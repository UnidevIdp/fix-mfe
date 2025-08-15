import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, Shield, Calendar, Activity } from 'lucide-react';

const StaffProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock data - will be replaced with API call
  const staff = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    role: 'admin',
    isActive: true,
    lastLoginAt: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-15T09:00:00Z',
    twoFactorEnabled: true,
    failedLoginAttempts: 0,
    tenantId: 'tenant-1',
    applicationId: 'ecommerce-app',
    vendorId: 'vendor-1'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      employee: 'bg-green-100 text-green-800',
      guest: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Profile</h2>
          <p className="text-gray-600">View and manage staff member details</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Deactivate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {staff.firstName} {staff.lastName}
              </h3>
              <p className="text-gray-600 mb-4">{staff.email}</p>
              
              <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRoleBadgeColor(staff.role)}`}>
                  {staff.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{staff.email}</span>
                </div>
                {staff.phoneNumber && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">{staff.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    2FA {staff.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Activity className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID
                </label>
                <p className="text-sm text-gray-900 font-mono">{staff.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant ID
                </label>
                <p className="text-sm text-gray-900 font-mono">{staff.tenantId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application ID
                </label>
                <p className="text-sm text-gray-900 font-mono">{staff.applicationId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor ID
                </label>
                <p className="text-sm text-gray-900 font-mono">{staff.vendorId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <p className="text-sm text-gray-900">{formatDate(staff.createdAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Login
                </label>
                <p className="text-sm text-gray-900">{formatDate(staff.lastLoginAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Failed Login Attempts
                </label>
                <p className="text-sm text-gray-900">{staff.failedLoginAttempts}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  staff.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                  <p className="text-sm text-gray-600">Add an extra layer of security to this account</p>
                </div>
                <button className={`px-3 py-1 text-sm rounded-full font-medium ${
                  staff.twoFactorEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {staff.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium text-gray-900">Password Reset</h5>
                  <p className="text-sm text-gray-600">Force password reset on next login</p>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full font-medium">
                  Send Reset Email
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium text-gray-900">Session Management</h5>
                  <p className="text-sm text-gray-600">Revoke all active sessions</p>
                </div>
                <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full font-medium">
                  Revoke Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;