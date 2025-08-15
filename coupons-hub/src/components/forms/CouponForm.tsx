import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import {
  Coupon,
  CouponFormData,
  CouponScope,
  DiscountType,
  CouponStatus,
  PaymentMethod,
  CouponPriority,
  CouponCombination
} from '../../types/coupon.types';

interface CouponFormProps {
  coupon?: Coupon | null;
  onSubmit: (data: CouponFormData) => void;
  onCancel: () => void;
}

export default function CouponForm({ coupon, onSubmit, onCancel }: CouponFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CouponFormData>({
    defaultValues: coupon || {
      code: '',
      scope: CouponScope.GLOBAL,
      status: CouponStatus.ACTIVE,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 0,
      firstTimeUserOnly: false,
      stackableWithOther: false,
      stackablePriority: 0,
      priority: CouponPriority.NORMAL,
      combination: CouponCombination.NONE,
      isActive: true,
      validFrom: new Date()
    }
  });

  const discountType = watch('discountType');
  const scope = watch('scope');

  useEffect(() => {
    if (coupon) {
      Object.entries(coupon).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as keyof CouponFormData, value);
        }
      });
    }
  }, [coupon, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Coupon Code
          </label>
          <input
            {...register('code', { 
              required: 'Coupon code is required',
              pattern: {
                value: /^[A-Z0-9_-]+$/,
                message: 'Code must contain only uppercase letters, numbers, hyphens, and underscores'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="SUMMER2024"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={CouponStatus.ACTIVE}>Active</option>
            <option value={CouponStatus.INACTIVE}>Inactive</option>
            <option value={CouponStatus.SCHEDULED}>Scheduled</option>
            <option value={CouponStatus.EXPIRED}>Expired</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe what this coupon offers..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scope
          </label>
          <select
            {...register('scope')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
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
            <option value={DiscountType.PERCENTAGE}>Percentage</option>
            <option value={DiscountType.FIXED}>Fixed Amount</option>
            <option value={DiscountType.BUY_X_GET_Y}>Buy X Get Y</option>
            <option value={DiscountType.FREE_SHIPPING}>Free Shipping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Value
          </label>
          <div className="relative">
            <input
              {...register('discountValue', {
                required: 'Discount value is required',
                min: { value: 0, message: 'Value must be positive' },
                max: discountType === DiscountType.PERCENTAGE 
                  ? { value: 100, message: 'Percentage cannot exceed 100' }
                  : undefined
              })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">
              {discountType === DiscountType.PERCENTAGE ? '%' : '$'}
            </span>
          </div>
          {errors.discountValue && (
            <p className="mt-1 text-sm text-red-600">{errors.discountValue.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valid From
          </label>
          <input
            {...register('validFrom', { required: 'Start date is required' })}
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.validFrom && (
            <p className="mt-1 text-sm text-red-600">{errors.validFrom.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valid Until (Optional)
          </label>
          <input
            {...register('validUntil')}
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Order Value
          </label>
          <input
            {...register('minOrderValue', { min: 0 })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Discount Amount
          </label>
          <input
            {...register('maxDiscount', { min: 0 })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="No limit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Total Usage
          </label>
          <input
            {...register('maxUsageCount', { min: 0 })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Unlimited"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Usage Per User
          </label>
          <input
            {...register('maxUsagePerUser', { min: 0 })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Unlimited"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            {...register('priority')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={CouponPriority.LOW}>Low</option>
            <option value={CouponPriority.NORMAL}>Normal</option>
            <option value={CouponPriority.HIGH}>High</option>
            <option value={CouponPriority.CRITICAL}>Critical</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            {...register('firstTimeUserOnly')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            First-time users only
          </label>
        </div>

        <div className="flex items-center">
          <input
            {...register('stackableWithOther')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Can be combined with other coupons
          </label>
        </div>

        <div className="flex items-center">
          <input
            {...register('isActive')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {coupon ? 'Update Coupon' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
}