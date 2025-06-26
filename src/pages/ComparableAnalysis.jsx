import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiSearch, FiBarChart3, FiTrendingUp, FiCalendar, FiMapPin, FiClock } = FiIcons;

const ComparableAnalysis = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');

  const sampleComps = [
    {
      id: 1,
      address: '123 Main Street',
      city: 'Austin, TX',
      price: 450000,
      sqft: 1850,
      bedrooms: 3,
      bathrooms: 2,
      lotSize: 0.25,
      yearBuilt: 2018,
      soldDate: '2024-01-10',
      daysOnMarket: 15,
      pricePerSqft: 243,
      distance: 0.2,
      similarity: 95
    },
    {
      id: 2,
      address: '456 Oak Avenue',
      city: 'Austin, TX',
      price: 425000,
      sqft: 1750,
      bedrooms: 3,
      bathrooms: 2,
      lotSize: 0.22,
      yearBuilt: 2017,
      soldDate: '2024-01-08',
      daysOnMarket: 12,
      pricePerSqft: 243,
      distance: 0.3,
      similarity: 92
    },
    {
      id: 3,
      address: '789 Pine Boulevard',
      city: 'Austin, TX',
      price: 475000,
      sqft: 1950,
      bedrooms: 4,
      bathrooms: 2.5,
      lotSize: 0.28,
      yearBuilt: 2019,
      soldDate: '2024-01-05',
      daysOnMarket: 8,
      pricePerSqft: 244,
      distance: 0.4,
      similarity: 88
    }
  ];

  const subjectProperty = {
    address: '321 Elm Street',
    city: 'Austin, TX',
    price: 465000,
    sqft: 1900,
    bedrooms: 3,
    bathrooms: 2,
    lotSize: 0.26,
    yearBuilt: 2018,
    pricePerSqft: 245
  };

  const handleSearch = () => {
    // In a real app, this would trigger a search API call
    console.log('Searching for:', searchAddress);
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
            <h1 className="text-2xl font-bold text-gray-900">Comparable Analysis</h1>
            <p className="text-gray-600 mt-1">Find and analyze comparable properties</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter property address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <motion.button
            onClick={handleSearch}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search Comps
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <SafeIcon icon={FiHome} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Subject Property</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">{subjectProperty.address}</h3>
              <p className="text-sm text-gray-600">{subjectProperty.city}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Price:</span>
                <p className="font-semibold text-gray-900">${subjectProperty.price.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Sqft:</span>
                <p className="font-semibold text-gray-900">{subjectProperty.sqft.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Bedrooms:</span>
                <p className="font-semibold text-gray-900">{subjectProperty.bedrooms}</p>
              </div>
              <div>
                <span className="text-gray-600">Bathrooms:</span>
                <p className="font-semibold text-gray-900">{subjectProperty.bathrooms}</p>
              </div>
              <div>
                <span className="text-gray-600">Year Built:</span>
                <p className="font-semibold text-gray-900">{subjectProperty.yearBuilt}</p>
              </div>
              <div>
                <span className="text-gray-600">Price/Sqft:</span>
                <p className="font-semibold text-gray-900">${subjectProperty.pricePerSqft}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Comparable Properties</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiBarChart3} />
                <span>{sampleComps.length} comps found</span>
              </div>
            </div>

            <div className="space-y-4">
              {sampleComps.map((comp, index) => (
                <motion.div
                  key={comp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedProperty(comp)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{comp.address}</h3>
                      <p className="text-sm text-gray-600">{comp.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${comp.price.toLocaleString()}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          comp.similarity >= 90 ? 'bg-green-100 text-green-800' :
                          comp.similarity >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {comp.similarity}% match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sqft:</span>
                      <p className="font-medium text-gray-900">{comp.sqft.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Bed/Bath:</span>
                      <p className="font-medium text-gray-900">{comp.bedrooms}/{comp.bathrooms}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">$/Sqft:</span>
                      <p className="font-medium text-gray-900">${comp.pricePerSqft}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Distance:</span>
                      <p className="font-medium text-gray-900">{comp.distance} mi</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} />
                        <span>Sold {comp.soldDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} />
                        <span>{comp.daysOnMarket} DOM</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Valuation Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiTrendingUp} className="text-3xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Est. Value</h3>
            <p className="text-2xl font-bold text-blue-600">$458,000</p>
            <p className="text-sm text-gray-600">Based on comps</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <SafeIcon icon={FiBarChart3} className="text-3xl text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Price Range</h3>
            <p className="text-lg font-bold text-green-600">$440K - $475K</p>
            <p className="text-sm text-gray-600">90% confidence</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <SafeIcon icon={FiMapPin} className="text-3xl text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Avg $/Sqft</h3>
            <p className="text-2xl font-bold text-orange-600">$243</p>
            <p className="text-sm text-gray-600">Market average</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <SafeIcon icon={FiHome} className="text-3xl text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Market Time</h3>
            <p className="text-2xl font-bold text-purple-600">12 days</p>
            <p className="text-sm text-gray-600">Expected DOM</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComparableAnalysis;