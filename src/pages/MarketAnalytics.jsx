import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown, FiHome, FiDollarSign } = FiIcons;

const MarketAnalytics = () => {
  const priceData = [
    { month: 'Jan', price: 425000, volume: 145 },
    { month: 'Feb', price: 435000, volume: 132 },
    { month: 'Mar', price: 445000, volume: 168 },
    { month: 'Apr', price: 455000, volume: 189 },
    { month: 'May', price: 465000, volume: 201 },
    { month: 'Jun', price: 475000, volume: 178 },
    { month: 'Jul', price: 483000, volume: 165 }
  ];

  const propertyTypeData = [
    { name: 'Single Family', value: 65, color: '#3b82f6' },
    { name: 'Condo', value: 20, color: '#10b981' },
    { name: 'Townhouse', value: 10, color: '#f59e0b' },
    { name: 'Multi-Family', value: 5, color: '#ef4444' }
  ];

  const neighborhoodData = [
    { name: 'Downtown', avgPrice: 520000, inventory: 45, growth: 12.5 },
    { name: 'West End', avgPrice: 465000, inventory: 67, growth: 8.2 },
    { name: 'Riverside', avgPrice: 425000, inventory: 89, growth: 15.1 },
    { name: 'Northside', avgPrice: 385000, inventory: 123, growth: 6.8 },
    { name: 'Southpark', avgPrice: 445000, inventory: 78, growth: 9.4 }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Market Analytics</h1>
        <p className="text-lg opacity-90">Comprehensive real estate market insights and trends</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Median Price', value: '$483,000', change: '+8.5%', icon: FiDollarSign, trend: 'up' },
          { title: 'Active Listings', value: '245', change: '-12.3%', icon: FiHome, trend: 'down' },
          { title: 'Avg DOM', value: '12 days', change: '-8.1%', icon: FiTrendingDown, trend: 'down' },
          { title: 'Price/SqFt', value: '$261', change: '+6.2%', icon: FiTrendingUp, trend: 'up' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <SafeIcon icon={metric.icon} className="text-2xl text-gray-400" />
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Price Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Property Types</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Neighborhood Analysis</h2>
          <div className="space-y-4">
            {neighborhoodData.map((neighborhood, index) => (
              <motion.div
                key={neighborhood.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{neighborhood.name}</h3>
                  <p className="text-sm text-gray-600">{neighborhood.inventory} active listings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${neighborhood.avgPrice.toLocaleString()}</p>
                  <p className={`text-sm font-medium ${
                    neighborhood.growth > 10 ? 'text-green-600' : 
                    neighborhood.growth > 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    +{neighborhood.growth}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Market Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Next 3 Months</h3>
            <p className="text-2xl font-bold text-green-600">+5.2%</p>
            <p className="text-sm text-gray-600">Expected price growth</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiHome} className="text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Outlook</h3>
            <p className="text-2xl font-bold text-blue-600">Balanced</p>
            <p className="text-sm text-gray-600">Market conditions</p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="text-4xl text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Opportunity</h3>
            <p className="text-2xl font-bold text-orange-600">Riverside</p>
            <p className="text-sm text-gray-600">Neighborhood to watch</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketAnalytics;