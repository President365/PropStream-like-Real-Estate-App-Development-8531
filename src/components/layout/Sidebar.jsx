import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiSearch, FiUsers, FiTrendingUp, FiBarChart3, FiBrain, FiTarget } = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/search', icon: FiSearch, label: 'Property Search', color: 'text-green-600' },
    { path: '/leads', icon: FiUsers, label: 'Lead Generation', color: 'text-purple-600' },
    { path: '/analytics', icon: FiTrendingUp, label: 'Market Analytics', color: 'text-orange-600' },
    { path: '/comparables', icon: FiBarChart3, label: 'Comparables', color: 'text-indigo-600' },
    { path: '/ai-insights', icon: FiBrain, label: 'AI Insights', color: 'text-pink-600' }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: -280,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      visibility: 'visible'
    },
    closed: {
      opacity: 0,
      visibility: 'hidden'
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg border-r border-gray-200 z-50 md:z-40 overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <motion.div
                    className={`sidebar-item flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon 
                      icon={item.icon} 
                      className={`text-lg ${isActive ? 'text-primary-600' : item.color}`} 
                    />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-white">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiTarget} className="text-lg" />
              <span className="font-semibold">Pro Tip</span>
            </div>
            <p className="text-sm opacity-90">
              Use AI Insights to identify the best investment opportunities in your market.
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;