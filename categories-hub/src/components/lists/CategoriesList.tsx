import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Category } from '../../services/categoriesApi';
import { LoadingCard, Button, Card, CardContent, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@workspace/ui';
import { Search, X, Tag } from 'lucide-react';

// Custom debounce hook
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

interface CategoriesListProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
  selectedCategory?: Category | null;
  className?: string;
  loading?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ 
  categories, 
  onCategoryClick, 
  selectedCategory,
  className = '',
  loading = false,
  showSearch = true,
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

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

  // Memoized filtered categories to prevent unnecessary recalculations
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    return categories.filter(category => {
      const matchesSearch = debouncedSearchTerm === '' || 
                           category.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           category.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
      const matchesLevel = levelFilter === 'all' || category.level.toString() === levelFilter;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [categories, debouncedSearchTerm, statusFilter, levelFilter]);

  const categoriesToDisplay = showSearch || showFilters ? filteredCategories : categories;

  // Show loading state
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
                  placeholder="Search categories by name or description..."
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
              padding: 'var(--categories-list-item-padding, 1rem)',
              border: '1px solid var(--categories-list-border-color, hsl(var(--border)))',
              borderRadius: 'var(--categories-list-border-radius, 0.75rem)',
              backgroundColor: 'var(--categories-list-bg, hsl(var(--card)))'
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

  // Handle undefined or null categories array
  if (!categories || categories.length === 0) {
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
                      placeholder="Search categories by name or description..."
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
                </div>
                
                {showFilters && (
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="0">Level 0</SelectItem>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
            </CardContent>
          </Card>
        )}
        
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--categories-list-empty-color, hsl(var(--muted-foreground)))'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'var(--categories-list-empty-bg, hsl(var(--muted)))',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Tag className="h-6 w-6" />
          </div>
          <p style={{ margin: 0, fontWeight: '500' }}>No categories found</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first category to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Enhanced Search and Filters */}
      {showSearch && (
        <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search categories by name or description..."
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
                          Found {categoriesToDisplay.length} result{categoriesToDisplay.length !== 1 ? 's' : ''}
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
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="0">Level 0</SelectItem>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Categories List */}
      <div className="space-y-3">
        {categoriesToDisplay.map((category) => {
          const isSelected = selectedCategory?.id === category.id;
          const initials = `${category.name?.[0] || '?'}${category.name?.[1] || ''}`.toUpperCase();
          
          return (
            <div
              key={category.id}
              style={{
                padding: 'var(--categories-list-item-padding, 1rem)',
                border: `2px solid ${isSelected 
                  ? 'var(--categories-list-selected-border, hsl(var(--primary)))' 
                  : 'var(--categories-list-border-color, hsl(var(--border)))'
                }`,
                borderRadius: 'var(--categories-list-border-radius, 0.75rem)',
                backgroundColor: isSelected 
                  ? 'var(--categories-list-selected-bg, hsl(var(--primary)) / 0.05)'
                  : 'var(--categories-list-bg, hsl(var(--card)))',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
                boxShadow: isSelected 
                  ? 'var(--categories-list-selected-shadow, 0 4px 12px hsl(var(--primary)) / 0.15)'
                  : 'var(--categories-list-shadow, 0 1px 3px hsl(var(--muted)) / 0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--categories-list-hover-bg, hsl(var(--accent)))';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--categories-list-hover-shadow, 0 4px 12px hsl(var(--muted)) / 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--categories-list-bg, hsl(var(--card)))';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--categories-list-shadow, 0 1px 3px hsl(var(--muted)) / 0.1)';
                }
              }}
              onClick={() => onCategoryClick?.(category)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={`${category.name}`}
                      style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--categories-list-avatar-border, hsl(var(--background)))'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--categories-list-avatar-bg, hsl(var(--primary)))',
                      color: 'var(--categories-list-avatar-text, hsl(var(--primary-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      border: '2px solid var(--categories-list-avatar-border, hsl(var(--background)))'
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
                    backgroundColor: category.isActive 
                      ? 'var(--categories-list-status-active, #22c55e)' 
                      : 'var(--categories-list-status-inactive, #6b7280)',
                    border: '2px solid var(--categories-list-avatar-border, hsl(var(--background)))'
                  }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{
                      fontWeight: '600',
                      color: 'var(--categories-list-name-color, hsl(var(--foreground)))',
                      margin: 0,
                      fontSize: '0.875rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {category.name || 'Unknown Category'}
                    </h3>
                    
                    {/* Level badge */}
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: category.level === 0 
                        ? 'var(--categories-list-level-top-bg, hsl(var(--primary)) / 0.1)'
                        : 'var(--categories-list-level-sub-bg, hsl(var(--secondary)) / 0.1)',
                      color: category.level === 0
                        ? 'var(--categories-list-level-top-text, hsl(var(--primary)))'
                        : 'var(--categories-list-level-sub-text, hsl(var(--secondary-foreground)))',
                      textTransform: 'capitalize'
                    }}>
                      Level {category.level}
                    </span>
                  </div>
                  
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--categories-list-description-color, hsl(var(--muted-foreground)))',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {category.description || 'No description'}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--categories-list-status-color, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      🏷️ {category.status || 'DRAFT'}
                    </span>
                    
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--categories-list-hierarchy-color, hsl(var(--muted-foreground)))',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      🌳 {category.parentId ? 'Sub-category' : 'Top Level'}
                    </span>
                  </div>
                </div>
                
                {/* Chevron indicator */}
                <div style={{
                  color: 'var(--categories-list-chevron-color, hsl(var(--muted-foreground)))',
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

export default CategoriesList;