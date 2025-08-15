/**
 * MFE Integration utilities for host applications
 */
/**
 * Initialize MFE routing integration in host app
 * Call this before mounting the StaffHub MFE
 */
export declare const initializeMFERouting: (hostNavigate: (path: string) => void, getCurrentPath: () => string, basePath?: string) => () => void;
/**
 * React Router v6 integration example
 */
export declare const createReactRouterIntegration: (basePath?: string) => {
    setupWithNavigate: (navigate: (to: string) => void, location: {
        pathname: string;
    }) => () => void;
};
/**
 * Next.js Router integration example
 */
export declare const createNextRouterIntegration: (basePath?: string) => {
    setupWithRouter: (router: any) => () => void;
};
/**
 * Vanilla JavaScript integration example
 */
export declare const createVanillaIntegration: (basePath?: string) => {
    setup: () => () => void;
};
/**
 * URL Utilities for MFE integration
 */
export declare const MFEUrlUtils: {
    /**
     * Transform internal MFE paths to host app paths
     */
    toHostPath: (mfePath: string, basePath?: string) => string;
    /**
     * Transform host app paths to internal MFE paths
     */
    toMFEPath: (hostPath: string, basePath?: string) => string;
    /**
     * Generate staff-specific URLs
     */
    staffUrls: {
        list: (basePath?: string) => string;
        create: (basePath?: string) => string;
        view: (id: string, basePath?: string) => string;
        edit: (id: string, basePath?: string) => string;
    };
};
//# sourceMappingURL=mfe-integration.d.ts.map