import React, { useState } from 'react';
import { cn } from '@workspace/ui';
import ComprehensiveCouponForm from './forms/ComprehensiveCouponForm';

interface CouponDashboardProps {
  coupons?: any[];
  selectedCoupon?: any;
  loading?: boolean;
  error?: string;
  searchQuery?: string;
  filters?: any;
  onCouponSelect?: (coupon: any) => void;
  onCouponCreate?: (couponData: any) => Promise<any>;
  onCouponUpdate?: (id: string, couponData: any) => Promise<any>;
  onCouponDelete?: (id: string) => Promise<boolean>;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  onRefresh?: () => void;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

export default function SimpleCouponDashboard(props: CouponDashboardProps = {}) {
  const [viewMode, setViewMode] = useState(props.initialViewMode || 'list');
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const coupons = props.coupons || [
    {
      id: '1',
      code: 'SUMMER2024',
      description: 'Summer sale discount',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      status: 'ACTIVE',
      isActive: true
    },
    {
      id: '2',
      code: 'WELCOME10',
      description: 'Welcome discount for new users',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      status: 'ACTIVE',
      isActive: true
    }
  ];

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setViewMode('create');
    if (props.onViewModeChange) {
      props.onViewModeChange('create');
    }
  };

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setViewMode('create');
    if (props.onViewModeChange) {
      props.onViewModeChange('create');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (props.onCouponDelete) {
      if (window.confirm('Are you sure you want to delete this coupon?')) {
        await props.onCouponDelete(id);
        if (props.onRefresh) {
          props.onRefresh();
        }
      }
    } else {
      console.log('Delete coupon:', id);
    }
  };

  const handleCouponSubmit = async (couponData: any) => {
    try {
      if (editingCoupon && props.onCouponUpdate) {
        await props.onCouponUpdate(editingCoupon.id, couponData);
      } else if (props.onCouponCreate) {
        await props.onCouponCreate(couponData);
      }
      
      if (props.onRefresh) {
        props.onRefresh();
      }
      
      setViewMode('list');
      setEditingCoupon(null);
      if (props.onViewModeChange) {
        props.onViewModeChange('list');
      }
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
  };

  const handleCancelForm = () => {
    setViewMode('list');
    setEditingCoupon(null);
    if (props.onViewModeChange) {
      props.onViewModeChange('list');
    }
  };

  if (viewMode === 'create') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ComprehensiveCouponForm
          coupon={editingCoupon}
          onSubmit={handleCouponSubmit}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Coupon Management
        </h1>
        <p className="text-muted-foreground">
          Create, manage, and track promotional coupons
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6 mb-6 border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button 
              onClick={handleCreateCoupon}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              + Create Coupon
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Filters
            </button>
          </div>

          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Import
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {coupon.code}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {coupon.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex px-2 py-1 text-xs font-medium rounded-full",
                    coupon.status === 'ACTIVE' 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  )}>
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditCoupon(coupon)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <p className="mb-2">No coupons found</p>
                  <p className="text-sm">
                    Create your first coupon to get started.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}