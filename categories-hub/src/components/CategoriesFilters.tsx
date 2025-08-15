import React from 'react';
import { 
  EntitySearchAndFilters, 
  FilterSection 
} from '@workspace/shared';

export interface CategoriesFilterState {
  status: string[];
  levels: string[];
  parentIds: string[];
  isActive?: boolean;
}

interface CategoriesFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: CategoriesFilterState) => void;
  loading?: boolean;
  className?: string;
  searchResultsCount?: number;
  totalCategoriesCount?: number;
  currentSearchQuery?: string;
}

export const CategoriesFilters: React.FC<CategoriesFiltersProps> = ({
  onSearch,
  onFilterChange,
  loading = false,
  className = '',
  searchResultsCount,
  totalCategoriesCount,
  currentSearchQuery
}) => {
  // Default filter state
  const [filters, setFilters] = React.useState<CategoriesFilterState>({
    status: [],
    levels: [],
    parentIds: [],
    isActive: undefined
  });

  // Define filter sections configuration
  const filterSections: FilterSection<CategoriesFilterState>[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'multiselect',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' }
      ]
    },
    {
      key: 'levels',
      label: 'Level',
      type: 'multiselect',
      options: [
        { label: 'Top Level (0)', value: '0' },
        { label: 'Level 1', value: '1' },
        { label: 'Level 2', value: '2' },
        { label: 'Level 3', value: '3' },
        { label: 'Level 4+', value: '4' }
      ]
    },
    {
      key: 'isActive',
      label: 'Active Status',
      type: 'select',
      options: [
        { label: 'All', value: undefined },
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ]
    }
  ];

  const handleFiltersChange = (newFilters: CategoriesFilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  return (
    <EntitySearchAndFilters<CategoriesFilterState>
      entityName="categories"
      placeholder="Search categories by name or description..."
      onSearch={handleSearch}
      loading={loading}
      resultsCount={searchResultsCount}
      totalCount={totalCategoriesCount}
      value={currentSearchQuery}
      filterSections={filterSections}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      className={className}
    />
  );
};

export default CategoriesFilters;