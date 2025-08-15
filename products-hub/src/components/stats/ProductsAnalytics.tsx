import React, { useMemo } from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
  Alert,
  AlertDescription,
} from '@workspace/ui';
import { useProductsAnalytics } from '../../hooks/useProducts';
import { mockAnalytics } from '../../services/mockData';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}> = ({ title, value, description, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
              {trend !== undefined && (
                <Badge
                  variant="outline"
                  className={trend >= 0 ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}
                >
                  {trend >= 0 ? '+' : ''}{trend}%
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div className={`rounded-full p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DistributionCard: React.FC<{
  title: string;
  data: Record<string, number>;
  icon: React.ReactNode;
}> = ({ title, data, icon }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            const percentage = total > 0 ? (value / total) * 100 : 0;
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {value} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const TrendsCard: React.FC<{
  title: string;
  data: Array<{ date: string; count: number }>;
  icon: React.ReactNode;
}> = ({ title, data, icon }) => {
  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-500 dark:text-gray-400">
                  {item.date}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 h-6 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${height}%` }}
                    />
                  </div>
                  <div className="w-8 text-xs text-gray-700 dark:text-gray-300 text-right">
                    {item.count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const TopProductsCard: React.FC<{
  products: Array<{
    id: string;
    name: string;
    sku: string;
    viewCount: number;
    orderCount: number;
    revenue: number;
  }>;
}> = ({ products }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Top Performing Products
        </CardTitle>
        <CardDescription>
          Best performing products by revenue and orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex-shrink-0">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  #{index + 1}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {product.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {product.sku}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  ${product.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {product.orderCount} orders
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ProductsAnalytics: React.FC = () => {
  // For development, use mock data
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const { 
    data: analyticsResponse, 
    isLoading, 
    error 
  } = useProductsAnalytics();

  // Use mock data in development if API fails
  const analytics = useMemo(() => {
    if (isDevelopment && (!analyticsResponse || error)) {
      return mockAnalytics;
    }
    return analyticsResponse?.data || mockAnalytics;
  }, [analyticsResponse, error, isDevelopment]);

  if (isLoading && !isDevelopment) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive insights into your product performance and inventory
        </p>
      </div>

      {/* Development Notice */}
      {isDevelopment && (error || !analyticsResponse) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Using mock analytics data for development. Backend service may not be running on port 8087.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={analytics.overview.totalProducts}
          description="All products in catalog"
          icon={<Package className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={analytics.overview.activeProducts}
          description="Currently active"
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value={analytics.overview.lowStock}
          description="Need restocking"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          title="Out of Stock"
          value={analytics.overview.outOfStock}
          description="Currently unavailable"
          icon={<Package className="h-5 w-5" />}
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Variants"
          value={analytics.overview.totalVariants}
          description="Product variations"
          icon={<Activity className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          title="Average Price"
          value={`$${analytics.overview.averagePrice.toFixed(2)}`}
          description="Across all products"
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Total Inventory"
          value={analytics.overview.totalInventory.toLocaleString()}
          description="Units in stock"
          icon={<Package className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Draft Products"
          value={analytics.overview.draftProducts}
          description="Pending publication"
          icon={<Users className="h-5 w-5" />}
          color="yellow"
        />
      </div>

      {/* Distribution and Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DistributionCard
          title="Products by Status"
          data={analytics.distribution.byStatus}
          icon={<PieChart className="h-5 w-5" />}
        />
        <DistributionCard
          title="Products by Category"
          data={analytics.distribution.byCategory}
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DistributionCard
          title="Inventory Status"
          data={analytics.distribution.byInventory}
          icon={<Package className="h-5 w-5" />}
        />
        <TrendsCard
          title="Product Creation Trends (Last 7 Days)"
          data={analytics.trends.daily}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Top Products */}
      {analytics.topProducts.length > 0 && (
        <TopProductsCard products={analytics.topProducts} />
      )}

      {/* Additional Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Well Stocked</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {((analytics.overview.totalProducts - analytics.overview.lowStock - analytics.overview.outOfStock) / analytics.overview.totalProducts * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Needs Attention</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {(analytics.overview.lowStock / analytics.overview.totalProducts * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {(analytics.overview.outOfStock / analytics.overview.totalProducts * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Published</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {(analytics.overview.activeProducts / analytics.overview.totalProducts * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">In Draft</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {(analytics.overview.draftProducts / analytics.overview.totalProducts * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Catalog Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Variants per Product</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {(analytics.overview.totalVariants / analytics.overview.totalProducts).toFixed(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Inventory</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {Math.round(analytics.overview.totalInventory / analytics.overview.totalProducts)} units
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsAnalytics;