import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../../services/productsApi';
import { LoadingCard, Button, Card, CardContent, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@workspace/ui';
import { Search, X, Package } from 'lucide-react';

// Custom debounce hook - EXACTLY like Staff Hub
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (value === debouncedValue) {
      setIsDebouncing(false);
      return;
    }
    
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debouncedValue]);

  return { debouncedValue, isDebouncing };
};

interface ProductsListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  selectedProduct?: Product | null;
  className?: string;
  loading?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
}

export const ProductsList: React.FC<ProductsListProps> = ({ 
  products, 
  onProductClick,
  selectedProduct,
  className = '',
  loading = false,
  showSearch = true,
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inventoryFilter, setInventoryFilter] = useState('all');

  // Use custom debounce hook
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebounce(searchTerm, 300);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Add keyboard support for Escape key to clear search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchTerm) {
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchTerm, clearSearch]);

  // Memoized filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      const matchesSearch = debouncedSearchTerm === '' || 
                           product.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.sku?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesInventory = inventoryFilter === 'all' || product.inventoryStatus === inventoryFilter;

      return matchesSearch && matchesStatus && matchesInventory;
    });
  }, [products, debouncedSearchTerm, statusFilter, inventoryFilter]);

  const productsToDisplay = showSearch || showFilters ? filteredProducts : products;

  // Show loading state - EXACTLY like Staff Hub
  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {showSearch && (
          <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products by name, SKU, or description..."
                  className="w-full pl-10 pr-16 transition-all duration-200"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        )}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: 'var(--product-list-item-padding, 1rem)',
              border: '1px solid var(--product-list-border-color, hsl(var(--border)))',
              borderRadius: 'var(--product-list-border-radius, 0.75rem)',
              backgroundColor: 'var(--product-list-bg, hsl(var(--card)))'
            }}
          >
            <LoadingCard 
              showAvatar 
              avatarSize="md" 
              lines={2} 
              className="p-0" 
            />
          </div>
        ))}
      </div>
    );
  }

  // Handle undefined or null products array - EXACTLY like Staff Hub
  if (!products || products.length === 0) {
    return (
      <div className={className}>
        {showSearch && (
          <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Search products by name, SKU, or description..."
                      className="w-full pl-10 pr-16 transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {/* Loading spinner - only when debouncing */}
                    {isDebouncing && searchTerm && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
                      </div>
                    )}
                    
                    {/* Enhanced Clear button - always visible when there's text */}
                    {searchTerm && (
                      <Button
                        onClick={clearSearch}
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all duration-200 z-20 border border-gray-200 bg-white shadow-sm hover:border-red-200 hover:shadow-md"
                        type="button"
                        title="Clear search (Esc)"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Enhanced Search status indicator */}
                  {searchTerm && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs flex items-center gap-2">
                        {isDebouncing ? (
                          <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                            Searching for "{searchTerm}"...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-green-600 font-medium">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            Found 0 results
                            {debouncedSearchTerm && (
                              <span className="text-gray-500 font-normal">
                                for "{debouncedSearchTerm}"
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      
                      {/* Quick clear shortcut */}
                      {!isDebouncing && searchTerm && (
                        <button
                          onClick={clearSearch}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
                        >
                          <X className="h-3 w-3" />
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {showFilters && (
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="All Inventory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Inventory</SelectItem>
                        <SelectItem value="IN_STOCK">In Stock</SelectItem>
                        <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--product-list-empty-color, hsl(var(--muted-foreground)))'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'var(--product-list-empty-bg, hsl(var(--muted)))',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package className="h-6 w-6" />
          </div>
          <p style={{ margin: 0, fontWeight: '500' }}>No products found</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first product to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Enhanced Search and Filters - EXACTLY like Staff Hub */}
      {showSearch && (
        <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search products by name, SKU, or description..."
                    className="w-full pl-10 pr-16 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  {/* Loading spinner - only when debouncing */}
                  {isDebouncing && searchTerm && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
                    </div>
                  )}
                  
                  {/* Enhanced Clear button - always visible when there's text */}
                  {searchTerm && (
                    <Button
                      onClick={clearSearch}
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all duration-200 z-20 border border-gray-200 bg-white shadow-sm hover:border-red-200 hover:shadow-md"
                      type="button"
                      title="Clear search (Esc)"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Enhanced Search status indicator */}
                {searchTerm && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs flex items-center gap-2">
                      {isDebouncing ? (
                        <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          Searching for "{searchTerm}"...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-green-600 font-medium">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Found {productsToDisplay.length} result{productsToDisplay.length !== 1 ? 's' : ''}
                          {debouncedSearchTerm && (
                            <span className="text-gray-500 font-normal">
                              for "{debouncedSearchTerm}"
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    
                    {/* Quick clear shortcut */}
                    {!isDebouncing && searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {showFilters && (
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Inventory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Inventory</SelectItem>
                      <SelectItem value="IN_STOCK">In Stock</SelectItem>
                      <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Product List - CARD LAYOUT like Staff Hub */}
      <div className="space-y-3">
        {productsToDisplay.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          const initials = product.name?.substring(0, 2).toUpperCase() || 'PR';
          
          return (
            <div
              key={product.id}
              style={{
                padding: 'var(--product-list-item-padding, 1rem)',
                border: `2px solid ${isSelected 
                  ? 'var(--product-list-selected-border, hsl(var(--primary)))' 
                  : 'var(--product-list-border-color, hsl(var(--border)))'
                }`,
                borderRadius: 'var(--product-list-border-radius, 0.75rem)',
                backgroundColor: isSelected 
                  ? 'var(--product-list-selected-bg, hsl(var(--primary)) / 0.05)'
                  : 'var(--product-list-bg, hsl(var(--card)))',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isSelected 
                  ? 'var(--product-list-selected-shadow, 0 4px 12px hsl(var(--primary)) / 0.15)'
                  : 'var(--product-list-shadow, 0 1px 3px hsl(var(--muted)) / 0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--product-list-hover-bg, hsl(var(--accent)))';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--product-list-hover-shadow, 0 4px 12px hsl(var(--muted)) / 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--product-list-bg, hsl(var(--card)))';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--product-list-shadow, 0 1px 3px hsl(var(--muted)) / 0.1)';
                }
              }}
              onClick={() => onProductClick?.(product)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--product-list-avatar-border, hsl(var(--background)))'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--product-list-avatar-bg, hsl(var(--primary)))',
                      color: 'var(--product-list-avatar-text, hsl(var(--primary-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      border: '2px solid var(--product-list-avatar-border, hsl(var(--background)))'
                    }}>
                      {initials}
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '50%',
                    backgroundColor: product.status === 'ACTIVE' 
                      ? 'var(--product-list-status-active, #22c55e)' 
                      : 'var(--product-list-status-inactive, #6b7280)',
                    border: '2px solid var(--product-list-avatar-border, hsl(var(--background)))'
                  }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{
                      fontWeight: '600',
                      color: 'var(--product-list-name-color, hsl(var(--foreground)))',
                      margin: 0,
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.name || 'Unknown Product'}
                    </h3>
                    
                    {/* Status badge */}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: product.status === 'ACTIVE' 
                        ? 'var(--product-list-role-manager-bg, hsl(var(--primary)) / 0.1)'
                        : 'var(--product-list-role-employee-bg, hsl(var(--secondary)) / 0.1)',
                      color: product.status === 'ACTIVE'
                        ? 'var(--product-list-role-manager-text, hsl(var(--primary)))'
                        : 'var(--product-list-role-employee-text, hsl(var(--secondary-foreground)))',
                      textTransform: 'capitalize'
                    }}>
                      {product.status || 'N/A'}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--product-list-email-color, hsl(var(--muted-foreground)))',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    SKU: {product.sku || 'No SKU'}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--product-list-department-color, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      💰 ${product.price || '0.00'}
                    </span>
                    
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--product-list-employment-color, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      📦 {product.quantity || 0} units
                    </span>
                    
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--product-list-employment-color, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      📊 {(product.inventoryStatus || 'N/A').replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                {/* Chevron indicator - EXACTLY like Staff Hub */}
                <div style={{
                  color: 'var(--product-list-chevron-color, hsl(var(--muted-foreground)))',
                  fontSize: '1rem',
                  transform: isSelected ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease-in-out'
                }}>
                  ▶
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;