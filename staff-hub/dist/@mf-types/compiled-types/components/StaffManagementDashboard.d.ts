import React from 'react';
import { Staff, CreateStaffRequest } from '@workspace/api-contracts';
interface StaffManagementDashboardProps {
    staff: Staff[];
    selectedStaff: Staff | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    filters: any;
    onStaffSelect: (staff: Staff) => void;
    onStaffCreate: (data: CreateStaffRequest) => Promise<Staff | null>;
    onStaffUpdate: (id: string, data: any) => Promise<Staff | null>;
    onStaffDelete: (id: string) => Promise<boolean>;
    onSearch: (query: string) => void;
    onFilterChange: (filters: any) => void;
    onRefresh: () => void;
    className?: string;
    initialViewMode?: string;
    onViewModeChange?: (mode: string) => void;
}
export declare const StaffManagementDashboard: React.FC<StaffManagementDashboardProps>;
export default StaffManagementDashboard;
//# sourceMappingURL=StaffManagementDashboard.d.ts.map