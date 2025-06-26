import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeepSeek } from '../../hooks/useDeepSeek';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBrain, FiLoader, FiAlertCircle, FiCheckCircle, FiTrendingUp } = FiIcons;

const AIAnalysisCard = ({ property, type = 'property' }) => {
  const { loading, error, analyzeProperty } = useDeepSeek();
  const [analysis, setAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (property && type === 'property') {
      handleAnalyze();
    }
  }, [property]);

  const handleAnalyze = async () => {
    try {
      const result = await analyzeProperty(property);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 ai-glow"
      >
        <div className="flex items-center justify-center space-x-3">
          <SafeIcon icon={FiLoader} className="text-2xl text-primary-600 animate-spin" />
          <span className="text-lg font-medium text-gray-900">AI Analyzing Property...</span>
        </div>
        <div className="mt-4 bg-gray-100 rounded-lg p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error && !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
      >
        <div className="flex items-center space-x-3 mb-4">
          <SafeIcon icon={FiAlertCircle} className="text-2xl text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Analysis Error</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <motion.button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Analysis
        </motion.button>
      </motion.div>
    );
  }

  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBrain} className="text-2xl text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
          </div>
          <motion.button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analyze with AI
          </motion.button>
        </div>
        <p className="text-gray-600">Get AI-powered insights for this property</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 ai-glow"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiBrain} className="text-2xl text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">DeepSeek AI Analysis</h3>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCheckCircle} className="text-green-600" />
          <span className="text-sm text-green-600 font-medium">Analysis Complete</span>
        </div>
      </div>

      {/* Investment Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">AI Investment Score</span>
          <span className="text-sm font-semibold text-gray-900">
            {analysis.investmentScore || analysis.score || 'N/A'}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${analysis.investmentScore || analysis.score || 0}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Price Assessment */}
      {analysis.priceAssessment && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Price Assessment</h4>
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            analysis.priceAssessment === 'Undervalued' ? 'bg-green-100 text-green-800' :
            analysis.priceAssessment === 'Overpriced' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {analysis.priceAssessment}
          </div>
        </div>
      )}

      {/* AI Analysis Summary */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">AI Insights</h4>
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          {analysis.analysis || analysis.insights || 'Analysis completed successfully'}
        </p>
      </div>

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiTrendingUp} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Toggle Details */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showDetails ? 'Hide Details' : 'Show Full Analysis'}
      </motion.button>

      {/* Detailed Analysis */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 overflow-x-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Refresh Analysis */}
      <motion.button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? 'Analyzing...' : 'Refresh Analysis'}
      </motion.button>
    </motion.div>
  );
};

export default AIAnalysisCard;