import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Calculate rate based on platform and metrics
const calculateRate = (platform, followers, engagementRate, campaignType, currency = 'USD') => {
  let baseRate = 0;
  let multiplier = 1;

  // Base rate calculation per platform
  switch (platform.toLowerCase()) {
    case 'youtube':
      baseRate = (followers / 1000) * 0.5; // $0.50 per 1K subscribers
      break;
    case 'instagram':
      baseRate = (followers / 1000) * 0.3; // $0.30 per 1K followers
      break;
    case 'tiktok':
      baseRate = (followers / 1000) * 0.2; // $0.20 per 1K followers
      break;
    case 'twitter':
      baseRate = (followers / 1000) * 0.15; // $0.15 per 1K followers
      break;
    default:
      baseRate = (followers / 1000) * 0.25;
  }

  // Engagement rate multiplier
  const engagementMultiplier = Math.max(1, engagementRate / 2);
  
  // Campaign type multiplier
  switch (campaignType?.toLowerCase()) {
    case 'reel':
    case 'video':
      multiplier = 2.0;
      break;
    case 'story':
      multiplier = 1.2;
      break;
    case 'post':
      multiplier = 1.5;
      break;
    case 'sponsored':
      multiplier = 2.5;
      break;
    default:
      multiplier = 1.0;
  }

  let finalRate = baseRate * engagementMultiplier * multiplier;

  // Currency conversion (simplified - in production, use real exchange rates)
  const currencyMultipliers = {
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'ZAR': 18.5,
    'CAD': 1.35,
    'AUD': 1.45
  };

  finalRate *= currencyMultipliers[currency] || 1;

  return Math.round(finalRate * 100) / 100; // Round to 2 decimal places
};

// Generate rate card
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { platform, campaignType, customFollowers, customEngagement } = req.body;
    
    const user = await User.findById(req.user.id);
    let followers, engagementRate;

    if (customFollowers && customEngagement) {
      followers = customFollowers;
      engagementRate = customEngagement;
    } else {
      const socialAccount = user.socialAccounts.find(acc => acc.platform === platform);
      if (!socialAccount) {
        return res.status(400).json({ message: 'Social account not connected for this platform' });
      }
      followers = socialAccount.followers;
      engagementRate = socialAccount.engagementRate;
    }

    const rate = calculateRate(platform, followers, engagementRate, campaignType, user.profile.currency);

    // Save rate card
    const rateCard = {
      platform,
      campaignType,
      baseRate: rate,
      currency: user.profile.currency,
      createdAt: new Date()
    };

    user.rateCards.push(rateCard);
    await user.save();

    res.json({
      rate,
      currency: user.profile.currency,
      platform,
      campaignType,
      followers,
      engagementRate,
      breakdown: {
        baseRate: calculateRate(platform, followers, 1, 'post', user.profile.currency),
        engagementBonus: engagementRate,
        campaignTypeMultiplier: campaignType
      }
    });
  } catch (error) {
    console.error('Rate calculation error:', error);
    res.status(500).json({ message: 'Failed to calculate rate' });
  }
});

// Get user's rate cards
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.rateCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    console.error('Get rate cards error:', error);
    res.status(500).json({ message: 'Failed to fetch rate cards' });
  }
});

export default router;