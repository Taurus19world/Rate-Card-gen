import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Create ambassadorship
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { brandName, campaignDuration, startDate, endDate } = req.body;
    
    const ambassadorship = {
      brandName,
      campaignDuration,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'active',
      performanceStats: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    };

    await User.findByIdAndUpdate(req.user.id, {
      $push: { ambassadorships: ambassadorship }
    });

    res.status(201).json({ message: 'Ambassadorship created successfully', ambassadorship });
  } catch (error) {
    console.error('Create ambassadorship error:', error);
    res.status(500).json({ message: 'Failed to create ambassadorship' });
  }
});

// Get ambassadorships
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.ambassadorships.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
  } catch (error) {
    console.error('Get ambassadorships error:', error);
    res.status(500).json({ message: 'Failed to fetch ambassadorships' });
  }
});

// Update ambassadorship performance
router.put('/:id/performance', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { impressions, clicks, conversions, revenue } = req.body;

    await User.findOneAndUpdate(
      { _id: req.user.id, 'ambassadorships._id': id },
      {
        $set: {
          'ambassadorships.$.performanceStats': {
            impressions,
            clicks,
            conversions,
            revenue
          }
        }
      }
    );

    res.json({ message: 'Performance stats updated successfully' });
  } catch (error) {
    console.error('Update performance error:', error);
    res.status(500).json({ message: 'Failed to update performance stats' });
  }
});

export default router;