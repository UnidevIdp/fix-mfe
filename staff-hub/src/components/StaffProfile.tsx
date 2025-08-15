import React from 'react';
import { Staff } from '@workspace/api-contracts';
import { Card, CardContent, CardHeader, Badge, Avatar, AvatarFallback, AvatarImage } from '@workspace/ui';
import { Mail, Phone, Building2, Calendar, User, Award, MapPin, Clock } from 'lucide-react';

interface StaffProfileProps {
  staff: Staff | null;
}

export const StaffProfile: React.FC<StaffProfileProps> = ({ staff }) => {
  if (!staff) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-gray-700 dark:text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            No Staff Selected
          </h3>
          <p className="text-sm text-gray-800 dark:text-gray-300">
            Choose a team member from the list to view their profile
          </p>
        </CardContent>
      </Card>
    );
  }

  const initials = `${staff.firstName?.[0] || '?'}${staff.lastName?.[0] || '?'}`.toUpperCase();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage 
                src={staff.profilePhotoUrl} 
                alt={`${staff.firstName || 'Unknown'} ${staff.lastName || 'User'}`}
              />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicator */}
            <div className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-background shadow-sm ${
              staff.isActive 
                ? 'bg-green-500' 
                : 'bg-gray-400'
            }`} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {staff.firstName || 'Unknown'} {staff.lastName || 'User'}
              </h2>
              
              {/* Role badge */}
              <Badge 
                variant={staff.role === 'manager' ? 'default' : 'secondary'}
                className="capitalize font-medium"
              >
                {staff.role || 'N/A'}
              </Badge>
              
              {/* Active status badge */}
              <Badge 
                variant={staff.isActive ? 'default' : 'outline'}
                className={`font-medium ${
                  staff.isActive 
                    ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700' 
                    : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                }`}
              >
                {staff.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                <Mail className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <span>{staff.email || 'No email'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                <Phone className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <span>{staff.phoneNumber || 'No phone number'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <User className="h-3 w-3" />
                Employee ID
              </div>
              <p className="text-sm font-bold text-black dark:text-white">
                {staff.employeeId || 'N/A'}
              </p>
            </div>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Building2 className="h-3 w-3" />
                Department
              </div>
              <p className="text-sm font-bold text-black dark:text-white">
                {staff.departmentId || 'No Department'}
              </p>
            </div>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Clock className="h-3 w-3" />
                Employment Type
              </div>
              <p className="text-sm font-bold text-black dark:text-white capitalize">
                {staff.employmentType?.replace('_', ' ') || 'N/A'}
              </p>
            </div>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Calendar className="h-3 w-3" />
                Start Date
              </div>
              <p className="text-sm font-bold text-black dark:text-white">
                {staff.startDate ? new Date(staff.startDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </Card>
        </div>

        {/* Skills Section */}
        {staff.skills && staff.skills.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-black dark:text-white">
                Skills & Expertise
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {staff.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200 transition-colors dark:bg-blue-900/50 dark:text-blue-100 dark:border-blue-700 dark:hover:bg-blue-900/70"
                >
                  <span>{skill.name}</span>
                  <Badge 
                    variant="default"
                    className="ml-2 px-2 py-0 text-xs capitalize bg-blue-700 text-white dark:bg-blue-600 dark:text-white font-bold"
                  >
                    {skill.level}
                  </Badge>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffProfile;