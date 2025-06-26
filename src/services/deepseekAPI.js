class DeepSeekAPI {
  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    this.baseURL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
    
    if (!this.apiKey) {
      console.warn('DeepSeek API key not found. Please add VITE_DEEPSEEK_API_KEY to your .env file');
    }
  }

  async makeRequest(endpoint, options = {}) {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('DeepSeek API request failed:', error);
      throw error;
    }
  }

  async generatePropertyAnalysis(propertyData) {
    const prompt = `Analyze this real estate property and provide investment insights:
    
Property Details:
- Address: ${propertyData.address}
- Price: $${propertyData.price?.toLocaleString()}
- Size: ${propertyData.sqft} sqft
- Bedrooms: ${propertyData.bedrooms}
- Bathrooms: ${propertyData.bathrooms}
- Year Built: ${propertyData.yearBuilt}
- Days on Market: ${propertyData.daysOnMarket}
- Property Type: ${propertyData.propertyType}

Please provide:
1. Investment score (0-100)
2. Key strengths and weaknesses
3. Price analysis (overpriced/fair/underpriced)
4. Market trend prediction
5. Rental potential assessment
6. 3 specific recommendations

Format as JSON with clear sections.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a real estate investment expert. Provide detailed, data-driven analysis in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      return this.parseAIResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Property analysis failed:', error);
      return this.getFallbackAnalysis(propertyData);
    }
  }

  async generateMarketInsights(marketData) {
    const prompt = `Analyze this real estate market data and provide insights:

Market Data:
- Average Price: $${marketData.averagePrice?.toLocaleString()}
- Price Change: ${marketData.priceChange}%
- Inventory: ${marketData.inventory} properties
- Average Days on Market: ${marketData.daysOnMarket}
- Absorption Rate: ${marketData.absorption} months

Provide market predictions for the next 3, 6, and 12 months including:
1. Price trend forecasts
2. Inventory predictions
3. Best investment opportunities
4. Risk factors to watch
5. Buyer/seller market assessment

Format as structured JSON.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a real estate market analyst. Provide comprehensive market insights in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1200,
          temperature: 0.6
        })
      });

      return this.parseMarketResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Market analysis failed:', error);
      return this.getFallbackMarketInsights();
    }
  }

  async generateLeadScoring(leadData) {
    const prompt = `Analyze this lead and provide scoring insights:

Lead Information:
- Name: ${leadData.name}
- Email: ${leadData.email}
- Property Interest: ${leadData.propertyInterest}
- Source: ${leadData.source}
- Notes: ${leadData.notes}
- Last Contact: ${leadData.lastContact}

Provide:
1. Lead score (0-100)
2. Conversion probability
3. Priority level (High/Medium/Low)
4. Recommended next actions
5. Timeline for follow-up
6. Key factors influencing the score

Format as JSON.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a real estate lead analysis expert. Provide detailed lead scoring in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.5
        })
      });

      return this.parseLeadResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Lead scoring failed:', error);
      return this.getFallbackLeadScore(leadData);
    }
  }

  parseAIResponse(content) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, create structured response from text
      return {
        investmentScore: this.extractScore(content),
        analysis: content,
        recommendations: this.extractRecommendations(content),
        priceAssessment: this.extractPriceAssessment(content)
      };
    } catch (error) {
      return { analysis: content, error: 'Failed to parse response' };
    }
  }

  parseMarketResponse(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        predictions: {
          threeMonth: 'Stable growth expected',
          sixMonth: 'Continued positive trends',
          twelveMonth: 'Market normalization'
        },
        insights: content
      };
    } catch (error) {
      return { insights: content, error: 'Failed to parse market response' };
    }
  }

  parseLeadResponse(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        score: this.extractScore(content),
        priority: 'Medium',
        recommendations: this.extractRecommendations(content),
        analysis: content
      };
    } catch (error) {
      return { analysis: content, error: 'Failed to parse lead response' };
    }
  }

  extractScore(text) {
    const scoreMatch = text.match(/(\d+)\/100|score.*?(\d+)|(\d+)%/i);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) : 75;
  }

  extractRecommendations(text) {
    const recommendations = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^\d+\.|^-|^•/) && line.length > 10) {
        recommendations.push(line.replace(/^\d+\.|^-|^•/, '').trim());
      }
    });
    
    return recommendations.slice(0, 5);
  }

  extractPriceAssessment(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('underpriced') || lowerText.includes('undervalued')) {
      return 'Undervalued';
    } else if (lowerText.includes('overpriced') || lowerText.includes('overvalued')) {
      return 'Overpriced';
    }
    return 'Fair Market Value';
  }

  getFallbackAnalysis(property) {
    return {
      investmentScore: Math.min(95, Math.max(60, 100 - (property.daysOnMarket || 0) * 2)),
      analysis: 'AI analysis temporarily unavailable. Using basic metrics.',
      priceAssessment: property.estimatedValue > property.price ? 'Undervalued' : 'Fair Market Value',
      recommendations: [
        'Review recent comparable sales',
        'Analyze neighborhood trends',
        'Consider property inspection'
      ]
    };
  }

  getFallbackMarketInsights() {
    return {
      predictions: {
        threeMonth: 'Market stability expected',
        sixMonth: 'Moderate growth anticipated',
        twelveMonth: 'Long-term positive outlook'
      },
      insights: 'AI market analysis temporarily unavailable.'
    };
  }

  getFallbackLeadScore(lead) {
    let score = 50;
    if (lead.source === 'Referral') score += 20;
    if (lead.notes?.toLowerCase().includes('pre-approved')) score += 15;
    if (lead.notes?.toLowerCase().includes('cash')) score += 25;
    
    return {
      score: Math.min(100, score),
      priority: score > 80 ? 'High' : score > 60 ? 'Medium' : 'Low',
      analysis: 'Basic lead scoring applied.',
      recommendations: ['Follow up within 24 hours', 'Send property listings']
    };
  }

  async testConnection() {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await this.makeRequest('/chat/completions', {
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: 'Hello, please respond with "Connection successful"'
            }
          ],
          max_tokens: 50
        })
      });

      return { 
        success: true, 
        message: response.choices[0].message.content 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export default new DeepSeekAPI();