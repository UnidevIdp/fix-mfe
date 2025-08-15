import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ProductsListWrapper from './components/lists/ProductsListWrapper';
import './styles/global.css';
import './styles/animations.css';

// Create a query client for the app
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

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 py-3">
            <h1 className="text-xl font-semibold text-gray-900">
              Products Hub
            </h1>
            <p className="text-sm text-gray-600">
              Cross-domain product management
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <ProductsListWrapper />
        </main>
      </div>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;