import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeepSeek } from '../../hooks/useDeepSeek';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiCopy, FiSend, FiUser, FiLoader, FiCheckCircle } = FiIcons;

const EmailGenerator = ({ property, agent }) => {
  const [emailType, setEmailType] = useState('initial_inquiry');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [buyerInfo, setBuyerInfo] = useState({
    name: 'John Doe',
    phone: '(555) 123-4567',
    email: 'john.doe@email.com',
    preApproved: true,
    cashBuyer: false,
    timeline: '30-60 days'
  });

  const { loading } = useDeepSeek();
  const [generating, setGenerating] = useState(false);

  const emailTemplates = {
    initial_inquiry: 'Initial Property Inquiry',
    showing_request: 'Showing Request',
    offer_submission: 'Offer Submission',
    follow_up: 'Follow-up Email',
    market_analysis: 'Market Analysis Request',
    custom: 'Custom Message'
  };

  const generateEmail = async () => {
    setGenerating(true);
    
    try {
      const prompt = `Generate a professional real estate email for the following scenario:

Email Type: ${emailTemplates[emailType]}
Property: ${property?.address || 'Property Address'}
List Price: $${property?.price?.toLocaleString() || 'N/A'}
Property Details: ${property?.bedrooms || 'N/A'} bed, ${property?.bathrooms || 'N/A'} bath, ${property?.sqft?.toLocaleString() || 'N/A'} sqft

Buyer Information:
- Name: ${buyerInfo.name}
- Phone: ${buyerInfo.phone}
- Email: ${buyerInfo.email}
- Pre-approved: ${buyerInfo.preApproved ? 'Yes' : 'No'}
- Cash Buyer: ${buyerInfo.cashBuyer ? 'Yes' : 'No'}
- Timeline: ${buyerInfo.timeline}

Agent Information:
- Name: ${agent?.name || 'Listing Agent'}
- Brokerage: ${agent?.brokerage || 'Real Estate Brokerage'}

${customMessage ? `Additional Message: ${customMessage}` : ''}

Generate a professional, courteous, and effective email that:
1. Is appropriate for the email type
2. Includes relevant property and buyer details
3. Has a clear call to action
4. Maintains professional tone
5. Is concise but informative

Format as a complete email with subject line.`;

      // Simulate AI generation (replace with actual DeepSeek API call)
      setTimeout(() => {
        const email = generateEmailTemplate(emailType, property, agent, buyerInfo, customMessage);
        setGeneratedEmail(email);
        setGenerating(false);
      }, 2000);

    } catch (error) {
      console.error('Email generation failed:', error);
      setGenerating(false);
    }
  };

  const generateEmailTemplate = (type, property, agent, buyer, custom) => {
    const agentName = agent?.name || 'Listing Agent';
    const propertyAddress = property?.address || 'Property Address';
    const price = property?.price?.toLocaleString() || 'List Price';

    const templates = {
      initial_inquiry: `Subject: Inquiry About ${propertyAddress} - MLS #${property?.mlsNumber || 'N/A'}

Dear ${agentName},

I hope this email finds you well. I am writing to express my interest in the property located at ${propertyAddress}, listed at $${price}.

About me:
• Name: ${buyer.name}
• Contact: ${buyer.phone} | ${buyer.email}
• ${buyer.preApproved ? 'Pre-approved for financing' : 'Working on financing pre-approval'}
• ${buyer.cashBuyer ? 'Cash buyer - can close quickly' : 'Financing purchase'}
• Timeline: Looking to purchase within ${buyer.timeline}

I would love to learn more about this property and would appreciate the opportunity to schedule a showing at your earliest convenience. Please let me know your availability this week.

I look forward to hearing from you soon.

Best regards,
${buyer.name}
${buyer.phone}
${buyer.email}`,

      showing_request: `Subject: Showing Request - ${propertyAddress}

Dear ${agentName},

I would like to schedule a showing for the property at ${propertyAddress} (MLS #${property?.mlsNumber || 'N/A'}).

My availability includes:
• Weekdays after 5:00 PM
• Weekends: Saturday and Sunday, flexible timing
• Can accommodate short notice if needed

Buyer qualifications:
• ${buyer.preApproved ? 'Pre-approved' : 'Working on pre-approval'} for $${Math.round((property?.price || 400000) * 1.1).toLocaleString()}
• ${buyer.cashBuyer ? 'Cash purchase' : 'Conventional financing'}
• Ready to move forward quickly on the right property

Please let me know what times work best for you. I'm very interested in this property and would appreciate the opportunity to view it soon.

Thank you for your time.

Best regards,
${buyer.name}
${buyer.phone}
${buyer.email}`,

      offer_submission: `Subject: Offer Submission - ${propertyAddress}

Dear ${agentName},

Following our recent showing of ${propertyAddress}, I am pleased to submit an offer on this property.

Offer highlights:
• Serious buyer with ${buyer.preApproved ? 'pre-approved financing' : 'strong financial position'}
• ${buyer.cashBuyer ? 'All-cash offer for quick closing' : 'Conventional financing with 20% down'}
• Flexible closing date to accommodate seller needs
• Minimal contingencies

I believe this property is an excellent fit for my needs, and I'm prepared to move forward quickly. My offer letter and supporting documentation are being prepared by my agent.

Could we schedule a call to discuss the offer details and next steps? I'm available at ${buyer.phone} or can be reached via email.

I look forward to working with you on this transaction.

Best regards,
${buyer.name}
${buyer.phone}
${buyer.email}`,

      follow_up: `Subject: Follow-up on ${propertyAddress} Inquiry

Dear ${agentName},

I wanted to follow up on my previous inquiry regarding ${propertyAddress}. I remain very interested in this property and would appreciate any updates you might have.

Since my last contact:
• ${buyer.preApproved ? 'Financing pre-approval has been confirmed' : 'I have completed my financing pre-approval'}
• I've been actively looking in this area and this property remains my top choice
• My timeline for purchasing is ${buyer.timeline}

If the property is still available, I would love to discuss next steps or schedule a showing. Please let me know if you need any additional information from me.

I appreciate your time and look forward to hearing from you.

Best regards,
${buyer.name}
${buyer.phone}
${buyer.email}`,

      market_analysis: `Subject: Market Analysis Request - ${propertyAddress} Area

Dear ${agentName},

I hope this email finds you well. I am actively looking to purchase in the ${property?.city || 'area'} market and am very interested in ${propertyAddress}.

As part of my due diligence, I would appreciate your professional insights on:
• Recent comparable sales in the neighborhood
• Current market trends and pricing
• Average days on market for similar properties
• Any upcoming developments or changes that might affect property values

About my search:
• Budget: Up to $${Math.round((property?.price || 400000) * 1.2).toLocaleString()}
• ${buyer.preApproved ? 'Pre-approved buyer' : 'Financing in progress'}
• Timeline: ${buyer.timeline}
• Serious about making a purchase in this area

Your expertise and market knowledge would be invaluable in helping me make an informed decision. Would you be available for a brief call this week to discuss?

Thank you for your time and expertise.

Best regards,
${buyer.name}
${buyer.phone}
${buyer.email}`,

      custom: custom || 'Please enter your custom message above and regenerate.'
    };

    return templates[type] || templates.initial_inquiry;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  const openEmailClient = () => {
    const subject = generatedEmail.split('\n')[0].replace('Subject: ', '');
    const body = generatedEmail.split('\n').slice(2).join('\n');
    const mailto = `mailto:${agent?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <SafeIcon icon={FiMail} className="text-2xl text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900">Email Generator</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(emailTemplates).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <SafeIcon icon={FiUser} />
              <span>Buyer Information</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={buyerInfo.name}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={buyerInfo.email}
                onChange={(e) => setBuyerInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Timeline</label>
              <select
                value={buyerInfo.timeline}
                onChange={(e) => setBuyerInfo(prev => ({ ...prev, timeline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ASAP">ASAP</option>
                <option value="30 days">30 days</option>
                <option value="30-60 days">30-60 days</option>
                <option value="60-90 days">60-90 days</option>
                <option value="3-6 months">3-6 months</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={buyerInfo.preApproved}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, preApproved: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Pre-approved</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={buyerInfo.cashBuyer}
                  onChange={(e) => setBuyerInfo(prev => ({ ...prev, cashBuyer: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Cash Buyer</span>
              </label>
            </div>
          </div>

          {emailType === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Message</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your custom message requirements..."
              />
            </div>
          )}

          <motion.button
            onClick={generateEmail}
            disabled={generating}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {generating ? (
              <>
                <SafeIcon icon={FiLoader} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiMail} />
                <span>Generate Email</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Generated Email Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Generated Email</h4>
            {generatedEmail && (
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiCopy} />
                  <span>Copy</span>
                </motion.button>
                <motion.button
                  onClick={openEmailClient}
                  className="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiSend} />
                  <span>Send</span>
                </motion.button>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 min-h-[400px]">
            {generatedEmail ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {generatedEmail}
              </pre>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <SafeIcon icon={FiMail} className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>Configure your email settings and click "Generate Email" to create a professional message</p>
              </div>
            )}
          </div>

          {agent && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Agent Information</h5>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Name: {agent.name || 'Not available'}</div>
                <div>Email: {agent.email || 'Not available'}</div>
                <div>Phone: {agent.phone || 'Not available'}</div>
                <div>Brokerage: {agent.brokerage || 'Not available'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EmailGenerator;