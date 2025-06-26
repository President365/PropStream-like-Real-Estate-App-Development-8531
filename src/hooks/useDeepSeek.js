import { useState, useCallback } from 'react';
import deepseekAPI from '../services/deepseekAPI';

export const useDeepSeek = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeProperty = useCallback(async (propertyData) => {
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await deepseekAPI.generatePropertyAnalysis(propertyData);
      return analysis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeMarket = useCallback(async (marketData) => {
    setLoading(true);
    setError(null);
    
    try {
      const insights = await deepseekAPI.generateMarketInsights(marketData);
      return insights;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scoreLead = useCallback(async (leadData) => {
    setLoading(true);
    setError(null);
    
    try {
      const scoring = await deepseekAPI.generateLeadScoring(leadData);
      return scoring;
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
      const result = await deepseekAPI.testConnection();
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
    analyzeProperty,
    analyzeMarket,
    scoreLead,
    testConnection
  };
};