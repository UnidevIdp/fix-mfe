import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategoriesManagementDashboard } from './CategoriesManagementDashboard';

interface SimpleCategoryDashboardProps {
  initialViewMode?: 'list' | 'detail' | 'create' | 'edit';
}

export const SimpleCategoryDashboard: React.FC<SimpleCategoryDashboardProps> = ({ 
  initialViewMode = 'list' 
}) => {
  const {
    categories,
    loading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
  };

  const handleCategoryCreate = async (data: any): Promise<any | null> => {
    try {
      const success = await createCategory(data);
      if (success) {
        await refetch();
        return { id: Date.now().toString(), ...data }; // Mock return for now
      }
      return null;
    } catch (error) {
      console.error('Failed to create category:', error);
      return null;
    }
  };

  const handleCategoryUpdate = async (id: string, data: any): Promise<any | null> => {
    try {
      const success = await updateCategory(id, data);
      if (success) {
        await refetch();
        return { id, ...data }; // Mock return for now
      }
      return null;
    } catch (error) {
      console.error('Failed to update category:', error);
      return null;
    }
  };

  const handleCategoryDelete = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteCategory(id);
      if (success) {
        await refetch();
        // Clear selected category if it was deleted
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
        }
      }
      return success;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <CategoriesManagementDashboard
      categories={categories}
      selectedCategory={selectedCategory}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      filters={filters}
      onCategorySelect={handleCategorySelect}
      onCategoryCreate={handleCategoryCreate}
      onCategoryUpdate={handleCategoryUpdate}
      onCategoryDelete={handleCategoryDelete}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onRefresh={handleRefresh}
      initialViewMode={initialViewMode}
      className="w-full"
    />
  );
};

export default SimpleCategoryDashboard;