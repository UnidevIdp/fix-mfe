import { Category } from '../services/categoriesApi';
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
    createCategory: (category: {
        name: string;
        description?: string;
        parentId?: string;
    }) => Promise<boolean>;
    updateCategory: (id: string, updates: {
        name?: string;
        description?: string;
        isActive?: boolean;
    }) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
}
/**
 * Hook for managing categories data and operations
 */
export declare const useCategories: (options?: UseCategoriesOptions) => UseCategoriesReturn;
export default useCategories;
