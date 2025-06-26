import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProperty } from '../../context/PropertyContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiDollarSign, FiHome, FiBed, FiBath, FiCalendar, FiSearch } = FiIcons;

const SearchFilters = () => {
  const { searchFilters, setSearchFilters, searchProperties } = useProperty();
  const [localFilters, setLocalFilters] = useState(searchFilters);
  const [isSearching, setIsSearching] = useState(false);

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(searchFilters);
  }, [searchFilters]);

  const handleFilterChange = async (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Debounce search for text inputs
    if (key === 'location') {
      // Don't search immediately for location, wait for user to finish typing
      return;
    }
    
    // For other filters, search immediately
    setIsSearching(true);
    try {
      setSearchFilters(newFilters);
      await searchProperties(newFilters);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSearch = async () => {
    setIsSearching(true);
    try {
      const newFilters = { ...localFilters };
      setSearchFilters(newFilters);
      await searchProperties(newFilters);
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...localFilters.priceRange];
    newRange[index] = parseInt(value) || 0;
    handleFilterChange('priceRange', newRange);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      location: '',
      priceRange: [0, 1000000],
      propertyType: 'all',
      bedrooms: 'any',
      bathrooms: 'any',
      yearBuilt: 'any',
      lotSize: 'any'
    };
    setLocalFilters(defaultFilters);
    handleFilterChange('location', '');
    setSearchFilters(defaultFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-gray-50 rounded-lg p-4 sm:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Location Search */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiMapPin} />
            <span>Location</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter city, zip, or address"
              value={localFilters.location || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, location: e.target.value }))}
              onKeyPress={handleKeyPress}
              onBlur={handleLocationSearch}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={handleLocationSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 disabled:opacity-50"
            >
              <SafeIcon icon={FiSearch} className={isSearching ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiHome} />
            <span>Property Type</span>
          </label>
          <select
            value={localFilters.propertyType || 'all'}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="Single Family">Single Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Multi-Family">Multi-Family</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiBed} />
            <span>Bedrooms</span>
          </label>
          <select
            value={localFilters.bedrooms || 'any'}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="any">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiBath} />
            <span>Bathrooms</span>
          </label>
          <select
            value={localFilters.bathrooms || 'any'}
            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="any">Any</option>
            <option value="1">1+</option>
            <option value="1.5">1.5+</option>
            <option value="2">2+</option>
            <option value="2.5">2.5+</option>
            <option value="3">3+</option>
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-6">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
          <SafeIcon icon={FiDollarSign} />
          <span>Price Range: ${(localFilters.priceRange?.[0] || 0).toLocaleString()} - ${(localFilters.priceRange?.[1] || 1000000).toLocaleString()}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Min Price: ${(localFilters.priceRange?.[0] || 0).toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="25000"
              value={localFilters.priceRange?.[0] || 0}
              onChange={(e) => handlePriceRangeChange(0, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Max Price: ${(localFilters.priceRange?.[1] || 1000000).toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="25000"
              value={localFilters.priceRange?.[1] || 1000000}
              onChange={(e) => handlePriceRangeChange(1, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
        {/* Price Range Input Fields */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Min Price ($)</label>
            <input
              type="number"
              min="0"
              max="2000000"
              step="25000"
              value={localFilters.priceRange?.[0] || 0}
              onChange={(e) => handlePriceRangeChange(0, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Max Price ($)</label>
            <input
              type="number"
              min="0"
              max="2000000"
              step="25000"
              value={localFilters.priceRange?.[1] || 1000000}
              onChange={(e) => handlePriceRangeChange(1, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Year Built */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiCalendar} />
            <span>Year Built</span>
          </label>
          <select
            value={localFilters.yearBuilt || 'any'}
            onChange={(e) => handleFilterChange('yearBuilt', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="any">Any Year</option>
            <option value="2020+">2020 or newer</option>
            <option value="2010+">2010 or newer</option>
            <option value="2000+">2000 or newer</option>
            <option value="1990+">1990 or newer</option>
          </select>
        </div>

        {/* Lot Size */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
            <SafeIcon icon={FiHome} />
            <span>Lot Size</span>
          </label>
          <select
            value={localFilters.lotSize || 'any'}
            onChange={(e) => handleFilterChange('lotSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="any">Any Size</option>
            <option value="0.1+">0.1+ acres</option>
            <option value="0.25+">0.25+ acres</option>
            <option value="0.5+">0.5+ acres</option>
            <option value="1+">1+ acres</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={handleLocationSearch}
          disabled={isSearching}
          className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSearching ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiSearch} />
              <span>Search Properties</span>
            </div>
          )}
        </motion.button>
        
        <motion.button
          onClick={resetFilters}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset Filters
        </motion.button>
      </div>

      {/* Filter Summary */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-gray-600">Active filters:</span>
          {localFilters.location && (
            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
              📍 {localFilters.location}
            </span>
          )}
          {localFilters.propertyType !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              🏠 {localFilters.propertyType}
            </span>
          )}
          {localFilters.bedrooms !== 'any' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
              🛏️ {localFilters.bedrooms}+ beds
            </span>
          )}
          {localFilters.bathrooms !== 'any' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              🚿 {localFilters.bathrooms}+ baths
            </span>
          )}
          {(localFilters.priceRange?.[0] > 0 || localFilters.priceRange?.[1] < 1000000) && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              💰 ${(localFilters.priceRange?.[0] || 0).toLocaleString()} - ${(localFilters.priceRange?.[1] || 1000000).toLocaleString()}
            </span>
          )}
          {Object.values(localFilters).every(val => 
            val === '' || val === 'all' || val === 'any' || 
            (Array.isArray(val) && val[0] === 0 && val[1] === 1000000)
          ) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              No filters applied
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilters;