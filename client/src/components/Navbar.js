import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, BarChart3, CreditCard, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            RateCard Pro
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <BarChart3 size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/rate-card"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <CreditCard size={18} />
                  <span>Rate Cards</span>
                </Link>
                <Link
                  to="/ambassador"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Users size={18} />
                  <span>Ambassador</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-300">{user?.profile?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;