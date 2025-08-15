import React from 'react';
import { 
  EntitySearchAndFilters, 
  FilterSection 
} from '@workspace/shared';

export interface ProductFilterState {
  statuses: string[];
  inventoryStatuses: string[];
  categories: string[];
  priceRanges: string[];
}

interface ProductsFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: ProductFilterState) => void;
  loading?: boolean;
  className?: string;
  searchResultsCount?: number;
  totalProductCount?: number;
  currentSearchQuery?: string;
}

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  onSearch,
  onFilterChange,
  loading = false,
  className = '',
  searchResultsCount,
  totalProductCount,
  currentSearchQuery
}) => {
  // Default filter state
  const [filters, setFilters] = React.useState<ProductFilterState>({
    statuses: [],
    inventoryStatuses: [],
    categories: [],
    priceRanges: []
  });

  // Define filter sections configuration
  const filterSections: FilterSection<ProductFilterState>[] = [
    {
      key: 'statuses',
      label: 'Status',
      type: 'multiselect',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Archived', value: 'ARCHIVED' }
      ]
    },
    {
      key: 'inventoryStatuses',
      label: 'Inventory Status',
      type: 'multiselect',
      options: [
        { label: 'In Stock', value: 'IN_STOCK' },
        { label: 'Low Stock', value: 'LOW_STOCK' },
        { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
        { label: 'Back Order', value: 'BACK_ORDER' },
        { label: 'Discontinued', value: 'DISCONTINUED' }
      ]
    },
    {
      key: 'categories',
      label: 'Category',
      type: 'multiselect',
      options: [
        { label: 'Electronics', value: 'cat-1' },
        { label: 'Clothing', value: 'cat-2' },
        { label: 'Books', value: 'cat-3' },
        { label: 'Home & Garden', value: 'cat-4' },
        { label: 'Sports & Outdoors', value: 'cat-5' }
      ]
    },
    {
      key: 'priceRanges',
      label: 'Price Range',
      type: 'multiselect',
      options: [
        { label: '$0 - $50', value: '0-50' },
        { label: '$50 - $100', value: '50-100' },
        { label: '$100 - $500', value: '100-500' },
        { label: '$500+', value: '500+' }
      ]
    }
  ];

  const handleFiltersChange = (newFilters: ProductFilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  return (
    <EntitySearchAndFilters<ProductFilterState>
      entityName="product"
      placeholder="Search products by name, SKU, or description..."
      onSearch={handleSearch}
      loading={loading}
      resultsCount={searchResultsCount}
      totalCount={totalProductCount}
      value={currentSearchQuery}
      filterSections={filterSections}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      className={className}
    />
  );
};

export default ProductsFilters;
  )
}