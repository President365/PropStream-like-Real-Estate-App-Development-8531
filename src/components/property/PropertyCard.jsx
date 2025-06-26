import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBed, FiBath, FiMaximize, FiMapPin, FiTrendingUp, FiClock } = FiIcons;

const PropertyCard = ({ property, compact = false }) => {
  return (
    <motion.div
      className={`property-card-hover bg-white rounded-xl shadow-lg overflow-hidden ${
        compact ? 'border border-gray-200' : ''
      }`}
      whileHover={{ y: -4 }}
    >
      <div className={`${compact ? 'h-32 sm:h-40' : 'h-40 sm:h-48'} property-image bg-gray-200 flex items-center justify-center relative`}>
        {property.images && property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.address}
            className="w-full h-full object-cover"
          />
        ) : (
          <SafeIcon icon={FiHome} className="text-3xl sm:text-4xl text-gray-400" />
        )}
        
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'For Sale' ? 'bg-green-500 text-white' :
            property.status === 'Recently Sold' ? 'bg-blue-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {property.status}
          </div>
        </div>

        {property.aiScore && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <div className="ai-glow bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              AI: {property.aiScore}
            </div>
          </div>
        )}
      </div>

      <div className={`p-3 sm:p-4 ${compact ? '' : 'sm:p-6'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 truncate ${
              compact ? 'text-sm' : 'text-sm sm:text-lg'
            }`}>
              {property.address}
            </h3>
            <div className="flex items-center space-x-1 text-gray-600 mt-1">
              <SafeIcon icon={FiMapPin} className="text-xs flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{property.city}, {property.state}</span>
            </div>
          </div>
          <div className="text-right ml-2">
            <p className={`font-bold text-gray-900 ${
              compact ? 'text-sm sm:text-lg' : 'text-lg sm:text-xl'
            }`}>
              ${property.price.toLocaleString()}
            </p>
            {property.estimatedValue && (
              <p className="text-xs text-gray-600">
                Est: ${property.estimatedValue.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm`}>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiBed} className="text-gray-500 flex-shrink-0" />
            <span className="truncate">{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiBath} className="text-gray-500 flex-shrink-0" />
            <span className="truncate">{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiMaximize} className="text-gray-500 flex-shrink-0" />
            <span className="truncate">{property.sqft.toLocaleString()} sf</span>
          </div>
        </div>

        {!compact && (
          <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiClock} className="text-gray-500" />
                <span className="text-gray-600">{property.daysOnMarket} DOM</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                property.leadPotential === 'Very High' ? 'bg-green-100 text-green-800' :
                property.leadPotential === 'High' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {property.leadPotential} Lead
              </div>
            </div>
            <div className="flex items-center space-x-1 text-primary-600">
              <SafeIcon icon={FiTrendingUp} className="text-sm" />
              <span className="text-sm font-medium">{property.marketTrend}</span>
            </div>
          </div>
        )}

        <Link to={`/property/${property.id}`}>
          <motion.button
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;