import React from 'react';
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
export declare const StaffFilters: React.FC<StaffFiltersProps>;
export default StaffFilters;
//# sourceMappingURL=StaffFilters.d.ts.map