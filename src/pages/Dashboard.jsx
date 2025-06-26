import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { useRentCast } from '../hooks/useRentCast';
import SafeIcon from '../common/SafeIcon';
import MetricCard from '../components/common/MetricCard';
import PropertyCard from '../components/property/PropertyCard';
import OfferCalculator from '../components/ai/OfferCalculator';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiHome, FiUsers, FiDollarSign, FiClock, FiArrowRight, FiDatabase, FiWifi, FiCheckCircle, FiAlertCircle, FiRefreshCw } = FiIcons;

const Dashboard = () => {
  const { properties, marketData, leads, useRealData, apiStatus, checkRentCastAndInitialize } = useProperty();
  const { testConnection: testRentCast } = useRentCast();
  const [rentCastStatus, setRentCastStatus] = useState(null);
  const [showOfferCalculator, setShowOfferCalculator] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const recentProperties = properties.slice(0, 3);
  const hotLeads = leads.filter(lead => lead.status === 'Hot').slice(0, 3);

  useEffect(() => {
    setRentCastStatus(apiStatus);
  }, [apiStatus]);

  const handleRetryConnection = async () => {
    if (retryAttempts >= 3) {
      setRentCastStatus({
        success: false,
        error: 'Maximum retry attempts reached. Please check your API key and try again later.'
      });
      return;
    }

    setRetryAttempts(prev => prev + 1);
    setRentCastStatus({ loading: true, message: `Retrying connection (${retryAttempts + 1}/3)...` });
    
    try {
      await checkRentCastAndInitialize();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const metrics = [
    {
      title: 'Market Value',
      value: `$${marketData.averagePrice?.toLocaleString() || '0'}`,
      change: `+${marketData.priceChange || 0}%`,
      icon: FiDollarSign,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Active Listings',
      value: marketData.inventory || 0,
      change: '-2.3%',
      icon: FiHome,
      trend: 'down',
      color: 'text-blue-600'
    },
    {
      title: 'Hot Leads',
      value: hotLeads.length,
      change: '+15.2%',
      icon: FiUsers,
      trend: 'up',
      color: 'text-purple-600'
    },
    {
      title: 'Avg. Days on Market',
      value: `${marketData.daysOnMarket || 0} days`,
      change: '-8.1%',
      icon: FiClock,
      trend: 'down',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 sm:p-8 text-white"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-base sm:text-lg opacity-90">
          Here's what's happening in your real estate market today.
        </p>
      </motion.div>

      {/* API Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiDatabase} className="text-xl text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">RentCast API</h3>
                <p className="text-sm text-gray-600">Live Property Data</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {rentCastStatus?.loading ? (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Testing...
                </div>
              ) : (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  rentCastStatus?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {rentCastStatus?.success ? 'Connected' : 'Disconnected'}
                </div>
              )}
              <motion.button
                onClick={handleRetryConnection}
                disabled={rentCastStatus?.loading || retryAttempts >= 3}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={rentCastStatus?.loading ? FiRefreshCw : rentCastStatus?.success ? FiCheckCircle : FiAlertCircle} 
                         className={rentCastStatus?.loading ? 'animate-spin' : ''} />
              </motion.button>
            </div>
          </div>
          
          {rentCastStatus?.success ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                <SafeIcon icon={FiCheckCircle} className="flex-shrink-0" />
                <span>{rentCastStatus.message || 'Live property data active'}</span>
              </div>
              {rentCastStatus.propertiesLoaded && (
                <div className="text-xs text-green-700 bg-green-50 rounded-lg p-2">
                  📊 {rentCastStatus.propertiesLoaded} properties loaded from RentCast
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-red-600 bg-red-50 rounded-lg p-2">
                {rentCastStatus?.error || 'API connection failed - Using demo data'}
              </div>
              {retryAttempts < 3 && (
                <motion.button
                  onClick={handleRetryConnection}
                  disabled={rentCastStatus?.loading}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {rentCastStatus?.loading ? 'Retrying...' : 'Retry Connection'}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiWifi} className="text-xl text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">DeepSeek AI</h3>
                <p className="text-sm text-gray-600">AI Analysis Engine</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 rounded-lg p-2 mt-3">
            <SafeIcon icon={FiCheckCircle} className="flex-shrink-0" />
            <span>AI-powered analysis and insights ready</span>
          </div>
        </motion.div>
      </div>

      {/* API Troubleshooting Card */}
      {!rentCastStatus?.success && !rentCastStatus?.loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiAlertCircle} className="text-yellow-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">RentCast API Connection Issue</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Unable to connect to RentCast API. The app is currently using demo data.
              </p>
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Possible solutions:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Verify your API key is correct: <code className="bg-yellow-100 px-1 rounded">8bd2e51f699c4b92b7ebe971ee874ca5</code></li>
                  <li>Check if you have sufficient API credits</li>
                  <li>Ensure your network allows API requests</li>
                  <li>Visit <a href="https://app.rentcast.io/dashboard" target="_blank" rel="noopener noreferrer" className="underline">RentCast Dashboard</a> to verify your account</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* AI Offer Calculator Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Offer Calculator</h2>
            <p className="text-gray-600">Calculate investment offers with AI analysis</p>
          </div>
          <motion.button
            onClick={() => setShowOfferCalculator(!showOfferCalculator)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showOfferCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </motion.button>
        </div>

        {showOfferCalculator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Property (Optional)</label>
              <select
                value={selectedProperty?.id || ''}
                onChange={(e) => {
                  const property = properties.find(p => p.id === parseInt(e.target.value));
                  setSelectedProperty(property);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Manual Entry</option>
                {properties.slice(0, 5).map(property => (
                  <option key={property.id} value={property.id}>
                    {property.address} - ${property.price?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <OfferCalculator property={selectedProperty} />
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Properties</h2>
            <Link
              to="/search"
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base"
            >
              <span>View All</span>
              <SafeIcon icon={FiArrowRight} className="text-sm" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} compact />
            ))}
          </div>
          {useRealData && rentCastStatus?.success && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                🔄 Live data from RentCast API - Properties automatically updated
              </p>
            </div>
          )}
          {!useRealData && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                📋 Currently showing demo data - Connect RentCast API for live properties
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Hot Leads</h2>
            <Link
              to="/leads"
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base"
            >
              <span>View All</span>
              <SafeIcon icon={FiArrowRight} className="text-sm" />
            </Link>
          </div>
          <div className="space-y-4">
            {hotLeads.map((lead) => (
              <motion.div
                key={lead.id}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {lead.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {lead.propertyInterest}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-medium text-green-600">
                      Score: {lead.leadScore}
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Market Trends</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="text-2xl sm:text-3xl text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Price Growth</h3>
            <p className="text-xl sm:text-2xl font-bold text-green-600">+{marketData.priceChange || 8.5}%</p>
            <p className="text-xs sm:text-sm text-gray-600">Year over year</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiHome} className="text-2xl sm:text-3xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Inventory</h3>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{marketData.absorption || 2.1} months</p>
            <p className="text-xs sm:text-sm text-gray-600">Supply remaining</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <SafeIcon icon={FiClock} className="text-2xl sm:text-3xl text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Market Speed</h3>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">{marketData.daysOnMarket || 12} days</p>
            <p className="text-xs sm:text-sm text-gray-600">Average on market</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/search">
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <SafeIcon icon={FiHome} className="text-2xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Search Properties</h3>
              <p className="text-sm text-gray-600">Find investment opportunities</p>
            </motion.div>
          </Link>
          <Link to="/ai-insights">
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">AI Analysis</h3>
              <p className="text-sm text-gray-600">Get AI-powered insights</p>
            </motion.div>
          </Link>
          <Link to="/leads">
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <SafeIcon icon={FiUsers} className="text-2xl text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Leads</h3>
              <p className="text-sm text-gray-600">Track and convert leads</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;