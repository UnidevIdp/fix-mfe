import { useState, useEffect, useCallback } from 'react';
import { Staff, CreateStaffRequest, UpdateStaffRequest, StaffFilters } from '@workspace/api-contracts';
import { defaultStaffApiClient } from '@workspace/shared';

interface UseStaffResult {
  // State
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

  // Actions
  loadStaff: (params?: { page?: number; limit?: number; search?: string; filters?: Partial<StaffFilters> }) => Promise<void>;
  createStaff: (staff: CreateStaffRequest) => Promise<Staff | null>;
  updateStaff: (id: string, updates: UpdateStaffRequest) => Promise<Staff | null>;
  deleteStaff: (id: string) => Promise<boolean>;
  selectStaff: (staff: Staff | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<StaffFilters>) => void;
  clearError: () => void;
  refreshStaff: () => Promise<void>;
}

export function useStaff(): UseStaffResult {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Partial<StaffFilters>>({});
  const [pagination, setPagination] = useState<UseStaffResult['pagination']>(null);
  const [lastParams, setLastParams] = useState<Parameters<UseStaffResult['loadStaff']>[0]>();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadStaff = useCallback(async (params: Parameters<UseStaffResult['loadStaff']>[0] = {}) => {
    setLoading(true);
    setError(null);
    setLastParams(params);

    try {
      const response = await defaultStaffApiClient.getStaffList(params);
      
      if (response.success) {
        setStaff(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error('Failed to load staff');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load staff';
      setError(errorMessage);
      console.error('Failed to load staff:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStaff = useCallback(async (staffData: CreateStaffRequest): Promise<Staff | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await defaultStaffApiClient.createStaff(staffData);
      
      if (response.success && response.data) {
        // Refresh the staff list to include the new member
        await loadStaff(lastParams);
        return response.data;
      } else {
        throw new Error('Failed to create staff member');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create staff member';
      setError(errorMessage);
      console.error('Failed to create staff:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadStaff, lastParams]);

  const updateStaff = useCallback(async (id: string, updates: UpdateStaffRequest): Promise<Staff | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await defaultStaffApiClient.updateStaff(id, updates);
      
      if (response.success && response.data) {
        // Update the staff in the local list
        setStaff(prevStaff => 
          prevStaff.map(member => 
            member.id === id ? response.data! : member
          )
        );
        
        // Update selected staff if it's the same one
        if (selectedStaff?.id === id) {
          setSelectedStaff(response.data);
        }
        
        return response.data;
      } else {
        throw new Error('Failed to update staff member');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update staff member';
      setError(errorMessage);
      console.error('Failed to update staff:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedStaff]);

  const deleteStaff = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await defaultStaffApiClient.deleteStaff(id);
      
      if (response.success) {
        // Remove the staff from the local list
        setStaff(prevStaff => prevStaff.filter(member => member.id !== id));
        
        // Clear selected staff if it's the same one
        if (selectedStaff?.id === id) {
          setSelectedStaff(null);
        }
        
        return true;
      } else {
        throw new Error('Failed to delete staff member');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete staff member';
      setError(errorMessage);
      console.error('Failed to delete staff:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedStaff]);

  const selectStaff = useCallback((staff: Staff | null) => {
    setSelectedStaff(staff);
  }, []);

  const refreshStaff = useCallback(async () => {
    await loadStaff({ ...lastParams, search: searchQuery, filters });
  }, [loadStaff, lastParams, searchQuery, filters]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStaff({ search: searchQuery, filters });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, loadStaff]);

  // Load initial staff data
  useEffect(() => {
    loadStaff();
  }, []);

  return {
    // State
    staff,
    selectedStaff,
    loading,
    error,
    searchQuery,
    filters,
    pagination,

    // Actions
    loadStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    selectStaff,
    setSearchQuery,
    setFilters,
    clearError,
    refreshStaff,
  };
}