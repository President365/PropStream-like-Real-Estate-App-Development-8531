import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeepSeek } from '../../hooks/useDeepSeek';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalculator, FiDollarSign, FiTrendingUp, FiDownload, FiLoader, FiCheckCircle } = FiIcons;

const OfferCalculator = ({ property }) => {
  const [offerData, setOfferData] = useState({
    listPrice: property?.price || 0,
    targetProfit: 20000,
    rehab: 15000,
    closingCosts: 3000,
    holdingCosts: 2000,
    marketingCosts: 1000,
    contingency: 5000,
    financingType: 'cash',
    loanAmount: 0,
    interestRate: 7.5,
    loanTerm: 30
  });

  const [calculatedOffer, setCalculatedOffer] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const { analyzeProperty, loading } = useDeepSeek();

  const handleInputChange = (field, value) => {
    setOfferData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const calculateOffer = async () => {
    const {
      listPrice,
      targetProfit,
      rehab,
      closingCosts,
      holdingCosts,
      marketingCosts,
      contingency,
      financingType,
      loanAmount,
      interestRate,
      loanTerm
    } = offerData;

    // Calculate ARV (After Repair Value)
    const arv = listPrice + rehab;

    // Calculate total costs
    const totalCosts = rehab + closingCosts + holdingCosts + marketingCosts + contingency;

    // Calculate financing costs if applicable
    let financingCosts = 0;
    if (financingType === 'loan' && loanAmount > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12)) / 
                            (Math.pow(1 + monthlyRate, loanTerm * 12) - 1);
      financingCosts = monthlyPayment * 6; // Assume 6 months holding period
    }

    // Calculate maximum offer
    const maxOffer = arv - totalCosts - targetProfit - financingCosts;

    // Calculate different offer scenarios
    const conservativeOffer = maxOffer * 0.85;
    const aggressiveOffer = maxOffer * 0.95;
    const marketOffer = listPrice * 0.92;

    const calculation = {
      arv,
      maxOffer,
      conservativeOffer,
      aggressiveOffer,
      marketOffer,
      totalCosts: totalCosts + financingCosts,
      projectedProfit: {
        conservative: arv - conservativeOffer - totalCosts - financingCosts,
        aggressive: arv - aggressiveOffer - totalCosts - financingCosts,
        market: arv - marketOffer - totalCosts - financingCosts
      },
      roi: {
        conservative: ((arv - conservativeOffer - totalCosts - financingCosts) / conservativeOffer) * 100,
        aggressive: ((arv - aggressiveOffer - totalCosts - financingCosts) / aggressiveOffer) * 100,
        market: ((arv - marketOffer - totalCosts - financingCosts) / marketOffer) * 100
      },
      breakdownCosts: {
        rehab,
        closingCosts,
        holdingCosts,
        marketingCosts,
        contingency,
        financingCosts
      }
    };

    setCalculatedOffer(calculation);

    // Get AI analysis
    if (property) {
      try {
        const analysis = await analyzeProperty({
          ...property,
          offerCalculation: calculation
        });
        setAiAnalysis(analysis);
      } catch (error) {
        console.error('AI analysis failed:', error);
      }
    }
  };

  const downloadReport = () => {
    if (!calculatedOffer) return;

    const reportData = {
      property: {
        address: property?.address || 'N/A',
        listPrice: offerData.listPrice,
        estimatedARV: calculatedOffer.arv
      },
      offers: {
        conservative: calculatedOffer.conservativeOffer,
        aggressive: calculatedOffer.aggressiveOffer,
        market: calculatedOffer.marketOffer
      },
      costs: calculatedOffer.breakdownCosts,
      projectedProfit: calculatedOffer.projectedProfit,
      roi: calculatedOffer.roi,
      aiInsights: aiAnalysis?.analysis || 'AI analysis not available'
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `offer-analysis-${property?.address?.replace(/\s+/g, '-') || 'property'}.json`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiCalculator} className="text-2xl text-primary-600" />
          <h3 className="text-xl font-bold text-gray-900">AI Offer Calculator</h3>
        </div>
        {calculatedOffer && (
          <motion.button
            onClick={downloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiDownload} />
            <span>Download Report</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Property & Cost Details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">List Price</label>
              <input
                type="number"
                value={offerData.listPrice}
                onChange={(e) => handleInputChange('listPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Profit</label>
              <input
                type="number"
                value={offerData.targetProfit}
                onChange={(e) => handleInputChange('targetProfit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rehab Costs</label>
              <input
                type="number"
                value={offerData.rehab}
                onChange={(e) => handleInputChange('rehab', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closing Costs</label>
              <input
                type="number"
                value={offerData.closingCosts}
                onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Holding Costs</label>
              <input
                type="number"
                value={offerData.holdingCosts}
                onChange={(e) => handleInputChange('holdingCosts', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contingency</label>
              <input
                type="number"
                value={offerData.contingency}
                onChange={(e) => handleInputChange('contingency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Financing Type</label>
            <select
              value={offerData.financingType}
              onChange={(e) => handleInputChange('financingType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="cash">Cash Purchase</option>
              <option value="loan">Financed</option>
            </select>
          </div>

          {offerData.financingType === 'loan' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                <input
                  type="number"
                  value={offerData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={offerData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term (years)</label>
                <input
                  type="number"
                  value={offerData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          <motion.button
            onClick={calculateOffer}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <SafeIcon icon={FiLoader} className="animate-spin" />
                <span>Calculating...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiCalculator} />
                <span>Calculate Offers</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {calculatedOffer ? (
            <>
              <h4 className="font-semibold text-gray-900">Calculated Offers</h4>
              
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-800">Conservative Offer</span>
                    <span className="text-2xl font-bold text-green-900">
                      ${calculatedOffer.conservativeOffer.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Profit: ${calculatedOffer.projectedProfit.conservative.toLocaleString()} 
                    ({calculatedOffer.roi.conservative.toFixed(1)}% ROI)
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Aggressive Offer</span>
                    <span className="text-2xl font-bold text-blue-900">
                      ${calculatedOffer.aggressiveOffer.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    Profit: ${calculatedOffer.projectedProfit.aggressive.toLocaleString()} 
                    ({calculatedOffer.roi.aggressive.toFixed(1)}% ROI)
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-orange-800">Market Offer</span>
                    <span className="text-2xl font-bold text-orange-900">
                      ${calculatedOffer.marketOffer.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-orange-700">
                    Profit: ${calculatedOffer.projectedProfit.market.toLocaleString()} 
                    ({calculatedOffer.roi.market.toFixed(1)}% ROI)
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Cost Breakdown</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Rehab:</span>
                    <span>${calculatedOffer.breakdownCosts.rehab.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Closing:</span>
                    <span>${calculatedOffer.breakdownCosts.closingCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Holding:</span>
                    <span>${calculatedOffer.breakdownCosts.holdingCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contingency:</span>
                    <span>${calculatedOffer.breakdownCosts.contingency.toLocaleString()}</span>
                  </div>
                  {calculatedOffer.breakdownCosts.financingCosts > 0 && (
                    <div className="flex justify-between">
                      <span>Financing:</span>
                      <span>${calculatedOffer.breakdownCosts.financingCosts.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-1 mt-1">
                    <div className="flex justify-between font-medium">
                      <span>Total Costs:</span>
                      <span>${calculatedOffer.totalCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {aiAnalysis && (
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiCheckCircle} className="text-primary-600" />
                    <h5 className="font-medium text-primary-900">AI Recommendations</h5>
                  </div>
                  <p className="text-sm text-primary-800">
                    {aiAnalysis.analysis || 'AI analysis suggests this offer strategy aligns with current market conditions.'}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <SafeIcon icon={FiCalculator} className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>Enter property details and click "Calculate Offers" to see results</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OfferCalculator;