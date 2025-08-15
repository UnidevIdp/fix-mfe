/**
 * Utility functions for staff management routing
 */

export const StaffRoutes = {
  // List and dashboard routes
  dashboard: () => '/',
  list: () => '/staff',
  
  // Staff management routes
  create: () => '/staff/create',
  view: (id: string) => `/staff/${id}/view`,
  edit: (id: string) => `/staff/${id}/edit`,
  
  // Legacy routes (for backward compatibility)
  legacy: {
    profile: (id: string) => `/staff/${id}`,
    list: () => '/staff-list',
    profilePage: (id: string) => `/staff-profile/${id}`
  }
};

/**
 * Generate navigation breadcrumbs based on current route
 */
export const getBreadcrumbs = (path: string, staffName?: string) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: StaffRoutes.dashboard() }
  ];

  if (path.startsWith('/staff')) {
    breadcrumbs.push({ label: 'Staff', href: StaffRoutes.list() });

    if (path.includes('/create')) {
      breadcrumbs.push({ label: 'Create New Staff', href: StaffRoutes.create() });
    } else if (path.includes('/edit')) {
      const id = path.split('/')[2];
      if (staffName) {
        breadcrumbs.push({ label: staffName, href: StaffRoutes.view(id) });
      }
      breadcrumbs.push({ label: 'Edit', href: StaffRoutes.edit(id) });
    } else if (path.includes('/view') || path.match(/\/staff\/[^\/]+$/)) {
      const id = path.split('/')[2];
      if (staffName) {
        breadcrumbs.push({ label: staffName, href: StaffRoutes.view(id) });
      }
    }
  }

  return breadcrumbs;
};

/**
 * Parse staff ID from current path
 */
export const getStaffIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/staff\/([^\/]+)/);
  return matches ? matches[1] : null;
};

/**
 * Check if current path is a staff management route
 */
export const isStaffRoute = (path: string): boolean => {
  return path.startsWith('/staff');
};

/**
 * Get current staff management mode from path
 */
export const getStaffModeFromPath = (path: string): 'list' | 'create' | 'view' | 'edit' => {
  if (path.includes('/create')) return 'create';
  if (path.includes('/edit')) return 'edit';
  if (path.includes('/view') || path.match(/\/staff\/[^\/]+$/)) return 'view';
  return 'list';
};