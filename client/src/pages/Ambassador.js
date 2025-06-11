import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Users, Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';

const Ambassador = () => {
  const [ambassadorships, setAmbassadorships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    campaignDuration: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAmbassadorships();
  }, []);

  const fetchAmbassadorships = async () => {
    try {
      const response = await axios.get('/api/ambassador');
      setAmbassadorships(response.data);
    } catch (error) {
      console.error('Failed to fetch ambassadorships:', error);
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
    setLoading(true);

    try {
      await axios.post('/api/ambassador', formData);
      addToast('Ambassadorship created successfully!', 'success');
      setShowForm(false);
      setFormData({
        brandName: '',
        campaignDuration: '',
        startDate: '',
        endDate: ''
      });
      fetchAmbassadorships();
    } catch (error) {
      addToast(
        error.response?.data?.message || 'Failed to create ambassadorship',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900';
      case 'completed':
        return 'text-blue-400 bg-blue-900';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900';
      default:
        return 'text-gray-400 bg-gray-900';
    }
  };

  const totalRevenue = ambassadorships.reduce((sum, amb) => 
    sum + (amb.performanceStats?.revenue || 0), 0
  );

  const activeAmbassadorships = ambassadorships.filter(amb => amb.status === 'active').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ambassador Program</h1>
          <p className="text-gray-400 mt-2">
            Manage your brand partnerships and track campaign performance
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Partnership</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Partnerships</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeAmbassadorships}</div>
            <p className="text-xs text-gray-500">Currently running</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500">From all campaigns</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Partnerships</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{ambassadorships.length}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* New Partnership Form */}
      {showForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Partnership</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Campaign Duration
                  </label>
                  <select
                    name="campaignDuration"
                    value={formData.campaignDuration}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Duration</option>
                    <option value="1 month">1 Month</option>
                    <option value="3 months">3 Months</option>
                    <option value="6 months">6 Months</option>
                    <option value="1 year">1 Year</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Partnership'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ambassadorships List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Partnerships</h2>
        {ambassadorships.length > 0 ? (
          <div className="grid gap-4">
            {ambassadorships.map((ambassadorship, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{ambassadorship.brandName}</h3>
                      <p className="text-gray-400">{ambassadorship.campaignDuration}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ambassadorship.status)}`}>
                      {ambassadorship.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Start Date</p>
                      <p className="text-white">{new Date(ambassadorship.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">End Date</p>
                      <p className="text-white">{new Date(ambassadorship.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Impressions</p>
                      <p className="text-white">{ambassadorship.performanceStats?.impressions?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-white">${ambassadorship.performanceStats?.revenue?.toLocaleString() || '0'}</p>
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
              <h3 className="text-lg font-semibold text-white mb-2">No Partnerships Yet</h3>
              <p className="text-gray-400 mb-4">Start by creating your first brand partnership</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Partnership
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Ambassador;