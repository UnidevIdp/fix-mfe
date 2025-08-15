import { Staff, CreateStaffRequest, UpdateStaffRequest, StaffFilters } from '@workspace/api-contracts';
interface UseStaffResult {
    staff: Staff[];
    selectedStaff: Staff | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    filters: Partial<StaffFilters>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    } | null;
    loadStaff: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        filters?: Partial<StaffFilters>;
    }) => Promise<void>;
    createStaff: (staff: CreateStaffRequest) => Promise<Staff | null>;
    updateStaff: (id: string, updates: UpdateStaffRequest) => Promise<Staff | null>;
    deleteStaff: (id: string) => Promise<boolean>;
    selectStaff: (staff: Staff | null) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: Partial<StaffFilters>) => void;
    clearError: () => void;
    refreshStaff: () => Promise<void>;
}
export declare function useStaff(): UseStaffResult;
export {};
//# sourceMappingURL=useStaff.d.ts.map