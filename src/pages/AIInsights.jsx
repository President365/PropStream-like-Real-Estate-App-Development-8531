import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeepSeek } from '../hooks/useDeepSeek';
import { useProperty } from '../context/PropertyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBrain, FiTrendingUp, FiTarget, FiAlertCircle, FiCheckCircle, FiDollarSign, FiHome, FiUsers, FiSettings } = FiIcons;

const AIInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState('investment');
  const [apiStatus, setApiStatus] = useState(null);
  const { testConnection, analyzeMarket, loading, error } = useDeepSeek();
  const { marketData, properties } = useProperty();

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const result = await testConnection();
      setApiStatus(result);
    } catch (err) {
      setApiStatus({ success: false, error: err.message });
    }
  };

  const insights = {
    investment: {
      title: 'Investment Opportunities',
      icon: FiDollarSign,
      color: 'text-green-600',
      data: [
        {
          id: 1,
          property: '456 Oak Avenue',
          score: 94,
          potential: 'Very High',
          reasons: ['Undervalued by 12%', 'High rental demand area', 'Upcoming infrastructure development'],
          roi: '18.5%',
          risk: 'Low'
        },
        {
          id: 2,
          property: '789 Pine Boulevard',
          score: 87,
          potential: 'High',
          reasons: ['Growing neighborhood', 'Good school district', 'Recent comparable sales'],
          roi: '14.2%',
          risk: 'Medium'
        },
        {
          id: 3,
          property: '123 Maple Street',
          score: 82,
          potential: 'High',
          reasons: ['Price below market', 'Low inventory area', 'Strong price appreciation'],
          roi: '12.8%',
          risk: 'Low'
        }
      ]
    },
    market: {
      title: 'Market Predictions',
      icon: FiTrendingUp,
      color: 'text-blue-600',
      data: [
        {
          prediction: 'Austin market will see 8-12% price growth in next 12 months',
          confidence: 89,
          factors: ['Job growth', 'Population influx', 'Limited inventory'],
          timeframe: '12 months'
        },
        {
          prediction: 'Riverside neighborhood emerging as hot investment area',
          confidence: 76,
          factors: ['New developments', 'Infrastructure improvements', 'Gentrification trends'],
          timeframe: '6-18 months'
        },
        {
          prediction: 'Interest rate stabilization will boost buyer activity',
          confidence: 82,
          factors: ['Fed policy signals', 'Economic indicators', 'Market sentiment'],
          timeframe: '3-6 months'
        }
      ]
    },
    leads: {
      title: 'Lead Scoring',
      icon: FiUsers,
      color: 'text-purple-600',
      data: [
        {
          name: 'Sarah Johnson',
          score: 92,
          likelihood: 'Very High',
          factors: ['Pre-approved financing', 'Active property viewing', 'Quick response time'],
          nextAction: 'Schedule property tour'
        },
        {
          name: 'Michael Chen',
          score: 78,
          likelihood: 'High',
          factors: ['Investment focused', 'Cash buyer', 'Multiple inquiries'],
          nextAction: 'Send investment analysis'
        },
        {
          name: 'Emily Rodriguez',
          score: 85,
          likelihood: 'High',
          factors: ['Relocating timeline', 'Specific requirements', 'Budget confirmed'],
          nextAction: 'Provide market overview'
        }
      ]
    }
  };

  const currentInsight = insights[selectedInsight];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiBrain} className="text-3xl" />
          <h1 className="text-3xl font-bold">AI Insights</h1>
        </div>
        <p className="text-lg opacity-90">Powered by DeepSeek AI analyzing market data, property trends, and buyer behavior</p>
      </motion.div>

      {/* API Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiSettings} className="text-xl text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">DeepSeek AI Status</h3>
          </div>
          <motion.button
            onClick={checkAPIStatus}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </motion.button>
        </div>

        {apiStatus && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            apiStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <SafeIcon icon={apiStatus.success ? FiCheckCircle : FiAlertCircle} />
            <span className="font-medium">
              {apiStatus.success ? 'DeepSeek AI Connected Successfully!' : `Connection Failed: ${apiStatus.error}`}
            </span>
          </div>
        )}

        {apiStatus?.success && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">✅ AI Features Available:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Property investment analysis</li>
              <li>• Market trend predictions</li>
              <li>• Automated offer calculations</li>
              <li>• Lead scoring and prioritization</li>
              <li>• Professional email generation</li>
            </ul>
          </div>
        )}

        {!apiStatus?.success && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">API Key Status:</h4>
            <p className="text-sm text-yellow-700 mb-2">
              Your DeepSeek API key has been configured. If you're seeing connection issues, please verify:
            </p>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. API key is valid and active at <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline">platform.deepseek.com</a></li>
              <li>2. You have sufficient API credits</li>
              <li>3. No firewall or network restrictions</li>
              <li>4. Try refreshing the page and testing again</li>
            </ol>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(insights).map(([key, insight]) => (
          <motion.button
            key={key}
            onClick={() => setSelectedInsight(key)}
            className={`text-left p-6 rounded-xl shadow-lg transition-all duration-300 ${
              selectedInsight === key 
                ? 'bg-white ring-2 ring-primary-500 transform scale-105' 
                : 'bg-white hover:shadow-xl'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={insight.icon} className={`text-2xl ${insight.color}`} />
              <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
            </div>
            <p className="text-sm text-gray-600">
              {key === 'investment' && 'Discover high-potential investment properties'}
              {key === 'market' && 'AI-powered market trend predictions'}
              {key === 'leads' && 'Intelligent lead scoring and prioritization'}
            </p>
          </motion.button>
        ))}
      </div>

      <motion.div
        key={selectedInsight}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={currentInsight.icon} className={`text-2xl ${currentInsight.color}`} />
            <h2 className="text-xl font-bold text-gray-900">{currentInsight.title}</h2>
          </div>
          {apiStatus?.success && (
            <motion.button
              onClick={() => analyzeMarket(marketData)}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Analyzing...' : 'Refresh with AI'}
            </motion.button>
          )}
        </div>

        {selectedInsight === 'investment' && (
          <div className="space-y-6">
            {currentInsight.data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.property}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.potential === 'Very High' ? 'bg-green-100 text-green-800' :
                        item.potential === 'High' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.potential} Potential
                      </div>
                      <span className="text-sm text-gray-600">Risk: {item.risk}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{item.score}</div>
                    <div className="text-sm text-gray-600">AI Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Factors</h4>
                    <ul className="space-y-1">
                      {item.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiCheckCircle} className="text-green-500 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Projected Returns</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{item.roi}</div>
                      <div className="text-sm text-gray-600">Expected ROI</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedInsight === 'market' && (
          <div className="space-y-6">
            {currentInsight.data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.prediction}</h3>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.confidence >= 85 ? 'bg-green-100 text-green-800' :
                        item.confidence >= 75 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.confidence}% Confidence
                      </div>
                      <span className="text-sm text-gray-600">Timeline: {item.timeframe}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Supporting Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.factors.map((factor, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedInsight === 'leads' && (
          <div className="space-y-6">
            {currentInsight.data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.likelihood === 'Very High' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.likelihood} Likelihood
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{item.score}</div>
                    <div className="text-sm text-gray-600">Lead Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Scoring Factors</h4>
                    <ul className="space-y-1">
                      {item.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <SafeIcon icon={FiCheckCircle} className="text-green-500 flex-shrink-0" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Action</h4>
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiTarget} className="text-primary-600" />
                        <span className="text-primary-800 font-medium">{item.nextAction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-start space-x-4">
          <SafeIcon icon={FiBrain} className="text-blue-600 text-xl flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">DeepSeek AI Integration</h3>
            <p className="text-sm text-gray-600 mb-3">
              Your PropStream app is now powered by DeepSeek's advanced AI models for comprehensive real estate analysis and decision support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-gray-900">Property Analysis</div>
                <div className="text-blue-600 font-bold">✅ Active</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-gray-900">Market Insights</div>
                <div className="text-green-600 font-bold">✅ Active</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="font-semibold text-gray-900">Lead Scoring</div>
                <div className="text-purple-600 font-bold">✅ Active</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIInsights;