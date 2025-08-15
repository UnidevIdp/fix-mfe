import React from 'react';
import CouponManagementDashboard from '../components/CouponManagementDashboard';

interface CreateCouponProps {
  onCouponCreate?: (couponData: any) => Promise<any>;
  onCouponUpdate?: (id: string, couponData: any) => Promise<any>;
  onRefresh?: () => void;
  coupons?: any[];
}

export default function CreateCoupon(props: CreateCouponProps = {}) {
  return (
    <div className="p-6">
      <CouponManagementDashboard 
        initialViewMode="create"
        onCouponCreate={props.onCouponCreate}
        onCouponUpdate={props.onCouponUpdate}
        onRefresh={props.onRefresh}
        coupons={props.coupons}
      />
    </div>
  );
}