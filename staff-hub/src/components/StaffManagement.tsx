import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Staff, CreateStaffRequest } from '@workspace/api-contracts';
import { useStaff } from '../hooks/useStaff';
import { useMfeRouter } from '@workspace/shared';
import { StaffManagementDashboard } from './StaffManagementDashboard';

interface StaffManagementProps {
  initialViewMode?: 'list' | 'detail' | 'create' | 'edit';
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ 
  initialViewMode = 'list' 
}) => {
  let id: string | undefined;
  
  try {
    // Try to get params from React Router
    const params = useParams<{ id: string }>();
    id = params.id;
  } catch (error) {
    // Fallback for MFE context
    id = undefined;
  }
  
  const { navigate, location, hasRouter } = useMfeRouter('staff-hub');
  
  const {
    staff,
    loading,
    error,
    searchQuery,
    filters,
    selectedStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    selectStaff,
    setSearchQuery,
    setFilters,
    refreshStaff
  } = useStaff();

  // Determine current mode based on URL and props
  const [currentMode, setCurrentMode] = useState<'list' | 'detail' | 'create' | 'edit'>(() => {
    if (initialViewMode === 'create') return 'create';
    if (initialViewMode === 'edit' && id) return 'edit';
    if (id) return 'detail';
    return 'list';
  });

  // Load staff member if ID is provided
  useEffect(() => {
    if (id && staff.length > 0) {
      const staffMember = staff.find(s => s.id === id);
      if (staffMember) {
        selectStaff(staffMember);
      }
    }
  }, [id, staff, selectStaff]);

  // Update mode based on URL changes
  useEffect(() => {
    const path = location.pathname;
    console.log('Current path:', path, 'ID:', id);
    
    if (path.includes('/create')) {
      console.log('Setting mode to create');
      setCurrentMode('create');
    } else if (path.includes('/edit') && id) {
      console.log('Setting mode to edit for ID:', id);
      setCurrentMode('edit');
    } else if (path.includes('/view') && id) {
      console.log('Setting mode to detail for ID:', id);
      setCurrentMode('detail');
    } else if (id && !path.includes('/edit') && !path.includes('/view')) {
      // Legacy route /staff/:id
      console.log('Setting mode to detail (legacy) for ID:', id);
      setCurrentMode('detail');
    } else {
      console.log('Setting mode to list');
      setCurrentMode('list');
    }
  }, [location.pathname, id]);

  const handleStaffSelect = (staff: Staff) => {
    selectStaff(staff);
    setCurrentMode('detail');
    navigate(`/staff/${staff.id}/view`);
  };

  const handleStaffCreate = async (data: CreateStaffRequest): Promise<Staff | null> => {
    try {
      const newStaff = await createStaff(data);
      if (newStaff) {
        setCurrentMode('detail');
        navigate(`/staff/${newStaff.id}/view`);
      }
      return newStaff;
    } catch (error) {
      console.error('Failed to create staff:', error);
      return null;
    }
  };

  const handleStaffUpdate = async (id: string, data: any): Promise<Staff | null> => {
    try {
      const updatedStaff = await updateStaff(id, data);
      if (updatedStaff) {
        setCurrentMode('detail');
        navigate(`/staff/${updatedStaff.id}/view`);
      }
      return updatedStaff;
    } catch (error) {
      console.error('Failed to update staff:', error);
      return null;
    }
  };

  const handleStaffDelete = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteStaff(id);
      if (success) {
        setCurrentMode('list');
        navigate('/staff');
      }
      return success;
    } catch (error) {
      console.error('Failed to delete staff:', error);
      return false;
    }
  };

  const handleViewModeChange = (mode: string) => {
    const newMode = mode as 'list' | 'detail' | 'create' | 'edit';
    setCurrentMode(newMode);
    
    // Update URL based on mode (only if router is available)
    if (hasRouter) {
      switch (newMode) {
        case 'list':
          navigate('/staff');
          break;
        case 'create':
          navigate('/staff/create');
          break;
        case 'edit':
          if (selectedStaff) {
            navigate(`/staff/${selectedStaff.id}/edit`);
          }
          break;
        case 'detail':
          if (selectedStaff) {
            navigate(`/staff/${selectedStaff.id}/view`);
          }
          break;
      }
    }
  };

  return (
    <StaffManagementDashboard
      staff={staff}
      selectedStaff={selectedStaff}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      filters={filters}
      onStaffSelect={handleStaffSelect}
      onStaffCreate={handleStaffCreate}
      onStaffUpdate={handleStaffUpdate}
      onStaffDelete={handleStaffDelete}
      onSearch={setSearchQuery}
      onFilterChange={setFilters}
      onRefresh={refreshStaff}
      initialViewMode={currentMode}
      onViewModeChange={handleViewModeChange}
      className="w-full"
    />
  );
};

export default StaffManagement;