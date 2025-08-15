import React from 'react';
import { 
  EntitySearchAndFilters, 
  FilterSection 
} from '@workspace/shared';

export interface StaffFilterState {
  roles: string[];
  employmentTypes: string[];
  departments: string[];
  isActive?: boolean;
}

interface StaffFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: StaffFilterState) => void;
  loading?: boolean;
  className?: string;
  searchResultsCount?: number;
  totalStaffCount?: number;
  currentSearchQuery?: string;
}

export const StaffFilters: React.FC<StaffFiltersProps> = ({
  onSearch,
  onFilterChange,
  loading = false,
  className = '',
  searchResultsCount,
  totalStaffCount,
  currentSearchQuery
}) => {
  // Default filter state
  const [filters, setFilters] = React.useState<StaffFilterState>({
    roles: [],
    employmentTypes: [],
    departments: [],
    isActive: undefined
  });

  // Define filter sections configuration
  const filterSections: FilterSection<StaffFilterState>[] = [
    {
      key: 'roles',
      label: 'Role',
      type: 'multiselect',
      options: [
        { label: 'Manager', value: 'manager' },
        { label: 'Employee', value: 'employee' },
        { label: 'Intern', value: 'intern' },
        { label: 'Contractor', value: 'contractor' }
      ]
    },
    {
      key: 'employmentTypes',
      label: 'Employment Type',
      type: 'multiselect',
      options: [
        { label: 'Full Time', value: 'full_time' },
        { label: 'Part Time', value: 'part_time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Intern', value: 'intern' }
      ]
    },
    {
      key: 'departments',
      label: 'Department',
      type: 'multiselect',
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' }
      ]
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All', value: undefined },
        { label: 'Active', value: true },
        { label: 'Inactive', value: false }
      ]
    }
  ];

  const handleFiltersChange = (newFilters: StaffFilterState) => {
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearch = (query: string) => {
    onSearch?.(query);
  };

  return (
    <EntitySearchAndFilters<StaffFilterState>
      entityName="staff"
      placeholder="Search staff by name or email..."
      onSearch={handleSearch}
      loading={loading}
      resultsCount={searchResultsCount}
      totalCount={totalStaffCount}
      value={currentSearchQuery}
      filterSections={filterSections}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      className={className}
    />
  );
};

export default StaffFilters;