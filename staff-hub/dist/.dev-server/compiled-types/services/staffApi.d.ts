export declare const uploadStaffDocuments: (staffId: string, files: File[]) => Promise<any[]>;
export declare const getStaffDocuments: (staffId: string) => Promise<any>;
export declare const deleteStaffDocument: (staffId: string, bucket: string, path: string) => Promise<any>;
export declare const generateStaffDocumentPresignedURL: (staffId: string, path: string, method?: string, expiresIn?: number) => Promise<any>;
export declare const staffApi: import("@workspace/shared").StaffApiClient;
export default staffApi;
//# sourceMappingURL=staffApi.d.ts.map