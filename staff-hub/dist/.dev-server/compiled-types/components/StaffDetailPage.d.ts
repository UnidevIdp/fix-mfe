import React from 'react';
import { Staff } from '@workspace/api-contracts';
interface StaffDetailPageProps {
    staffId: string;
    onBack?: () => void;
    onEdit?: (staff: Staff) => void;
    onEditMode?: () => void;
    onDelete?: (staffId: string) => void;
}
export declare const StaffDetailPage: React.FC<StaffDetailPageProps>;
export default StaffDetailPage;
//# sourceMappingURL=StaffDetailPage.d.ts.map