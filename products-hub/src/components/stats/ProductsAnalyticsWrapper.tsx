import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ProductsAnalytics from './ProductsAnalytics';

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

const ProductsAnalyticsWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsAnalytics />
      <Toaster 
        position="top-right" 
        expand={true}
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
};

export default ProductsAnalyticsWrapper;