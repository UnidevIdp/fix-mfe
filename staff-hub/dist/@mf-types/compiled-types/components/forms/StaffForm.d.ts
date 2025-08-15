import React from 'react';
import { Staff, CreateStaffRequest } from '@workspace/api-contracts';
interface StaffFormProps {
    staff?: Staff;
    onSubmit: (data: CreateStaffRequest | Partial<Staff>) => void;
    onCancel?: () => void;
    loading?: boolean;
    className?: string;
}
export declare const StaffForm: React.FC<StaffFormProps>;
export default StaffForm;
//# sourceMappingURL=StaffForm.d.ts.map