import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { DollarSign, Download, Calculator, History } from 'lucide-react';
import axios from 'axios';

const RateCard = () => {
  const [formData, setFormData] = useState({
    platform: '',
    campaignType: '',
    customFollowers: '',
    customEngagement: ''
  });
  const [rateResult, setRateResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rateHistory, setRateHistory] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchRateHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/profile');
      setSocialAccounts(response.data.socialAccounts || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchRateHistory = async () => {
    try {
      const response = await axios.get('/api/rate-card/history');
      setRateHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch rate history:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.campaignType) {
      addToast('Please select platform and campaign type', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/rate-card/generate', formData);
      setRateResult(response.data);
      addToast('Rate card generated successfully!', 'success');
      fetchRateHistory(); // Refresh history
    } catch (error) {
      addToast(
        error.response?.data?.message || 'Failed to generate rate card',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'Twitter' }
  ];

  const campaignTypes = [
    { value: 'post', label: 'Regular Post' },
    { value: 'story', label: 'Story' },
    { value: 'reel', label: 'Reel/Short Video' },
    { value: 'video', label: 'Long-form Video' },
    { value: 'sponsored', label: 'Sponsored Content' }
  ];

  const selectedAccount = socialAccounts.find(acc => acc.platform === formData.platform);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Rate Card Generator</h1>
        <p className="text-gray-400 mt-2">
          Generate professional rate cards based on your social media metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rate Card Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Generate Rate Card</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Platform</option>
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Campaign Type
                </label>
                <select
                  name="campaignType"
                  value={formData.campaignType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Campaign Type</option>
                  {campaignTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAccount && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Connected Account Data</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Followers</p>
                      <p className="text-white font-semibold">{selectedAccount.followers?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Engagement Rate</p>
                      <p className="text-white font-semibold">{selectedAccount.engagementRate}%</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-600 pt-4">
                <h4 className="text-white font-semibold mb-4">Custom Values (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Followers
                    </label>
                    <input
                      type="number"
                      name="customFollowers"
                      value={formData.customFollowers}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Override followers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Engagement %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="customEngagement"
                      value={formData.customEngagement}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Override engagement"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    <span>Generate Rate Card</span>
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Rate Result */}
        <div className="space-y-6">
          {rateResult && (
            <Card className="bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Your Rate Card</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-2">
                    {rateResult.currency === 'USD' ? '$' : rateResult.currency + ' '}
                    {rateResult.rate.toLocaleString()}
                  </div>
                  <p className="text-blue-200">
                    {rateResult.campaignType} on {rateResult.platform}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-blue-200 text-sm">Followers</p>
                    <p className="text-white font-semibold">{rateResult.followers?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-200 text-sm">Engagement</p>
                    <p className="text-white font-semibold">{rateResult.engagementRate}%</p>
                  </div>
                </div>

                <button className="w-full bg-white text-blue-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Rate Card</span>
                </button>
              </CardContent>
            </Card>
          )}

          {/* Rate History */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <History className="w-5 h-5" />
                <span>Rate History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rateHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {rateHistory.slice(0, 10).map((rate, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-semibold capitalize">
                          {rate.platform} - {rate.campaignType}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(rate.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">
                          {rate.currency === 'USD' ? '$' : rate.currency + ' '}
                          {rate.baseRate.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No rate cards generated yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RateCard;