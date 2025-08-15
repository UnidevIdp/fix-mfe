import React from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Percent } from 'lucide-react';

interface CouponStatisticsProps {
  statistics?: {
    totalCoupons: number;
    activeCoupons: number;
    expiredCoupons: number;
    totalRedemptions: number;
    totalDiscountAmount: number;
    avgDiscountPerOrder: number;
    topPerformingCoupons: Array<{
      code: string;
      usageCount: number;
      totalDiscount: number;
    }>;
    monthlyTrends: Array<{
      month: string;
      redemptions: number;
      discountAmount: number;
    }>;
  };
}

export default function CouponStatistics({ statistics }: CouponStatisticsProps) {
  if (!statistics) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Coupons',
      value: statistics.totalCoupons,
      icon: <Percent className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Active Coupons',
      value: statistics.activeCoupons,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Total Redemptions',
      value: statistics.totalRedemptions.toLocaleString(),
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Total Discount Given',
      value: `$${statistics.totalDiscountAmount.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {statistics.topPerformingCoupons && statistics.topPerformingCoupons.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Coupons</h3>
          <div className="space-y-3">
            {statistics.topPerformingCoupons.slice(0, 5).map((coupon, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {coupon.code}
                  </code>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Uses</p>
                    <p className="font-semibold">{coupon.usageCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="font-semibold">${coupon.totalDiscount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {statistics.monthlyTrends && statistics.monthlyTrends.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Trends</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Redemptions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statistics.monthlyTrends.map((trend, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trend.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trend.redemptions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${trend.discountAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}