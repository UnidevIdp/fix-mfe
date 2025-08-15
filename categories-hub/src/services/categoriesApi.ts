// Categories API service using shared HTTP client
import { createServiceClient } from '@workspace/shared';

// Create categories service client
const categoriesClient = createServiceClient('categories');

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface CategoriesListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Categories API service
 */
export const categoriesApi = {
  // Get all categories
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.parentId) searchParams.append('parentId', params.parentId);

    const query = searchParams.toString();
    const endpoint = query ? `/categories?${query}` : '/categories';
    
    return categoriesClient.get<CategoriesListResponse>(endpoint);
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    return categoriesClient.get<Category>(`/categories/${id}`);
  },

  // Create new category
  createCategory: async (category: CreateCategoryRequest) => {
    return categoriesClient.post<Category>('/categories', category);
  },

  // Update category
  updateCategory: async (id: string, category: UpdateCategoryRequest) => {
    return categoriesClient.put<Category>(`/categories/${id}`, category);
  },

  // Delete category
  deleteCategory: async (id: string) => {
    return categoriesClient.delete(`/categories/${id}`);
  },

  // Get category tree
  getCategoryTree: async () => {
    return categoriesClient.get<Category[]>('/categories/tree');
  },

  // Bulk operations
  bulkCreateCategories: async (categories: CreateCategoryRequest[]) => {
    return categoriesClient.post<Category[]>('/categories/bulk', { categories });
  },

  bulkUpdateCategories: async (updates: Array<{ id: string } & UpdateCategoryRequest>) => {
    return categoriesClient.put<Category[]>('/categories/bulk', { updates });
  },
};

export default categoriesApi;