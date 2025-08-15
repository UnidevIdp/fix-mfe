import React, { useState, useCallback, useEffect } from 'react';
import { Coupon, CouponFiltersType } from '../types/coupon.types';
import { Ticket, UserCheck, UserX, DollarSign, Search, RefreshCw, Plus, Eye, Settings2, AlertCircle, Calendar, Percent, Users } from 'lucide-react';
import { useMfeRouter } from '@workspace/shared';
import { CouponRoutes, getBreadcrumbs } from '../utils/routing';
import { Button, Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui';
import { useCoupons } from '../hooks/useCoupons';
import { CouponsFilters } from './CouponsFilters';
import { CouponDetailPage } from './CouponDetailPage';
import { CouponFormStepper } from './forms/CouponFormStepper';

interface CouponManagementDashboardProps {
  // Coupon data
  coupons?: Coupon[];
  selectedCoupon?: Coupon | null;
  loading?: boolean;
  error?: string | null;
  
  // Search and filtering
  searchQuery?: string;
  filters?: CouponFiltersType;
  
  // Actions
  onCouponSelect?: (coupon: Coupon) => void;
  onCouponCreate?: (data: any) => Promise<Coupon | null>;
  onCouponUpdate?: (id: string, data: any) => Promise<Coupon | null>;
  onCouponDelete?: (id: string) => Promise<boolean>;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  onRefresh?: () => void;
  
  // UI state
  className?: string;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

type ViewMode = 'list' | 'detail' | 'create' | 'bulk';

export const CouponManagementDashboard: React.FC<CouponManagementDashboardProps> = ({
  coupons: propsCoupons,
  selectedCoupon: propsSelectedCoupon,
  loading: propsLoading,
  error: propsError,
  searchQuery: propsSearchQuery,
  filters: propsFilters,
  onCouponSelect,
  onCouponCreate,
  onCouponUpdate,
  onCouponDelete,
  onSearch,
  onFilterChange,
  onRefresh,
  className = '',
  initialViewMode,
  onViewModeChange
}) => {
  const { navigate, location, hasRouter } = useMfeRouter('coupons-hub');
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('list');
  const [couponId, setCouponId] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'none' | 'delete' | 'activate' | 'deactivate'>('none');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(propsSelectedCoupon || null);
  
  // Use hook data if props not provided
  const hookData = useCoupons();
  const coupons = propsCoupons || hookData.coupons || [];
  const loading = propsLoading !== undefined ? propsLoading : hookData.loading;
  const error = propsError || null;
  
  // URL-based route detection and view mode initialization
  useEffect(() => {
    // Skip URL detection if initialViewMode is explicitly provided
    if (initialViewMode) {
      console.log('[CouponDashboard] Using initialViewMode:', initialViewMode);
      return;
    }
    
    const currentPath = location.pathname;
    console.log('[CouponDashboard] URL changed:', currentPath);
    
    // Parse URL to determine view mode and ID
    if (currentPath.includes('/create')) {
      console.log('[CouponDashboard] Setting mode to create');
      setInternalViewMode('create');
      setCouponId(null);
    } else if (currentPath.includes('/edit')) {
      console.log('[CouponDashboard] Setting mode to detail (edit mode)');
      const match = currentPath.match(/\/coupons\/([^\/]+)\/edit/);
      if (match) {
        const id = match[1];
        setCouponId(id);
        setInternalViewMode('detail');
        // Auto-select coupon if available
        const coupon = coupons.find(c => c.id === id);
        if (coupon && !selectedCoupon) {
          handleCouponSelect(coupon);
        }
      }
    } else if (currentPath.includes('/view') || currentPath.match(/\/coupons\/[^\/]+$/)) {
      console.log('[CouponDashboard] Setting mode to detail (view mode)');
      const match = currentPath.match(/\/coupons\/([^\/]+)(?:\/view)?$/);
      if (match) {
        const id = match[1];
        setCouponId(id);
        setInternalViewMode('detail');
        // Auto-select coupon if available
        const coupon = coupons.find(c => c.id === id);
        if (coupon && !selectedCoupon) {
          handleCouponSelect(coupon);
        }
      }
    } else {
      console.log('[CouponDashboard] Setting mode to list');
      setInternalViewMode('list');
      setCouponId(null);
    }
  }, [location.pathname, coupons, selectedCoupon, initialViewMode]);

  // Use initial view mode if provided (from routes), otherwise use internal state
  const viewMode = initialViewMode ? (initialViewMode as ViewMode) : internalViewMode;
  const setViewMode = onViewModeChange 
    ? (mode: ViewMode) => onViewModeChange(mode)
    : setInternalViewMode;

  // Analytics data
  const analytics = {
    total: coupons.length,
    active: coupons.filter(c => c.status === 'active').length,
    expired: coupons.filter(c => c.status === 'expired').length,
    used: coupons.filter(c => c.usageCount > 0).length,
    totalSavings: coupons.reduce((sum, c) => sum + (c.totalSavings || 0), 0)
  };

  const handleCouponSelect = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    onCouponSelect?.(coupon);
  };

  const handleViewDetail = useCallback((coupon: Coupon) => {
    handleCouponSelect(coupon);
    setViewMode('detail');
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(CouponRoutes.view(coupon.id));
    }
  }, [navigate, onViewModeChange]);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setSelectedForBulk([]);
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(CouponRoutes.list());
    }
  }, [navigate, onViewModeChange]);

  const handleCreateNew = useCallback(() => {
    setViewMode('create');
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(CouponRoutes.create());
    }
  }, [navigate, onViewModeChange]);

  const handleBulkSelect = useCallback((couponId: string, selected: boolean) => {
    setSelectedForBulk(prev => 
      selected 
        ? [...prev, couponId]
        : prev.filter(id => id !== couponId)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedForBulk.length === coupons.length) {
      setSelectedForBulk([]);
    } else {
      setSelectedForBulk(coupons.map(c => c.id));
    }
  }, [coupons, selectedForBulk.length]);

  // Detail view
  if (viewMode === 'detail' && selectedCoupon) {
    return (
      <CouponDetailPage
        couponId={selectedCoupon.id}
        onBack={handleBackToList}
        onEdit={async (updatedCoupon) => {
          await onCouponUpdate?.(updatedCoupon.id, updatedCoupon);
          onRefresh?.();
        }}
        onEditMode={() => {
          navigate(CouponRoutes.edit(selectedCoupon.id));
        }}
        onDelete={async (couponId) => {
          await onCouponDelete?.(couponId);
          handleBackToList();
          onRefresh?.();
        }}
      />
    );
  }

  // Create view
  if (viewMode === 'create') {
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={handleBackToList}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--coupon-dashboard-border, hsl(var(--border)))',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}
          >
            ← Back to Coupon List
          </button>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            Add New Coupon
          </h2>
        </div>
        
        <CouponFormStepper
          onSubmit={async (data) => {
            try {
              const newCoupon = await onCouponCreate?.(data);
              if (newCoupon) {
                handleBackToList();
                onRefresh?.();
              }
            } catch (error) {
              console.error('Failed to create coupon:', error);
            }
          }}
          onCancel={handleBackToList}
          loading={loading}
        />
      </div>
    );
  }

  // Generate breadcrumbs (only if router is available)
  const breadcrumbs = hasRouter ? getBreadcrumbs(
    location.pathname, 
    selectedCoupon ? selectedCoupon.code : undefined
  ) : [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Breadcrumb Navigation */}
      {hasRouter && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && <span className="text-muted-foreground/60">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{crumb.label}</span>
              ) : (
                <button
                  onClick={() => navigate(crumb.href)}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            icon: Ticket, 
            value: analytics.total, 
            label: 'Total Coupons',
            color: 'rgb(59, 130, 246)',
            bgColor: 'rgb(219, 234, 254)'
          },
          { 
            icon: UserCheck, 
            value: analytics.active, 
            label: 'Active',
            color: 'rgb(34, 197, 94)',
            bgColor: 'rgb(220, 252, 231)'
          },
          { 
            icon: UserX, 
            value: analytics.expired, 
            label: 'Expired',
            color: 'rgb(239, 68, 68)',
            bgColor: 'rgb(254, 226, 226)'
          },
          { 
            icon: DollarSign, 
            value: `$${analytics.totalSavings.toFixed(0)}`, 
            label: 'Total Savings',
            color: 'rgb(168, 85, 247)',
            bgColor: 'rgb(243, 232, 255)'
          }
        ].map(({ icon: Icon, value, label, color, bgColor }) => (
          <Card key={label} className="analytics-card-modern group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200" 
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon size={20} color={color} className="group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    {value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Bar */}
      <Card className="card-modern mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Coupon Directory</h2>
                <p className="text-sm text-slate-600 mt-1">Manage and track promotional coupons</p>
              </div>
              
              {selectedForBulk.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-sm font-medium text-emerald-700">
                    {selectedForBulk.length} selected
                  </span>
                  
                  <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as any)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue placeholder="Bulk Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Choose Action</SelectItem>
                      <SelectItem value="activate">Activate</SelectItem>
                      <SelectItem value="deactivate">Deactivate</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
              
                  <Button 
                    disabled={bulkAction === 'none'}
                    size="sm"
                    variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                    className="h-8 px-3 text-xs"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={onRefresh || (() => {})} 
                className="btn-modern-outline btn-modern-outline-neutral"
              >
                <div className="relative flex items-center gap-2">
                  <RefreshCw size={16} className="btn-icon-rotate-180" />
                  Refresh
                </div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setViewMode('bulk')} 
                className="btn-modern-outline btn-modern-outline-accent"
              >
                <div className="relative flex items-center gap-2">
                  <Settings2 size={16} className="btn-icon-rotate-90" />
                  Bulk Manage
                </div>
              </Button>
              
              <Button 
                onClick={handleCreateNew} 
                className="btn-modern-primary"
              >
                <div className="relative flex items-center gap-2">
                  <Plus size={16} className="btn-icon-rotate-90" />
                  Add Coupon
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <CouponsFilters
        searchQuery={propsSearchQuery}
        filters={propsFilters}
        onSearchChange={onSearch}
        onFilterChange={onFilterChange}
        className="mb-6"
      />

      {/* Bulk Selection Controls */}
      {viewMode === 'bulk' && (
        <Card className="bg-emerald-50/50 border-emerald-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-semibold text-emerald-800">
                  Bulk Management Mode
                </h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSelectAll}
                  className="text-emerald-600 border-emerald-300 hover:bg-emerald-100"
                >
                  {selectedForBulk.length === coupons.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setViewMode('list')}
                className="text-slate-600 border-slate-300 hover:bg-slate-100"
              >
                Exit Bulk Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Coupon List */}
      <Card className="overflow-hidden">
        {error ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Failed to Load Coupon Data
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {error}
            </p>
            <Button
              onClick={onRefresh || (() => {})}
              className="btn-modern-primary"
            >
              <div className="relative flex items-center gap-2">
                <RefreshCw size={16} />
                Try Again
              </div>
            </Button>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No coupons found</h3>
            <p className="text-sm text-slate-600 mb-6">
              Try adjusting your search criteria or add your first coupon.
            </p>
            <Button
              onClick={handleCreateNew}
              className="btn-modern-primary"
            >
              <div className="relative flex items-center gap-2">
                <Plus size={16} />
                Create First Coupon
              </div>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {coupons.map((coupon, index) => {
              const isSelected = selectedForBulk.includes(coupon.id);
              
              return (
                <div
                  key={coupon.id}
                  className="list-item-modern p-4 cursor-pointer group"
                  onClick={() => !viewMode.includes('bulk') && handleViewDetail(coupon)}
                >
                  <div className="flex items-center gap-4">
                    {/* Bulk selection checkbox */}
                    {viewMode === 'bulk' && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleBulkSelect(coupon.id, e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                        {coupon.discountType === 'percentage' ? (
                          <Percent size={20} />
                        ) : (
                          <DollarSign size={20} />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        coupon.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-slate-800 transition-colors">
                          {coupon.code || 'Unknown Coupon'}
                        </h3>
                        
                        <Badge className={`text-xs font-medium ${
                          coupon.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {coupon.status || 'N/A'}
                        </Badge>
                        
                        <Badge className={`text-xs font-medium ${
                          coupon.usageCount > 0
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {coupon.usageCount > 0 ? `Used ${coupon.usageCount}x` : 'Unused'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Percent size={14} />
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Expires: {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          Limit: {coupon.usageLimit || 'Unlimited'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {viewMode !== 'bulk' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(coupon);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CouponManagementDashboard;