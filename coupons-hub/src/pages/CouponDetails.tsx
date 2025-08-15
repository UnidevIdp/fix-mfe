import React from 'react';
import { useParams } from 'react-router-dom';
import CouponManagementDashboard from '../components/CouponManagementDashboard';

export default function CouponDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Coupon ID is required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <CouponManagementDashboard initialViewMode="detail" />
    </div>
  );
}