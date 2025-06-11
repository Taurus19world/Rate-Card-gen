import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, CreditCard, Users, Zap, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: "Real-time Analytics",
      description: "Connect your social media accounts and get live data for accurate rate calculations"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-green-500" />,
      title: "Smart Rate Cards",
      description: "Generate professional rate cards based on your actual engagement and follower metrics"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Ambassador Tracking",
      description: "Manage brand partnerships and track campaign performance in one place"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Multi-Platform Support",
      description: "Connect YouTube, Instagram, TikTok, and more social media platforms"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We never share your information"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
      title: "Growth Insights",
      description: "Track your growth and optimize your content strategy with detailed analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Rate Cards for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {" "}Influencers
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect your social media accounts, analyze your performance, and generate 
            professional rate cards that reflect your true value as an influencer.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors card-hover"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Monetize Your Influence?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of influencers who are already using RateCard Pro to 
            create professional rate cards and grow their business.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              Start Your Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;