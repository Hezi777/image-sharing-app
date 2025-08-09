import React, { createContext, useContext, useMemo, useState } from 'react';

interface SearchContextType {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within <SearchProvider>');
  return ctx;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSearch, setShowSearch] = useState(false);
  const value = useMemo(() => ({ showSearch, setShowSearch }), [showSearch]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
