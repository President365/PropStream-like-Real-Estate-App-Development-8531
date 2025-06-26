import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProperty } from '../context/PropertyContext';
import SafeIcon from '../common/SafeIcon';
import PropertyCard from '../components/property/PropertyCard';
import PropertyMap from '../components/property/PropertyMap';
import SearchFilters from '../components/search/SearchFilters';
import * as FiIcons from 'react-icons/fi';

const { FiMap, FiList, FiFilter, FiSearch } = FiIcons;

const PropertySearch = () => {
  const { 
    properties, 
    filteredProperties, 
    searchFilters, 
    isSearching,
    useRealData,
    apiStatus 
  } = useProperty();
  
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  const [displayProperties, setDisplayProperties] = useState([]);

  // Update display properties when filtered properties change
  useEffect(() => {
    setDisplayProperties(filteredProperties.length > 0 ? filteredProperties : properties);
  }, [filteredProperties, properties]);

  const hasActiveFilters = () => {
    return (
      searchFilters.location !== '' ||
      searchFilters.propertyType !== 'all' ||
      searchFilters.bedrooms !== 'any' ||
      searchFilters.bathrooms !== 'any' ||
      searchFilters.yearBuilt !== 'any' ||
      searchFilters.lotSize !== 'any' ||
      (searchFilters.priceRange && 
       (searchFilters.priceRange[0] > 0 || searchFilters.priceRange[1] < 1000000))
    );
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
            <h1 className="text-2xl font-bold text-gray-900">Property Search</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600">
                {isSearching ? 'Searching...' : `${displayProperties.length} properties found`}
              </p>
              {hasActiveFilters() && (
                <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  Filters Active
                </span>
              )}
              {useRealData && apiStatus.success && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Live Data
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters || hasActiveFilters() 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiFilter} />
              <span>Filters</span>
              {hasActiveFilters() && (
                <span className="bg-white text-primary-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </motion.button>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <motion.button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiList} />
                <span>List</span>
              </motion.button>
              <motion.button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiMap} />
                <span>Map</span>
              </motion.button>
            </div>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <SearchFilters />
          </motion.div>
        )}
      </motion.div>

      {/* Loading State */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-gray-700">Searching properties...</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {useRealData ? 'Fetching live data from RentCast API' : 'Filtering local properties'}
          </p>
        </motion.div>
      )}

      {/* Results */}
      {!isSearching && (
        <>
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <PropertyMap properties={displayProperties} />
            </motion.div>
          )}
        </>
      )}

      {/* No Results */}
      {!isSearching && displayProperties.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg"
        >
          <SafeIcon icon={FiSearch} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters() 
              ? 'Try adjusting your search filters to see more results.' 
              : 'No properties available at the moment.'}
          </p>
          {hasActiveFilters() && (
            <motion.button
              onClick={() => setShowFilters(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Adjust Filters
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Search Tips */}
      {!isSearching && displayProperties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-2">💡 Search Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Location:</strong> Try "Austin, TX" or specific zip codes like "78701"
            </div>
            <div>
              <strong>Price Range:</strong> Use the sliders or type exact amounts
            </div>
            <div>
              <strong>Property Type:</strong> Filter by Single Family, Condo, etc.
            </div>
            <div>
              <strong>Bedrooms/Bathrooms:</strong> Select minimum requirements
            </div>
          </div>
          {useRealData && apiStatus.success && (
            <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                🔄 <strong>Live Data Active:</strong> Results are fetched in real-time from RentCast API
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PropertySearch;