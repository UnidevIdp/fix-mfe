import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ProductsManagement from './components/ProductsManagement';
import ProductsAnalytics from './components/stats/ProductsAnalytics';
import './styles/global.css';

// Create a query client with default options
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
      <Router>
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
            <Routes>
              {/* Dashboard Overview */}
              <Route path="/" element={<ProductsManagement />} />
              
              {/* Product Management Routes */}
              <Route path="/products" element={<ProductsManagement />} />
              <Route path="/products/create" element={<ProductsManagement initialViewMode="create" />} />
              <Route path="/products/:id/view" element={<ProductsManagement initialViewMode="detail" />} />
              <Route path="/products/:id/edit" element={<ProductsManagement initialViewMode="edit" />} />
              
              {/* Analytics Route */}
              <Route path="/products/analytics" element={<ProductsAnalytics />} />
              
              {/* Legacy Routes for backward compatibility */}
              <Route path="/products/:id" element={<ProductsManagement initialViewMode="detail" />} />
            </Routes>
          </main>
        </div>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
};

export default App;