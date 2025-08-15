import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ProductsList from './ProductsList';

// Create a separate query client for the exported component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const ProductsListWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsList />
      <Toaster 
        position="top-right" 
        expand={true}
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
};

export default ProductsListWrapper;