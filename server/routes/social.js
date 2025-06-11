import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// YouTube Analytics
router.get('/youtube/stats/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    // Get channel statistics
    const channelResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.data.items.length) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const channel = channelResponse.data.items[0];
    const stats = channel.statistics;

    // Get recent videos for engagement calculation
    const videosResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=10&order=date&type=video&key=${apiKey}`
    );

    const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');
    
    const videoStatsResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
    );

    // Calculate average engagement rate
    const videos = videoStatsResponse.data.items;
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || 0), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || 0), 0);
    
    const avgViews = totalViews / videos.length;
    const avgEngagement = ((totalLikes + totalComments) / totalViews) * 100;

    const result = {
      platform: 'youtube',
      channelName: channel.snippet.title,
      subscribers: parseInt(stats.subscriberCount),
      totalViews: parseInt(stats.viewCount),
      totalVideos: parseInt(stats.videoCount),
      avgViewsPerVideo: Math.round(avgViews),
      engagementRate: parseFloat(avgEngagement.toFixed(2)),
      lastUpdated: new Date()
    };

    // Update user's social account data
    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        'socialAccounts.$[elem].followers': result.subscribers,
        'socialAccounts.$[elem].engagementRate': result.engagementRate,
        'socialAccounts.$[elem].lastSync': new Date()
      }
    }, {
      arrayFilters: [{ 'elem.platform': 'youtube' }]
    });

    res.json(result);
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch YouTube data' });
  }
});

// Instagram Basic Display API
router.get('/instagram/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const instagramAccount = user.socialAccounts.find(acc => acc.platform === 'instagram');
    
    if (!instagramAccount || !instagramAccount.accessToken) {
      return res.status(400).json({ message: 'Instagram account not connected' });
    }

    const response = await axios.get(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${instagramAccount.accessToken}`
    );

    const mediaResponse = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=20&access_token=${instagramAccount.accessToken}`
    );

    const media = mediaResponse.data.data;
    const totalLikes = media.reduce((sum, post) => sum + (post.like_count || 0), 0);
    const totalComments = media.reduce((sum, post) => sum + (post.comments_count || 0), 0);
    const avgEngagement = ((totalLikes + totalComments) / media.length) / 1000 * 100; // Rough calculation

    const result = {
      platform: 'instagram',
      username: response.data.username,
      mediaCount: response.data.media_count,
      avgLikesPerPost: Math.round(totalLikes / media.length),
      avgCommentsPerPost: Math.round(totalComments / media.length),
      engagementRate: parseFloat(avgEngagement.toFixed(2)),
      lastUpdated: new Date()
    };

    res.json(result);
  } catch (error) {
    console.error('Instagram API error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch Instagram data' });
  }
});

// Connect social media account
router.post('/connect/:platform', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    const { username, accessToken, refreshToken } = req.body;

    const user = await User.findById(req.user.id);
    
    // Check if account already exists
    const existingAccountIndex = user.socialAccounts.findIndex(acc => acc.platform === platform);
    
    const accountData = {
      platform,
      username,
      accessToken,
      refreshToken,
      isConnected: true,
      lastSync: new Date()
    };

    if (existingAccountIndex >= 0) {
      user.socialAccounts[existingAccountIndex] = accountData;
    } else {
      user.socialAccounts.push(accountData);
    }

    await user.save();
    
    res.json({ message: `${platform} account connected successfully` });
  } catch (error) {
    console.error('Connect account error:', error);
    res.status(500).json({ message: 'Failed to connect account' });
  }
});

// Disconnect social media account
router.delete('/disconnect/:platform', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.params;
    
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { socialAccounts: { platform } }
    });
    
    res.json({ message: `${platform} account disconnected successfully` });
  } catch (error) {
    console.error('Disconnect account error:', error);
    res.status(500).json({ message: 'Failed to disconnect account' });
  }
});

export default router;