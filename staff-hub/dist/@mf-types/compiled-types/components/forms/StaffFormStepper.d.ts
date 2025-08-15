import React from 'react';
import { Staff, CreateStaffRequest } from '@workspace/api-contracts';
interface StaffFormStepperProps {
    staff?: Staff;
    onSubmit: (data: CreateStaffRequest | Partial<Staff>, documents?: File[]) => void;
    onCancel?: () => void;
    loading?: boolean;
    className?: string;
}
export declare const StaffFormStepper: React.FC<StaffFormStepperProps>;
export default StaffFormStepper;
//# sourceMappingURL=StaffFormStepper.d.ts.map