import React, { useState, useCallback } from 'react';
import { Ticket, DollarSign, Calendar, Settings, FileText, User, Percent, Users, Tag, Clock } from 'lucide-react';
import { Stepper, type StepperStep } from '@workspace/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';

interface CouponFormStepperProps {
  coupon?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface FormData {
  // Basic Information
  code: string;
  description: string;
  displayText: string;
  
  // Discount Settings
  discountType: string;
  discountValue: number;
  maxDiscount: string;
  minOrderValue: string;
  
  // Usage Limits
  maxUsageCount: string;
  maxUsagePerUser: string;
  firstTimeUserOnly: boolean;
  
  // Time Restrictions
  validFrom: string;
  validUntil: string;
  
  // Status
  status: string;
  isActive: boolean;
  priority: string;
  scope: string;
  stackableWithOther: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const CouponFormStepper: React.FC<CouponFormStepperProps> = ({
  coupon,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    code: coupon?.code || '',
    description: coupon?.description || '',
    displayText: coupon?.displayText || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || 0,
    maxDiscount: coupon?.maxDiscount || '',
    minOrderValue: coupon?.minOrderValue || '',
    maxUsageCount: coupon?.maxUsageCount || '',
    maxUsagePerUser: coupon?.maxUsagePerUser || '',
    firstTimeUserOnly: coupon?.firstTimeUserOnly || false,
    validFrom: coupon?.validFrom || new Date().toISOString().slice(0, 16),
    validUntil: coupon?.validUntil || '',
    status: coupon?.status || 'active',
    isActive: coupon?.isActive ?? true,
    priority: coupon?.priority || 'normal',
    scope: coupon?.scope || 'global',
    stackableWithOther: coupon?.stackableWithOther || false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'code':
        if (!value.trim()) return 'Coupon code is required';
        if (!/^[A-Z0-9_-]+$/.test(value)) return 'Code must contain only uppercase letters, numbers, hyphens, and underscores';
        return '';
      
      case 'discountValue':
        if (value <= 0) return 'Discount value must be greater than 0';
        if (formData.discountType === 'percentage' && value > 100) return 'Percentage cannot exceed 100';
        return '';
      
      case 'validFrom':
        if (!value) return 'Start date is required';
        return '';
      
      case 'validUntil':
        if (value && formData.validFrom && new Date(value) <= new Date(formData.validFrom)) {
          return 'End date must be after start date';
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateStep = useCallback((stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (stepNumber) {
      case 1: // Basic Information
        ['code'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 2: // Discount Settings
        ['discountValue'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 3: // Time & Restrictions
        ['validFrom'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleComplete = () => {
    onSubmit(formData);
  };

  const renderFormField = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: { value: string; label: string }[],
    description?: string,
    icon?: React.ReactNode
  ) => {
    const fieldError = errors[name];
    const value = formData[name];
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {label} 
          {required && <span className="text-red-500 text-sm">*</span>}
        </label>
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {options ? (
          <select
            name={name}
            value={value as string}
            onChange={handleInputChange}
            required={required}
            disabled={loading}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="flex items-center space-x-3 pt-1">
            <input
              type="checkbox"
              name={name}
              checked={value as boolean}
              onChange={handleInputChange}
              disabled={loading}
              className="w-4 h-4 text-primary focus:ring-primary focus:ring-2 border border-input rounded"
            />
            <span className="text-sm text-foreground">{label}</span>
          </div>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value as string}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value as string}
            onChange={handleInputChange}
            required={required}
            disabled={loading}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          />
        )}
        
        {fieldError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <span className="text-red-500 text-sm">⚠️</span>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{fieldError}</p>
          </div>
        )}
      </div>
    );
  };

  const steps: StepperStep[] = [
    {
      id: 1,
      title: "Basic Information",
      description: "Coupon details and description",
      icon: Ticket,
      validation: () => validateStep(1),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Basic Information</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter the basic details for this coupon</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coupon Details Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ticket className="h-4 w-4 text-primary" />
                  Coupon Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('code', 'Coupon Code', 'text', true, undefined, 'Unique identifier for the coupon', <Tag className="h-3 w-3" />)}
                {renderFormField('description', 'Description', 'textarea', false, undefined, 'What this coupon offers', <FileText className="h-3 w-3" />)}
                {renderFormField('displayText', 'Display Text', 'text', false, undefined, 'Text shown to customers', <FileText className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-primary" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('status', 'Status', 'select', true, [
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'expired', label: 'Expired' }
                ], 'Current coupon status', <Clock className="h-3 w-3" />)}
                {renderFormField('priority', 'Priority', 'select', false, [
                  { value: 'low', label: 'Low' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' }
                ], 'Coupon priority level', <Award className="h-3 w-3" />)}
                {renderFormField('scope', 'Scope', 'select', false, [
                  { value: 'global', label: 'Global' },
                  { value: 'tenant', label: 'Tenant' },
                  { value: 'vendor', label: 'Vendor' },
                  { value: 'category', label: 'Category' }
                ], 'Coupon application scope', <Users className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Discount Settings",
      description: "Discount type and value",
      icon: DollarSign,
      validation: () => validateStep(2),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Discount Settings</h3>
            <p className="text-sm text-muted-foreground mt-1">Configure the discount type and value</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Discount Configuration Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Discount Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('discountType', 'Discount Type', 'select', true, [
                  { value: 'percentage', label: 'Percentage' },
                  { value: 'fixed_amount', label: 'Fixed Amount' },
                  { value: 'free_shipping', label: 'Free Shipping' },
                  { value: 'buy_x_get_y', label: 'Buy X Get Y' }
                ], 'Type of discount to apply', <Percent className="h-3 w-3" />)}
                {renderFormField('discountValue', 'Discount Value', 'number', true, undefined, 'Amount or percentage of discount', <DollarSign className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Limits Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  Limits & Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('maxDiscount', 'Max Discount Amount', 'number', false, undefined, 'Maximum discount amount (optional)', <DollarSign className="h-3 w-3" />)}
                {renderFormField('minOrderValue', 'Min Order Value', 'number', false, undefined, 'Minimum order value required', <DollarSign className="h-3 w-3" />)}
                {renderFormField('maxUsageCount', 'Max Total Usage', 'number', false, undefined, 'Maximum total usage count', <Users className="h-3 w-3" />)}
                {renderFormField('maxUsagePerUser', 'Max Usage Per User', 'number', false, undefined, 'Maximum usage per user', <User className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Time & Restrictions",
      description: "Validity period and user restrictions",
      icon: Calendar,
      validation: () => validateStep(3),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Time & Restrictions</h3>
            <p className="text-sm text-muted-foreground mt-1">Set validity period and user restrictions</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Settings Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4 text-primary" />
                  Validity Period
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('validFrom', 'Valid From', 'datetime-local', true, undefined, 'When the coupon becomes active', <Calendar className="h-3 w-3" />)}
                {renderFormField('validUntil', 'Valid Until', 'datetime-local', false, undefined, 'When the coupon expires (optional)', <Calendar className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* User Restrictions Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  User Restrictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('firstTimeUserOnly', 'First-time users only', 'checkbox', false, undefined, 'Restrict to new customers only')}
                {renderFormField('stackableWithOther', 'Can be combined with other coupons', 'checkbox', false, undefined, 'Allow stacking with other offers')}
                <div className="pt-4 border-t border-border">
                  {renderFormField('isActive', 'Active Coupon', 'checkbox', false, undefined, 'Check if this coupon should be active immediately')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`w-full max-w-none bg-background ${className}`}>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Ticket className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {coupon ? 'Edit Coupon' : 'Add New Coupon'}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl mx-auto">
          {coupon ? 'Update the information below to modify this coupon.' : 'Complete the steps below to add a new promotional coupon.'}
        </p>
      </div>

      <div className="w-full max-w-none">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={handleComplete}
          onCancel={onCancel}
          loading={loading}
          allowSkip={true}
          finishButtonText={coupon ? "Update Coupon" : "Create Coupon"}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CouponFormStepper;