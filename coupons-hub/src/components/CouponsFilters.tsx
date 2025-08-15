import React from 'react';
import { EntitySearchAndFilters } from '@workspace/shared';
import { CouponFiltersType } from '../types/coupon.types';

interface CouponsFiltersProps {
  searchQuery?: string;
  filters?: CouponFiltersType;
  onSearchChange?: (query: string) => void;
  onFilterChange?: (filters: CouponFiltersType) => void;
  onClearFilters?: () => void;
  className?: string;
}

export const CouponsFilters: React.FC<CouponsFiltersProps> = ({
  searchQuery = '',
  filters = {},
  onSearchChange,
  onFilterChange,
  onClearFilters,
  className = ''
}) => {
  const filterSections = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'scope',
      label: 'Scope',
      type: 'select' as const,
      options: [
        { value: 'global', label: 'Global' },
        { value: 'tenant', label: 'Tenant' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'category', label: 'Category' }
      ]
    },
    {
      key: 'discountType',
      label: 'Discount Type',
      type: 'select' as const,
      options: [
        { value: 'percentage', label: 'Percentage' },
        { value: 'fixed_amount', label: 'Fixed Amount' },
        { value: 'free_shipping', label: 'Free Shipping' },
        { value: 'buy_x_get_y', label: 'Buy X Get Y' }
      ]
    },
    {
      key: 'isActive',
      label: 'Active Only',
      type: 'select' as const,
      options: [
        { value: undefined, label: 'All' },
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ]
    }
  ];

  const handleFiltersChange = (newFilters: CouponFiltersType) => {
    onFilterChange?.(newFilters);
  };

  return (
    <EntitySearchAndFilters<CouponFiltersType>
      entityName="coupons"
      placeholder="Search coupons by code or description..."
      onSearch={onSearchChange}
      loading={false}
      value={searchQuery}
      filterSections={filterSections}
      filters={filters}
      onFiltersChange={handleFiltersChange}
      className={className}
    />
  );
};

export default CouponsFilters;
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      filters={filterOptions}
      onFilterChange={handleFilterUpdate}
      onClearFilters={onClearFilters}
      searchPlaceholder="Search coupons by code, description..."
      className={className}
    />
  );
};

export default CouponsFilters;
  )
}