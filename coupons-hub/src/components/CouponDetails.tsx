import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  DollarSign, 
  Percent, 
  Users, 
  ShoppingCart,
  Tag,
  Activity,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import { useCouponById } from '../hooks/useCoupons';
import { CouponStatus, DiscountType } from '../types/coupon.types';

interface CouponDetailsProps {
  couponId: string;
}

export default function CouponDetails({ couponId }: CouponDetailsProps) {
  const { coupon, statistics, loading, error } = useCouponById(couponId);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load coupon details</p>
      </div>
    );
  }

  const getStatusColor = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case CouponStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case CouponStatus.EXPIRED:
        return 'bg-red-100 text-red-800 border-red-200';
      case CouponStatus.SCHEDULED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDiscountDisplay = (type: DiscountType, value: number) => {
    switch (type) {
      case DiscountType.PERCENTAGE:
        return `${value}% OFF`;
      case DiscountType.FIXED:
        return `$${value} OFF`;
      case DiscountType.BUY_X_GET_Y:
        return 'Buy One Get One';
      case DiscountType.FREE_SHIPPING:
        return 'Free Shipping';
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <code className="bg-gray-100 px-3 py-1 rounded text-blue-600">
                {coupon.code}
              </code>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(coupon.status)}`}>
                {coupon.status}
              </span>
            </h2>
            {coupon.description && (
              <p className="mt-2 text-gray-600">{coupon.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {getDiscountDisplay(coupon.discountType, coupon.discountValue)}
            </div>
            {coupon.maxDiscount && (
              <p className="text-sm text-gray-500 mt-1">
                Max discount: ${coupon.maxDiscount}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Valid Period</p>
                <p className="font-medium">
                  {format(new Date(coupon.validFrom), 'MMM dd, yyyy')} - 
                  {coupon.validUntil 
                    ? format(new Date(coupon.validUntil), 'MMM dd, yyyy')
                    : 'No expiry'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Min Order Value</p>
                <p className="font-medium">
                  {coupon.minOrderValue ? `$${coupon.minOrderValue}` : 'No minimum'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">User Restrictions</p>
                <p className="font-medium">
                  {coupon.firstTimeUserOnly ? 'First-time users only' : 'All users'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Scope</p>
                <p className="font-medium capitalize">{coupon.scope.toLowerCase()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Active Status</p>
                <div className="flex items-center gap-2">
                  {coupon.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-green-700">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-red-700">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Stackable</p>
                <p className="font-medium">
                  {coupon.stackableWithOther ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {statistics && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Uses</p>
              <p className="text-2xl font-bold text-gray-900">
                {coupon.usageCount}
                {coupon.maxUsageCount && (
                  <span className="text-sm text-gray-500"> / {coupon.maxUsageCount}</span>
                )}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Redemption Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.redemptionRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Discount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics.totalDiscountAmount?.toFixed(2) || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${statistics.avgOrderValue?.toFixed(2) || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Created</dt>
            <dd className="font-medium">
              {format(new Date(coupon.createdAt), 'MMM dd, yyyy HH:mm')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Last Updated</dt>
            <dd className="font-medium">
              {format(new Date(coupon.updatedAt), 'MMM dd, yyyy HH:mm')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Priority</dt>
            <dd className="font-medium capitalize">{coupon.priority.toLowerCase()}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Combination Type</dt>
            <dd className="font-medium capitalize">{coupon.combination.toLowerCase()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}