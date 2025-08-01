import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of our search context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Create the context with a default (null) value
// We'll provide the actual value in the SearchProvider
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create a custom hook for easy consumption of the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Create the SearchProvider component
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};