/**
 * Utility functions for coupons management routing
 */

export const CouponRoutes = {
  // List and dashboard routes
  dashboard: () => '/',
  list: () => '/coupons',
  
  // Coupon management routes
  create: () => '/coupons/create',
  view: (id: string) => `/coupons/${id}/view`,
  edit: (id: string) => `/coupons/${id}/edit`,
  
  // Analytics and insights
  analytics: () => '/coupons/analytics',
  
  // Campaign management
  campaigns: () => '/coupons/campaigns',
  
  // Legacy routes (for backward compatibility)
  legacy: {
    details: (id: string) => `/coupons/${id}`,
    list: () => '/coupons-list',
    dashboard: () => '/coupon-dashboard'
  }
};

/**
 * Generate navigation breadcrumbs based on current route
 */
export const getBreadcrumbs = (path: string, couponName?: string) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: CouponRoutes.dashboard() }
  ];

  if (path.startsWith('/coupons')) {
    breadcrumbs.push({ label: 'Coupons', href: CouponRoutes.list() });

    if (path.includes('/create')) {
      breadcrumbs.push({ label: 'Create New Coupon', href: CouponRoutes.create() });
    } else if (path.includes('/edit')) {
      const id = path.split('/')[2];
      if (couponName) {
        breadcrumbs.push({ label: couponName, href: CouponRoutes.view(id) });
      }
      breadcrumbs.push({ label: 'Edit', href: CouponRoutes.edit(id) });
    } else if (path.includes('/view') || path.match(/\/coupons\/[^\/]+$/)) {
      const id = path.split('/')[2];
      if (couponName) {
        breadcrumbs.push({ label: couponName, href: CouponRoutes.view(id) });
      }
    } else if (path.includes('/analytics')) {
      breadcrumbs.push({ label: 'Analytics & Insights', href: CouponRoutes.analytics() });
    } else if (path.includes('/campaigns')) {
      breadcrumbs.push({ label: 'Campaigns', href: CouponRoutes.campaigns() });
    }
  }

  return breadcrumbs;
};

/**
 * Parse coupon ID from current path
 */
export const getCouponIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/coupons\/([^\/]+)/);
  return matches ? matches[1] : null;
};

/**
 * Check if current path is a coupon management route
 */
export const isCouponRoute = (path: string): boolean => {
  return path.startsWith('/coupons');
};

/**
 * Get current coupon management mode from path
 */
export const getCouponModeFromPath = (path: string): 'list' | 'create' | 'view' | 'edit' | 'analytics' | 'campaigns' => {
  if (path.includes('/create')) return 'create';
  if (path.includes('/edit')) return 'edit';
  if (path.includes('/view') || path.match(/\/coupons\/[^\/]+$/)) return 'view';
  if (path.includes('/analytics')) return 'analytics';
  if (path.includes('/campaigns')) return 'campaigns';
  return 'list';
};