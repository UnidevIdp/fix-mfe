import React from 'react';
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
  const [activeTab, setActiveTab] = React.useState<'products' | 'analytics'>('products');

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
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'products'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Products Management
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Analytics & Insights
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'products' && <ProductsManagement />}
            {activeTab === 'analytics' && <ProductsAnalytics />}
          </div>
        </main>

        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
};

export default App;