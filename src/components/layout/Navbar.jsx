import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBell, FiUser, FiSettings, FiSearch, FiMenu, FiX } = FiIcons;

const Navbar = ({ onMenuToggle, isMobileMenuOpen }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <motion.nav
      className="bg-white shadow-lg border-b border-gray-200 fixed w-full top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <SafeIcon 
                icon={isMobileMenuOpen ? FiX : FiMenu} 
                className="text-xl text-gray-600" 
              />
            </button>

            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-primary-600 p-2 rounded-lg">
                <SafeIcon icon={FiHome} className="text-white text-lg sm:text-xl" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">PropStream</span>
            </motion.div>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <SafeIcon 
                icon={FiSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search properties, addresses, or MLS..."
                className="search-input pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiSearch} className="text-xl" />
            </button>

            <motion.button
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiBell} className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </motion.button>

            <motion.button
              className="hidden sm:block p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiSettings} className="text-xl" />
            </motion.button>

            <motion.div
              className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 sm:px-3 py-2 cursor-pointer"
              whileHover={{ backgroundColor: '#f3f4f6' }}
            >
              <div className="bg-primary-600 p-1 rounded-full">
                <SafeIcon icon={FiUser} className="text-white text-sm" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">John Doe</span>
            </motion.div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden pb-4 overflow-hidden"
            >
              <div className="relative">
                <SafeIcon 
                  icon={FiSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="search-input pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;