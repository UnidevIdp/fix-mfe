/**
 * MFE Integration utilities for host applications
 */

import { setupMFERouter, onMFENavigation } from '@workspace/shared';

/**
 * Initialize MFE routing integration in host app
 * Call this before mounting the CouponsHub MFE
 */
export const initializeMFERouting = (hostNavigate: (path: string) => void, getCurrentPath: () => string, basePath?: string) => {
  setupMFERouter({
    navigate: (path: string) => {
      // Transform MFE paths to host app paths
      const fullPath = basePath ? `${basePath}${path}` : path;
      hostNavigate(fullPath);
    },
    getCurrentPath: () => {
      const currentPath = getCurrentPath();
      // Remove base path if it exists
      if (basePath && currentPath.startsWith(basePath)) {
        return currentPath.substring(basePath.length) || '/';
      }
      return currentPath;
    },
    basePath
  });

  // Listen for MFE navigation events
  const cleanup = onMFENavigation((path: string, source: string) => {
    console.log(`Navigation from ${source} MFE:`, path);
    const fullPath = basePath ? `${basePath}${path}` : path;
    hostNavigate(fullPath);
  });

  return cleanup;
};

/**
 * React Router v6 integration example
 */
export const createReactRouterIntegration = (basePath = '/coupons') => {
  return {
    // For React Router v6
    setupWithNavigate: (navigate: (to: string) => void, location: { pathname: string }) => {
      return initializeMFERouting(
        navigate,
        () => location.pathname,
        basePath
      );
    }
  };
};

/**
 * Next.js Router integration example
 */
export const createNextRouterIntegration = (basePath = '/coupons') => {
  return {
    // For Next.js router
    setupWithRouter: (router: any) => {
      return initializeMFERouting(
        (path: string) => router.push(path),
        () => router.asPath,
        basePath
      );
    }
  };
};

/**
 * Vanilla JavaScript integration example
 */
export const createVanillaIntegration = (basePath = '/coupons') => {
  return {
    setup: () => {
      return initializeMFERouting(
        (path: string) => {
          window.history.pushState({}, '', path);
          // Trigger any custom routing logic here
          window.dispatchEvent(new PopStateEvent('popstate'));
        },
        () => window.location.pathname,
        basePath
      );
    }
  };
};

/**
 * URL Utilities for MFE integration
 */
export const MFEUrlUtils = {
  /**
   * Transform internal MFE paths to host app paths
   */
  toHostPath: (mfePath: string, basePath = '/coupons') => {
    return `${basePath}${mfePath}`;
  },

  /**
   * Transform host app paths to internal MFE paths
   */
  toMFEPath: (hostPath: string, basePath = '/coupons') => {
    if (hostPath.startsWith(basePath)) {
      return hostPath.substring(basePath.length) || '/';
    }
    return hostPath;
  },

  /**
   * Generate coupon-specific URLs
   */
  couponUrls: {
    list: (basePath = '/coupons') => `${basePath}`,
    create: (basePath = '/coupons') => `${basePath}/create`,
    view: (id: string, basePath = '/coupons') => `${basePath}/${id}/view`,
    edit: (id: string, basePath = '/coupons') => `${basePath}/${id}/edit`,
    analytics: (basePath = '/coupons') => `${basePath}/analytics`,
    campaigns: (basePath = '/coupons') => `${basePath}/campaigns`,
  }
};