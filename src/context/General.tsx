// src/contexts/RefetchContext.tsx

import React, { createContext, useContext } from 'react';
import { useApolloClient } from '@apollo/client';

// Define the shape of the context
interface RefetchContextType {
  triggerRefetch: () => void;
}

// Create the context with a default no-op function
const RefetchContext = createContext<RefetchContextType>({
  triggerRefetch: () => {},
});

// Provider component
export const RefetchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useApolloClient();

  const triggerRefetch = () => {
    client.reFetchObservableQueries();
  };

  return <RefetchContext.Provider value={{ triggerRefetch }}>{children}</RefetchContext.Provider>;
};

// Custom hook to use the refetch context
export const useRefetchAll = () => {
  return useContext(RefetchContext);
};
