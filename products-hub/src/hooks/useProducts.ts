import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  productsApi, 
  Product, 
  ProductFilters, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductsAnalytics 
} from '../services/productsApi';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string, includeVariants = true) => {
  return useQuery({
    queryKey: ['product', id, includeVariants],
    queryFn: () => productsApi.getProduct(id, includeVariants),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (product: CreateProductRequest) => productsApi.createProduct(product),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: UpdateProductRequest }) => 
      productsApi.updateProduct(id, product),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete product');
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) => 
      productsApi.updateProductStatus(id, status, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product status');
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, quantity, inventoryStatus }: { id: string; quantity: number; inventoryStatus?: string }) => 
      productsApi.updateInventory(id, quantity, inventoryStatus),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Inventory updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update inventory');
    },
  });
};

export const useCategories = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ['categories', page, limit],
    queryFn: () => productsApi.getCategories(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProductsAnalytics = () => {
  return useQuery({
    queryKey: ['products-analytics'],
    queryFn: () => productsApi.getAnalytics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useSearchProducts = (query: string, filters?: Omit<ProductFilters, 'search'>) => {
  return useQuery({
    queryKey: ['search-products', query, filters],
    queryFn: () => productsApi.searchProducts(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};