import React, { useState, useMemo } from 'react';
import { useProducts, useCategories, useDeleteProduct, useUpdateProductStatus } from '../hooks/useProducts';
import { Product, ProductFilters } from '../services/productsApi';
import { mockProducts, mockCategories } from '../services/mockData';
import { ProductsManagementDashboard } from './ProductsManagementDashboard';

export const ProductsManagement: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
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

  const { 
    data: categoriesResponse, 
    isLoading: isLoadingCategories 
  } = useCategories();

  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();

  // Use mock data in development if API fails
  const products = useMemo(() => {
    if (isDevelopment && (!productsResponse || productsError)) {
      return mockProducts;
    }
    return productsResponse?.data || [];
  }, [productsResponse, productsError, isDevelopment]);

  const categories = useMemo(() => {
    if (isDevelopment && (!categoriesResponse || !categoriesResponse.data)) {
      return mockCategories;
    }
    return categoriesResponse?.data || [];
  }, [categoriesResponse, isDevelopment]);

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
    // Implementation for creating product
    console.log('Create product:', data);
    return null;
  };

  const handleProductUpdate = async (id: string, data: any): Promise<Product | null> => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: data.status });
      return null;
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
      className="w-full"
    />
  );
};

export default ProductsManagement;