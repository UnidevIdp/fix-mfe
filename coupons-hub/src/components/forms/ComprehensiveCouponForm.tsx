import React, { useState } from 'react';
import { cn } from '@workspace/ui';

// Enums from references
enum CouponScope {
  APPLICATION = 'APPLICATION',
  TENANT = 'TENANT',
  VENDOR = 'VENDOR',
  CUSTOM = 'CUSTOM',
}

enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

enum CouponStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  FULLY_REDEEMED = 'FULLY_REDEEMED',
  SCHEDULED = 'SCHEDULED',
}

enum CouponPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

enum CouponCombination {
  NONE = 'NONE',
  ANY = 'ANY',
  SAME_TYPE = 'SAME_TYPE',
}

interface ComprehensiveCouponFormProps {
  coupon?: any;
  onSubmit: (couponData: any) => void;
  onCancel: () => void;
}

export default function ComprehensiveCouponForm({ 
  coupon, 
  onSubmit, 
  onCancel 
}: ComprehensiveCouponFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    code: coupon?.code || '',
    description: coupon?.description || '',
    displayText: coupon?.displayText || '',
    thumbnailUrl: coupon?.thumbnailUrl || '',
    
    // Scope and Status
    scope: coupon?.scope || CouponScope.APPLICATION,
    status: coupon?.status || CouponStatus.ACTIVE,
    priority: coupon?.priority || CouponPriority.MEDIUM,
    
    // Discount Configuration
    discountType: coupon?.discountType || DiscountType.PERCENTAGE,
    discountValue: coupon?.discountValue || 0,
    maxDiscount: coupon?.maxDiscount || '',
    minOrderValue: coupon?.minOrderValue || '',
    maxDiscountPerVendor: coupon?.maxDiscountPerVendor || '',
    
    // Usage Limits
    maxUsageCount: coupon?.maxUsageCount || '',
    maxUsagePerUser: coupon?.maxUsagePerUser || '',
    maxUsagePerTenant: coupon?.maxUsagePerTenant || '',
    maxUsagePerVendor: coupon?.maxUsagePerVendor || '',
    
    // Restrictions
    firstTimeUserOnly: coupon?.firstTimeUserOnly || false,
    minItemCount: coupon?.minItemCount || '',
    maxItemCount: coupon?.maxItemCount || '',
    
    // Target Criteria
    excludedTenants: coupon?.excludedTenants?.join(', ') || '',
    excludedVendors: coupon?.excludedVendors?.join(', ') || '',
    categoryIds: coupon?.categoryIds?.join(', ') || '',
    productIds: coupon?.productIds?.join(', ') || '',
    userGroupIds: coupon?.userGroupIds?.join(', ') || '',
    countryCodes: coupon?.countryCodes?.join(', ') || '',
    regionCodes: coupon?.regionCodes?.join(', ') || '',
    
    // Time Restrictions
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    validUntil: coupon?.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : '',
    daysOfWeek: coupon?.daysOfWeek || [],
    
    // Payment and Stacking
    allowedPaymentMethods: coupon?.allowedPaymentMethods || [],
    stackableWithOther: coupon?.stackableWithOther || false,
    stackablePriority: coupon?.stackablePriority || 0,
    combination: coupon?.combination || CouponCombination.NONE,
    
    // Status
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    'Basic Information',
    'Discount Settings',
    'Usage Limits',
    'Restrictions',
    'Time & Payment',
    'Review'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Information
        if (!formData.code.trim()) newErrors.code = 'Coupon code is required';
        if (formData.code.trim() && !/^[A-Z0-9_-]+$/.test(formData.code)) {
          newErrors.code = 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
        }
        break;
      case 1: // Discount Settings
        if (formData.discountValue <= 0) newErrors.discountValue = 'Discount value must be greater than 0';
        if (formData.discountType === DiscountType.PERCENTAGE && formData.discountValue > 100) {
          newErrors.discountValue = 'Percentage cannot exceed 100';
        }
        break;
      case 2: // Usage Limits - Optional fields, no validation needed
        break;
      case 3: // Restrictions - Optional fields, no validation needed
        break;
      case 4: // Time & Payment
        if (!formData.validFrom) newErrors.validFrom = 'Start date is required';
        if (formData.validUntil && new Date(formData.validUntil) <= new Date(formData.validFrom)) {
          newErrors.validUntil = 'End date must be after start date';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const submitData = {
        ...formData,
        excludedTenants: formData.excludedTenants ? formData.excludedTenants.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        excludedVendors: formData.excludedVendors ? formData.excludedVendors.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        categoryIds: formData.categoryIds ? formData.categoryIds.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        productIds: formData.productIds ? formData.productIds.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        userGroupIds: formData.userGroupIds ? formData.userGroupIds.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        countryCodes: formData.countryCodes ? formData.countryCodes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        regionCodes: formData.regionCodes ? formData.regionCodes.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        validFrom: new Date(formData.validFrom),
        validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
        maxDiscountPerVendor: formData.maxDiscountPerVendor ? Number(formData.maxDiscountPerVendor) : undefined,
        maxUsageCount: formData.maxUsageCount ? Number(formData.maxUsageCount) : undefined,
        maxUsagePerUser: formData.maxUsagePerUser ? Number(formData.maxUsagePerUser) : undefined,
        maxUsagePerTenant: formData.maxUsagePerTenant ? Number(formData.maxUsagePerTenant) : undefined,
        maxUsagePerVendor: formData.maxUsagePerVendor ? Number(formData.maxUsagePerVendor) : undefined,
        minItemCount: formData.minItemCount ? Number(formData.minItemCount) : undefined,
        maxItemCount: formData.maxItemCount ? Number(formData.maxItemCount) : undefined,
      };
      onSubmit(submitData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="SUMMER2024"
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                  errors.code ? "border-destructive" : "border-border"
                )}
              />
              {errors.code && <p className="mt-1 text-sm text-destructive">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this coupon offers..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Display Text
              </label>
              <input
                type="text"
                value={formData.displayText}
                onChange={(e) => handleInputChange('displayText', e.target.value)}
                placeholder="Text shown to users"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Scope
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={CouponScope.APPLICATION}>Application Wide</option>
                  <option value={CouponScope.TENANT}>Specific Tenant</option>
                  <option value={CouponScope.VENDOR}>Specific Vendor</option>
                  <option value={CouponScope.CUSTOM}>Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={CouponPriority.LOW}>Low</option>
                  <option value={CouponPriority.MEDIUM}>Medium</option>
                  <option value={CouponPriority.HIGH}>High</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 1: // Discount Settings
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => handleInputChange('discountType', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={DiscountType.PERCENTAGE}>Percentage</option>
                  <option value={DiscountType.FIXED}>Fixed Amount</option>
                  <option value={DiscountType.BUY_X_GET_Y}>Buy X Get Y</option>
                  <option value={DiscountType.FREE_SHIPPING}>Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', Number(e.target.value))}
                    step="0.01"
                    min="0"
                    className={cn(
                      "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                      errors.discountValue ? "border-destructive" : "border-border"
                    )}
                  />
                  <span className="absolute right-3 top-2.5 text-muted-foreground">
                    {formData.discountType === DiscountType.PERCENTAGE ? '%' : '$'}
                  </span>
                </div>
                {errors.discountValue && <p className="mt-1 text-sm text-destructive">{errors.discountValue}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Maximum Discount Amount
                </label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => handleInputChange('minOrderValue', e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Max Discount Per Vendor
              </label>
              <input
                type="number"
                value={formData.maxDiscountPerVendor}
                onChange={(e) => handleInputChange('maxDiscountPerVendor', e.target.value)}
                step="0.01"
                min="0"
                placeholder="No limit"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );

      case 2: // Usage Limits
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Max Total Usage
                </label>
                <input
                  type="number"
                  value={formData.maxUsageCount}
                  onChange={(e) => handleInputChange('maxUsageCount', e.target.value)}
                  min="0"
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Max Usage Per User
                </label>
                <input
                  type="number"
                  value={formData.maxUsagePerUser}
                  onChange={(e) => handleInputChange('maxUsagePerUser', e.target.value)}
                  min="0"
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Max Usage Per Tenant
                </label>
                <input
                  type="number"
                  value={formData.maxUsagePerTenant}
                  onChange={(e) => handleInputChange('maxUsagePerTenant', e.target.value)}
                  min="0"
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Max Usage Per Vendor
                </label>
                <input
                  type="number"
                  value={formData.maxUsagePerVendor}
                  onChange={(e) => handleInputChange('maxUsagePerVendor', e.target.value)}
                  min="0"
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="firstTimeUserOnly"
                checked={formData.firstTimeUserOnly}
                onChange={(e) => handleInputChange('firstTimeUserOnly', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="firstTimeUserOnly" className="text-sm text-foreground">
                First-time users only
              </label>
            </div>
          </div>
        );

      case 3: // Restrictions
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Minimum Item Count
                </label>
                <input
                  type="number"
                  value={formData.minItemCount}
                  onChange={(e) => handleInputChange('minItemCount', e.target.value)}
                  min="0"
                  placeholder="No minimum"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Maximum Item Count
                </label>
                <input
                  type="number"
                  value={formData.maxItemCount}
                  onChange={(e) => handleInputChange('maxItemCount', e.target.value)}
                  min="0"
                  placeholder="No maximum"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Excluded Tenants (comma-separated IDs)
              </label>
              <input
                type="text"
                value={formData.excludedTenants}
                onChange={(e) => handleInputChange('excludedTenants', e.target.value)}
                placeholder="tenant1, tenant2, tenant3"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Excluded Vendors (comma-separated IDs)
              </label>
              <input
                type="text"
                value={formData.excludedVendors}
                onChange={(e) => handleInputChange('excludedVendors', e.target.value)}
                placeholder="vendor1, vendor2, vendor3"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Category IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.categoryIds}
                  onChange={(e) => handleInputChange('categoryIds', e.target.value)}
                  placeholder="cat1, cat2, cat3"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Product IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.productIds}
                  onChange={(e) => handleInputChange('productIds', e.target.value)}
                  placeholder="prod1, prod2, prod3"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Country Codes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.countryCodes}
                  onChange={(e) => handleInputChange('countryCodes', e.target.value)}
                  placeholder="US, CA, UK"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Region Codes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.regionCodes}
                  onChange={(e) => handleInputChange('regionCodes', e.target.value)}
                  placeholder="NA, EU, APAC"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Time & Payment
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Valid From *
                </label>
                <input
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.validFrom ? "border-destructive" : "border-border"
                  )}
                />
                {errors.validFrom && <p className="mt-1 text-sm text-destructive">{errors.validFrom}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Valid Until
                </label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => handleInputChange('validUntil', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    errors.validUntil ? "border-destructive" : "border-border"
                  )}
                />
                {errors.validUntil && <p className="mt-1 text-sm text-destructive">{errors.validUntil}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Allowed Payment Methods
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.values(PaymentMethod).map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.allowedPaymentMethods.includes(method)}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...formData.allowedPaymentMethods, method]
                          : formData.allowedPaymentMethods.filter(m => m !== method);
                        handleInputChange('allowedPaymentMethods', methods);
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <span className="text-sm text-foreground">
                      {method.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stackableWithOther"
                  checked={formData.stackableWithOther}
                  onChange={(e) => handleInputChange('stackableWithOther', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="stackableWithOther" className="text-sm text-foreground">
                  Can be combined with other coupons
                </label>
              </div>

              {formData.stackableWithOther && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Stacking Priority
                    </label>
                    <input
                      type="number"
                      value={formData.stackablePriority}
                      onChange={(e) => handleInputChange('stackablePriority', Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Combination Type
                    </label>
                    <select
                      value={formData.combination}
                      onChange={(e) => handleInputChange('combination', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={CouponCombination.NONE}>None</option>
                      <option value={CouponCombination.ANY}>Any</option>
                      <option value={CouponCombination.SAME_TYPE}>Same Type</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="isActive" className="text-sm text-foreground">
                  Active
                </label>
              </div>
            </div>
          </div>
        );

      case 5: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Review Coupon Details</h3>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Code:</span>
                  <p className="text-foreground font-mono">{formData.code}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Discount:</span>
                  <p className="text-foreground">
                    {formData.discountType === DiscountType.PERCENTAGE ? `${formData.discountValue}%` : `$${formData.discountValue}`} OFF
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">Description:</span>
                <p className="text-foreground">{formData.description || 'No description'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Valid From:</span>
                  <p className="text-foreground">{new Date(formData.validFrom).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Valid Until:</span>
                  <p className="text-foreground">
                    {formData.validUntil ? new Date(formData.validUntil).toLocaleString() : 'No expiry'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Scope:</span>
                  <p className="text-foreground">{formData.scope}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Priority:</span>
                  <p className="text-foreground">{formData.priority}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <p className="text-foreground">{formData.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {coupon ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>
        <p className="text-muted-foreground mt-1">
          Complete all required fields to {coupon ? 'update' : 'create'} your coupon
        </p>
      </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  index === currentStep ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    index < currentStep ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

      {/* Step Content */}
      <div className="mb-8 min-h-[400px]">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 border border-border rounded-md text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-border rounded-md text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {coupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}