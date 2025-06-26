class RentCastAPI {
  constructor() {
    this.apiKey = import.meta.env.VITE_RENTCAST_API_KEY;
    this.baseURL = 'https://api.rentcast.io/v1';
    
    if (!this.apiKey) {
      console.warn('RentCast API key not found. Please add VITE_RENTCAST_API_KEY to your .env file');
    }
  }

  async makeRequest(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('RentCast API key is required');
    }

    const url = new URL(`${this.baseURL}${endpoint}`);
    
    // Add API key to headers instead of query params
    const headers = {
      'X-Api-Key': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      console.log('RentCast API Request:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('RentCast API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`RentCast API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('RentCast API Success:', data);
      return data;
    } catch (error) {
      console.error('RentCast API request failed:', error);
      throw error;
    }
  }

  // Property Search using correct endpoint
  async searchProperties(params) {
    const { address, city, state, zipCode, bedrooms, bathrooms, propertyType, radius = 5, limit = 50 } = params;
    
    try {
      const searchParams = {
        limit: Math.min(limit, 500) // RentCast max limit
      };

      // Add location parameters
      if (city) searchParams.city = city;
      if (state) searchParams.state = state;
      if (zipCode) searchParams.zipCode = zipCode;
      if (address) searchParams.address = address;
      
      // Add property filters
      if (bedrooms && bedrooms !== 'any') searchParams.bedrooms = bedrooms;
      if (bathrooms && bathrooms !== 'any') searchParams.bathrooms = bathrooms;
      if (propertyType && propertyType !== 'all') {
        // Map property types to RentCast format
        const typeMap = {
          'Single Family': 'Single Family',
          'Condo': 'Condo',
          'Townhouse': 'Townhouse',
          'Multi-Family': 'Multi Family'
        };
        searchParams.propertyType = typeMap[propertyType] || propertyType;
      }

      // Use the correct listings endpoint
      const response = await this.makeRequest('/listings/sale', searchParams);
      return this.transformPropertiesData(response);
    } catch (error) {
      console.error('Property search failed:', error);
      return { properties: [], error: error.message };
    }
  }

  // Get Property Details
  async getPropertyDetails(propertyId) {
    try {
      const response = await this.makeRequest(`/properties/${propertyId}`);
      return this.transformPropertyData(response);
    } catch (error) {
      console.error('Property details fetch failed:', error);
      throw error;
    }
  }

  // Get Property Value Estimate using correct endpoint
  async getPropertyValue(address, city, state, zipCode) {
    try {
      const params = {};
      if (address) params.address = address;
      if (city) params.city = city;
      if (state) params.state = state;
      if (zipCode) params.zipCode = zipCode;

      const response = await this.makeRequest('/avm/value', params);
      return {
        estimatedValue: response.price || response.estimate,
        confidence: response.confidence,
        priceRange: {
          low: response.price_range_low || response.low,
          high: response.price_range_high || response.high
        },
        comparables: response.comparables || []
      };
    } catch (error) {
      console.error('Property value estimate failed:', error);
      throw error;
    }
  }

  // Get Rental Estimates
  async getRentalEstimate(address, city, state, zipCode, propertyType) {
    try {
      const params = {};
      if (address) params.address = address;
      if (city) params.city = city;
      if (state) params.state = state;
      if (zipCode) params.zipCode = zipCode;
      if (propertyType) params.propertyType = propertyType;

      const response = await this.makeRequest('/avm/rent', params);
      return {
        rentEstimate: response.rent || response.estimate,
        confidence: response.confidence,
        rentRange: {
          low: response.rent_range_low || response.low,
          high: response.rent_range_high || response.high
        }
      };
    } catch (error) {
      console.error('Rental estimate failed:', error);
      throw error;
    }
  }

  // Get Market Data using correct endpoint
  async getMarketData(city, state, propertyType = 'Single Family') {
    try {
      const params = {
        city,
        state,
        propertyType
      };

      const response = await this.makeRequest('/markets/summary', params);
      return {
        averagePrice: response.average_price || response.avgPrice,
        medianPrice: response.median_price || response.medianPrice,
        pricePerSqft: response.price_per_sqft || response.pricePerSqft,
        averageRent: response.average_rent || response.avgRent,
        inventory: response.inventory_count || response.inventory,
        daysOnMarket: response.average_days_on_market || response.avgDaysOnMarket || 15,
        priceChange: response.price_change_percentage || response.priceChange || 5.2,
        marketTrend: response.market_trend || response.trend || 'Stable'
      };
    } catch (error) {
      console.error('Market data fetch failed:', error);
      // Return reasonable defaults for demo
      return {
        averagePrice: 450000,
        medianPrice: 425000,
        pricePerSqft: 240,
        averageRent: 2500,
        inventory: 180,
        daysOnMarket: 15,
        priceChange: 5.2,
        marketTrend: 'Stable'
      };
    }
  }

  // Get Comparable Sales
  async getComparables(address, city, state, zipCode, radius = 0.5) {
    try {
      const params = {
        radius
      };
      if (address) params.address = address;
      if (city) params.city = city;
      if (state) params.state = state;
      if (zipCode) params.zipCode = zipCode;

      const response = await this.makeRequest('/avm/comparables', params);
      return (response.comparables || []).map(comp => ({
        address: comp.address,
        price: comp.price,
        sqft: comp.sqft || comp.squareFeet,
        bedrooms: comp.bedrooms,
        bathrooms: comp.bathrooms,
        soldDate: comp.sold_date || comp.soldDate,
        daysOnMarket: comp.days_on_market || comp.daysOnMarket,
        distance: comp.distance
      }));
    } catch (error) {
      console.error('Comparables fetch failed:', error);
      throw error;
    }
  }

  // Transform API response to match app structure
  transformPropertiesData(response) {
    if (!response) {
      return { properties: [], total: 0 };
    }

    // Handle different response formats
    const listings = response.listings || response.properties || response.data || [];
    
    if (!Array.isArray(listings)) {
      console.warn('Unexpected RentCast response format:', response);
      return { properties: [], total: 0 };
    }

    const properties = listings.map((listing, index) => ({
      id: listing.id || `rentcast_${Date.now()}_${index}`,
      address: listing.address || listing.formattedAddress || 'Address Not Available',
      city: listing.city,
      state: listing.state,
      zipCode: listing.zipCode || listing.zip,
      price: listing.price || listing.listPrice,
      estimatedValue: listing.estimatedValue || listing.price || listing.listPrice,
      bedrooms: listing.bedrooms || listing.beds,
      bathrooms: listing.bathrooms || listing.baths,
      sqft: listing.sqft || listing.squareFeet,
      lotSize: listing.lotSize || listing.lotSizeAcres || 0.25,
      yearBuilt: listing.yearBuilt || listing.builtYear,
      propertyType: listing.propertyType || 'Single Family',
      status: listing.status || 'For Sale',
      daysOnMarket: listing.daysOnMarket || Math.floor(Math.random() * 30) + 1,
      images: this.extractImages(listing),
      coordinates: this.extractCoordinates(listing),
      aiScore: Math.floor(Math.random() * 30) + 70, // Placeholder until AI analysis
      leadPotential: this.calculateLeadPotential(listing),
      marketTrend: listing.marketTrend || 'Stable',
      mlsNumber: listing.mlsNumber || listing.mls,
      listingAgent: this.extractAgentInfo(listing),
      description: listing.description,
      features: listing.features || [],
      rentEstimate: listing.rentEstimate || this.estimateRent(listing)
    }));

    return {
      properties: properties.filter(p => p.price && p.price > 0), // Filter out invalid properties
      total: response.total || properties.length,
      page: response.page || 1,
      pages: response.pages || 1
    };
  }

  transformPropertyData(property) {
    return {
      id: property.id,
      address: property.address || property.formattedAddress,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode || property.zip,
      price: property.price || property.listPrice,
      estimatedValue: property.estimatedValue || property.price,
      bedrooms: property.bedrooms || property.beds,
      bathrooms: property.bathrooms || property.baths,
      sqft: property.sqft || property.squareFeet,
      lotSize: property.lotSize || 0.25,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType || 'Single Family',
      status: property.status || 'For Sale',
      daysOnMarket: property.daysOnMarket || 15,
      images: this.extractImages(property),
      coordinates: this.extractCoordinates(property),
      aiScore: Math.floor(Math.random() * 30) + 70,
      leadPotential: this.calculateLeadPotential(property),
      marketTrend: property.marketTrend || 'Stable',
      mlsNumber: property.mlsNumber,
      listingAgent: this.extractAgentInfo(property),
      description: property.description,
      features: property.features || [],
      rentEstimate: property.rentEstimate || this.estimateRent(property)
    };
  }

  extractImages(listing) {
    if (listing.photos && Array.isArray(listing.photos)) {
      return listing.photos;
    }
    if (listing.images && Array.isArray(listing.images)) {
      return listing.images;
    }
    // Return sample images as fallback
    const sampleImages = [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
    ];
    return [sampleImages[Math.floor(Math.random() * sampleImages.length)]];
  }

  extractCoordinates(listing) {
    if (listing.latitude && listing.longitude) {
      return [parseFloat(listing.latitude), parseFloat(listing.longitude)];
    }
    if (listing.lat && listing.lng) {
      return [parseFloat(listing.lat), parseFloat(listing.lng)];
    }
    // Default to Austin coordinates if not available
    return [30.2672 + (Math.random() - 0.5) * 0.1, -97.7431 + (Math.random() - 0.5) * 0.1];
  }

  extractAgentInfo(listing) {
    return {
      name: listing.agentName || listing.agent?.name || 'Contact Agent',
      phone: listing.agentPhone || listing.agent?.phone || '(555) 123-4567',
      email: listing.agentEmail || listing.agent?.email || 'agent@realestate.com',
      brokerage: listing.brokerageName || listing.agent?.brokerage || 'Real Estate Brokerage'
    };
  }

  estimateRent(property) {
    // Simple rent estimation based on property details
    const baseRent = (property.sqft || 1200) * 1.5; // $1.50 per sqft baseline
    const bedroomMultiplier = (property.bedrooms || 2) * 200;
    return Math.round(baseRent + bedroomMultiplier);
  }

  calculateLeadPotential(property) {
    let score = 0;
    
    if (property.daysOnMarket > 30) score += 20;
    if (property.price < property.estimatedValue) score += 30;
    if (property.priceReduction) score += 25;
    
    if (score >= 50) return 'Very High';
    if (score >= 30) return 'High';
    if (score >= 15) return 'Medium';
    return 'Low';
  }

  async testConnection() {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'API key not configured. Please add your RentCast API key to the .env file.'
      };
    }

    try {
      // Test with a simple property search in Austin
      const response = await this.makeRequest('/listings/sale', {
        city: 'Austin',
        state: 'TX',
        limit: 1
      });

      return {
        success: true,
        message: 'RentCast API connected successfully',
        data: response
      };
    } catch (error) {
      console.error('RentCast connection test failed:', error);
      
      // Provide more specific error information
      let errorMessage = error.message;
      
      if (error.message.includes('401')) {
        errorMessage = 'Invalid API key. Please check your RentCast API key.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access forbidden. Please verify your API key permissions.';
      } else if (error.message.includes('404')) {
        errorMessage = 'API endpoint not found. RentCast API may have updated.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

export default new RentCastAPI();