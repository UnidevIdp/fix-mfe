import { httpClient } from '@workspace/shared';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.tesseract-hub.com/products/v1'
  : 'http://localhost:8087/api/v1';

export interface Product {
  id: string;
  tenantId: string;
  vendorId: string;
  categoryId: string;
  name: string;
  slug?: string;
  sku: string;
  description?: string;
  price: string;
  comparePrice?: string;
  costPrice?: string;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'REJECTED';
  inventoryStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'BACK_ORDER' | 'DISCONTINUED';
  quantity?: number;
  minOrderQty?: number;
  maxOrderQty?: number;
  lowStockThreshold?: number;
  weight?: string;
  dimensions?: Record<string, any>;
  searchKeywords?: string;
  tags?: string[];
  currencyCode?: string;
  syncStatus?: 'SYNCED' | 'PENDING' | 'FAILED' | 'CONFLICT';
  syncedAt?: string;
  version?: number;
  offlineId?: string;
  localizations?: Record<string, any>;
  attributes?: ProductAttribute[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  metadata?: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: string;
  comparePrice?: string;
  costPrice?: string;
  quantity: number;
  lowStockThreshold?: number;
  weight?: string;
  dimensions?: Record<string, any>;
  inventoryStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'BACK_ORDER' | 'DISCONTINUED';
  syncStatus?: 'SYNCED' | 'PENDING' | 'FAILED' | 'CONFLICT';
  version?: number;
  offlineId?: string;
  images?: ProductImage[];
  attributes?: ProductVariantAttribute[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  type?: string;
}

export interface ProductVariantAttribute {
  id: string;
  name: string;
  value: string;
  type?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  position: number;
  width?: number;
  height?: number;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  slug?: string;
  sku: string;
  description?: string;
  price: string;
  comparePrice?: string;
  costPrice?: string;
  vendorId: string;
  categoryId: string;
  quantity?: number;
  minOrderQty?: number;
  maxOrderQty?: number;
  lowStockThreshold?: number;
  weight?: string;
  dimensions?: Record<string, any>;
  searchKeywords?: string;
  tags?: string[];
  currencyCode?: string;
  attributes?: ProductAttribute[];
  images?: ProductImage[];
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  price?: string;
  comparePrice?: string;
  costPrice?: string;
  categoryId?: string;
  minOrderQty?: number;
  maxOrderQty?: number;
  lowStockThreshold?: number;
  weight?: string;
  dimensions?: Record<string, any>;
  searchKeywords?: string;
  tags?: string[];
  attributes?: ProductAttribute[];
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  vendorId?: string;
  status?: string;
  inventoryStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  includeVariants?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  metadata?: Record<string, any>;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ProductsAnalytics {
  overview: {
    totalProducts: number;
    activeProducts: number;
    draftProducts: number;
    outOfStock: number;
    lowStock: number;
    totalVariants: number;
    averagePrice: number;
    totalInventory: number;
  };
  distribution: {
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    byInventory: Record<string, number>;
  };
  trends: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ date: string; count: number }>;
    monthly: Array<{ date: string; count: number }>;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sku: string;
    viewCount: number;
    orderCount: number;
    revenue: number;
  }>;
}

export interface ProductsAnalyticsResponse {
  success: boolean;
  data: ProductsAnalytics;
  message?: string;
}

// API Functions
export const productsApi = {
  // Products
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.vendorId) params.append('vendorId', filters.vendorId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.inventoryStatus) params.append('inventoryStatus', filters.inventoryStatus);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice);
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters?.includeVariants) params.append('includeVariants', filters.includeVariants.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    
    return httpClient.get(url);
  },

  getProduct: async (id: string, includeVariants = true): Promise<ProductResponse> => {
    return httpClient.get(`${API_BASE_URL}/products/${id}?includeVariants=${includeVariants}`);
  },

  createProduct: async (product: CreateProductRequest): Promise<ProductResponse> => {
    return httpClient.post(`${API_BASE_URL}/products`, product);
  },

  updateProduct: async (id: string, product: UpdateProductRequest): Promise<ProductResponse> => {
    return httpClient.put(`${API_BASE_URL}/products/${id}`, product);
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    return httpClient.delete(`${API_BASE_URL}/products/${id}`);
  },

  updateProductStatus: async (id: string, status: string, notes?: string): Promise<{ success: boolean; message: string }> => {
    return httpClient.put(`${API_BASE_URL}/products/${id}/status`, { status, notes });
  },

  updateInventory: async (id: string, quantity: number, inventoryStatus?: string): Promise<{ success: boolean; message: string }> => {
    return httpClient.put(`${API_BASE_URL}/products/${id}/inventory`, { quantity, inventoryStatus });
  },

  // Categories
  getCategories: async (page = 1, limit = 50): Promise<CategoriesResponse> => {
    return httpClient.get(`${API_BASE_URL}/categories?page=${page}&limit=${limit}`);
  },

  // Analytics
  getAnalytics: async (): Promise<ProductsAnalyticsResponse> => {
    return httpClient.get(`${API_BASE_URL}/products/analytics`);
  },

  // Search
  searchProducts: async (query: string, filters?: Omit<ProductFilters, 'search'>): Promise<ProductsResponse> => {
    const searchRequest = {
      query,
      ...filters,
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };
    
    return httpClient.post(`${API_BASE_URL}/products/search`, searchRequest);
  },
};

// Document upload functionality for products
export const uploadProductDocuments = async (productId: string, files: File[]): Promise<any[]> => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('product_id', productId);
    formData.append('isPublic', 'false');
    formData.append('tags', `document_type:product_document,uploaded_at:${new Date().toISOString()}`);

    const response = await fetch('/api/v1/products/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-ID': localStorage.getItem('tenantId') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}: ${response.statusText}`);
    }

    return response.json();
  });

  return Promise.all(uploadPromises);
};