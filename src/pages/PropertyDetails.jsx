import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProperty } from '../context/PropertyContext';
import SafeIcon from '../common/SafeIcon';
import PropertyMap from '../components/property/PropertyMap';
import AIAnalysisCard from '../components/ai/AIAnalysisCard';
import OfferCalculator from '../components/ai/OfferCalculator';
import EmailGenerator from '../components/communication/EmailGenerator';
import DealExport from '../components/reports/DealExport';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiHome, FiBed, FiBath, FiMaximize, FiCalendar, FiTrendingUp, FiDollarSign, FiMapPin, FiCalculator, FiMail, FiDownload } = FiIcons;

const PropertyDetails = () => {
  const { id } = useParams();
  const { getPropertyById, generateAIInsights } = useProperty();
  const property = getPropertyById(id);
  const aiInsights = property ? generateAIInsights(property) : null;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [offerCalculation, setOfferCalculation] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
        <Link to="/search" className="text-primary-600 hover:text-primary-700">
          Back to search
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'calculator', label: 'Offer Calculator', icon: FiCalculator },
    { id: 'communication', label: 'Contact Agent', icon: FiMail },
    { id: 'export', label: 'Export Deal', icon: FiDownload }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Link to="/search">
          <motion.button
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiArrowLeft} className="text-gray-600" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
          <p className="text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
        </div>
      </motion.div>

      {/* Property Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="h-96 property-image bg-gray-200 flex items-center justify-center">
          {property.images && property.images[0] ? (
            <img
              src={property.images[0]}
              alt={property.address}
              className="w-full h-full object-cover"
            />
          ) : (
            <SafeIcon icon={FiHome} className="text-6xl text-gray-400" />
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">${property.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Est. Value: ${property.estimatedValue.toLocaleString()}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'For Sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {property.status}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBed} className="text-gray-500" />
              <span className="text-gray-900">{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBath} className="text-gray-500" />
              <span className="text-gray-900">{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMaximize} className="text-gray-500" />
              <span className="text-gray-900">{property.sqft.toLocaleString()} sqft</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCalendar} className="text-gray-500" />
              <span className="text-gray-900">Built {property.yearBuilt}</span>
            </div>
          </div>

          {/* Agent Information */}
          {property.listingAgent && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Listing Agent</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-900">{property.listingAgent.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-900">{property.listingAgent.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{property.listingAgent.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Brokerage:</span>
                  <span className="ml-2 text-gray-900">{property.listingAgent.brokerage || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Property Type:</span>
                      <span className="ml-2 text-gray-900">{property.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lot Size:</span>
                      <span className="ml-2 text-gray-900">{property.lotSize} acres</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Days on Market:</span>
                      <span className="ml-2 text-gray-900">{property.daysOnMarket} days</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Market Trend:</span>
                      <span className="ml-2 text-gray-900">{property.marketTrend}</span>
                    </div>
                    {property.mlsNumber && (
                      <div>
                        <span className="text-gray-600">MLS #:</span>
                        <span className="ml-2 text-gray-900">{property.mlsNumber}</span>
                      </div>
                    )}
                    {property.rentEstimate && (
                      <div>
                        <span className="text-gray-600">Rent Estimate:</span>
                        <span className="ml-2 text-gray-900">${property.rentEstimate.toLocaleString()}/mo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                  <PropertyMap properties={[property]} height="300px" />
                </div>

                {property.comparables && property.comparables.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparable Sales</h3>
                    <div className="space-y-3">
                      {property.comparables.map((comp, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{comp.address}</p>
                            <p className="text-sm text-gray-600">{comp.sqft.toLocaleString()} sqft</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${comp.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">${Math.round(comp.price / comp.sqft)}/sqft</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <AIAnalysisCard 
                  property={property} 
                  type="property" 
                  onAnalysisComplete={setAiAnalysis}
                />

                <div className="bg-white rounded-xl shadow-lg p-6 ai-glow">
                  <div className="flex items-center space-x-2 mb-4">
                    <SafeIcon icon={FiTrendingUp} className="text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Basic Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Investment Score</span>
                        <span className="text-sm font-semibold text-gray-900">{aiInsights?.investmentScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${aiInsights?.investmentScore || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Lead Potential</h4>
                      <div className={`px-3 py-2 rounded-lg text-sm ${
                        property.leadPotential === 'Very High' ? 'lead-score-high text-white' :
                        property.leadPotential === 'High' ? 'lead-score-medium text-white' :
                        'lead-score-low text-white'
                      }`}>
                        {property.leadPotential}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <OfferCalculator 
              property={property} 
              onCalculationComplete={setOfferCalculation}
            />
          )}

          {activeTab === 'communication' && (
            <EmailGenerator 
              property={property} 
              agent={property.listingAgent}
            />
          )}

          {activeTab === 'export' && (
            <DealExport 
              property={property}
              offerCalculation={offerCalculation}
              aiAnalysis={aiAnalysis}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PropertyDetails;