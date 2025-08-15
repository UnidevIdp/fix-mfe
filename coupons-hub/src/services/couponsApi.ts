import { Coupon, CouponCampaign, CouponStatistics, CouponValidationResult } from '../types/coupon.types';
import { createServiceClient, ApiResponse } from '@workspace/shared';

// Create coupons service client with automatic Bearer token injection
const couponsClient = createServiceClient('coupons');

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CouponListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  scope?: string;
  discountType?: string;
  isActive?: boolean;
  searchTerm?: string;
  campaignId?: string;
  vendorId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class CouponsApiService {

  async getCoupons(params: CouponListParams): Promise<PaginatedResponse<Coupon>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = queryParams.toString() ? `/coupons?${queryParams}` : '/coupons';
    const response = await couponsClient.get<PaginatedResponse<Coupon>>(endpoint);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch coupons');
    }

    return response.data!;
  }

  async getCouponById(id: string): Promise<Coupon> {
    const response = await couponsClient.get<Coupon>(`/coupons/${id}`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch coupon');
    }

    return response.data!;
  }

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const response = await couponsClient.post<Coupon>('/coupons', coupon);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create coupon');
    }

    return response.data!;
  }

  async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    const response = await couponsClient.put<Coupon>(`/coupons/${id}`, coupon);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update coupon');
    }

    return response.data!;
  }

  async deleteCoupon(id: string): Promise<void> {
    const response = await couponsClient.delete(`/coupons/${id}`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete coupon');
    }
  }

  async validateCoupon(code: string, orderDetails: any): Promise<CouponValidationResult> {
    const response = await couponsClient.post<CouponValidationResult>('/coupons/validate', { code, orderDetails });

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to validate coupon');
    }

    return response.data!;
  }

  async getCouponStatistics(id: string): Promise<CouponStatistics> {
    const response = await couponsClient.get<CouponStatistics>(`/coupons/${id}/statistics`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch coupon statistics');
    }

    return response.data!;
  }

  async getCampaigns(params?: { page?: number; pageSize?: number; status?: string }): Promise<PaginatedResponse<CouponCampaign>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/campaigns?${queryParams}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  }

  async createCampaign(campaign: Partial<CouponCampaign>): Promise<CouponCampaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(campaign)
    });

    if (!response.ok) {
      throw new Error('Failed to create campaign');
    }

    return response.json();
  }

  async updateCampaign(id: string, campaign: Partial<CouponCampaign>): Promise<CouponCampaign> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(campaign)
    });

    if (!response.ok) {
      throw new Error('Failed to update campaign');
    }

    return response.json();
  }

  async deleteCampaign(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'DELETE',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error('Failed to delete campaign');
    }
  }

  async exportCoupons(filters: CouponListParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/coupons/export?${queryParams}`, {
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error('Failed to export coupons');
    }

    return response.blob();
  }

  async importCoupons(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/coupons/import`, {
      method: 'POST',
      headers: {
        'Authorization': this.headers.Authorization
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to import coupons');
    }

    return response.json();
  }
}

export const couponsApi = new CouponsApiService();