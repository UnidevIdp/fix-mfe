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

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    if (!hasRouter || breadcrumbs.length === 0) return null;
    
    return (
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
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Breadcrumb Navigation */}
      {renderBreadcrumbs()}
      
      {/* Analytics Dashboard */}
      <div className="flex gap-4 mb-6">
        {[
          { 
            icon: Ticket, 
            value: analytics.total, 
            label: 'Total Coupons',
            color: 'rgb(59, 130, 246)', // blue-500
            bgColor: 'rgb(219, 234, 254)' // blue-100
          },
          { 
            icon: UserCheck, 
            value: analytics.active, 
            label: 'Active',
            color: 'rgb(34, 197, 94)', // green-500
            bgColor: 'rgb(220, 252, 231)' // green-100
          },
          { 
            icon: UserX, 
            value: analytics.expired, 
            label: 'Expired',
            color: 'rgb(239, 68, 68)', // red-500
            bgColor: 'rgb(254, 226, 226)' // red-100
          },
          { 
            icon: DollarSign, 
            value: `$${analytics.totalSavings.toFixed(0)}`, 
            label: 'Total Savings',
            color: 'rgb(168, 85, 247)', // purple-500
            bgColor: 'rgb(243, 232, 255)' // purple-100
          }
        ].map(({ icon: Icon, value, label, color, bgColor }) => (
          <Card key={label} className="flex-1 hover:shadow-lg transition-all duration-300 border-l-4" 
                style={{ borderLeftColor: color }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full" 
                     style={{ backgroundColor: bgColor }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {/* Left side: title + bulk selection info */}
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Coupon Directory</h2>

              {selectedForBulk.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedForBulk.length} selected
                  </span>
                  
                  <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Bulk Actions" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg">
                      <SelectItem value="none">Bulk Actions</SelectItem>
                      <SelectItem value="activate">Activate</SelectItem>
                      <SelectItem value="deactivate">Deactivate</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
              
                  <Button 
                    disabled={bulkAction === 'none'}
                    size="sm"
                    variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Right side: actions */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="default"
                onClick={onRefresh || (() => {})}
                className="btn-modern-outline group"
              >
                <RefreshCw size={16} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Refresh
              </Button>
              
              {/* Bulk Manage Button */}
              <Button
                variant="outline"
                size="default"
                onClick={() => setViewMode('bulk')}
                className="btn-modern-accent-emerald group"
              >
                <Settings2 size={16} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Bulk Manage
              </Button>
              
              {/* Add Coupon Button */}
              <Button
                size="default"
                onClick={handleCreateNew}
                className="btn-modern-primary-emerald group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                <span className="relative z-10 font-semibold">Add Coupon</span>
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
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--coupon-dashboard-bulk-bg, hsl(var(--accent) / 0.1))',
          borderRadius: '0.75rem',
          border: '1px solid var(--coupon-dashboard-accent, hsl(var(--accent)))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 className="text-base font-semibold">
                Bulk Management Mode
              </h3>
              <Button size="sm" onClick={handleSelectAll}>
                {selectedForBulk.length === coupons.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <Button size="sm" variant="outline" onClick={() => setViewMode('list')}>
              Exit Bulk Mode
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Coupon List */}
      <Card className="overflow-hidden">
        {error ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgb(254, 226, 226)', // red-100
              borderRadius: '50%',
              margin: '0 auto 1rem auto'
            }}>
              <AlertCircle size={32} color="rgb(239, 68, 68)" />
            </div>
            <h3 style={{ 
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Failed to Load Coupon Data
            </h3>
            <p style={{ 
              color: 'var(--muted-foreground)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </p>
            <button
              onClick={onRefresh || (() => {})}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgb(59, 130, 246)', // blue-500
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(37, 99, 235)'; // blue-600
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(59, 130, 246)'; // blue-500
              }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : coupons.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted-foreground)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgb(243, 244, 246)', // gray-100
              borderRadius: '50%',
              margin: '0 auto 1rem auto'
            }}>
              <Search size={32} color="rgb(107, 114, 128)" />
            </div>
            <h3>No coupons found</h3>
            <p>Try adjusting your search criteria or add your first coupon.</p>
          </div>
        ) : (
          <div style={{ overflow: 'auto', maxHeight: '600px' }}>
            {coupons.map((coupon, index) => {
              const isSelected = selectedForBulk.includes(coupon.id);
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={coupon.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--coupon-list-item-padding, 1.25rem)',
                    backgroundColor: isEven 
                      ? 'transparent'
                      : 'hsl(var(--muted) / 0.05)',
                    borderBottom: index < coupons.length - 1 
                      ? '1px solid hsl(var(--border))'
                      : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: '0.75rem',
                    margin: '0.25rem 0',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--accent) / 0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px hsl(var(--muted) / 0.15)';
                    e.currentTarget.style.borderColor = 'hsl(var(--border))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEven 
                      ? 'transparent'
                      : 'hsl(var(--muted) / 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  {/* Bulk selection checkbox */}
                  {viewMode === 'bulk' && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleBulkSelect(coupon.id, e.target.checked)}
                      style={{ marginRight: '1rem' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  {/* Avatar */}
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginRight: '1rem',
                    flexShrink: 0,
                    border: '2px solid hsl(var(--background))',
                    boxShadow: '0 2px 8px hsl(var(--muted) / 0.15)'
                  }}>
                    {coupon.discountType === 'percentage' ? (
                      <Percent size={20} />
                    ) : (
                      <DollarSign size={20} />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div 
                    style={{ flex: 1, minWidth: 0 }}
                    onClick={() => viewMode !== 'bulk' && handleViewDetail(coupon)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '1rem',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {coupon.code || 'Unknown Coupon'}
                      </h4>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: coupon.status === 'active' 
                          ? 'hsl(var(--primary) / 0.1)'
                          : 'hsl(var(--secondary) / 0.1)',
                        color: coupon.status === 'active'
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--secondary-foreground))',
                        textTransform: 'capitalize'
                      }}>
                        {coupon.status || 'N/A'}
                      </span>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1.5px solid',
                        borderColor: coupon.usageCount > 0 
                          ? '#16a34a'
                          : '#6b7280',
                        backgroundColor: coupon.usageCount > 0 
                          ? '#dcfce7'
                          : '#f3f4f6',
                        color: coupon.usageCount > 0
                          ? '#166534'
                          : '#374151'
                      }}>
                        {coupon.usageCount > 0 ? `Used ${coupon.usageCount}x` : 'Unused'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: 'hsl(var(--muted-foreground))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Percent size={14} color="rgb(107, 114, 128)" />
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Calendar size={14} color="rgb(107, 114, 128)" />
                        Expires: {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'N/A'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Users size={14} color="rgb(107, 114, 128)" />
                        Limit: {coupon.usageLimit || 'Unlimited'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  {viewMode !== 'bulk' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(coupon);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'transparent',
                          color: 'hsl(var(--muted-foreground))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '2rem',
                          minHeight: '2rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
                          e.currentTarget.style.color = 'hsl(var(--accent-foreground))';
                          e.currentTarget.style.borderColor = 'hsl(var(--accent-foreground) / 0.2)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px hsl(var(--muted) / 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                          e.currentTarget.style.borderColor = 'hsl(var(--border))';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  )}
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