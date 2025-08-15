import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Button } from '@workspace/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui';

interface ProductsFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  loading?: boolean;
  searchResultsCount?: number;
  totalProductCount?: number;
  currentSearchQuery?: string;
}

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            Search
          </Button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2">
          <Select value={filters.status} onValueChange={(value) => handleFilterUpdate('status', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.inventoryStatus} onValueChange={(value) => handleFilterUpdate('inventoryStatus', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Inventory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inventory</SelectItem>
              <SelectItem value="IN_STOCK">In Stock</SelectItem>
              <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category} onValueChange={(value) => handleFilterUpdate('category', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priceRange} onValueChange={(value) => handleFilterUpdate('priceRange', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-50">$0 - $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-500">$100 - $500</SelectItem>
              <SelectItem value="500+">$500+</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="gap-2"
          >
            <X size={16} />
            Clear Filters
          </Button>
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