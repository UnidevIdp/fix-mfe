import { useState, useEffect, useCallback } from 'react';
import { categoriesApi, Category } from '../services/categoriesApi';
import type { ApiResponse } from '@workspace/shared';

export interface UseCategoriesOptions {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  autoFetch?: boolean;
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  createCategory: (category: { name: string; description?: string; parentId?: string }) => Promise<boolean>;
  updateCategory: (id: string, updates: { name?: string; description?: string; isActive?: boolean }) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

/**
 * Hook for managing categories data and operations
 */
export const useCategories = (options: UseCategoriesOptions = {}): UseCategoriesReturn => {
  const {
    page = 1,
    limit = 20,
    search,
    parentId,
    autoFetch = true
  } = options;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, use mock data until backend is running
      const mockCategories = [
        {
          id: '1',
          name: 'Electronics',
          description: 'Electronic devices and accessories',
          level: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Smartphones',
          description: 'Mobile phones and accessories',
          parentId: '1',
          level: 1,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Laptops',
          description: 'Portable computers and accessories',
          parentId: '1',
          level: 1,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Gaming Laptops',
          description: 'High-performance gaming laptops',
          parentId: '3',
          level: 2,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'Fashion',
          description: 'Clothing and accessories',
          level: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '6',
          name: 'Men\'s Clothing',
          description: 'Clothing for men',
          parentId: '5',
          level: 1,
          isActive: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try to fetch from backend first
      try {
        const response = await categoriesApi.getCategories({
          page,
          limit,
          search,
          parentId
        });

        if (response.success && response.data) {
          setCategories(response.data.categories);
          setTotal(response.data.total);
        } else {
          throw new Error('Backend not available, using mock data');
        }
      } catch (backendError) {
        // Fallback to mock data
        console.log('Using mock data:', backendError);
        setCategories(mockCategories);
        setTotal(mockCategories.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, parentId]);

  const createCategory = useCallback(async (categoryData: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<boolean> => {
    try {
      const response = await categoriesApi.createCategory(categoryData);
      
      if (response.success) {
        // Refetch to get updated list
        await fetchCategories();
        return true;
      } else {
        setError(response.error?.message || 'Failed to create category');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      return false;
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, updates: {
    name?: string;
    description?: string;
    isActive?: boolean;
  }): Promise<boolean> => {
    try {
      const response = await categoriesApi.updateCategory(id, updates);
      
      if (response.success) {
        // Update the local state
        setCategories(prev => 
          prev.map(cat => 
            cat.id === id ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat
          )
        );
        return true;
      } else {
        setError(response.error?.message || 'Failed to update category');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      return false;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await categoriesApi.deleteCategory(id);
      
      if (response.success) {
        // Remove from local state
        setCategories(prev => prev.filter(cat => cat.id !== id));
        setTotal(prev => prev - 1);
        return true;
      } else {
        setError(response.error?.message || 'Failed to delete category');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      return false;
    }
  }, []);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  return {
    categories,
    loading,
    error,
    total,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;