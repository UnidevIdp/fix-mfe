import {
  Coupon,
  CouponUsage
} from '../../../../../../packages/api-contracts/generated/typescript/coupons';

// Define enums locally until they are properly generated from API contracts
export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled',
  SUSPENDED = 'suspended'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
  BUY_X_GET_Y = 'buy_x_get_y'
}

export enum CouponType {
  GENERAL = 'general',
  FIRST_TIME_USER = 'first_time_user',
  LOYALTY = 'loyalty',
  REFERRAL = 'referral',
  SEASONAL = 'seasonal',
  FLASH_SALE = 'flash_sale'
}

export enum CouponScope {
  GLOBAL = 'global',
  TENANT = 'tenant',
  USER_GROUP = 'user_group',
  SPECIFIC_USERS = 'specific_users'
}

export enum TargetAudience {
  ALL_USERS = 'all_users',
  NEW_CUSTOMERS = 'new_customers',
  EXISTING_CUSTOMERS = 'existing_customers',
  VIP_CUSTOMERS = 'vip_customers',
  SPECIFIC_SEGMENT = 'specific_segment'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

export enum CouponPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum CouponCombination {
  NONE = 'none',
  ANY = 'any',
  SPECIFIC = 'specific'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum RedemptionStatus {
  PENDING = 'pending',
  REDEEMED = 'redeemed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum UserCouponStatus {
  AVAILABLE = 'available',
  USED = 'used',
  EXPIRED = 'expired',
  INVALID = 'invalid'
}

// Type aliases
export type CouponCampaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: Date;
  endDate?: Date;
  coupons: Coupon[];
};

export type CouponBatch = {
  id: string;
  campaignId: string;
  size: number;
  generatedAt: Date;
  codes: string[];
};

export type CouponRedemption = CouponUsage;

export type CouponStatistics = {
  totalCoupons: number;
  activeCoupons: number;
  usedCoupons: number;
  totalRedemptions: number;
  totalDiscountGiven: number;
};

export type CouponValidationResult = {
  isValid: boolean;
  errors: string[];
  discountAmount?: number;
  finalTotal?: number;
};

export type CouponUserAssignment = {
  id: string;
  couponId: string;
  userId: string;
  assignedAt: Date;
  status: UserCouponStatus;
};

export type {
  Coupon,
  CouponUsage,
  CouponCampaign,
  CouponBatch,
  CouponRedemption,
  CouponStatistics,
  CouponValidationResult,
  CouponUserAssignment,
  DiscountType,
  CouponStatus,
  CouponType,
  TargetAudience
};

export interface CouponFormData {
  code: string;
  description?: string;
  displayText?: string;
  thumbnailUrl?: string;
  scope: CouponScope;
  status: CouponStatus;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  maxDiscountPerVendor?: number;
  maxUsageCount?: number;
  maxUsagePerUser?: number;
  maxUsagePerTenant?: number;
  maxUsagePerVendor?: number;
  firstTimeUserOnly: boolean;
  minItemCount?: number;
  maxItemCount?: number;
  categoryIds?: string[];
  productIds?: string[];
  userGroupIds?: string[];
  countryCodes?: string[];
  regionCodes?: string[];
  validFrom: Date;
  validUntil?: Date;
  allowedPaymentMethods?: PaymentMethod[];
  stackableWithOther: boolean;
  stackablePriority: number;
  priority: CouponPriority;
  combination: CouponCombination;
  isActive: boolean;
}

export interface CouponFiltersType {
  status?: CouponStatus;
  scope?: CouponScope;
  discountType?: DiscountType;
  isActive?: boolean;
  searchTerm?: string;
  validFrom?: Date;
  validUntil?: Date;
  campaignId?: string;
  vendorId?: string;
}