import React, { useState, useEffect } from 'react';
import { Coupon } from '../types/coupon.types';
import { useCouponById } from '../hooks/useCoupons';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Label } from '@workspace/ui';
import { ArrowLeft, Edit, Trash2, Save, X, Ticket, Mail, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, Award, FileText, Download, Eye, Percent, Users } from 'lucide-react';

interface CouponDetailPageProps {
  couponId: string;
  onBack?: () => void;
  onEdit?: (coupon: Coupon) => void;
  onEditMode?: () => void;
  onDelete?: (couponId: string) => void;
}

interface CouponDetailState {
  coupon: Coupon | null;
  loading: boolean;
  error: string | null;
  editing: boolean;
  saving: boolean;
}

export const CouponDetailPage: React.FC<CouponDetailPageProps> = ({
  couponId,
  onBack,
  onEdit,
  onEditMode,
  onDelete
}) => {
  const { coupon, loading, error } = useCouponById(couponId);
  const [state, setState] = useState<CouponDetailState>({
    coupon: null,
    loading: true,
    error: null,
    editing: false,
    saving: false
  });

  const [editForm, setEditForm] = useState<any>({});

  // Load coupon data
  useEffect(() => {
    if (coupon) {
      setState(prev => ({ 
        ...prev, 
        coupon, 
        loading: false,
        editing: window.location.pathname.includes('/edit')
      }));
      
      // Initialize edit form
      setEditForm({
        code: coupon.code,
        description: coupon.description,
        discountValue: coupon.discountValue,
        status: coupon.status,
        isActive: coupon.isActive
      });
    }
    
    if (error) {
      setState(prev => ({ 
        ...prev, 
        error: error, 
        loading: false 
      }));
    }
  }, [coupon, error]);

  const handleEdit = () => {
    if (onEditMode) {
      onEditMode();
    } else {
      setState(prev => ({ ...prev, editing: true }));
    }
  };

  const handleCancelEdit = () => {
    setState(prev => ({ ...prev, editing: false }));
    if (state.coupon) {
      setEditForm({
        code: state.coupon.code,
        description: state.coupon.description,
        discountValue: state.coupon.discountValue,
        status: state.coupon.status,
        isActive: state.coupon.isActive
      });
    }
  };

  const handleSave = async () => {
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      if (state.coupon) {
        const updatedCoupon = { ...state.coupon, ...editForm };
        setState(prev => ({ 
          ...prev, 
          coupon: updatedCoupon, 
          editing: false, 
          saving: false 
        }));
        
        onEdit?.(updatedCoupon);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update coupon', 
        saving: false 
      }));
    }
  };

  const handleDelete = async () => {
    if (!state.coupon || !confirm(`Are you sure you want to delete coupon ${state.coupon.code}?`)) return;
    
    try {
      setState(prev => ({ ...prev, saving: true }));
      onDelete?.(couponId);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete coupon', 
        saving: false 
      }));
    }
  };

  // Loading state
  if (loading || state.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || state.error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-6 py-6">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Coupon</h3>
                <p className="text-sm text-muted-foreground mb-4">{error || state.error}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.reload()} variant="default" size="sm">
                    Try Again
                  </Button>
                  {onBack && (
                    <Button onClick={onBack} variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to List
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!coupon && !state.coupon) return null;

  const displayCoupon = state.coupon || coupon;
  if (!displayCoupon) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="w-full px-6 py-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Coupon Directory
              </Button>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {!state.editing ? (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Coupon
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                    className="bg-destructive/30 hover:bg-destructive/50 text-primary-foreground border border-destructive/50 backdrop-blur-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={state.saving}
                    variant="default"
                    size="sm"
                    className="bg-emerald-500/30 hover:bg-emerald-500/50 text-primary-foreground border border-emerald-400/50 backdrop-blur-sm font-medium disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {state.saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={state.saving}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium disabled:opacity-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Coupon Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 border-4 border-primary-foreground/30 shadow-2xl ring-4 ring-primary-foreground/10 hover:scale-105 transition-transform duration-300 rounded-full bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/30 backdrop-blur-sm flex items-center justify-center">
                {displayCoupon.discountType === 'percentage' ? (
                  <Percent className="h-12 w-12 text-primary-foreground" />
                ) : (
                  <DollarSign className="h-12 w-12 text-primary-foreground" />
                )}
              </div>
              
              {/* Status indicator with glow */}
              <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-primary-foreground shadow-lg ${
                displayCoupon.isActive 
                  ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' 
                  : 'bg-slate-400 shadow-slate-400/50'
              }`}>
                <div className={`absolute inset-0 rounded-full ${
                  displayCoupon.isActive ? 'bg-emerald-400 animate-ping' : ''
                }`} />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-primary-foreground">
                  {displayCoupon.code}
                </h1>
                
                <Badge 
                  variant={displayCoupon.status === 'active' ? 'default' : 'secondary'}
                  className={`capitalize font-medium backdrop-blur-sm transition-all duration-200 ${
                    displayCoupon.status === 'active' 
                      ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50 shadow-lg shadow-emerald-500/20' 
                      : 'bg-secondary/30 text-primary-foreground border-secondary/50'
                  }`}
                >
                  {displayCoupon.status === 'active' ? '✨ Active' : '⏸️ ' + displayCoupon.status}
                </Badge>
                
                <Badge 
                  variant={displayCoupon.isActive ? 'default' : 'outline'}
                  className={`font-medium transition-all duration-200 backdrop-blur-sm ${
                    displayCoupon.isActive 
                      ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50 shadow-lg shadow-emerald-500/20 animate-pulse' 
                      : 'bg-slate-500/30 text-slate-300 border-slate-400/50'
                  }`}
                >
                  {displayCoupon.isActive ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ✨ Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      ⏸️ Inactive
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-1 text-primary-foreground/90">
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="h-4 w-4" />
                  <span>
                    {displayCoupon.discountType === 'percentage' 
                      ? `${displayCoupon.discountValue}% OFF` 
                      : `$${displayCoupon.discountValue} OFF`
                    }
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Expires: {displayCoupon.validUntil 
                      ? new Date(displayCoupon.validUntil).toLocaleDateString() 
                      : 'No expiry'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-6 space-y-6">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Coupon Code */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  <Ticket className="h-4 w-4" />
                  Coupon Code
                </div>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200 font-mono">
                  {displayCoupon.code}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Discount Value */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  <DollarSign className="h-4 w-4" />
                  Discount Value
                </div>
                <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                  {displayCoupon.discountType === 'percentage' 
                    ? `${displayCoupon.discountValue}%` 
                    : `$${displayCoupon.discountValue}`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Usage Count */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  <Users className="h-4 w-4" />
                  Usage Count
                </div>
                <p className="text-sm font-bold text-purple-800 dark:text-purple-200">
                  {displayCoupon.usageCount || 0} / {displayCoupon.maxUsageCount || '∞'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Status */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  <CheckCircle className="h-4 w-4" />
                  Status
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 capitalize">
                  {displayCoupon.status}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coupon Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Ticket className="h-5 w-5" />
                Coupon Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  {state.editing ? (
                    <Input
                      id="code"
                      value={editForm.code || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, code: e.target.value }))}
                      placeholder="Enter coupon code"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md font-mono">
                      {displayCoupon.code}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  {state.editing ? (
                    <Input
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {displayCoupon.description || 'No description'}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  {state.editing ? (
                    <Input
                      id="discountValue"
                      type="number"
                      value={editForm.discountValue || ''}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, discountValue: e.target.value }))}
                      placeholder="Enter discount value"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {displayCoupon.discountType === 'percentage' 
                        ? `${displayCoupon.discountValue}%` 
                        : `$${displayCoupon.discountValue}`
                      }
                    </p>
                  )}
                </div>

                {/* Valid From */}
                <div className="space-y-2">
                  <Label>Valid From</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {displayCoupon.validFrom ? new Date(displayCoupon.validFrom).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                {/* Valid Until */}
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {displayCoupon.validUntil ? new Date(displayCoupon.validUntil).toLocaleDateString() : 'No expiry'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-secondary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-b border-secondary/20">
              <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                <Users className="h-5 w-5" />
                Usage Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {state.editing ? (
                    <select
                      id="status"
                      value={editForm.status || 'active'}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, status: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md capitalize">
                      {displayCoupon.status}
                    </p>
                  )}
                </div>

                {/* Usage Count */}
                <div className="space-y-2">
                  <Label>Usage Count</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {displayCoupon.usageCount || 0} times used
                  </p>
                </div>

                {/* Max Usage */}
                <div className="space-y-2">
                  <Label>Usage Limit</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {displayCoupon.maxUsageCount || 'Unlimited'}
                  </p>
                </div>

                {/* Min Order Value */}
                {displayCoupon.minOrderValue && (
                  <div className="space-y-2">
                    <Label>Min Order Value</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      ${displayCoupon.minOrderValue}
                    </p>
                  </div>
                )}

                {/* Max Discount */}
                {displayCoupon.maxDiscount && (
                  <div className="space-y-2">
                    <Label>Max Discount</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      ${displayCoupon.maxDiscount}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Restrictions */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-orange-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b border-orange-500/20">
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Award className="h-5 w-5" />
                🎯 Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-gradient-to-br from-orange-50/30 to-orange-100/20 dark:from-orange-950/20 dark:to-orange-900/10">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">User Restrictions</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {displayCoupon.firstTimeUserOnly ? 'First-time users only' : 'All users eligible'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-gradient-to-br from-orange-50/30 to-orange-100/20 dark:from-orange-950/20 dark:to-orange-900/10">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200">Stacking</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {displayCoupon.stackableWithOther ? 'Can be combined' : 'Cannot be combined'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Security Section */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-slate-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-slate-500/5 to-slate-500/10 border-b border-slate-500/20">
              <CardTitle className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="h-5 w-5" />
                📊 Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {displayCoupon.createdAt ? new Date(displayCoupon.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {displayCoupon.updatedAt ? new Date(displayCoupon.updatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="py-2 px-3 bg-muted/50 rounded-md">
                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {displayCoupon.priority || 'Normal'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Scope</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md capitalize">
                    {displayCoupon.scope || 'Global'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-yellow-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 border-b border-yellow-500/20">
              <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <FileText className="h-5 w-5" />
                📝 Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Additional coupon details</p>
                <p className="text-xs mt-2">Usage analytics and performance metrics</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CouponDetailPage;