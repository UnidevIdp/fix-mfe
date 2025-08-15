/**
 * Utility functions for staff management routing
 */
export declare const StaffRoutes: {
    dashboard: () => string;
    list: () => string;
    create: () => string;
    view: (id: string) => string;
    edit: (id: string) => string;
    legacy: {
        profile: (id: string) => string;
        list: () => string;
        profilePage: (id: string) => string;
    };
};
/**
 * Generate navigation breadcrumbs based on current route
 */
export declare const getBreadcrumbs: (path: string, staffName?: string) => {
    label: string;
    href: string;
}[];
/**
 * Parse staff ID from current path
 */
export declare const getStaffIdFromPath: (path: string) => string | null;
/**
 * Check if current path is a staff management route
 */
export declare const isStaffRoute: (path: string) => boolean;
/**
 * Get current staff management mode from path
 */
export declare const getStaffModeFromPath: (path: string) => "list" | "create" | "view" | "edit";
//# sourceMappingURL=routing.d.ts.map