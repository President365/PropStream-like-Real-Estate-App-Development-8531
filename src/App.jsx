import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import PropertySearch from './pages/PropertySearch';
import PropertyDetails from './pages/PropertyDetails';
import LeadGeneration from './pages/LeadGeneration';
import MarketAnalytics from './pages/MarketAnalytics';
import ComparableAnalysis from './pages/ComparableAnalysis';
import AIInsights from './pages/AIInsights';
import { PropertyProvider } from './context/PropertyContext';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSidebarClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <PropertyProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar 
            onMenuToggle={handleMenuToggle} 
            isMobileMenuOpen={isMobileMenuOpen}
          />
          
          <div className="flex">
            <Sidebar 
              isOpen={isMobile ? isMobileMenuOpen : true}
              onClose={handleSidebarClose}
            />
            
            <motion.main
              className={`flex-1 p-4 sm:p-6 pt-20 transition-all duration-300 ${
                isMobile ? 'ml-0' : 'ml-64'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search" element={<PropertySearch />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/leads" element={<LeadGeneration />} />
                <Route path="/analytics" element={<MarketAnalytics />} />
                <Route path="/comparables" element={<ComparableAnalysis />} />
                <Route path="/ai-insights" element={<AIInsights />} />
              </Routes>
            </motion.main>
          </div>
        </div>
      </Router>
    </PropertyProvider>
  );
}

export default App;