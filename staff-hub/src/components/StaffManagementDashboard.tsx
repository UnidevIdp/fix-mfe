import React, { useState, useCallback, useEffect } from 'react';
import { Staff, CreateStaffRequest } from '@workspace/api-contracts';
import { StaffDetailPage } from './StaffDetailPage';
import { StaffFormStepper } from './forms/StaffFormStepper';
import { uploadStaffDocuments } from '../services/staffApi';
import { Users, UserCheck, UserX, Crown, Search, AlertCircle, RefreshCw, Settings2, Mail, Building2, Briefcase, Plus, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useMfeRouter } from '@workspace/shared';
import { StaffRoutes, getBreadcrumbs } from '../utils/routing';
import { StaffFilters } from './StaffFilters';

interface StaffManagementDashboardProps {
  // Staff data
  staff: Staff[];
  selectedStaff: Staff | null;
  loading: boolean;
  error: string | null;
  
  // Search and filtering
  searchQuery: string;
  filters: any;
  
  // Actions
  onStaffSelect: (staff: Staff) => void;
  onStaffCreate: (data: CreateStaffRequest) => Promise<Staff | null>;
  onStaffUpdate: (id: string, data: any) => Promise<Staff | null>;
  onStaffDelete: (id: string) => Promise<boolean>;
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  
  // UI state
  className?: string;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

type ViewMode = 'list' | 'detail' | 'create' | 'bulk';

export const StaffManagementDashboard: React.FC<StaffManagementDashboardProps> = ({
  staff,
  selectedStaff,
  loading,
  error,
  searchQuery,
  filters,
  onStaffSelect,
  onStaffCreate,
  onStaffUpdate,
  onStaffDelete,
  onSearch,
  onFilterChange,
  onRefresh,
  className = '',
  initialViewMode,
  onViewModeChange
}) => {
  const { navigate, location, hasRouter } = useMfeRouter('staff-hub');
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('list');
  const [staffId, setStaffId] = useState<string | null>(null);
  
  // URL-based route detection and view mode initialization
  useEffect(() => {
    // Skip URL detection if initialViewMode is explicitly provided
    if (initialViewMode) {
      console.log('[StaffDashboard] Using initialViewMode:', initialViewMode);
      return;
    }
    
    const currentPath = location.pathname;
    console.log('[StaffDashboard] URL changed:', currentPath);
    
    // Parse URL to determine view mode and ID
    if (currentPath.includes('/create')) {
      console.log('[StaffDashboard] Setting mode to create');
      setInternalViewMode('create');
      setStaffId(null);
    } else if (currentPath.includes('/edit')) {
      console.log('[StaffDashboard] Setting mode to detail (edit mode)');
      const match = currentPath.match(/\/staff\/([^\/]+)\/edit/);
      if (match) {
        const id = match[1];
        setStaffId(id);
        setInternalViewMode('detail');
        // Auto-select staff member if available
        const staffMember = staff.find(s => s.id === id);
        if (staffMember && !selectedStaff) {
          onStaffSelect(staffMember);
        }
      }
    } else if (currentPath.includes('/view') || currentPath.match(/\/staff\/[^\/]+$/)) {
      console.log('[StaffDashboard] Setting mode to detail (view mode)');
      const match = currentPath.match(/\/staff\/([^\/]+)(?:\/view)?$/);
      if (match) {
        const id = match[1];
        setStaffId(id);
        setInternalViewMode('detail');
        // Auto-select staff member if available
        const staffMember = staff.find(s => s.id === id);
        if (staffMember && !selectedStaff) {
          onStaffSelect(staffMember);
        }
      }
    } else {
      console.log('[StaffDashboard] Setting mode to list');
      setInternalViewMode('list');
      setStaffId(null);
    }
  }, [location.pathname, staff, selectedStaff, onStaffSelect, initialViewMode]);
  
  // Use initial view mode if provided (from routes), otherwise use internal state
  const viewMode = initialViewMode ? (initialViewMode as ViewMode) : internalViewMode;
  const setViewMode = onViewModeChange 
    ? (mode: ViewMode) => onViewModeChange(mode)
    : setInternalViewMode;
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'none' | 'delete' | 'activate' | 'deactivate'>('none');

  // Analytics data
  const analytics = {
    total: staff.length,
    active: staff.filter(s => s.isActive).length,
    inactive: staff.filter(s => !s.isActive).length,
    managers: staff.filter(s => s.role === 'manager').length,
    employees: staff.filter(s => s.role === 'employee').length
  };

  const handleViewDetail = useCallback((staff: Staff) => {
    onStaffSelect(staff);
    setViewMode('detail');
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(StaffRoutes.view(staff.id));
    }
  }, [onStaffSelect, navigate, onViewModeChange]);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setSelectedForBulk([]);
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(StaffRoutes.list());
    }
  }, [navigate, onViewModeChange]);

  const handleCreateNew = useCallback(() => {
    setViewMode('create');
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(StaffRoutes.create());
    }
  }, [navigate, onViewModeChange]);

  const handleBulkSelect = useCallback((staffId: string, selected: boolean) => {
    setSelectedForBulk(prev => 
      selected 
        ? [...prev, staffId]
        : prev.filter(id => id !== staffId)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedForBulk.length === staff.length) {
      setSelectedForBulk([]);
    } else {
      setSelectedForBulk(staff.map(s => s.id));
    }
  }, [staff, selectedForBulk.length]);

  const handleBulkAction = useCallback(async () => {
    if (bulkAction === 'none' || selectedForBulk.length === 0) return;
    
    const confirmMessage = {
      delete: `Are you sure you want to delete ${selectedForBulk.length} staff members?`,
      activate: `Are you sure you want to activate ${selectedForBulk.length} staff members?`,
      deactivate: `Are you sure you want to deactivate ${selectedForBulk.length} staff members?`
    }[bulkAction];
    
    if (!confirm(confirmMessage)) return;
    
    try {
      for (const staffId of selectedForBulk) {
        if (bulkAction === 'delete') {
          await onStaffDelete(staffId);
        } else {
          await onStaffUpdate(staffId, { 
            isActive: bulkAction === 'activate' 
          });
        }
      }
      
      setSelectedForBulk([]);
      setBulkAction('none');
      onRefresh();
      
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  }, [bulkAction, selectedForBulk, onStaffDelete, onStaffUpdate, onRefresh]);

  // Detail view
  if (viewMode === 'detail' && selectedStaff) {
    return (
      <StaffDetailPage
        staffId={selectedStaff.id}
        onBack={handleBackToList}
        onEdit={async (updatedStaff) => {
          await onStaffUpdate(updatedStaff.id, updatedStaff);
          onRefresh();
        }}
        onEditMode={() => {
          navigate(StaffRoutes.edit(selectedStaff.id));
        }}
        onDelete={async (staffId) => {
          await onStaffDelete(staffId);
          handleBackToList();
          onRefresh();
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
              border: '1px solid var(--staff-dashboard-border, hsl(var(--border)))',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}
          >
            ← Back to Staff List
          </button>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            Add New Staff Member
          </h2>
        </div>
        
        <StaffFormStepper
          onSubmit={async (data, documents) => {
            try {
              const newStaff = await onStaffCreate(data as CreateStaffRequest);
              if (newStaff) {
                // Upload documents if any were provided
                if (documents && documents.length > 0) {
                  try {
                    await uploadStaffDocuments(newStaff.id, documents);
                    console.log(`Successfully uploaded ${documents.length} documents for staff member ${newStaff.id}`);
                  } catch (uploadError) {
                    console.error('Failed to upload documents:', uploadError);
                    // Staff was created successfully, but document upload failed
                    // You might want to show a warning to the user
                  }
                }
                handleBackToList();
                onRefresh();
              }
            } catch (error) {
              console.error('Failed to create staff:', error);
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
    selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : undefined
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
                variant="outline"
                onClick={() => navigate(crumb.href)}
                className="gap-2 hover:bg-accent/50 transition-all duration-200 border-border/50 hover:border-border"
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
            icon: Users, 
            value: analytics.total, 
            label: 'Total Staff',
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
            value: analytics.inactive, 
            label: 'Inactive',
            color: 'rgb(239, 68, 68)', // red-500
            bgColor: 'rgb(254, 226, 226)' // red-100
          },
          { 
            icon: Crown, 
            value: analytics.managers, 
            label: 'Managers',
            color: 'rgb(168, 85, 247)', // purple-500
            bgColor: 'rgb(243, 232, 255)' // purple-100
          }
        ].map(({ icon: Icon, value, label, color, bgColor }) => (
          <Card key={label} className="flex-1 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
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
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Staff Directory</h2>
              
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
                    onClick={handleBulkAction}
                    disabled={bulkAction === 'none'}
                    size="sm"
                    variant={bulkAction === 'delete' ? 'destructive' : 'default'}
                  >
                    Apply
                  </Button>
                </div>
              )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh} className="gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
          
          <Button variant="secondary" onClick={() => setViewMode('bulk')} className="gap-2">
            <Settings2 size={16} />
            Bulk Manage
          </Button>
          
          <Button onClick={handleCreateNew} className="gap-2 px-6 py-2 text-sm font-semibold shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700">
            <Plus size={16} />
            Add Staff
          </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <StaffFilters
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        loading={loading}
        searchResultsCount={staff.length}
        totalStaffCount={analytics.total}
        currentSearchQuery={searchQuery}
      />

      {/* Bulk Selection Controls */}
      {viewMode === 'bulk' && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--staff-dashboard-bulk-bg, hsl(var(--accent)) / 0.1)',
          borderRadius: '0.75rem',
          border: '1px solid var(--staff-dashboard-accent, hsl(var(--accent)))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                variant="secondary"
              <h3 className="text-base font-semibold">
                className="gap-2 hover:bg-secondary/80 transition-all duration-200"
              </h3>
              <Button size="sm" onClick={handleSelectAll}>
                {selectedForBulk.length === staff.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <Button size="sm" variant="outline" onClick={() => setViewMode('list')}>
              Exit Bulk Mode
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Staff List */}
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
              color: 'var(--staff-dashboard-foreground, hsl(var(--foreground)))',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Failed to Load Staff Data
            </h3>
            <p style={{ 
              color: 'var(--staff-dashboard-muted, hsl(var(--muted-foreground)))',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </p>
            <button
              onClick={onRefresh}
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
        ) : staff.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--staff-dashboard-muted, hsl(var(--muted-foreground)))'
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
            <h3>No staff members found</h3>
            <p>Try adjusting your search criteria or add your first team member.</p>
          </div>
        ) : (
          <div style={{ overflow: 'auto', maxHeight: '600px' }}>
            {staff.map((member, index) => {
              const isSelected = selectedForBulk.includes(member.id);
              const isEven = index % 2 === 0;
              
              return (
                <div
                className="gap-2 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--staff-list-item-padding, 1.25rem)',
                    backgroundColor: isEven 
                      ? 'var(--staff-dashboard-row-even, transparent)'
                      : 'var(--staff-dashboard-row-odd, hsl(var(--muted)) / 0.05)',
                    borderBottom: index < staff.length - 1 
                      ? '1px solid var(--staff-dashboard-border, hsl(var(--border)))'
                      : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: '0.75rem',
                    margin: '0.25rem 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--staff-dashboard-hover, hsl(var(--accent)) / 0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px hsl(var(--muted)) / 0.15';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEven 
                      ? 'var(--staff-dashboard-row-even, transparent)'
                      : 'var(--staff-dashboard-row-odd, hsl(var(--muted)) / 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Bulk selection checkbox */}
                  {viewMode === 'bulk' && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleBulkSelect(member.id, e.target.checked)}
                      style={{ marginRight: '1rem' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  {/* Avatar */}
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--staff-dashboard-avatar-bg, hsl(var(--primary)))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginRight: '1rem',
                    flexShrink: 0
                  }}>
                    {`${member.firstName?.[0] || '?'}${member.lastName?.[0] || '?'}`.toUpperCase()}
                  </div>
                  
                  {/* Details */}
                  <div 
                    style={{ flex: 1, minWidth: 0 }}
                    onClick={() => !viewMode.includes('bulk') && handleViewDetail(member)}
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
                        {member.firstName || 'Unknown'} {member.lastName || 'User'}
                      </h4>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: member.role === 'manager' 
                          ? 'var(--staff-dashboard-manager-bg, hsl(var(--primary)) / 0.1)'
                          : 'var(--staff-dashboard-employee-bg, hsl(var(--secondary)) / 0.1)',
                        color: member.role === 'manager'
                          ? 'var(--staff-dashboard-manager-text, hsl(var(--primary)))'
                          : 'var(--staff-dashboard-employee-text, hsl(var(--secondary-foreground)))',
                        textTransform: 'capitalize'
                      }}>
                        {member.role || 'N/A'}
                      </span>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1.5px solid',
                        borderColor: member.isActive 
                          ? '#16a34a'
                          : '#6b7280',
                        backgroundColor: member.isActive 
                          ? '#dcfce7'
                          : '#f3f4f6',
                        color: member.isActive
                          ? '#166534'
                          : '#374151'
                      }}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--staff-dashboard-muted, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Mail size={14} color="rgb(107, 114, 128)" />
                        {member.email || 'No email'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Building2 size={14} color="rgb(107, 114, 128)" />
                        {member.departmentId || 'No Department'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Briefcase size={14} color="rgb(107, 114, 128)" />
                        {member.employmentType?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  {viewMode !== 'bulk' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(member);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'transparent',
                          color: 'var(--staff-dashboard-icon-color, hsl(var(--muted-foreground)))',
                          border: '1px solid var(--staff-dashboard-icon-border, hsl(var(--border)))',
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
                          e.currentTarget.style.backgroundColor = 'var(--staff-dashboard-icon-hover-bg, hsl(var(--accent)))';
                          e.currentTarget.style.color = 'var(--staff-dashboard-icon-hover-color, hsl(var(--accent-foreground)))';
                          e.currentTarget.style.borderColor = 'var(--staff-dashboard-icon-hover-border, hsl(var(--accent-foreground)) / 0.2)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px hsl(var(--muted)) / 0.15';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--staff-dashboard-icon-color, hsl(var(--muted-foreground)))';
                          e.currentTarget.style.borderColor = 'var(--staff-dashboard-icon-border, hsl(var(--border)))';
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

export default StaffManagementDashboard;