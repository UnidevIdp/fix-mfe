import React, { useState } from 'react';
import { Staff, StaffRole, EmploymentType, CreateStaffRequest } from '@workspace/api-contracts';
import { Spinner } from '@workspace/ui';

interface StaffFormProps {
  staff?: Staff;
  onSubmit: (data: CreateStaffRequest | Partial<Staff>) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

interface FormErrors {
  [key: string]: string;
}

export const StaffForm: React.FC<StaffFormProps> = ({ 
  staff, 
  onSubmit, 
  onCancel,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    firstName: staff?.firstName || '',
    lastName: staff?.lastName || '',
    email: staff?.email || '',
    phoneNumber: staff?.phoneNumber || '',
    employeeId: staff?.employeeId || '',
    role: staff?.role || StaffRole.EMPLOYEE,
    employmentType: staff?.employmentType || EmploymentType.FULL_TIME,
    departmentId: staff?.departmentId || '',
    startDate: staff?.startDate || '',
    endDate: staff?.endDate || '',
    jobTitle: staff?.jobTitle || '',
    managerId: staff?.managerId || '',
    salary: staff?.salary || '',
    address: staff?.address || '',
    emergencyContact: staff?.emergencyContact || '',
    emergencyPhone: staff?.emergencyPhone || '',
    birthDate: staff?.birthDate || '',
    nationality: staff?.nationality || '',
    skillsAndCertifications: staff?.skillsAndCertifications || '',
    notes: staff?.notes || '',
    isActive: staff?.isActive ?? true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

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
      
      case 'phoneNumber':
      case 'emergencyPhone':
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      case 'employeeId':
        if (value && value.length < 3) return 'Employee ID must be at least 3 characters';
        return '';
      
      case 'jobTitle':
        if (!value.trim()) return 'Job title is required';
        return '';
      
      case 'salary':
        if (value && (isNaN(value) || Number(value) < 0)) return 'Please enter a valid salary amount';
        return '';
      
      case 'emergencyContact':
        if (value && value.length < 2) return 'Emergency contact name must be at least 2 characters';
        return '';
      
      case 'startDate':
        if (!value) return 'Start date is required';
        if (new Date(value) > new Date()) return 'Start date cannot be in the future';
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as {[key: string]: boolean});
    setTouched(allTouched);
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const getFieldStyle = (fieldName: string) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return {
      padding: '0.75rem',
      border: `2px solid ${hasError 
        ? 'var(--staff-form-error-border, #ef4444)' 
        : 'var(--staff-form-border, hsl(var(--border)))'
      }`,
      borderRadius: '0.5rem',
      backgroundColor: 'var(--staff-form-input-bg, hsl(var(--background)))',
      color: 'var(--staff-form-input-text, hsl(var(--foreground)))',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease-in-out',
      width: '100%'
    };
  };

  const renderField = (
    name: string,
    label: string,
    type: string = 'text',
    required: boolean = false,
    options?: { value: string; label: string }[]
  ) => {
    const fieldError = touched[name] && errors[name];
    
    return (
      <div key={name}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--staff-form-label-color, hsl(var(--foreground)))',
          marginBottom: '0.5rem'
        }}>
          {label} {required && <span style={{ color: 'var(--staff-form-required-color, #ef4444)' }}>*</span>}
        </label>
        
        {options ? (
          <select
            name={name}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={loading}
            style={getFieldStyle(name)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--staff-form-focus-border, hsl(var(--primary)))';
              e.target.style.boxShadow = 'var(--staff-form-focus-shadow, 0 0 0 3px hsl(var(--primary)) / 0.1)';
            }}
            onBlur={(e) => {
              handleBlur(e);
              e.target.style.borderColor = fieldError 
                ? 'var(--staff-form-error-border, #ef4444)'
                : 'var(--staff-form-border, hsl(var(--border)))';
              e.target.style.boxShadow = 'none';
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name={name}
              checked={formData[name as keyof typeof formData] as boolean}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: '1rem',
                height: '1rem',
                accentColor: 'var(--staff-form-checkbox-color, hsl(var(--primary)))'
              }}
            />
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--staff-form-checkbox-label, hsl(var(--foreground)))'
            }}>
              {label}
            </span>
          </div>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            disabled={loading}
            placeholder={`Enter ${label.toLowerCase()}`}
            style={getFieldStyle(name)}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--staff-form-focus-border, hsl(var(--primary)))';
              e.target.style.boxShadow = 'var(--staff-form-focus-shadow, 0 0 0 3px hsl(var(--primary)) / 0.1)';
            }}
            onBlur={(e) => {
              handleBlur(e);
              e.target.style.borderColor = fieldError 
                ? 'var(--staff-form-error-border, #ef4444)'
                : 'var(--staff-form-border, hsl(var(--border)))';
              e.target.style.boxShadow = 'none';
            }}
          />
        )}
        
        {fieldError && (
          <p style={{
            color: 'var(--staff-form-error-text, #ef4444)',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            ⚠️ {fieldError}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'var(--staff-form-bg, hsl(var(--card)))',
      borderRadius: '1rem',
      border: '1px solid var(--staff-form-container-border, hsl(var(--border)))',
      boxShadow: 'var(--staff-form-shadow, 0 4px 6px -1px rgb(0 0 0 / 0.1))'
    }}>
      <div style={{
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--staff-form-divider, hsl(var(--border)))'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--staff-form-title-color, hsl(var(--foreground)))',
          margin: '0 0 0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {staff ? '✏️ Edit Staff Member' : '➕ Add New Staff Member'}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--staff-form-subtitle-color, hsl(var(--muted-foreground)))',
          margin: 0
        }}>
          {staff ? 'Update the information below to modify this staff member.' : 'Fill in the details below to add a new team member.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={className}>
        {/* Basic Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--staff-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--staff-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            👤 Basic Information
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {renderField('firstName', 'First Name', 'text', true)}
            {renderField('lastName', 'Last Name', 'text', true)}
            {renderField('email', 'Email Address', 'email', true)}
            {renderField('phoneNumber', 'Phone Number', 'tel')}
            {renderField('birthDate', 'Date of Birth', 'date')}
            {renderField('nationality', 'Nationality', 'text')}
          </div>
        </div>

        {/* Employment Details Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--staff-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--staff-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            💼 Employment Details
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {renderField('employeeId', 'Employee ID', 'text')}
            {renderField('jobTitle', 'Job Title', 'text', true)}
            {renderField('role', 'Role', 'select', true, [
              { value: 'employee', label: 'Employee' },
              { value: 'manager', label: 'Manager' },
              { value: 'intern', label: 'Intern' },
              { value: 'contractor', label: 'Contractor' }
            ])}
            {renderField('employmentType', 'Employment Type', 'select', true, [
              { value: 'full_time', label: 'Full Time' },
              { value: 'part_time', label: 'Part Time' },
              { value: 'contract', label: 'Contract' },
              { value: 'intern', label: 'Intern' }
            ])}
            {renderField('departmentId', 'Department', 'select', false, [
              { value: '', label: 'Select Department' },
              { value: 'Engineering', label: 'Engineering' },
              { value: 'Sales', label: 'Sales' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'HR', label: 'Human Resources' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Operations', label: 'Operations' },
              { value: 'IT', label: 'Information Technology' }
            ])}
            {renderField('managerId', 'Manager', 'select', false, [
              { value: '', label: 'Select Manager' },
              { value: 'manager1', label: 'John Smith (Engineering Manager)' },
              { value: 'manager2', label: 'Sarah Johnson (Sales Manager)' },
              { value: 'manager3', label: 'Mike Wilson (HR Manager)' }
            ])}
            {renderField('startDate', 'Start Date', 'date', true)}
            {renderField('endDate', 'End Date', 'date')}
            {renderField('salary', 'Annual Salary ($)', 'number')}
          </div>
        </div>

        {/* Contact & Emergency Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--staff-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--staff-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📞 Contact & Emergency Information
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {renderField('address', 'Address', 'text')}
            {renderField('emergencyContact', 'Emergency Contact Name', 'text')}
            {renderField('emergencyPhone', 'Emergency Contact Phone', 'tel')}
          </div>
        </div>

        {/* Additional Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--staff-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--staff-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📋 Additional Information
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--staff-form-label-color, hsl(var(--foreground)))',
                marginBottom: '0.5rem'
              }}>
                Skills & Certifications
              </label>
              <textarea
                name="skillsAndCertifications"
                value={formData.skillsAndCertifications}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                placeholder="List relevant skills, certifications, and qualifications..."
                rows={3}
                style={{
                  ...getFieldStyle('skillsAndCertifications'),
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
              {touched.skillsAndCertifications && errors.skillsAndCertifications && (
                <p style={{
                  color: 'var(--staff-form-error-text, #ef4444)',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⚠️ {errors.skillsAndCertifications}
                </p>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--staff-form-label-color, hsl(var(--foreground)))',
                marginBottom: '0.5rem'
              }}>
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                placeholder="Additional notes or comments about this staff member..."
                rows={3}
                style={{
                  ...getFieldStyle('notes'),
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
              {touched.notes && errors.notes && (
                <p style={{
                  color: 'var(--staff-form-error-text, #ef4444)',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  ⚠️ {errors.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--staff-form-section-title, hsl(var(--foreground)))',
            margin: '0 0 1rem',
            padding: '0.5rem 0',
            borderBottom: '2px solid var(--staff-form-section-border, hsl(var(--primary)))',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ⚙️ Status
          </h4>
          {renderField('isActive', 'Active Employee', 'checkbox')}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--staff-form-divider, hsl(var(--border)))'
        }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid var(--staff-form-cancel-border, hsl(var(--border)))',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--staff-form-cancel-bg, hsl(var(--background)))',
                color: 'var(--staff-form-cancel-text, hsl(var(--foreground)))',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease-in-out',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--staff-form-cancel-hover-bg, hsl(var(--muted)))';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = 'var(--staff-form-cancel-bg, hsl(var(--background)))';
                }
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: loading 
                ? 'var(--staff-form-submit-disabled-bg, hsl(var(--muted)))'
                : 'var(--staff-form-submit-bg, hsl(var(--primary)))',
              color: 'var(--staff-form-submit-text, hsl(var(--primary-foreground)))',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.8 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--staff-form-submit-hover-bg, hsl(var(--primary)) / 0.9)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = 'var(--staff-form-submit-bg, hsl(var(--primary)))';
              }
            }}
          >
            {loading && <Spinner size="sm" />}
            {loading ? 'Saving...' : (staff ? '💾 Update Staff' : '✅ Create Staff')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;