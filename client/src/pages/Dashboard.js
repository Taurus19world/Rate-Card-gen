import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import YouTubeConnect from '../components/YouTubeConnect';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { BarChart3, Users, TrendingUp, DollarSign, Youtube, Instagram, Music, Twitter } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [stats, setStats] = useState({
    totalFollowers: 0,
    avgEngagement: 0,
    connectedPlatforms: 0,
    totalRateCards: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/profile');
      setSocialAccounts(response.data.socialAccounts || []);
      
      // Calculate stats
      const totalFollowers = response.data.socialAccounts?.reduce((sum, acc) => sum + (acc.followers || 0), 0) || 0;
      const avgEngagement = response.data.socialAccounts?.length > 0 
        ? response.data.socialAccounts.reduce((sum, acc) => sum + (acc.engagementRate || 0), 0) / response.data.socialAccounts.length 
        : 0;
      
      setStats({
        totalFollowers,
        avgEngagement: Math.round(avgEngagement * 100) / 100,
        connectedPlatforms: response.data.socialAccounts?.length || 0,
        totalRateCards: response.data.rateCards?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleYouTubeConnect = (data) => {
    fetchUserData(); // Refresh data after connection
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'tiktok':
        return <Music className="w-5 h-5 text-black" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-500" />;
      default:
        return <Users className="w-5 h-5 text-gray-500" />;
    }
  };

  const youtubeAccount = socialAccounts.find(acc => acc.platform === 'youtube');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Welcome back, {user?.profile?.name || user?.email}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalFollowers.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgEngagement}%</div>
            <p className="text-xs text-gray-500">Average across platforms</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Connected Platforms</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.connectedPlatforms}</div>
            <p className="text-xs text-gray-500">Social media accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Rate Cards</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalRateCards}</div>
            <p className="text-xs text-gray-500">Generated rate cards</p>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Connect Your Platforms</h2>
          
          {/* YouTube Connection */}
          <YouTubeConnect
            onConnect={handleYouTubeConnect}
            isConnected={!!youtubeAccount}
            channelData={youtubeAccount}
          />

          {/* Placeholder for other platforms */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 opacity-50">
            <div className="flex items-center space-x-3 mb-4">
              <Instagram className="w-8 h-8 text-pink-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">Instagram</h3>
                <p className="text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 opacity-50">
            <div className="flex items-center space-x-3 mb-4">
              <Music className="w-8 h-8 text-black bg-white rounded" />
              <div>
                <h3 className="text-lg font-semibold text-white">TikTok</h3>
                <p className="text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Accounts Summary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Your Connected Accounts</h2>
          
          {socialAccounts.length > 0 ? (
            <div className="space-y-4">
              {socialAccounts.map((account, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <h3 className="font-semibold text-white capitalize">{account.platform}</h3>
                          <p className="text-sm text-gray-400">{account.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{account.followers?.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{account.engagementRate}% engagement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Connected Accounts</h3>
                <p className="text-gray-400">Connect your social media accounts to start generating rate cards</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;