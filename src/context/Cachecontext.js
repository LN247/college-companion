
import React, { createContext, useState, useContext, useEffect } from 'react';

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const [cache, setCache] = useState({});

  const setCacheData = (key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: { data, timestamp: Date.now() }
    }));
  };

  const getCacheData = (key, maxAge = 1000000) => {
    const item = cache[key];
    if (item && Date.now() - item.timestamp < maxAge) {
      return item.data;
    }
    return null;
  };

  return (
    <CacheContext.Provider value={{ setCacheData, getCacheData }}>
      {children}
    </CacheContext.Provider>
  );
}

export const useCache = () => useContext(CacheContext);