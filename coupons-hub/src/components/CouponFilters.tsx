import React from 'react';
import { useForm } from 'react-hook-form';
import {
  CouponFiltersType,
  CouponStatus,
  CouponScope,
  DiscountType
} from '../types/coupon.types';

interface CouponFiltersProps {
  filters: CouponFiltersType;
  onApply: (filters: CouponFiltersType) => void;
  onReset: () => void;
}

export default function CouponFilters({ filters, onApply, onReset }: CouponFiltersProps) {
  const { register, handleSubmit, reset } = useForm<CouponFiltersType>({
    defaultValues: filters
  });

  const handleReset = () => {
    reset({});
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onApply)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            {...register('searchTerm')}
            type="text"
            placeholder="Search by code or description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value={CouponStatus.ACTIVE}>Active</option>
            <option value={CouponStatus.INACTIVE}>Inactive</option>
            <option value={CouponStatus.EXPIRED}>Expired</option>
            <option value={CouponStatus.SCHEDULED}>Scheduled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scope
          </label>
          <select
            {...register('scope')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Scopes</option>
            <option value={CouponScope.GLOBAL}>Global</option>
            <option value={CouponScope.VENDOR}>Vendor</option>
            <option value={CouponScope.CATEGORY}>Category</option>
            <option value={CouponScope.PRODUCT}>Product</option>
            <option value={CouponScope.USER}>User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Type
          </label>
          <select
            {...register('discountType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value={DiscountType.PERCENTAGE}>Percentage</option>
            <option value={DiscountType.FIXED}>Fixed Amount</option>
            <option value={DiscountType.BUY_X_GET_Y}>Buy X Get Y</option>
            <option value={DiscountType.FREE_SHIPPING}>Free Shipping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Active Status
          </label>
          <select
            {...register('isActive')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valid From
          </label>
          <input
            {...register('validFrom')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valid Until
          </label>
          <input
            {...register('validUntil')}
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Campaign ID
          </label>
          <input
            {...register('campaignId')}
            type="text"
            placeholder="Filter by campaign"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}