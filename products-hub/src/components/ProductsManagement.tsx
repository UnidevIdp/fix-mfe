import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../services/productsApi';
import { useProducts, useDeleteProduct, useUpdateProductStatus } from '../hooks/useProducts';
import { ProductsManagementDashboard } from './ProductsManagementDashboard';
import { mockProducts } from '../services/mockData';

interface ProductsManagementProps {
  initialViewMode?: 'list' | 'detail' | 'create' | 'edit';
}

export const ProductsManagement: React.FC<ProductsManagementProps> = ({ 
  initialViewMode = 'list' 
}) => {
  let id: string | undefined;
  
  try {
    // Try to get ID from URL path
    const path = window.location.pathname;
    const match = path.match(/\/products\/([^\/]+)/);
    id = match ? match[1] : undefined;
  } catch (error) {
    // Fallback for MFE context
    id = undefined;
  }
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // For development, use mock data
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const { 
    data: productsResponse, 
    isLoading: isLoadingProducts, 
    error: productsError,
    refetch
  } = useProducts(filters);

  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();

  // Use mock data in development if API fails
  const products = useMemo(() => {
    if (isDevelopment && (!productsResponse || productsError)) {
      return mockProducts;
    }
    return productsResponse?.data || [];
  }, [productsResponse, productsError, isDevelopment]);

  // Load product if ID is provided
  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [id, products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleProductCreate = async (data: any): Promise<Product | null> => {
    try {
      // Implementation for creating product
      console.log('Create product:', data);
      // Simulate success for now
      const newProduct = { ...data, id: Date.now().toString() };
      return newProduct;
    } catch (error) {
      console.error('Failed to create product:', error);
      return null;
    }
  };

  const handleProductUpdate = async (id: string, data: any): Promise<Product | null> => {
    try {
      if (data.status) {
        await updateStatusMutation.mutateAsync({ id, status: data.status });
      }
      // Return updated product
      const updatedProduct = products.find(p => p.id === id);
      return updatedProduct ? { ...updatedProduct, ...data } : null;
    } catch (error) {
      console.error('Failed to update product:', error);
      return null;
    }
  };

  const handleProductDelete = async (id: string): Promise<boolean> => {
    try {
      await deleteProductMutation.mutateAsync(id);
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      return false;
    }
  };

  return (
    <ProductsManagementDashboard
      products={products}
      selectedProduct={selectedProduct}
      loading={isLoadingProducts}
      error={productsError?.message || null}
      searchQuery={searchQuery}
      filters={filters}
      onProductSelect={handleProductSelect}
      onProductCreate={handleProductCreate}
      onProductUpdate={handleProductUpdate}
      onProductDelete={handleProductDelete}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onRefresh={handleRefresh}
      initialViewMode={initialViewMode}
      className="w-full"
    />
  );
};

export default ProductsManagement;