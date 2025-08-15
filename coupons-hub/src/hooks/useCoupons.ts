import { useState, useEffect, useCallback } from 'react';
import { couponsApi, CouponListParams, PaginatedResponse } from '../services/couponsApi';
import { Coupon, CouponCampaign, CouponFiltersType } from '../types/coupon.types';
import { toast } from 'sonner';

export const useCoupons = (initialFilters?: CouponFiltersType) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<CouponFiltersType>(initialFilters || {});

  const fetchCoupons = useCallback(async (params?: CouponListParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Coupon> = await couponsApi.getCoupons({
        page: params?.page || pagination.page,
        pageSize: params?.pageSize || pagination.pageSize,
        ...filters,
        ...params
      });
      
      setCoupons(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coupons';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.pageSize]);

  const createCoupon = async (couponData: Partial<Coupon>) => {
    try {
      const newCoupon = await couponsApi.createCoupon(couponData);
      toast.success('Coupon created successfully');
      await fetchCoupons();
      return newCoupon;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create coupon';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    try {
      const updatedCoupon = await couponsApi.updateCoupon(id, couponData);
      toast.success('Coupon updated successfully');
      await fetchCoupons();
      return updatedCoupon;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update coupon';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await couponsApi.deleteCoupon(id);
      toast.success('Coupon deleted successfully');
      await fetchCoupons();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete coupon';
      toast.error(errorMessage);
      throw err;
    }
  };

  const changePage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const changePageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const updateFilters = (newFilters: CouponFiltersType) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return {
    coupons,
    loading,
    error,
    pagination,
    filters,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    changePage,
    changePageSize,
    updateFilters
  };
};

export const useCouponById = (id: string) => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  const fetchCoupon = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [couponData, statsData] = await Promise.all([
        couponsApi.getCouponById(id),
        couponsApi.getCouponStatistics(id)
      ]);
      
      setCoupon(couponData);
      setStatistics(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coupon';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  return {
    coupon,
    statistics,
    loading,
    error,
    refetch: fetchCoupon
  };
};

export const useCouponCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CouponCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await couponsApi.getCampaigns();
      setCampaigns(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns
  };
};