/**
 * Utility functions for products management routing
 */

export const ProductRoutes = {
  // List and dashboard routes
  dashboard: () => '/',
  list: () => '/products',
  
  // Product management routes
  create: () => '/products/create',
  view: (id: string) => `/products/${id}/view`,
  edit: (id: string) => `/products/${id}/edit`,
  
  // Analytics and insights
  analytics: () => '/products/analytics',
  
  // Category management
  categories: () => '/products/categories',
  
  // Inventory management
  inventory: () => '/products/inventory',
  
  // Legacy routes (for backward compatibility)
  legacy: {
    details: (id: string) => `/products/${id}`,
    list: () => '/products-list',
    analytics: () => '/product-analytics'
  }
};

/**
 * Generate navigation breadcrumbs based on current route
 */
export const getBreadcrumbs = (path: string, productName?: string) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: ProductRoutes.dashboard() }
  ];

  if (path.startsWith('/products')) {
    breadcrumbs.push({ label: 'Products', href: ProductRoutes.list() });

    if (path.includes('/create')) {
      breadcrumbs.push({ label: 'Create New Product', href: ProductRoutes.create() });
    } else if (path.includes('/edit')) {
      const id = path.split('/')[2];
      if (productName) {
        breadcrumbs.push({ label: productName, href: ProductRoutes.view(id) });
      }
      breadcrumbs.push({ label: 'Edit', href: ProductRoutes.edit(id) });
    } else if (path.includes('/view') || path.match(/\/products\/[^\/]+$/)) {
      const id = path.split('/')[2];
      if (productName) {
        breadcrumbs.push({ label: productName, href: ProductRoutes.view(id) });
      }
    } else if (path.includes('/analytics')) {
      breadcrumbs.push({ label: 'Analytics & Insights', href: ProductRoutes.analytics() });
    } else if (path.includes('/categories')) {
      breadcrumbs.push({ label: 'Categories', href: ProductRoutes.categories() });
    } else if (path.includes('/inventory')) {
      breadcrumbs.push({ label: 'Inventory Management', href: ProductRoutes.inventory() });
    }
  }

  return breadcrumbs;
};

/**
 * Parse product ID from current path
 */
export const getProductIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/products\/([^\/]+)/);
  return matches ? matches[1] : null;
};

/**
 * Check if current path is a product management route
 */
export const isProductRoute = (path: string): boolean => {
  return path.startsWith('/products');
};

/**
 * Get current product management mode from path
 */
export const getProductModeFromPath = (path: string): 'list' | 'create' | 'view' | 'edit' | 'analytics' | 'categories' | 'inventory' => {
  if (path.includes('/create')) return 'create';
  if (path.includes('/edit')) return 'edit';
  if (path.includes('/view') || path.match(/\/products\/[^\/]+$/)) return 'view';
  if (path.includes('/analytics')) return 'analytics';
  if (path.includes('/categories')) return 'categories';
  if (path.includes('/inventory')) return 'inventory';
  return 'list';
};