import { defaultStaffApiClient } from '@workspace/shared';

// Helper function to get tenant ID with fallback to UUID format
const getTenantId = (): string => {
  const tenantId = localStorage.getItem('tenantId');
  // If no tenantId or it's the old default-tenant, use UUID format
  if (!tenantId || tenantId === 'default-tenant') {
    return '00000000-0000-0000-0000-000000000001';
  }
  return tenantId;
};

// Document upload functionality
export const uploadStaffDocuments = async (staffId: string, files: File[]): Promise<any[]> => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('staff_id', staffId);
    formData.append('isPublic', 'false');
    formData.append('tags', `document_type:staff_document,uploaded_at:${new Date().toISOString()}`);

    const response = await fetch('/api/v1/staff/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'X-Tenant-ID': getTenantId(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}: ${response.statusText}`);
    }

    return response.json();
  });

  return Promise.all(uploadPromises);
};

// Get staff documents
export const getStaffDocuments = async (staffId: string): Promise<any> => {
  const response = await fetch(`/api/v1/staff/${staffId}/documents`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-Tenant-ID': localStorage.getItem('tenantId') || '',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get staff documents: ${response.statusText}`);
  }

  return response.json();
};

// Delete staff document
export const deleteStaffDocument = async (staffId: string, bucket: string, path: string): Promise<any> => {
  const response = await fetch(`/api/v1/staff/${staffId}/documents/${bucket}/${path}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-Tenant-ID': localStorage.getItem('tenantId') || '',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete document: ${response.statusText}`);
  }

  return response.json();
};

// Generate presigned URL for staff document
export const generateStaffDocumentPresignedURL = async (
  staffId: string, 
  path: string, 
  method: string = 'GET', 
  expiresIn: number = 3600
): Promise<any> => {
  const response = await fetch(`/api/v1/staff/${staffId}/documents/presigned-url`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-Tenant-ID': localStorage.getItem('tenantId') || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      path,
      bucket: 'staff-documents',
      method,
      expiresIn,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate presigned URL: ${response.statusText}`);
  }

  return response.json();
};

// Re-export the shared staff API client as the default for this MFE
export const staffApi = defaultStaffApiClient;
export default staffApi;