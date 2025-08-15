import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, UserPlus, MoreHorizontal, X, Users } from 'lucide-react';
import { Button } from '@workspace/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';
import { Input } from '@workspace/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui';
import { Badge } from '@workspace/ui';

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

// Mock data - will be replaced with API calls
const mockStaff = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    isActive: true,
    lastLoginAt: '2024-01-15T10:30:00Z',
    tenantId: 'tenant-1',
    applicationId: 'ecommerce-app'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@example.com',
    role: 'manager',
    isActive: true,
    lastLoginAt: '2024-01-14T15:45:00Z',
    tenantId: 'tenant-1',
    applicationId: 'healthcare-app'
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    role: 'employee',
    isActive: false,
    lastLoginAt: '2024-01-10T09:15:00Z',
    tenantId: 'tenant-2',
    applicationId: 'ecommerce-app'
  }
];

const StaffList: React.FC = () => {
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
    return mockStaff.filter(staff => {
      const matchesSearch = debouncedSearchTerm === '' || 
                           staff.firstName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           staff.lastName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           staff.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && staff.isActive) ||
                           (statusFilter === 'inactive' && !staff.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [debouncedSearchTerm, roleFilter, statusFilter]);

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      super_admin: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200',
      admin: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border border-red-200',
      manager: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
      employee: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
      guest: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h2>
          <p className="text-gray-600 text-lg">Manage staff members across all domains</p>
        </div>
        <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
          <UserPlus className="h-5 w-5 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Enhanced Filters */}
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
                        Found {filteredStaff.length} result{filteredStaff.length !== 1 ? 's' : ''}
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
          </div>
        </CardContent>
      </Card>

      {/* Staff Cards - Modern Grid Layout */}
      <div className="grid gap-4">
        {filteredStaff.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent className="pt-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg mb-2">No staff members found</CardTitle>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria or filters.</p>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Staff Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredStaff.map((staff) => (
            <Card
              key={staff.id}
              className="hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                        {staff.firstName?.[0]}{staff.lastName?.[0]}
                      </div>
                    </div>
                    
                    {/* Staff Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                          {staff.firstName} {staff.lastName}
                        </h3>
                        <Badge className={getRoleBadgeColor(staff.role)}>
                          {staff.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant={staff.isActive ? 'default' : 'secondary'} className={staff.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-100'}>
                          {staff.isActive ? '● Active' : '● Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Email:</span>
                          <span>{staff.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">App:</span>
                          <span className="capitalize">{staff.applicationId.replace('-app', '').replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Last Login:</span>
                          <span>{formatLastLogin(staff.lastLoginAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group">
                      <MoreHorizontal className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Enhanced Pagination */}
      <Card className="mt-6">
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">1</span> to <span className="font-semibold text-foreground">{filteredStaff.length}</span> of{' '}
              <span className="font-semibold text-foreground">{filteredStaff.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffList;