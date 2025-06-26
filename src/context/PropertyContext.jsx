import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRentCast } from '../hooks/useRentCast';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    priceRange: [0, 1000000],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    yearBuilt: 'any',
    lotSize: 'any'
  });
  const [marketData, setMarketData] = useState({});
  const [leads, setLeads] = useState([]);
  const [useRealData, setUseRealData] = useState(false);
  const [apiStatus, setApiStatus] = useState({ loading: true });
  const [isSearching, setIsSearching] = useState(false);

  const { searchProperties: searchRentCast, testConnection, getMarketData } = useRentCast();

  // Initialize data
  useEffect(() => {
    checkRentCastAndInitialize();
  }, []);

  // Update filtered properties when properties or filters change
  useEffect(() => {
    const filtered = filterProperties(properties, searchFilters);
    setFilteredProperties(filtered);
  }, [properties, searchFilters]);

  const checkRentCastAndInitialize = async () => {
    setApiStatus({ loading: true, message: 'Testing RentCast connection...' });
    
    try {
      console.log('🔍 Testing RentCast API connection...');
      const result = await testConnection();
      
      if (result.success) {
        setUseRealData(true);
        setApiStatus({ success: true, message: 'RentCast API connected successfully' });
        console.log('✅ RentCast API connected successfully');
        
        // Load some initial properties from RentCast
        try {
          console.log('📊 Loading properties from RentCast...');
          const realProperties = await searchRentCast({
            city: 'Austin',
            state: 'TX',
            limit: 20
          });
          
          if (realProperties.properties && realProperties.properties.length > 0) {
            setProperties(realProperties.properties);
            console.log(`✅ Loaded ${realProperties.properties.length} real properties from RentCast`);
            setApiStatus(prev => ({ 
              ...prev, 
              propertiesLoaded: realProperties.properties.length,
              message: `Connected - ${realProperties.properties.length} properties loaded`
            }));
          } else {
            console.log('⚠️ No properties returned from RentCast, using demo data');
            setApiStatus(prev => ({ ...prev, message: 'Connected but no properties found, using demo data' }));
            initializeMockData();
          }

          // Load real market data
          try {
            console.log('📈 Loading market data from RentCast...');
            const marketInfo = await getMarketData('Austin', 'TX', 'Single Family');
            setMarketData(marketInfo);
            console.log('✅ Real market data loaded from RentCast');
          } catch (error) {
            console.warn('⚠️ Market data unavailable, using defaults:', error.message);
            setMarketData({
              averagePrice: 483000,
              priceChange: 8.5,
              inventory: 245,
              daysOnMarket: 12,
              absorption: 2.1
            });
          }
        } catch (error) {
          console.error('❌ Failed to load RentCast properties:', error);
          setApiStatus({ success: false, error: `Failed to load properties: ${error.message}` });
          initializeMockData();
        }
      } else {
        console.log('❌ RentCast API not available:', result.error);
        setApiStatus({ success: false, error: result.error });
        initializeMockData();
      }
    } catch (error) {
      console.error('❌ RentCast connection test failed:', error);
      setApiStatus({ success: false, error: error.message });
      initializeMockData();
    }
  };

  const initializeMockData = () => {
    console.log('📋 Initializing demo data...');
    
    const mockProperties = [
      {
        id: 1,
        address: '123 Maple Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        price: 450000,
        estimatedValue: 465000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1850,
        lotSize: 0.25,
        yearBuilt: 2018,
        propertyType: 'Single Family',
        status: 'For Sale',
        daysOnMarket: 15,
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
        coordinates: [30.2672, -97.7431],
        aiScore: 92,
        leadPotential: 'High',
        marketTrend: 'Rising',
        mlsNumber: 'MLS123456',
        listingAgent: {
          name: 'Sarah Johnson',
          phone: '(512) 555-0123',
          email: 'sarah.johnson@realestate.com',
          brokerage: 'Austin Premier Realty'
        },
        rentEstimate: 2800,
        comparables: [
          { address: '125 Maple Street', price: 440000, sqft: 1800 },
          { address: '127 Maple Street', price: 470000, sqft: 1900 }
        ]
      },
      {
        id: 2,
        address: '456 Oak Avenue',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        price: 325000,
        estimatedValue: 340000,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        lotSize: 0.15,
        yearBuilt: 2015,
        propertyType: 'Condo',
        status: 'For Sale',
        daysOnMarket: 8,
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
        coordinates: [30.2849, -97.7341],
        aiScore: 87,
        leadPotential: 'High',
        marketTrend: 'Stable',
        mlsNumber: 'MLS789012',
        listingAgent: {
          name: 'Mike Chen',
          phone: '(512) 555-0456',
          email: 'mike.chen@realestate.com',
          brokerage: 'Austin Premier Realty'
        },
        rentEstimate: 2200,
        comparables: [
          { address: '458 Oak Avenue', price: 315000, sqft: 1150 },
          { address: '460 Oak Avenue', price: 335000, sqft: 1250 }
        ]
      },
      {
        id: 3,
        address: '789 Pine Boulevard',
        city: 'Austin',
        state: 'TX',
        zipCode: '78703',
        price: 675000,
        estimatedValue: 680000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
        lotSize: 0.35,
        yearBuilt: 2020,
        propertyType: 'Single Family',
        status: 'Recently Sold',
        daysOnMarket: 3,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        coordinates: [30.2711, -97.7494],
        aiScore: 95,
        leadPotential: 'Very High',
        marketTrend: 'Rising',
        mlsNumber: 'MLS345678',
        listingAgent: {
          name: 'Emily Rodriguez',
          phone: '(512) 555-0789',
          email: 'emily.rodriguez@realestate.com',
          brokerage: 'Austin Premier Realty'
        },
        rentEstimate: 3500,
        comparables: [
          { address: '791 Pine Boulevard', price: 665000, sqft: 2350 },
          { address: '793 Pine Boulevard', price: 685000, sqft: 2450 }
        ]
      },
      {
        id: 4,
        address: '321 Cedar Lane',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704',
        price: 285000,
        estimatedValue: 295000,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 850,
        lotSize: 0.1,
        yearBuilt: 2019,
        propertyType: 'Condo',
        status: 'For Sale',
        daysOnMarket: 22,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
        coordinates: [30.2500, -97.7500],
        aiScore: 78,
        leadPotential: 'Medium',
        marketTrend: 'Stable',
        mlsNumber: 'MLS456789',
        listingAgent: {
          name: 'David Wilson',
          phone: '(512) 555-0321',
          email: 'david.wilson@realestate.com',
          brokerage: 'Austin Premier Realty'
        },
        rentEstimate: 1800,
        comparables: [
          { address: '323 Cedar Lane', price: 275000, sqft: 820 },
          { address: '325 Cedar Lane', price: 295000, sqft: 880 }
        ]
      },
      {
        id: 5,
        address: '567 Elm Drive',
        city: 'Austin',
        state: 'TX',
        zipCode: '78705',
        price: 850000,
        estimatedValue: 875000,
        bedrooms: 5,
        bathrooms: 4,
        sqft: 3200,
        lotSize: 0.5,
        yearBuilt: 2021,
        propertyType: 'Single Family',
        status: 'For Sale',
        daysOnMarket: 5,
        images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'],
        coordinates: [30.2800, -97.7600],
        aiScore: 96,
        leadPotential: 'Very High',
        marketTrend: 'Rising',
        mlsNumber: 'MLS567890',
        listingAgent: {
          name: 'Lisa Martinez',
          phone: '(512) 555-0567',
          email: 'lisa.martinez@realestate.com',
          brokerage: 'Austin Premier Realty'
        },
        rentEstimate: 4200,
        comparables: [
          { address: '569 Elm Drive', price: 825000, sqft: 3100 },
          { address: '571 Elm Drive', price: 895000, sqft: 3300 }
        ]
      }
    ];

    const mockLeads = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567',
        propertyInterest: '123 Maple Street',
        leadScore: 92,
        status: 'Hot',
        lastContact: '2024-01-15',
        source: 'Website',
        notes: 'First-time buyer, pre-approved for $500k'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '(555) 234-5678',
        propertyInterest: '456 Oak Avenue',
        leadScore: 78,
        status: 'Warm',
        lastContact: '2024-01-12',
        source: 'Referral',
        notes: 'Looking for investment property'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '(555) 345-6789',
        propertyInterest: '789 Pine Boulevard',
        leadScore: 85,
        status: 'Hot',
        lastContact: '2024-01-14',
        source: 'Social Media',
        notes: 'Relocating from California, needs quick closing'
      }
    ];

    setProperties(mockProperties);
    setLeads(mockLeads);
    setMarketData({
      averagePrice: 483000,
      priceChange: 8.5,
      inventory: 245,
      daysOnMarket: 12,
      absorption: 2.1
    });
  };

  const filterProperties = (allProperties, filters) => {
    if (!allProperties || allProperties.length === 0) return [];

    return allProperties.filter(property => {
      // Location filter
      if (filters.location && filters.location.trim() !== '') {
        const searchTerm = filters.location.toLowerCase().trim();
        const matchesAddress = property.address?.toLowerCase().includes(searchTerm);
        const matchesCity = property.city?.toLowerCase().includes(searchTerm);
        const matchesZip = property.zipCode?.toLowerCase().includes(searchTerm);
        
        if (!matchesAddress && !matchesCity && !matchesZip) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange && Array.isArray(filters.priceRange)) {
        const [minPrice, maxPrice] = filters.priceRange;
        if (property.price < minPrice || property.price > maxPrice) {
          return false;
        }
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType !== 'all') {
        if (property.propertyType !== filters.propertyType) {
          return false;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        const minBedrooms = parseInt(filters.bedrooms);
        if (property.bedrooms < minBedrooms) {
          return false;
        }
      }

      // Bathrooms filter
      if (filters.bathrooms && filters.bathrooms !== 'any') {
        const minBathrooms = parseFloat(filters.bathrooms);
        if (property.bathrooms < minBathrooms) {
          return false;
        }
      }

      // Year built filter
      if (filters.yearBuilt && filters.yearBuilt !== 'any') {
        const yearFilter = filters.yearBuilt;
        const propertyYear = property.yearBuilt;
        
        if (yearFilter === '2020+' && propertyYear < 2020) return false;
        if (yearFilter === '2010+' && propertyYear < 2010) return false;
        if (yearFilter === '2000+' && propertyYear < 2000) return false;
        if (yearFilter === '1990+' && propertyYear < 1990) return false;
      }

      // Lot size filter
      if (filters.lotSize && filters.lotSize !== 'any') {
        const sizeFilter = filters.lotSize;
        const propertyLotSize = property.lotSize || 0;
        
        if (sizeFilter === '0.1+' && propertyLotSize < 0.1) return false;
        if (sizeFilter === '0.25+' && propertyLotSize < 0.25) return false;
        if (sizeFilter === '0.5+' && propertyLotSize < 0.5) return false;
        if (sizeFilter === '1+' && propertyLotSize < 1) return false;
      }

      return true;
    });
  };

  const searchProperties = async (filters) => {
    setIsSearching(true);
    setSearchFilters(filters);

    try {
      if (useRealData && apiStatus.success) {
        try {
          const searchParams = {
            city: filters.location.includes(',') ? filters.location.split(',')[0]?.trim() : filters.location || 'Austin',
            state: filters.location.includes(',') ? filters.location.split(',')[1]?.trim() : 'TX',
            bedrooms: filters.bedrooms !== 'any' ? parseInt(filters.bedrooms) : undefined,
            bathrooms: filters.bathrooms !== 'any' ? parseFloat(filters.bathrooms) : undefined,
            propertyType: filters.propertyType !== 'all' ? filters.propertyType : undefined,
            limit: 50
          };

          console.log('Searching with RentCast API...', searchParams);
          const result = await searchRentCast(searchParams);
          
          if (result.properties && result.properties.length > 0) {
            setProperties(result.properties);
            console.log(`Found ${result.properties.length} properties from RentCast`);
            return result.properties;
          } else {
            console.log('No real properties found, filtering mock data');
            const filtered = filterProperties(properties, filters);
            return filtered;
          }
        } catch (error) {
          console.error('RentCast search failed, using local filtering:', error);
          const filtered = filterProperties(properties, filters);
          return filtered;
        }
      } else {
        console.log('Using local property filtering...');
        const filtered = filterProperties(properties, filters);
        return filtered;
      }
    } finally {
      setIsSearching(false);
    }
  };

  const getPropertyById = (id) => {
    return properties.find(property => property.id === parseInt(id));
  };

  const generateAIInsights = (property) => {
    return {
      investmentScore: property.aiScore,
      marketAnalysis: `This property shows ${property.marketTrend.toLowerCase()} market conditions with strong potential.`,
      priceRecommendation: property.estimatedValue > property.price ? 'Undervalued' : 'Fair Market Value',
      leadPotential: property.leadPotential,
      recommendations: [
        'Consider quick offer due to low days on market',
        'Property type is in high demand in this area',
        'Comparable sales support current pricing'
      ]
    };
  };

  const value = {
    properties,
    setProperties,
    filteredProperties,
    setFilteredProperties,
    selectedProperty,
    setSelectedProperty,
    searchFilters,
    setSearchFilters,
    marketData,
    leads,
    setLeads,
    useRealData,
    apiStatus,
    isSearching,
    searchProperties,
    getPropertyById,
    generateAIInsights,
    checkRentCastAndInitialize,
    filterProperties
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};