import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Staff } from '@workspace/api-contracts';
import { LoadingCard, Button, Card, CardContent, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@workspace/ui';
import { Search, X, Users } from 'lucide-react';

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    if (value === debouncedValue) {
      setIsDebouncing(false);
      return;
    }
    
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, debouncedValue]);

  return { debouncedValue, isDebouncing };
};

interface StaffListProps {
  staff: Staff[];
  onStaffClick?: (staff: Staff) => void;
  selectedStaff?: Staff | null;
  className?: string;
  loading?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
}

export const StaffList: React.FC<StaffListProps> = ({ 
  staff, 
  onStaffClick,
  selectedStaff,
  className = '',
  loading = false,
  showSearch = true,
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Use custom debounce hook
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebounce(searchTerm, 300);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Add keyboard support for Escape key to clear search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchTerm) {
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchTerm, clearSearch]);

  // Memoized filtered staff to prevent unnecessary recalculations
  const filteredStaff = useMemo(() => {
    if (!staff) return [];
    
    return staff.filter(member => {
      const matchesSearch = debouncedSearchTerm === '' || 
                           member.firstName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           member.lastName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           member.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && member.isActive) ||
                           (statusFilter === 'inactive' && !member.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, debouncedSearchTerm, roleFilter, statusFilter]);

  const staffToDisplay = showSearch || showFilters ? filteredStaff : staff;
  // Show loading state
  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {showSearch && (
          <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search staff by name or email..."
                  className="w-full pl-10 pr-16 transition-all duration-200"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        )}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: 'var(--staff-list-item-padding, 1rem)',
              border: '1px solid var(--staff-list-border-color, hsl(var(--border)))',
              borderRadius: 'var(--staff-list-border-radius, 0.75rem)',
              backgroundColor: 'var(--staff-list-bg, hsl(var(--card)))'
            }}
          >
            <LoadingCard 
              showAvatar 
              avatarSize="md" 
              lines={2} 
              className="p-0" 
            />
          </div>
        ))}
      </div>
    );
  }

  // Handle undefined or null staff array
  if (!staff || staff.length === 0) {
    return (
      <div className={className}>
        {showSearch && (
          <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="text"
                      placeholder="Search staff by name or email..."
                      className="w-full pl-10 pr-16 transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {/* Loading spinner - only when debouncing */}
                    {isDebouncing && searchTerm && (
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
                      </div>
                    )}
                    
                    {/* Enhanced Clear button - always visible when there's text */}
                    {searchTerm && (
                      <Button
                        onClick={clearSearch}
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all duration-200 z-20 border border-gray-200 bg-white shadow-sm hover:border-red-200 hover:shadow-md"
                        type="button"
                        title="Clear search (Esc)"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {showFilters && (
                  <div className="flex gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {/* Enhanced Search status indicator */}
              {searchTerm && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs flex items-center gap-2">
                    {isDebouncing ? (
                      <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        Searching for "{searchTerm}"...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-green-600 font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Found 0 results
                        {debouncedSearchTerm && (
                          <span className="text-gray-500 font-normal">
                            for "{debouncedSearchTerm}"
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  
                  {/* Quick clear shortcut */}
                  {!isDebouncing && searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--staff-list-empty-color, hsl(var(--muted-foreground)))'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            backgroundColor: 'var(--staff-list-empty-bg, hsl(var(--muted)))',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users className="h-6 w-6" />
          </div>
          <p style={{ margin: 0, fontWeight: '500' }}>No staff members found</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Add your first team member to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Enhanced Search and Filters */}
      {showSearch && (
        <Card className="hover:shadow-md transition-shadow duration-200 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search staff by name or email..."
                    className="w-full pl-10 pr-16 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  {/* Loading spinner - only when debouncing */}
                  {isDebouncing && searchTerm && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
                    </div>
                  )}
                  
                  {/* Enhanced Clear button - always visible when there's text */}
                  {searchTerm && (
                    <Button
                      onClick={clearSearch}
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-600 text-gray-400 transition-all duration-200 z-20 border border-gray-200 bg-white shadow-sm hover:border-red-200 hover:shadow-md"
                      type="button"
                      title="Clear search (Esc)"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* Enhanced Search status indicator */}
                {searchTerm && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs flex items-center gap-2">
                      {isDebouncing ? (
                        <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          Searching for "{searchTerm}"...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-green-600 font-medium">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          Found {staffToDisplay.length} result{staffToDisplay.length !== 1 ? 's' : ''}
                          {debouncedSearchTerm && (
                            <span className="text-gray-500 font-normal">
                              for "{debouncedSearchTerm}"
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    
                    {/* Quick clear shortcut */}
                    {!isDebouncing && searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {showFilters && (
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Staff List */}
      <div className="space-y-3">
        {staffToDisplay.map((member) => {
        const isSelected = selectedStaff?.id === member.id;
        const initials = `${member.firstName?.[0] || '?'}${member.lastName?.[0] || '?'}`.toUpperCase();
        
        return (
          <div
            key={member.id}
            style={{
              padding: 'var(--staff-list-item-padding, 1rem)',
              border: `2px solid ${isSelected 
                ? 'var(--staff-list-selected-border, hsl(var(--primary)))' 
                : 'var(--staff-list-border-color, hsl(var(--border)))'
              }`,
              borderRadius: 'var(--staff-list-border-radius, 0.75rem)',
              backgroundColor: isSelected 
                ? 'var(--staff-list-selected-bg, hsl(var(--primary)) / 0.05)'
                : 'var(--staff-list-bg, hsl(var(--card)))',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: isSelected 
                ? 'var(--staff-list-selected-shadow, 0 4px 12px hsl(var(--primary)) / 0.15)'
                : 'var(--staff-list-shadow, 0 1px 3px hsl(var(--muted)) / 0.1)'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--staff-list-hover-bg, hsl(var(--accent)))';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--staff-list-hover-shadow, 0 4px 12px hsl(var(--muted)) / 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--staff-list-bg, hsl(var(--card)))';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--staff-list-shadow, 0 1px 3px hsl(var(--muted)) / 0.1)';
              }
            }}
            onClick={() => onStaffClick?.(member)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                {member.profilePhotoUrl ? (
                  <img
                    src={member.profilePhotoUrl}
                    alt={`${member.firstName} ${member.lastName}`}
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--staff-list-avatar-border, hsl(var(--background)))'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--staff-list-avatar-bg, hsl(var(--primary)))',
                    color: 'var(--staff-list-avatar-text, hsl(var(--primary-foreground)))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    border: '2px solid var(--staff-list-avatar-border, hsl(var(--background)))'
                  }}>
                    {initials}
                  </div>
                )}
                
                {/* Online status indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  backgroundColor: member.isActive 
                    ? 'var(--staff-list-status-active, #22c55e)' 
                    : 'var(--staff-list-status-inactive, #6b7280)',
                  border: '2px solid var(--staff-list-avatar-border, hsl(var(--background)))'
                }} />
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{
                    fontWeight: '600',
                    color: 'var(--staff-list-name-color, hsl(var(--foreground)))',
                    margin: 0,
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {member.firstName || 'Unknown'} {member.lastName || 'User'}
                  </h3>
                  
                  {/* Role badge */}
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: member.role === 'manager' 
                      ? 'var(--staff-list-role-manager-bg, hsl(var(--primary)) / 0.1)'
                      : 'var(--staff-list-role-employee-bg, hsl(var(--secondary)) / 0.1)',
                    color: member.role === 'manager'
                      ? 'var(--staff-list-role-manager-text, hsl(var(--primary)))'
                      : 'var(--staff-list-role-employee-text, hsl(var(--secondary-foreground)))',
                    textTransform: 'capitalize'
                  }}>
                    {member.role || 'N/A'}
                  </span>
                </div>
                
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--staff-list-email-color, hsl(var(--muted-foreground)))',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {member.email || 'No email'}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--staff-list-department-color, hsl(var(--muted-foreground)))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    🏢 {member.departmentId || 'No Department'}
                  </span>
                  
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--staff-list-employment-color, hsl(var(--muted-foreground)))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    💼 {member.employmentType?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
              </div>
              
              {/* Chevron indicator */}
              <div style={{
                color: 'var(--staff-list-chevron-color, hsl(var(--muted-foreground)))',
                fontSize: '1rem',
                transform: isSelected ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out'
              }}>
                ▶
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default StaffList;