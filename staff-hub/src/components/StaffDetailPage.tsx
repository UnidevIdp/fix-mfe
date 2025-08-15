import React, { useState, useEffect } from 'react';
import { Staff, UpdateStaffRequest } from '@workspace/api-contracts';
import { defaultStaffApiClient, DefaultLoadingSpinner } from '@workspace/shared';
import { Button, Card, CardContent, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Badge, Input, Label, Textarea } from '@workspace/ui';
import { ArrowLeft, Edit, Trash2, Save, X, User, Mail, Phone, Building2, Calendar, MapPin, Briefcase, Clock, CheckCircle, XCircle, Award, FileText, Download, Eye } from 'lucide-react';

interface StaffDetailPageProps {
  staffId: string;
  onBack?: () => void;
  onEdit?: (staff: Staff) => void;
  onEditMode?: () => void;
  onDelete?: (staffId: string) => void;
}

interface StaffDetailState {
  staff: Staff | null;
  loading: boolean;
  error: string | null;
  editing: boolean;
  saving: boolean;
}

export const StaffDetailPage: React.FC<StaffDetailPageProps> = ({
  staffId,
  onBack,
  onEdit,
  onEditMode,
  onDelete
}) => {
  const [state, setState] = useState<StaffDetailState>({
    staff: null,
    loading: true,
    error: null,
    editing: false,
    saving: false
  });

  const [editForm, setEditForm] = useState<UpdateStaffRequest>({});

  // Load staff data
  useEffect(() => {
    const loadStaff = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await defaultStaffApiClient.getStaff(staffId);
        
        if (response.success && response.data) {
          // Check if URL indicates edit mode
          const isEditMode = window.location.pathname.includes('/edit');
          
          setState(prev => ({ 
            ...prev, 
            staff: response.data, 
            loading: false,
            editing: isEditMode 
          }));
          
          // Initialize edit form
          setEditForm({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            departmentId: response.data.departmentId,
            isActive: response.data.isActive
          });
        } else {
          throw new Error(response.error?.message || 'Failed to load staff data');
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Failed to load staff', 
          loading: false 
        }));
      }
    };

    if (staffId) {
      loadStaff();
    }
  }, [staffId]);

  const handleEdit = () => {
    if (onEditMode) {
      // Use URL-based navigation for edit mode
      onEditMode();
    } else {
      // Fallback to inline editing
      setState(prev => ({ ...prev, editing: true }));
    }
  };

  const handleCancelEdit = () => {
    setState(prev => ({ ...prev, editing: false }));
    if (state.staff) {
      setEditForm({
        firstName: state.staff.firstName,
        lastName: state.staff.lastName,
        email: state.staff.email,
        phoneNumber: state.staff.phoneNumber,
        departmentId: state.staff.departmentId,
        isActive: state.staff.isActive
      });
    }
  };

  const handleSave = async () => {
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      const response = await defaultStaffApiClient.updateStaff(staffId, editForm);
      
      if (response.success && response.data) {
        setState(prev => ({ 
          ...prev, 
          staff: response.data, 
          editing: false, 
          saving: false 
        }));
        
        onEdit?.(response.data);
      } else {
        throw new Error('Failed to update staff data');
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update staff', 
        saving: false 
      }));
    }
  };

  const handleDelete = async () => {
    if (!state.staff || !confirm(`Are you sure you want to delete ${state.staff.firstName} ${state.staff.lastName}?`)) return;
    
    try {
      setState(prev => ({ ...prev, saving: true }));
      
      await defaultStaffApiClient.deleteStaff(staffId);
      
      onDelete?.(staffId);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete staff', 
        saving: false 
      }));
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-center h-64">
            <DefaultLoadingSpinner size="lg" text="Loading staff details..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-6 py-6">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Staff</h3>
                <p className="text-sm text-muted-foreground mb-4">{state.error}</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.reload()} variant="default" size="sm">
                    Try Again
                  </Button>
                  {onBack && (
                    <Button onClick={onBack} variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to List
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!state.staff) return null;

  const { staff } = state;
  const initials = `${staff.firstName?.[0] || '?'}${staff.lastName?.[0] || '?'}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="w-full px-6 py-6">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Staff Directory
              </Button>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {!state.editing ? (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                    className="bg-destructive/30 hover:bg-destructive/50 text-primary-foreground border border-destructive/50 backdrop-blur-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={state.saving}
                    variant="default"
                    size="sm"
                    className="bg-emerald-500/30 hover:bg-emerald-500/50 text-primary-foreground border border-emerald-400/50 backdrop-blur-sm font-medium disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {state.saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={state.saving}
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm font-medium disabled:opacity-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary-foreground/30 shadow-2xl ring-4 ring-primary-foreground/10 hover:scale-105 transition-transform duration-300">
                <AvatarImage 
                  src={staff.profilePhotoUrl} 
                  alt={`${staff.firstName} ${staff.lastName}`}
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/30 text-primary-foreground backdrop-blur-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Status indicator with glow */}
              <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-primary-foreground shadow-lg ${
                staff.isActive 
                  ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' 
                  : 'bg-slate-400 shadow-slate-400/50'
              }`}>
                <div className={`absolute inset-0 rounded-full ${
                  staff.isActive ? 'bg-emerald-400 animate-ping' : ''
                }`} />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-primary-foreground">
                  {staff.firstName} {staff.lastName}
                </h1>
                
                <Badge 
                  variant={staff.role === 'manager' ? 'default' : 'secondary'}
                  className={`capitalize font-medium backdrop-blur-sm transition-all duration-200 ${
                    staff.role === 'manager' 
                      ? 'bg-amber-500/30 text-amber-100 border-amber-400/50 shadow-lg shadow-amber-500/20' 
                      : 'bg-secondary/30 text-primary-foreground border-secondary/50'
                  }`}
                >
                  {staff.role === 'manager' ? '👑 Manager' : '👤 Employee'}
                </Badge>
                
                <Badge 
                  variant={staff.isActive ? 'default' : 'outline'}
                  className={`font-medium transition-all duration-200 backdrop-blur-sm ${
                    staff.isActive 
                      ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50 shadow-lg shadow-emerald-500/20 animate-pulse' 
                      : 'bg-slate-500/30 text-slate-300 border-slate-400/50'
                  }`}
                >
                  {staff.isActive ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ✨ Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      ⏸️ Inactive
                    </>
                  )}
                </Badge>
              </div>
              
              <div className="space-y-1 text-primary-foreground/90">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{staff.email || 'No email'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>{staff.phoneNumber || 'No phone number'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-6 space-y-6">
        {/* Quick Info Cards - All in single row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Employee ID */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  <User className="h-4 w-4" />
                  Employee ID
                </div>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {staff.employeeId || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Start Date */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </div>
                <p className="text-lg font-bold text-amber-800 dark:text-amber-200">
                  {staff.startDate ? new Date(staff.startDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Department */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  <Building2 className="h-4 w-4" />
                  Department
                </div>
                <p className="text-sm font-bold text-purple-800 dark:text-purple-200">
                  {staff.departmentId || 'No Department'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Employment Type */}
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  <Clock className="h-4 w-4" />
                  Employment Type
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 capitalize">
                  {staff.employmentType?.replace('_', ' ') || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Manager Card */}
          {staff.managerId && (
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-50/50 to-rose-100/30 dark:from-rose-950/30 dark:to-rose-900/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                    <User className="h-4 w-4" />
                    Manager
                  </div>
                  <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
                    {staff.managerId}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Card */}
          {staff.locationId && (
            <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50/50 to-teal-100/30 dark:from-teal-950/30 dark:to-teal-900/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="text-sm font-bold text-teal-800 dark:text-teal-200">
                    {staff.locationId}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Combined Information Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-primary bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {state.editing ? (
                  <Input
                    id="firstName"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.firstName || 'N/A'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {state.editing ? (
                  <Input
                    id="lastName"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.lastName || 'N/A'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {state.editing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.email || 'N/A'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {state.editing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.phoneNumber || 'N/A'}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              {staff.mobileNumber && (
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.mobileNumber}
                  </p>
                </div>
              )}

              {/* Alternate Email */}
              {staff.alternateEmail && (
                <div className="space-y-2">
                  <Label>Alternate Email</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.alternateEmail}
                  </p>
                </div>
              )}

              {/* Display Name */}
              {staff.displayName && (
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.displayName}
                  </p>
                </div>
              )}
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-secondary bg-gradient-to-br from-card to-card/50">
          <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-b border-secondary/20">
            <CardTitle className="flex items-center gap-2 text-secondary-foreground">
              <Briefcase className="h-5 w-5" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {state.editing ? (
                  <Input
                    id="department"
                    value={editForm.departmentId || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, departmentId: e.target.value }))}
                    placeholder="Enter department"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.departmentId || 'N/A'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {state.editing ? (
                  <select
                    id="status"
                    value={editForm.isActive?.toString() || 'true'}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, isActive: e.target.value === 'true' }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </p>
                )}
              </div>

              {/* Team ID */}
              {staff.teamId && (
                <div className="space-y-2">
                  <Label>Team</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.teamId}
                  </p>
                </div>
              )}

              {/* Cost Center */}
              {staff.costCenter && (
                <div className="space-y-2">
                  <Label>Cost Center</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {staff.costCenter}
                  </p>
                </div>
              )}

              {/* End Date */}
              {staff.endDate && (
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {new Date(staff.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Probation End Date */}
              {staff.probationEndDate && (
                <div className="space-y-2">
                  <Label>Probation End Date</Label>
                  <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                    {new Date(staff.probationEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Skills Section */}
        {staff.skills && staff.skills.length > 0 && (
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10 border-b border-accent/20">
              <CardTitle className="flex items-center gap-2 text-accent-foreground">
                <CheckCircle className="h-5 w-5" />
                ⭐ Skills & Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {staff.skills.map((skill: any, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-300/30 dark:border-blue-700/30 hover:shadow-md transition-all duration-200 hover:scale-105"
                  >
                    <span className="text-blue-700 dark:text-blue-300">💼 {skill.name}</span>
                    <Badge 
                      variant="default"
                      className={`ml-2 px-2 py-0 text-xs capitalize ${
                        skill.level === 'expert' ? 'bg-emerald-500 text-white' :
                        skill.level === 'advanced' ? 'bg-blue-500 text-white' :
                        skill.level === 'intermediate' ? 'bg-amber-500 text-white' :
                        'bg-slate-500 text-white'
                      }`}
                    >
                      {skill.level === 'expert' ? '🚀 Expert' :
                       skill.level === 'advanced' ? '⭐ Advanced' :
                       skill.level === 'intermediate' ? '📈 Intermediate' :
                       '🌱 ' + skill.level}
                    </Badge>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information Layout - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certifications Section */}
          {staff.certifications && staff.certifications.length > 0 && (
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-orange-500 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-500/10 border-b border-orange-500/20">
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Award className="h-5 w-5" />
                  🏆 Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {staff.certifications.map((cert: any, index: number) => (
                    <div key={index} className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-gradient-to-br from-orange-50/30 to-orange-100/20 dark:from-orange-950/20 dark:to-orange-900/10">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200">{cert.name}</h4>
                        <p className="text-sm text-orange-600 dark:text-orange-400">Issued by: {cert.issuedBy}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                          {cert.expiresAt && (
                            <span>Expires: {new Date(cert.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                        {cert.credentialId && (
                          <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {cert.verificationUrl && (
                            <Button size="sm" variant="outline" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                          )}
                          {cert.documentUrl && (
                            <Button size="sm" variant="outline" className="text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              Document
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity & Security Section */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-slate-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-slate-500/5 to-slate-500/10 border-b border-slate-500/20">
              <CardTitle className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="h-5 w-5" />
                🔒 Activity & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-4">
                {staff.lastLoginAt && (
                  <div className="space-y-2">
                    <Label>Last Login</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {new Date(staff.lastLoginAt).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {staff.lastActivityAt && (
                  <div className="space-y-2">
                    <Label>Last Activity</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {new Date(staff.lastActivityAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {staff.isVerified !== undefined && (
                  <div className="space-y-2">
                    <Label>Account Verified</Label>
                    <div className="py-2 px-3 bg-muted/50 rounded-md">
                      <Badge variant={staff.isVerified ? "default" : "secondary"} className={
                        staff.isVerified ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : ""
                      }>
                        {staff.isVerified ? "✅ Verified" : "❌ Not Verified"}
                      </Badge>
                    </div>
                  </div>
                )}

                {staff.twoFactorEnabled !== undefined && (
                  <div className="space-y-2">
                    <Label>Two-Factor Authentication</Label>
                    <div className="py-2 px-3 bg-muted/50 rounded-md">
                      <Badge variant={staff.twoFactorEnabled ? "default" : "secondary"} className={
                        staff.twoFactorEnabled ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" : ""
                      }>
                        {staff.twoFactorEnabled ? "🔐 Enabled" : "🔓 Disabled"}
                      </Badge>
                    </div>
                  </div>
                )}

                {staff.timezone && (
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {staff.timezone}
                    </p>
                  </div>
                )}

                {staff.locale && (
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <p className="text-sm font-medium text-foreground py-2 px-3 bg-muted/50 rounded-md">
                      {staff.locale}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section Layout - Documents, Notes, Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents Section */}
          <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-indigo-500 bg-gradient-to-br from-card to-card/50">
            <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 border-b border-indigo-500/20">
              <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
                📄 Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Document management integration</p>
                <p className="text-xs mt-2">Connect to staff document storage</p>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {staff.notes ? (
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-yellow-500 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 border-b border-yellow-500/20">
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <FileText className="h-5 w-5" />
                  📝 Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{staff.notes}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-yellow-500 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 border-b border-yellow-500/20">
                <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <FileText className="h-5 w-5" />
                  📝 Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No notes available</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags Section */}
          {staff.tags && staff.tags.length > 0 ? (
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-pink-500 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-pink-500/5 to-pink-500/10 border-b border-pink-500/20">
                <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                  <CheckCircle className="h-5 w-5" />
                  🏷️ Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {staff.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 text-pink-800 dark:text-pink-200 border border-pink-300 dark:border-pink-700"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-pink-500 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="bg-gradient-to-r from-pink-500/5 to-pink-500/10 border-b border-pink-500/20">
                <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                  <CheckCircle className="h-5 w-5" />
                  🏷️ Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No tags available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage;