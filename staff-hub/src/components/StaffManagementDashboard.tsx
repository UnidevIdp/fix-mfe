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
              <Button
                variant="outline"
                onClick={() => navigate(crumb.href)}
                className="gap-2 hover:bg-accent/50 transition-all duration-200 border-border/50 hover:border-border"
              >
                {crumb.label}
              </Button>
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
              <Button 
                variant="outline"
                onClick={onRefresh} 
                className="group relative overflow-hidden px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:text-slate-700 hover:border-slate-300 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white/80 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-2">
                  <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  Refresh
                </div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setViewMode('bulk')} 
                className="group relative overflow-hidden px-4 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:text-indigo-700 hover:border-indigo-300 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-indigo-50/50 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-2">
                  <Settings2 size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  Bulk Manage
                </div>
              </Button>
              
              <Button 
                onClick={handleCreateNew} 
                className="group relative overflow-hidden px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center gap-2">
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  Add Staff
                </div>
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
        <Card className="bg-blue-50/50 border-blue-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-semibold text-blue-800">
                  Bulk Management Mode
                </h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSelectAll}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  {selectedForBulk.length === staff.length ? 'Deselect All' : 'Select All'}
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

      {/* Enhanced Staff List */}
      <Card className="overflow-hidden">
        {error ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Failed to Load Staff Data
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {error}
            </p>
            <Button
              onClick={onRefresh}
              className="btn-modern-primary"
            >
              <div className="relative flex items-center gap-2">
                <RefreshCw size={16} />
                Try Again
              </div>
            </Button>
          </div>
        ) : staff.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No staff members found</h3>
            <p className="text-sm text-slate-600 mb-6">
              Try adjusting your search criteria or add your first team member.
            </p>
            <Button
              onClick={handleCreateNew}
              className="btn-modern-primary"
            >
              <div className="relative flex items-center gap-2">
                <Plus size={16} />
                Add First Staff Member
              </div>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {staff.map((member, index) => {
              const isSelected = selectedForBulk.includes(member.id);
              
              return (
                <div
                  key={member.id}
                  className="list-item-modern p-4 cursor-pointer group"
                  onClick={() => !viewMode.includes('bulk') && handleViewDetail(member)}
                >
                  <div className="flex items-center gap-4">
                    {/* Bulk selection checkbox */}
                    {viewMode === 'bulk' && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleBulkSelect(member.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                        {`${member.firstName?.[0] || '?'}${member.lastName?.[0] || '?'}`.toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        member.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-slate-800 transition-colors">
                          {member.firstName || 'Unknown'} {member.lastName || 'User'}
                        </h3>
                        
                        <Badge className={`text-xs font-medium ${
                          member.role === 'manager' 
                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {member.role || 'N/A'}
                        </Badge>
                        
                        <Badge className={`text-xs font-medium ${
                          member.isActive
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {member.email || 'No email'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 size={14} />
                          {member.departmentId || 'No Department'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {member.employmentType?.replace('_', ' ') || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    {viewMode !== 'bulk' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(member);
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

export default StaffManagementDashboard;