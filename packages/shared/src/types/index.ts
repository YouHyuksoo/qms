// Common types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditFields {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
