import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const MetricCard = ({ title, value, change, icon, trend, color }) => {
  return (
    <motion.div
      className="metric-card rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <SafeIcon icon={icon} className={`text-xl sm:text-2xl ${color}`} />
        <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <SafeIcon icon={trend === 'up' ? FiTrendingUp : FiTrendingDown} className="text-xs" />
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
};

export default MetricCard;