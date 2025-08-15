/**
 * Utility functions for categories management routing
 */

export const CategoryRoutes = {
  // List and dashboard routes
  dashboard: () => '/',
  list: () => '/categories',
  
  // Category management routes
  create: () => '/categories/create',
  view: (id: string) => `/categories/${id}/view`,
  edit: (id: string) => `/categories/${id}/edit`,
  
  // Legacy routes (for backward compatibility)
  legacy: {
    details: (id: string) => `/categories/${id}`,
    list: () => '/categories-list'
  }
};

/**
 * Generate navigation breadcrumbs based on current route
 */
export const getBreadcrumbs = (path: string, categoryName?: string) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: CategoryRoutes.dashboard() }
  ];

  if (path.startsWith('/categories')) {
    breadcrumbs.push({ label: 'Categories', href: CategoryRoutes.list() });

    if (path.includes('/create')) {
      breadcrumbs.push({ label: 'Create New Category', href: CategoryRoutes.create() });
    } else if (path.includes('/edit')) {
      const id = path.split('/')[2];
      if (categoryName) {
        breadcrumbs.push({ label: categoryName, href: CategoryRoutes.view(id) });
      }
      breadcrumbs.push({ label: 'Edit', href: CategoryRoutes.edit(id) });
    } else if (path.includes('/view') || path.match(/\/categories\/[^\/]+$/)) {
      const id = path.split('/')[2];
      if (categoryName) {
        breadcrumbs.push({ label: categoryName, href: CategoryRoutes.view(id) });
      }
    }
  }

  return breadcrumbs;
};

/**
 * Parse category ID from current path
 */
export const getCategoryIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/categories\/([^\/]+)/);
  return matches ? matches[1] : null;
};

/**
 * Check if current path is a categories management route
 */
export const isCategoriesRoute = (path: string): boolean => {
  return path.startsWith('/categories');
};

/**
 * Get current categories management mode from path
 */
export const getCategoriesModeFromPath = (path: string): 'list' | 'create' | 'view' | 'edit' => {
  if (path.includes('/create')) return 'create';
  if (path.includes('/edit')) return 'edit';
  if (path.includes('/view') || path.match(/\/categories\/[^\/]+$/)) return 'view';
  return 'list';
};