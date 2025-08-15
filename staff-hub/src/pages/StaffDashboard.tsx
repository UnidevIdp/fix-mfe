import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Shield, Activity } from 'lucide-react';
import { useStaff } from '../hooks/useStaff';
import { Button } from '@workspace/ui';
import { Card, CardContent } from '@workspace/ui';
import StaffList from './StaffList';

const StaffDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'list'>('overview');
  const { staff } = useStaff();

  // Show the existing StaffList component when in list mode
  if (viewMode === 'list') {
    return (
      <div>
        <div className="mb-4">
          <Button variant="outline" onClick={() => setViewMode('overview')}>
            ← Back to Dashboard
          </Button>
        </div>
        <StaffList />
      </div>
    );
  }

  const analytics = {
    total: staff.length,
    active: staff.filter(s => s.isActive).length,
    inactive: staff.filter(s => !s.isActive).length,
    admins: staff.filter(s => s.role === 'admin' || s.role === 'super_admin').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management Dashboard</h2>
          <p className="text-gray-600">Manage staff across all domains and applications</p>
        </div>
        <Button onClick={() => setViewMode('list')} className="bg-blue-600 hover:bg-blue-700">
          <Users className="h-4 w-4 mr-2" />
          View Staff List
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Inactive Staff</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-4 h-auto flex-col items-start space-y-2 hover:bg-gray-50 transition-colors"
              onClick={() => setViewMode('list')}
            >
              <div className="flex items-center w-full">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">View All Staff</h4>
                  <p className="text-sm text-gray-600">Browse and search staff members with advanced filters</p>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="p-4 h-auto flex-col items-start space-y-2 hover:bg-gray-50 transition-colors"
              onClick={() => setViewMode('list')}
            >
              <div className="flex items-center w-full">
                <UserPlus className="h-5 w-5 text-green-600 mr-3" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Add New Staff</h4>
                  <p className="text-sm text-gray-600">Access staff management to add new members</p>
                </div>
              </div>
            </Button>

            <Link to="/staff">
              <Button
                variant="outline"
                className="p-4 h-auto flex-col items-start space-y-2 hover:bg-gray-50 transition-colors w-full"
              >
                <div className="flex items-center w-full">
                  <Shield className="h-5 w-5 text-purple-600 mr-3" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">Staff List View</h4>
                    <p className="text-sm text-gray-600">Simple list view with search</p>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {staff.slice(0, 3).map((member, index) => (
              <div key={member.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-gray-900">{member.firstName} {member.lastName} - {member.role}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            {staff.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No staff data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;