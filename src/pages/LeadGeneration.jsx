import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProperty } from '../context/PropertyContext';
import SafeIcon from '../common/SafeIcon';
import LeadCard from '../components/leads/LeadCard';
import LeadFilters from '../components/leads/LeadFilters';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiTrendingUp, FiTarget, FiPlus, FiFilter } = FiIcons;

const LeadGeneration = () => {
  const { leads } = useProperty();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState(leads);

  const leadStats = {
    total: leads.length,
    hot: leads.filter(lead => lead.status === 'Hot').length,
    warm: leads.filter(lead => lead.status === 'Warm').length,
    cold: leads.filter(lead => lead.status === 'Cold').length,
    avgScore: Math.round(leads.reduce((sum, lead) => sum + lead.leadScore, 0) / leads.length)
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Generation</h1>
            <p className="text-gray-600 mt-1">Manage and track your real estate leads</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiFilter} />
              <span>Filters</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiPlus} />
              <span>Add Lead</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiUsers} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Total Leads</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{leadStats.total}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">Hot Leads</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{leadStats.hot}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiTarget} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Warm Leads</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">{leadStats.warm}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiTrendingUp} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Avg Score</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{leadStats.avgScore}</p>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <LeadFilters onFilterChange={setFilteredLeads} leads={leads} />
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LeadCard lead={lead} />
          </motion.div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg"
        >
          <SafeIcon icon={FiUsers} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600">Try adjusting your filters or add new leads to get started.</p>
        </motion.div>
      )}
    </div>
  );
};

export default LeadGeneration;