interface CategoryDashboardProps {
    categories?: any[];
    selectedCategory?: any;
    loading?: boolean;
    error?: string;
    searchQuery?: string;
    filters?: any;
    onCategorySelect?: (category: any) => void;
    onCategoryCreate?: (categoryData: any) => Promise<any>;
    onCategoryUpdate?: (id: string, categoryData: any) => Promise<any>;
    onCategoryDelete?: (id: string) => Promise<boolean>;
    onSearch?: (query: string) => void;
    onFilterChange?: (filters: any) => void;
    onRefresh?: () => void;
    initialViewMode?: string;
    onViewModeChange?: (mode: string) => void;
}
export default function SimpleCategoryDashboard(props?: CategoryDashboardProps): import("react/jsx-runtime").JSX.Element;
export {};
