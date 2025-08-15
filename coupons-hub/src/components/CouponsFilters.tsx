import React from 'react';
import { Search, Filter, X, Calendar, Tag, DollarSign, ToggleLeft } from 'lucide-react';
import { EntitySearchAndFilters } from '@workspace/shared';
import { CouponFiltersType, CouponStatus, CouponScope, DiscountType } from '../types/coupon.types';

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
  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      icon: Tag,
      type: 'select' as const,
      options: [
        { value: CouponStatus.ACTIVE, label: 'Active' },
        { value: CouponStatus.EXPIRED, label: 'Expired' },
        { value: CouponStatus.SCHEDULED, label: 'Scheduled' },
        { value: CouponStatus.INACTIVE, label: 'Inactive' },
        { value: CouponStatus.SUSPENDED, label: 'Suspended' }
      ],
      value: filters.status
    },
    {
      key: 'scope',
      label: 'Scope',
      icon: Filter,
      type: 'select' as const,
      options: [
        { value: CouponScope.GLOBAL, label: 'Global' },
        { value: CouponScope.TENANT, label: 'Tenant' },
        { value: CouponScope.USER_GROUP, label: 'User Group' },
        { value: CouponScope.SPECIFIC_USERS, label: 'Specific Users' }
      ],
      value: filters.scope
    },
    {
      key: 'discountType',
      label: 'Discount Type',
      icon: DollarSign,
      type: 'select' as const,
      options: [
        { value: DiscountType.PERCENTAGE, label: 'Percentage' },
        { value: DiscountType.FIXED_AMOUNT, label: 'Fixed Amount' },
        { value: DiscountType.FREE_SHIPPING, label: 'Free Shipping' },
        { value: DiscountType.BUY_X_GET_Y, label: 'Buy X Get Y' }
      ],
      value: filters.discountType
    },
    {
      key: 'isActive',
      label: 'Active Only',
      icon: ToggleLeft,
      type: 'boolean' as const,
      value: filters.isActive
    },
    {
      key: 'validFrom',
      label: 'Valid From',
      icon: Calendar,
      type: 'date' as const,
      value: filters.validFrom
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      icon: Calendar,
      type: 'date' as const,
      value: filters.validUntil
    }
  ];

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange?.(newFilters);
  };

  return (
    <EntitySearchAndFilters
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