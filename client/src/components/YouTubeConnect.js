import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import axios from 'axios';
import { Youtube, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const YouTubeConnect = ({ onConnect, isConnected, channelData }) => {
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { addToast } = useToast();

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!channelId.trim()) {
      addToast('Please enter a YouTube Channel ID', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/social/youtube/stats/${channelId}`);
      setStats(response.data);
      
      // Connect the account
      await axios.post('/api/social/connect/youtube', {
        username: response.data.channelName,
        channelId: channelId,
        followers: response.data.subscribers,
        engagementRate: response.data.engagementRate
      });

      addToast('YouTube channel connected successfully!', 'success');
      onConnect && onConnect(response.data);
    } catch (error) {
      console.error('YouTube connection error:', error);
      addToast(
        error.response?.data?.message || 'Failed to connect YouTube channel',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.delete('/api/social/disconnect/youtube');
      setStats(null);
      setChannelId('');
      addToast('YouTube channel disconnected', 'info');
      onConnect && onConnect(null);
    } catch (error) {
      addToast('Failed to disconnect YouTube channel', 'error');
    }
  };

  if (isConnected && channelData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Youtube className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-white">YouTube Connected</h3>
              <p className="text-gray-400">{channelData.channelName}</p>
            </div>
          </div>
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{channelData.subscribers?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Subscribers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{channelData.totalVideos?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Videos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{channelData.avgViewsPerVideo?.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Avg Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{channelData.engagementRate}%</p>
            <p className="text-sm text-gray-400">Engagement</p>
          </div>
        </div>

        <button
          onClick={handleDisconnect}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Disconnect YouTube
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-4">
        <Youtube className="w-8 h-8 text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-white">Connect YouTube</h3>
          <p className="text-gray-400">Connect your YouTube channel to generate rate cards</p>
        </div>
      </div>

      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            YouTube Channel ID
          </label>
          <input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Enter your YouTube Channel ID"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Find your Channel ID in YouTube Studio → Settings → Channel → Advanced settings
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !channelId.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Youtube className="w-4 h-4" />
              <span>Connect YouTube</span>
            </>
          )}
        </button>
      </form>

      {stats && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-white font-semibold mb-3">Channel Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Subscribers</p>
              <p className="text-white font-semibold">{stats.subscribers?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Views</p>
              <p className="text-white font-semibold">{stats.totalViews?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Videos</p>
              <p className="text-white font-semibold">{stats.totalVideos?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Engagement Rate</p>
              <p className="text-white font-semibold">{stats.engagementRate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeConnect;