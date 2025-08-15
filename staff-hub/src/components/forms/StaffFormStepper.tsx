import React, { useState, useCallback } from 'react';
import { User, Briefcase, Phone, FileText, Settings, Mail, Calendar, MapPin, Building2, Clock, Users, IdCard, DollarSign, Shield } from 'lucide-react';
import { Staff, StaffRole, EmploymentType, CreateStaffRequest } from '@workspace/api-contracts';
import { Stepper, type StepperStep } from '@workspace/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui';

interface StaffFormStepperProps {
  staff?: Staff;
  onSubmit: (data: CreateStaffRequest | Partial<Staff>, documents?: File[]) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  nationality: string;
  
  // Employment Details
  employeeId: string;
  jobTitle: string;
  role: StaffRole;
  employmentType: EmploymentType;
  departmentId: string;
  managerId: string;
  startDate: string;
  endDate: string;
  salary: string;
  
  // Contact & Emergency
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  
  // Additional Information
  skillsAndCertifications: string;
  notes: string;
  
  // Status
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const StaffFormStepper: React.FC<StaffFormStepperProps> = ({
  staff,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: staff?.firstName || '',
    lastName: staff?.lastName || '',
    email: staff?.email || '',
    phoneNumber: staff?.phoneNumber || '',
    birthDate: staff?.birthDate || '',
    nationality: staff?.nationality || '',
    employeeId: staff?.employeeId || '',
    jobTitle: staff?.jobTitle || '',
    role: staff?.role || 'employee',
    employmentType: staff?.employmentType || 'full_time',
    departmentId: staff?.departmentId || '',
    managerId: staff?.managerId || '',
    startDate: staff?.startDate || '',
    endDate: staff?.endDate || '',
    salary: staff?.salary || '',
    address: staff?.address || '',
    emergencyContact: staff?.emergencyContact || '',
    emergencyPhone: staff?.emergencyPhone || '',
    skillsAndCertifications: staff?.skillsAndCertifications || '',
    notes: staff?.notes || '',
    isActive: staff?.isActive ?? true,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'jobTitle':
        if (!value.trim()) return 'Job title is required';
        return '';
      
      case 'startDate':
        if (!value) return 'Start date is required';
        if (new Date(value) > new Date()) return 'Start date cannot be in the future';
        return '';
      
      case 'phoneNumber':
      case 'emergencyPhone':
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      case 'salary':
        if (value && (isNaN(value) || Number(value) < 0)) return 'Please enter a valid salary amount';
        return '';
      
      case 'endDate':
        if (value && formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          return 'End date must be after start date';
        }
        return '';
      
      case 'birthDate':
        if (value) {
          const today = new Date();
          const birth = new Date(value);
          const age = today.getFullYear() - birth.getFullYear();
          if (age < 16 || age > 100) return 'Please enter a valid birth date';
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateStep = useCallback((stepNumber: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (stepNumber) {
      case 1: // Basic Information
        ['firstName', 'lastName', 'email'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 2: // Employment Details
        ['jobTitle', 'startDate'].forEach(field => {
          const error = validateField(field, formData[field as keyof FormData]);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 3: // Contact & Emergency - optional fields, just validate format
        ['phoneNumber', 'emergencyPhone'].forEach(field => {
          const value = formData[field as keyof FormData];
          if (value) {
            const error = validateField(field, value);
            if (error) newErrors[field] = error;
          }
        });
        break;
      
      case 4: // Additional Information - all optional
        break;
      
      case 5: // Documents - optional
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedDocuments(prev => [...prev, ...files]);
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    onSubmit(formData, uploadedDocuments);
  };

  const renderFormField = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: { value: string; label: string }[],
    description?: string,
    icon?: React.ReactNode
  ) => {
    const fieldError = errors[name];
    const value = formData[name];
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {label} 
          {required && <span className="text-red-500 text-sm">*</span>}
        </label>
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {options ? (
          <select
            name={name}
            value={value as string}
            onChange={handleInputChange}
            required={required}
            disabled={loading}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="flex items-center space-x-3 pt-1">
            <input
              type="checkbox"
              name={name}
              checked={value as boolean}
              onChange={handleInputChange}
              disabled={loading}
              className="w-4 h-4 text-primary focus:ring-primary focus:ring-2 border border-input rounded"
            />
            <span className="text-sm text-foreground">{label}</span>
          </div>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value as string}
            onChange={handleInputChange}
            disabled={loading}
            rows={3}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value as string}
            onChange={handleInputChange}
            required={required}
            disabled={loading}
            placeholder={`Enter ${label.toLowerCase()}`}
            className={`w-full px-3 py-2.5 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              fieldError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
            }`}
          />
        )}
        
        {fieldError && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <span className="text-red-500 text-sm">⚠️</span>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{fieldError}</p>
          </div>
        )}
      </div>
    );
  };

  const steps: StepperStep[] = [
    {
      id: 1,
      title: "Basic Information",
      description: "Personal details and contact",
      icon: User,
      validation: () => validateStep(1),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Basic Information</h3>
            <p className="text-sm text-muted-foreground mt-1">Enter the personal details for this staff member</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Details Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('firstName', 'First Name', 'text', true, undefined, 'Legal first name', <User className="h-3 w-3" />)}
                {renderFormField('lastName', 'Last Name', 'text', true, undefined, 'Legal last name', <User className="h-3 w-3" />)}
                {renderFormField('birthDate', 'Date of Birth', 'date', false, undefined, 'Used for age verification', <Calendar className="h-3 w-3" />)}
                {renderFormField('nationality', 'Nationality', 'text', false, undefined, 'Country of citizenship', <MapPin className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-4 w-4 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('email', 'Email Address', 'email', true, undefined, 'Primary work email address', <Mail className="h-3 w-3" />)}
                {renderFormField('phoneNumber', 'Phone Number', 'tel', false, undefined, 'Contact phone number', <Phone className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Employment Details",
      description: "Job information and hierarchy",
      icon: Briefcase,
      validation: () => validateStep(2),
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Employment Details</h3>
            <p className="text-sm text-muted-foreground mt-1">Configure job information and organizational hierarchy</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Information Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('employeeId', 'Employee ID', 'text', false, undefined, 'Unique identifier for this employee', <IdCard className="h-3 w-3" />)}
                {renderFormField('jobTitle', 'Job Title', 'text', true, undefined, 'Official job position title', <Briefcase className="h-3 w-3" />)}
                {renderFormField('role', 'Role', 'select', true, [
                  { value: 'employee', label: 'Employee' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'intern', label: 'Intern' },
                  { value: 'contractor', label: 'Contractor' }
                ], 'Employee role level', <Shield className="h-3 w-3" />)}
                {renderFormField('employmentType', 'Employment Type', 'select', true, [
                  { value: 'full_time', label: 'Full Time' },
                  { value: 'part_time', label: 'Part Time' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'intern', label: 'Intern' }
                ], 'Type of employment arrangement', <Clock className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Organization & Compensation Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  Organization & Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('departmentId', 'Department', 'select', false, [
                  { value: '', label: 'Select Department' },
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Sales', label: 'Sales' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'HR', label: 'Human Resources' },
                  { value: 'Finance', label: 'Finance' },
                  { value: 'Operations', label: 'Operations' },
                  { value: 'IT', label: 'Information Technology' }
                ], 'Department assignment', <Building2 className="h-3 w-3" />)}
                {renderFormField('managerId', 'Manager', 'select', false, [
                  { value: '', label: 'Select Manager' },
                  { value: 'manager1', label: 'John Smith (Engineering)' },
                  { value: 'manager2', label: 'Sarah Johnson (Sales)' },
                  { value: 'manager3', label: 'Mike Wilson (HR)' }
                ], 'Direct reporting manager', <Users className="h-3 w-3" />)}
                {renderFormField('startDate', 'Start Date', 'date', true, undefined, 'First day of employment', <Calendar className="h-3 w-3" />)}
                {renderFormField('endDate', 'End Date', 'date', false, undefined, 'Last day of employment (if applicable)', <Calendar className="h-3 w-3" />)}
                {renderFormField('salary', 'Annual Salary ($)', 'number', false, undefined, 'Annual compensation amount', <DollarSign className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Contact & Emergency",
      description: "Address and emergency contact",
      icon: Phone,
      validation: () => validateStep(3),
      canSkip: true,
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Contact & Emergency Information</h3>
            <p className="text-sm text-muted-foreground mt-1">Address and emergency contact details (optional)</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Address Information Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-primary" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('address', 'Home Address', 'text', false, undefined, 'Full residential address', <MapPin className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Emergency Contact Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-4 w-4 text-primary" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('emergencyContact', 'Emergency Contact Name', 'text', false, undefined, 'Person to contact in case of emergency', <User className="h-3 w-3" />)}
                {renderFormField('emergencyPhone', 'Emergency Contact Phone', 'tel', false, undefined, 'Emergency contact phone number', <Phone className="h-3 w-3" />)}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Additional Information",
      description: "Skills, notes, and status",
      icon: FileText,
      validation: () => validateStep(4),
      canSkip: true,
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Additional Information</h3>
            <p className="text-sm text-muted-foreground mt-1">Skills, notes, and employee status (optional)</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills & Experience Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Skills & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('skillsAndCertifications', 'Skills & Certifications', 'textarea', false, undefined, 'List relevant skills, certifications, and qualifications', <FileText className="h-3 w-3" />)}
              </CardContent>
            </Card>

            {/* Notes & Status Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4 text-primary" />
                  Notes & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderFormField('notes', 'Additional Notes', 'textarea', false, undefined, 'Any additional information or comments', <FileText className="h-3 w-3" />)}
                <div className="pt-4 border-t border-border">
                  {renderFormField('isActive', 'Active Employee', 'checkbox', false, undefined, 'Check if this employee should be active immediately')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Documents",
      description: "Upload relevant documents",
      icon: Settings,
      validation: () => validateStep(5),
      canSkip: true,
      content: (
        <div className="w-full space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">Document Upload</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload relevant documents like resume, contracts, certificates (optional)</p>
          </div>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all duration-200 bg-muted/30">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer text-sm"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB each)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click to browse or drag and drop files here
                    </p>
                  </div>
                </div>
              </div>

              {uploadedDocuments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Uploaded Documents ({uploadedDocuments.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-foreground truncate font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className={`w-full max-w-none bg-background ${className}`}>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-2xl mx-auto">
          {staff ? 'Update the information below to modify this staff member.' : 'Complete the steps below to add a new team member to your organization.'}
        </p>
      </div>

      <div className="w-full max-w-none">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={handleComplete}
          onCancel={onCancel}
          loading={loading}
          allowSkip={true}
          finishButtonText={staff ? "Update Staff" : "Create Staff"}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default StaffFormStepper;