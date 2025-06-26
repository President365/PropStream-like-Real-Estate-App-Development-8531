import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiTrendingUp } = FiIcons;

const LeadCard = ({ lead }) => {
  const getScoreColor = (score) => {
    if (score >= 85) return 'lead-score-high';
    if (score >= 70) return 'lead-score-medium';
    return 'lead-score-low';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800';
      case 'Warm': return 'bg-yellow-100 text-yellow-800';
      case 'Cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-2 rounded-full">
            <SafeIcon icon={FiUser} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`${getScoreColor(lead.leadScore)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
            {lead.leadScore}
          </div>
          <p className="text-xs text-gray-600 mt-1">Lead Score</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiMail} className="text-gray-400" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiPhone} className="text-gray-400" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiMapPin} className="text-gray-400" />
          <span>{lead.propertyInterest}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SafeIcon icon={FiCalendar} className="text-gray-400" />
          <span>Last contact: {lead.lastContact}</span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-1">Notes</h4>
        <p className="text-sm text-gray-600">{lead.notes}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Source: {lead.source}
        </div>
        <motion.button
          className="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiTrendingUp} className="text-xs" />
          <span>Follow Up</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LeadCard;