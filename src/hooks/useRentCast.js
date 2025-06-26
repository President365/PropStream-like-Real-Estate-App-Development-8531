import { useState, useCallback } from 'react';
import rentcastAPI from '../services/rentcastAPI';

export const useRentCast = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchProperties = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await rentcastAPI.searchProperties(searchParams);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyDetails = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);
    
    try {
      const property = await rentcastAPI.getPropertyDetails(propertyId);
      return property;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyValue = useCallback(async (address, city, state, zipCode) => {
    setLoading(true);
    setError(null);
    
    try {
      const valuation = await rentcastAPI.getPropertyValue(address, city, state, zipCode);
      return valuation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRentalEstimate = useCallback(async (address, city, state, zipCode, propertyType) => {
    setLoading(true);
    setError(null);
    
    try {
      const estimate = await rentcastAPI.getRentalEstimate(address, city, state, zipCode, propertyType);
      return estimate;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMarketData = useCallback(async (city, state, propertyType) => {
    setLoading(true);
    setError(null);
    
    try {
      const marketData = await rentcastAPI.getMarketData(city, state, propertyType);
      return marketData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComparables = useCallback(async (address, city, state, zipCode, radius) => {
    setLoading(true);
    setError(null);
    
    try {
      const comparables = await rentcastAPI.getComparables(address, city, state, zipCode, radius);
      return comparables;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const testConnection = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await rentcastAPI.testConnection();
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    searchProperties,
    getPropertyDetails,
    getPropertyValue,
    getRentalEstimate,
    getMarketData,
    getComparables,
    testConnection
  };
};