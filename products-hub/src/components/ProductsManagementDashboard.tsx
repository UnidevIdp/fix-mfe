import React, { useState, useCallback, useEffect } from 'react';
import { Product } from '../services/productsApi';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Plus, 
  Eye, 
  Settings2, 
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { useMfeRouter } from '@workspace/shared';
import { ProductRoutes, getBreadcrumbs } from '../utils/routing';
import { Button } from '@workspace/ui';
import { Card, CardContent } from '@workspace/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui';
import { ProductsForm } from './forms/ProductsForm';

// ProductsFilters Component (embedded for completeness)
interface ProductsFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  loading?: boolean;
  searchResultsCount?: number;
  totalProductCount?: number;
  currentSearchQuery?: string;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  onSearch,
  onFilterChange,
  loading,
  searchResultsCount = 0,
  totalProductCount = 0,
  currentSearchQuery = ''
}) => {
  const [searchInput, setSearchInput] = useState(currentSearchQuery);
  const [filters, setFilters] = useState({
    status: 'all',
    inventoryStatus: 'all',
    category: 'all',
    priceRange: 'all'
  });

  const handleSearch = useCallback(() => {
    onSearch(searchInput);
  }, [searchInput, onSearch]);

  const handleFilterUpdate = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      inventoryStatus: 'all',
      category: 'all',
      priceRange: 'all'
    });
    setSearchInput('');
    onSearch('');
    onFilterChange({});
  }, [onSearch, onFilterChange]);

  return (
    <Card>
      <CardContent className="p-4">
        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              size={18} 
              style={{ color: 'var(--muted-foreground)' }}
            />
            <input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                fontSize: '0.875rem',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ring)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            />
          </div>
          <button 
            onClick={handleSearch} 
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: 'white',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Search
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2">
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterUpdate('status', e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '10rem'
            }}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
          </select>

          <select 
            value={filters.inventoryStatus} 
            onChange={(e) => handleFilterUpdate('inventoryStatus', e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '10rem'
            }}
          >
            <option value="all">All Inventory</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <select 
            value={filters.category} 
            onChange={(e) => handleFilterUpdate('category', e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '10rem'
            }}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="other">Other</option>
          </select>

          <select 
            value={filters.priceRange} 
            onChange={(e) => handleFilterUpdate('priceRange', e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              minWidth: '10rem'
            }}
          >
            <option value="all">All Prices</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500+">$500+</option>
          </select>

          <button 
            onClick={clearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: 'white',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <XCircle size={16} />
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        {currentSearchQuery && (
          <div className="mt-3 text-sm text-muted-foreground">
            Found {searchResultsCount} of {totalProductCount} products
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component Props
interface ProductsManagementDashboardProps {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: any;
  onProductSelect: (product: Product) => void;
  onProductCreate: (data: any) => Promise<Product | null>;
  onProductUpdate: (id: string, data: any) => Promise<Product | null>;
  onProductDelete: (id: string) => Promise<boolean>;
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  className?: string;
  initialViewMode?: string;
  onViewModeChange?: (mode: string) => void;
}

type ViewMode = 'list' | 'detail' | 'create' | 'bulk';

export const ProductsManagementDashboard: React.FC<ProductsManagementDashboardProps> = ({
  products,
  selectedProduct,
  loading,
  error,
  searchQuery,
  filters,
  onProductSelect,
  onProductCreate,
  onProductUpdate,
  onProductDelete,
  onSearch,
  onFilterChange,
  onRefresh,
  className = '',
  initialViewMode,
  onViewModeChange
}) => {
  const { navigate, location, hasRouter } = useMfeRouter('products-hub');
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('list');
  const [_productId, setProductId] = useState<string | null>(null);
  const [selectedForBulk, setSelectedForBulk] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'none' | 'delete' | 'activate' | 'deactivate'>('none');
  
  // URL-based route detection
  useEffect(() => {
    if (initialViewMode) return;
    
    const currentPath = location.pathname;
    
    if (currentPath.includes('/create')) {
      setInternalViewMode('create');
      setProductId(null);
    } else if (currentPath.includes('/edit')) {
      const match = currentPath.match(/\/products\/([^\/]+)\/edit/);
      if (match) {
        const id = match[1];
        setProductId(id);
        setInternalViewMode('detail');
        const product = products.find(p => p.id === id);
        if (product && !selectedProduct) {
          onProductSelect(product);
        }
      }
    } else if (currentPath.includes('/view') || currentPath.match(/\/products\/[^\/]+$/)) {
      const match = currentPath.match(/\/products\/([^\/]+)(?:\/view)?$/);
      if (match) {
        const id = match[1];
        setProductId(id);
        setInternalViewMode('detail');
        const product = products.find(p => p.id === id);
        if (product && !selectedProduct) {
          onProductSelect(product);
        }
      }
    } else {
      setInternalViewMode('list');
      setProductId(null);
    }
  }, [location.pathname, products, selectedProduct, onProductSelect, initialViewMode]);

  const viewMode = initialViewMode ? (initialViewMode as ViewMode) : internalViewMode;
  const setViewMode = onViewModeChange 
    ? (mode: ViewMode) => onViewModeChange(mode)
    : setInternalViewMode;

  // Analytics data
  const analytics = {
    total: products.length,
    active: products.filter(p => p.status === 'ACTIVE').length,
    lowStock: products.filter(p => p.inventoryStatus === 'LOW_STOCK').length,
    outOfStock: products.filter(p => p.inventoryStatus === 'OUT_OF_STOCK').length,
  };

  const handleViewDetail = useCallback((product: Product) => {
    onProductSelect(product);
    setViewMode('detail');
    if (!onViewModeChange) {
      navigate(ProductRoutes.view(product.id));
    }
  }, [onProductSelect, navigate, onViewModeChange]);

  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setSelectedForBulk([]);
    if (!onViewModeChange) {
      navigate(ProductRoutes.list());
    }
  }, [navigate, onViewModeChange]);

  const handleCreateNew = useCallback(() => {
    setViewMode('create');
    if (!onViewModeChange) {
      navigate(ProductRoutes.create());
    }
  }, [navigate, onViewModeChange]);

  const handleBulkSelect = useCallback((productId: string, selected: boolean) => {
    setSelectedForBulk(prev => 
      selected 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedForBulk.length === products.length) {
      setSelectedForBulk([]);
    } else {
      setSelectedForBulk(products.map(p => p.id));
    }
  }, [products, selectedForBulk.length]);

  const handleBulkAction = useCallback(async () => {
    if (bulkAction === 'none' || selectedForBulk.length === 0) return;
    
    const confirmMessage = {
      delete: `Are you sure you want to delete ${selectedForBulk.length} products?`,
      activate: `Are you sure you want to activate ${selectedForBulk.length} products?`,
      deactivate: `Are you sure you want to deactivate ${selectedForBulk.length} products?`
    }[bulkAction];
    
    if (!confirm(confirmMessage)) return;
    
    try {
      for (const productId of selectedForBulk) {
        if (bulkAction === 'delete') {
          await onProductDelete(productId);
        } else {
          const statusUpdate = {
            activate: { status: 'ACTIVE' },
            deactivate: { status: 'INACTIVE' }
          }[bulkAction];
          
          if (statusUpdate) {
            await onProductUpdate(productId, statusUpdate);
          }
        }
      }
      
      setSelectedForBulk([]);
      setBulkAction('none');
      onRefresh();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  }, [bulkAction, selectedForBulk, onProductDelete, onProductUpdate, onRefresh]);

  // Detail view
  if (viewMode === 'detail' && selectedProduct) {
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
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}
          >
            ← Back to Product List
          </button>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            Product Details: {selectedProduct.name}
          </h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div>Product details for {selectedProduct.name}</div>
          </CardContent>
        </Card>
      </div>
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
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem'
            }}
          >
            ← Back to Product List
          </button>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            Add New Product
          </h2>
        </div>
        
        <ProductsForm
          onSuccess={async () => {
            handleBackToList();
            onRefresh();
          }}
          onCancel={handleBackToList}
        />
      </div>
    );
  }

  // Generate breadcrumbs
  const breadcrumbs = hasRouter ? getBreadcrumbs(
    location.pathname, 
    selectedProduct ? selectedProduct.name : undefined
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
      {renderBreadcrumbs()}
      
      {/* Analytics Dashboard */}
      <div className="flex gap-4 mb-6">
        {[
          { 
            icon: Package, 
            value: analytics.total, 
            label: 'Total Products',
            color: 'rgb(59, 130, 246)',
            bgColor: 'rgb(219, 234, 254)'
          },
          { 
            icon: CheckCircle, 
            value: analytics.active, 
            label: 'Active',
            color: 'rgb(34, 197, 94)',
            bgColor: 'rgb(220, 252, 231)'
          },
          { 
            icon: AlertTriangle, 
            value: analytics.lowStock, 
            label: 'Low Stock',
            color: 'rgb(239, 68, 68)',
            bgColor: 'rgb(254, 226, 226)'
          },
          { 
            icon: XCircle, 
            value: analytics.outOfStock, 
            label: 'Out of Stock',
            color: 'rgb(168, 85, 247)',
            bgColor: 'rgb(243, 232, 255)'
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
              <h2 className="text-xl font-semibold">Product Directory</h2>
              
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
            Add Product
          </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <ProductsFilters
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        loading={loading}
        searchResultsCount={products.length}
        totalProductCount={analytics.total}
        currentSearchQuery={searchQuery}
      />

      {/* Bulk Selection Controls */}
      {viewMode === 'bulk' && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'hsl(var(--accent) / 0.1)',
          borderRadius: '0.75rem',
          border: '1px solid hsl(var(--accent))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 className="text-base font-semibold">
                Bulk Management Mode
              </h3>
              <Button size="sm" onClick={handleSelectAll}>
                {selectedForBulk.length === products.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <Button size="sm" variant="outline" onClick={() => setViewMode('list')}>
              Exit Bulk Mode
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Product List */}
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
              backgroundColor: 'rgb(254, 226, 226)',
              borderRadius: '50%',
              margin: '0 auto 1rem auto'
            }}>
              <RefreshCw size={32} color="rgb(239, 68, 68)" />
            </div>
            <h3 style={{ 
              color: 'var(--foreground)',
              marginBottom: '0.5rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Failed to Load Product Data
            </h3>
            <p style={{ 
              color: 'var(--muted-foreground)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error || 'An error occurred while loading products'}
            </p>
            <button
              onClick={onRefresh}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgb(59, 130, 246)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(37, 99, 235)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgb(59, 130, 246)';
              }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
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
              backgroundColor: 'rgb(243, 244, 246)',
              borderRadius: '50%',
              margin: '0 auto 1rem auto'
            }}>
              <Search size={32} color="rgb(107, 114, 128)" />
            </div>
            <h3>No products found</h3>
            <p>Try adjusting your search criteria or add your first product.</p>
          </div>
        ) : (
          <div style={{ overflow: 'auto', maxHeight: '600px' }}>
            {products.map((product, index) => {
              const isSelected = selectedForBulk.includes(product.id);
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: isEven 
                      ? 'transparent'
                      : 'hsl(var(--muted) / 0.05)',
                    borderBottom: index < products.length - 1 
                      ? '1px solid hsl(var(--border))'
                      : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--accent) / 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isEven 
                      ? 'transparent'
                      : 'hsl(var(--muted) / 0.05)';
                  }}
                >
                  {/* Bulk selection checkbox */}
                  {viewMode === 'bulk' && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleBulkSelect(product.id, e.target.checked)}
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
                    overflow: 'hidden'
                  }}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      product.name?.substring(0, 2).toUpperCase() || 'PR'
                    )}
                  </div>
                  
                  {/* Details */}
                  <div 
                    style={{ flex: 1, minWidth: 0 }}
                    onClick={() => !viewMode.includes('bulk') && handleViewDetail(product)}
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
                        {product.name || 'Unknown Product'}
                      </h4>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: '1.5px solid',
                        borderColor: product.status === 'ACTIVE' 
                          ? '#16a34a'
                          : product.status === 'DRAFT'
                          ? '#6b7280'
                          : product.status === 'PENDING'
                          ? '#eab308'
                          : '#dc2626',
                        backgroundColor: product.status === 'ACTIVE' 
                          ? '#dcfce7'
                          : product.status === 'DRAFT'
                          ? '#f3f4f6'
                          : product.status === 'PENDING'
                          ? '#fef3c7'
                          : '#fecaca',
                        color: product.status === 'ACTIVE'
                          ? '#166534'
                          : product.status === 'DRAFT'
                          ? '#374151'
                          : product.status === 'PENDING'
                          ? '#92400e'
                          : '#991b1b'
                      }}>
                        {product.status || 'N/A'}
                      </span>
                      
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: product.inventoryStatus === 'IN_STOCK' 
                          ? 'hsl(var(--primary) / 0.1)'
                          : product.inventoryStatus === 'LOW_STOCK'
                          ? '#fef3c7'
                          : 'hsl(var(--secondary) / 0.1)',
                        color: product.inventoryStatus === 'IN_STOCK'
                          ? 'hsl(var(--primary))'
                          : product.inventoryStatus === 'LOW_STOCK'
                          ? '#92400e'
                          : 'hsl(var(--secondary-foreground))',
                        textTransform: 'capitalize'
                      }}>
                        {(product.inventoryStatus || 'N/A').replace('_', ' ')}
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
                        <Package size={14} color="rgb(107, 114, 128)" />
                        SKU: {product.sku || 'N/A'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <TrendingUp size={14} color="rgb(107, 114, 128)" />
                        ${product.price || '0.00'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <ShoppingCart size={14} color="rgb(107, 114, 128)" />
                        Qty: {product.quantity || 0}
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick actions */}
                  {viewMode !== 'bulk' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(product);
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

export default ProductsManagementDashboard;