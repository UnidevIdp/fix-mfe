import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ShoppingCart,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
  Alert,
  AlertDescription,
} from '@workspace/ui';
import { useProducts, useCategories, useDeleteProduct, useUpdateProductStatus } from '../../hooks/useProducts';
import { Product, ProductFilters } from '../../services/productsApi';
import { mockProducts, mockCategories } from '../../services/mockData';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
    case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'INACTIVE': return 'bg-red-100 text-red-800 border-red-200';
    case 'ARCHIVED': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getInventoryStatusColor = (status: string) => {
  switch (status) {
    case 'IN_STOCK': return 'bg-green-100 text-green-800 border-green-200';
    case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800 border-red-200';
    case 'BACK_ORDER': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'DISCONTINUED': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
    case 'DRAFT': return <Edit className="h-4 w-4" />;
    case 'PENDING': return <Clock className="h-4 w-4" />;
    case 'INACTIVE': return <AlertTriangle className="h-4 w-4" />;
    case 'ARCHIVED': return <Package className="h-4 w-4" />;
    case 'REJECTED': return <AlertTriangle className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

const ProductsList: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // For development, use mock data
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const { 
    data: productsResponse, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useProducts(filters);

  const { 
    data: categoriesResponse, 
    isLoading: isLoadingCategories 
  } = useCategories();

  const deleteProductMutation = useDeleteProduct();
  const updateStatusMutation = useUpdateProductStatus();

  // Use mock data in development if API fails
  const products = useMemo(() => {
    if (isDevelopment && (!productsResponse || productsError)) {
      return mockProducts;
    }
    return productsResponse?.data || [];
  }, [productsResponse, productsError, isDevelopment]);

  const categories = useMemo(() => {
    if (isDevelopment && (!categoriesResponse || !categoriesResponse.data)) {
      return mockCategories;
    }
    return categoriesResponse?.data || [];
  }, [categoriesResponse, isDevelopment]);

  const pagination = useMemo(() => {
    if (isDevelopment && (!productsResponse || productsError)) {
      return {
        page: 1,
        limit: 20,
        total: mockProducts.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
    }
    return productsResponse?.pagination || {
      page: 1, limit: 20, total: 0, totalPages: 0, hasNext: false, hasPrevious: false
    };
  }, [productsResponse, productsError, isDevelopment]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: productId, status: newStatus });
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  if (isLoadingProducts && !isDevelopment) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products by name, SKU, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Select
              value={filters.categoryId || 'all-categories'}
              onValueChange={(value) => handleFilterChange('categoryId', value === 'all-categories' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status || 'all-statuses'}
              onValueChange={(value) => handleFilterChange('status', value === 'all-statuses' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.inventoryStatus || 'all-inventory'}
              onValueChange={(value) => handleFilterChange('inventoryStatus', value === 'all-inventory' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Inventory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-inventory">All Inventory</SelectItem>
                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="BACK_ORDER">Back Order</SelectItem>
                <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy || 'createdAt'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Development Notice */}
      {isDevelopment && (productsError || !productsResponse) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Using mock data for development. Backend service may not be running on port 8087.
          </AlertDescription>
        </Alert>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <TrendingUp className="mr-1 h-3 w-3" />
                {products.filter(p => p.status === 'ACTIVE').length} Active
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {products.filter(p => p.inventoryStatus === 'LOW_STOCK').length} Low Stock
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <Package className="mr-1 h-3 w-3" />
                {products.filter(p => p.inventoryStatus === 'OUT_OF_STOCK').length} Out of Stock
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage 
                          src={product.images?.[0]?.url} 
                          alt={product.images?.[0]?.altText || product.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-md bg-gray-100">
                          <Package className="h-4 w-4 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {product.sku}
                        </div>
                        {product.variants && product.variants.length > 0 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${product.price}</div>
                        {product.comparePrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.comparePrice}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {product.quantity || 0} units
                        </div>
                        {product.inventoryStatus && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getInventoryStatusColor(product.inventoryStatus)}`}
                          >
                            {product.inventoryStatus.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(product.status)} flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(product.status)}
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Manage Inventory
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevious}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsList;

