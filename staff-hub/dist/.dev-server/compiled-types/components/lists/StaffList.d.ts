import React from 'react';
import { Staff } from '@workspace/api-contracts';
interface StaffListProps {
    staff: Staff[];
    onStaffClick?: (staff: Staff) => void;
    selectedStaff?: Staff | null;
    className?: string;
    loading?: boolean;
    showSearch?: boolean;
    showFilters?: boolean;
}
export declare const StaffList: React.FC<StaffListProps>;
export default StaffList;
//# sourceMappingURL=StaffList.d.ts.map