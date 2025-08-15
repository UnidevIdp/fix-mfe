import React, { useState, useCallback, useEffect } from 'react';
import { Category, CreateCategoryRequest } from '../services/categoriesApi';
import { CategoryDetailPage } from './CategoryDetailPage';
import { CategoryFormStepper } from './forms/CategoryFormStepper';
import { uploadCategoryDocuments } from '../services/categoriesApi';
import { Users, CheckCircle, XCircle, Crown, Search, AlertCircle, RefreshCw, Settings2, Mail, Building2, Briefcase, Plus, Eye, ArrowLeft, Tag, Layers, TreePine } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Badge } from '@workspace/ui';
import { useMfeRouter } from '@workspace/shared';
import { CategoryRoutes, getBreadcrumbs } from '../utils/routing';
import { CategoriesFilters } from './CategoriesFilters';

interface CategoriesManagementDashboardProps {
  // Category data
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
  
  // Search and filtering
  searchQuery: string;
  filters: any;
  
  // Actions
  onCategorySelect: (category: Category) => void;
  onCategoryCreate: (data: CreateCategoryRequest) => Promise<Category | null>;
  onCategoryUpdate: (id: string, data: any) => Promise<Category | null>;
  onCategoryDelete: (id: string) => Promise<boolean>;
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  
  // UI state
  className?: string;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

type ViewMode = 'list' | 'detail' | 'create' | 'bulk';

export const CategoriesManagementDashboard: React.FC<CategoriesManagementDashboardProps> = ({
  categories,
  selectedCategory,
  loading,
  error,
  searchQuery,
  filters,
  onCategorySelect,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  onSearch,
  onFilterChange,
  onRefresh,
  className = '',
  initialViewMode,
  onViewModeChange
}) => {
  const { navigate, location, hasRouter } = useMfeRouter('categories-hub');
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('list');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  
  // URL-based route detection and view mode initialization
  useEffect(() => {
    // Skip URL detection if initialViewMode is explicitly provided
    if (initialViewMode) {
      console.log('[CategoriesDashboard] Using initialViewMode:', initialViewMode);
      return;
    }
    
    const currentPath = location.pathname;
    console.log('[CategoriesDashboard] URL changed:', currentPath);
    
    // Parse URL to determine view mode and ID
    if (currentPath.includes('/create')) {
      console.log('[CategoriesDashboard] Setting mode to create');
      setInternalViewMode('create');
      setCategoryId(null);
    } else if (currentPath.includes('/edit')) {
      console.log('[CategoriesDashboard] Setting mode to detail (edit mode)');
      const match = currentPath.match(/\/categories\/([^\/]+)\/edit/);
      if (match) {
        const id = match[1];
        setCategoryId(id);
        setInternalViewMode('detail');
        // Auto-select category if available
        const category = categories.find(c => c.id === id);
        if (category && !selectedCategory) {
          onCategorySelect(category);
        }
      }
    } else if (currentPath.includes('/view') || currentPath.match(/\/categories\/[^\/]+$/)) {
      console.log('[CategoriesDashboard] Setting mode to detail (view mode)');
      const match = currentPath.match(/\/categories\/([^\/]+)(?:\/view)?$/);
      if (match) {
        const id = match[1];
        setCategoryId(id);
        setInternalViewMode('detail');
        // Auto-select category if available
        const category = categories.find(c => c.id === id);
        if (category && !selectedCategory) {
          onCategorySelect(category);
        }
      }
    } else {
      console.log('[CategoriesDashboard] Setting mode to list');
      setInternalViewMode('list');
      setCategoryId(null);
    }
  }, [location.pathname, categories, selectedCategory, onCategorySelect, initialViewMode]);
  
  // Use initial view mode if provided (from routes), otherwise use internal state
  const viewMode = initialViewMode ? (initialViewMode as ViewMode) : internalViewMode;
  const setViewMode = onViewModeChange 
    ? (mode: ViewMode) => onViewModeChange(mode)
    : setInternalViewMode;
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'none' | 'delete' | 'activate' | 'deactivate'>('none');

  // Analytics data
  const analytics = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
    approved: categories.filter(c => c.status === 'APPROVED').length,
    pending: categories.filter(c => c.status === 'PENDING').length
  };

  const handleViewDetail = useCallback((category: Category) => {
    onCategorySelect(category);
    setViewMode('detail');
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(CategoryRoutes.view(category.id));
    }
  }, [onCategorySelect, navigate, onViewModeChange]);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setSelectedForBulk([]);
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(CategoryRoutes.list());
    }
  }, [navigate, onViewModeChange]);

  const handleCreateNew = useCallback(() => {
    setViewMode('create');
    // Navigation is handled by onViewModeChange if provided
    if (!onViewModeChange) {
      navigate(CategoryRoutes.create());
    }
  }, [navigate, onViewModeChange]);

  const handleBulkSelect = useCallback((categoryId: string, selected: boolean) => {
    setSelectedForBulk(prev => 
      selected 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedForBulk.length === categories.length) {
      setSelectedForBulk([]);
    } else {
      setSelectedForBulk(categories.map(c => c.id));
    }
  }, [categories, selectedForBulk.length]);

  const handleBulkAction = useCallback(async () => {
    if (bulkAction === 'none' || selectedForBulk.length === 0) return;
    
    const confirmMessage = {
      delete: `Are you sure you want to delete ${selectedForBulk.length} categories?`,
      activate: `Are you sure you want to activate ${selectedForBulk.length} categories?`,
      deactivate: `Are you sure you want to deactivate ${selectedForBulk.length} categories?`
    }[bulkAction];
    
    if (!confirm(confirmMessage)) return;
    
    try {
      for (const categoryId of selectedForBulk) {
        if (bulkAction === 'delete') {
          await onCategoryDelete(categoryId);
        } else {
          await onCategoryUpdate(categoryId, { 
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
  }, [bulkAction, selectedForBulk, onCategoryDelete, onCategoryUpdate, onRefresh]);

  // Detail view
  if (viewMode === 'detail' && selectedCategory) {
    return (
      <CategoryDetailPage
        categoryId={selectedCategory.id}
        onBack={handleBackToList}
        onEdit={async (updatedCategory) => {
          await onCategoryUpdate(updatedCategory.id, updatedCategory);
          onRefresh();
        }}
        onEditMode={() => {
          navigate(CategoryRoutes.edit(selectedCategory.id));
        }}
        onDelete={async (categoryId) => {
          await onCategoryDelete(categoryId);
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
              border: '1px solid var(--categories-dashboard-border, hsl(var(--border)))',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}
          >
            ← Back to Categories List
          </button>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            Add New Category
          </h2>
        </div>
        
        <CategoryFormStepper
          onSubmit={async (data, documents) => {
            try {
              const newCategory = await onCategoryCreate(data as CreateCategoryRequest);
              if (newCategory) {
                // Upload documents if any were provided
                if (documents && documents.length > 0) {
                  try {
                    await uploadCategoryDocuments(newCategory.id, documents);
                    console.log(`Successfully uploaded ${documents.length} documents for category ${newCategory.id}`);
                  } catch (uploadError) {
                    console.error('Failed to upload documents:', uploadError);
                    // Category was created successfully, but document upload failed
                    // You might want to show a warning to the user
                  }
                }
                handleBackToList();
                onRefresh();
              }
            } catch (error) {
              console.error('Failed to create category:', error);
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
    selectedCategory ? selectedCategory.name : undefined
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
            icon: Tag, 
            value: analytics.total, 
            label: 'Total Categories',
            color: 'rgb(59, 130, 246)', // blue-500
            bgColor: 'rgb(219, 234, 254)' // blue-100
          },
          { 
            icon: CheckCircle, 
            value: analytics.active, 
            label: 'Active',
            color: 'rgb(34, 197, 94)', // green-500
            bgColor: 'rgb(220, 252, 231)' // green-100
          },
          { 
            icon: XCircle, 
            value: analytics.inactive, 
            label: 'Inactive',
            color: 'rgb(239, 68, 68)', // red-500
            bgColor: 'rgb(254, 226, 226)' // red-100
          },
          { 
            icon: Crown, 
            value: analytics.approved, 
            label: 'Approved',
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
              <h2 className="text-xl font-semibold">Categories Directory</h2>
              
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
                Add Category
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <CategoriesFilters
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        loading={loading}
        searchResultsCount={categories.length}
        totalCategoriesCount={analytics.total}
        currentSearchQuery={searchQuery}
      />

      {/* Bulk Selection Controls */}
      {viewMode === 'bulk' && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--categories-dashboard-bulk-bg, hsl(var(--accent)) / 0.1)',
          borderRadius: '0.75rem',
          border: '1px solid var(--categories-dashboard-accent, hsl(var(--accent)))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 className="text-base font-semibold">
                Bulk Management Mode
              </h3>
              <Button size="sm" onClick={handleSelectAll}>
                {selectedForBulk.length === categories.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <Button size="sm" variant="outline" onClick={() => setViewMode('list')}>
              Exit Bulk Mode
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Categories List */}
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
              color: 'var(--categories-dashboard-foreground, hsl(var(--foreground)))',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Failed to Load Categories Data
            </h3>
            <p style={{ 
              color: 'var(--categories-dashboard-muted, hsl(var(--muted-foreground)))',
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
        ) : categories.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--categories-dashboard-muted, hsl(var(--muted-foreground)))'
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
            <h3>No categories found</h3>
            <p>Try adjusting your search criteria or add your first category.</p>
          </div>
        ) : (
          <div style={{ overflow: 'auto', maxHeight: '600px' }}>
            {categories.map((category, index) => {
              const isSelected = selectedForBulk.includes(category.id);
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: isEven 
                      ? 'var(--categories-dashboard-row-even, transparent)'
                      : 'var(--categories-dashboard-row-odd, hsl(var(--muted)) / 0.05)',
                    borderBottom: index < categories.length - 1 
                      ? '1px solid var(--categories-dashboard-border, hsl(var(--border)))'
                      : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--categories-dashboard-hover, hsl(var(--accent)) / 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEven 
                      ? 'var(--categories-dashboard-row-even, transparent)'
                      : 'var(--categories-dashboard-row-odd, hsl(var(--muted)) / 0.05)';
                  }}
                >
                  {/* Bulk selection checkbox */}
                  {viewMode === 'bulk' && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleBulkSelect(category.id, e.target.checked)}
                      style={{ marginRight: '1rem' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  
                  {/* Avatar */}
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--categories-dashboard-avatar-bg, hsl(var(--primary)))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginRight: '1rem',
                    flexShrink: 0
                  }}>
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      `${category.name?.[0] || '?'}${category.name?.[1] || ''}`.toUpperCase()
                    )}
                  </div>
                  
                  {/* Details */}
                  <div 
                    style={{ flex: 1, minWidth: 0 }}
                    onClick={() => !viewMode.includes('bulk') && handleViewDetail(category)}
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
                        {category.name || 'Unknown Category'}
                      </h4>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: category.level === 0 
                          ? 'var(--categories-dashboard-top-level-bg, hsl(var(--primary)) / 0.1)'
                          : 'var(--categories-dashboard-sub-level-bg, hsl(var(--secondary)) / 0.1)',
                        color: category.level === 0
                          ? 'var(--categories-dashboard-top-level-text, hsl(var(--primary)))'
                          : 'var(--categories-dashboard-sub-level-text, hsl(var(--secondary-foreground)))',
                        textTransform: 'capitalize'
                      }}>
                        Level {category.level}
                      </span>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1.5px solid',
                        borderColor: category.isActive 
                          ? '#16a34a'
                          : '#6b7280',
                        backgroundColor: category.isActive 
                          ? '#dcfce7'
                          : '#f3f4f6',
                        color: category.isActive
                          ? '#166534'
                          : '#374151'
                      }}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--categories-dashboard-muted, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Tag size={14} color="rgb(107, 114, 128)" />
                        {category.description || 'No description'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Layers size={14} color="rgb(107, 114, 128)" />
                        {category.status || 'DRAFT'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <TreePine size={14} color="rgb(107, 114, 128)" />
                        {category.parentId ? 'Sub-category' : 'Top Level'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  {viewMode !== 'bulk' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(category);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'transparent',
                          color: 'var(--categories-dashboard-icon-color, hsl(var(--muted-foreground)))',
                          border: '1px solid var(--categories-dashboard-icon-border, hsl(var(--border)))',
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
                          e.currentTarget.style.backgroundColor = 'var(--categories-dashboard-icon-hover-bg, hsl(var(--accent)))';
                          e.currentTarget.style.color = 'var(--categories-dashboard-icon-hover-color, hsl(var(--accent-foreground)))';
                          e.currentTarget.style.borderColor = 'var(--categories-dashboard-icon-hover-border, hsl(var(--accent-foreground)) / 0.2)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px hsl(var(--muted)) / 0.15';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--categories-dashboard-icon-color, hsl(var(--muted-foreground)))';
                          e.currentTarget.style.borderColor = 'var(--categories-dashboard-icon-border, hsl(var(--border)))';
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

export default CategoriesManagementDashboard;