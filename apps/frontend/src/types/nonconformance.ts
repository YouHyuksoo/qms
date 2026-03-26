/**
 * Nonconformance Module Types
 */

export enum NcrStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DISPOSITION_DECIDED = 'DISPOSITION_DECIDED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DefectType {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
}

export enum NcrSource {
  INSPECTION = 'INSPECTION',
  AUDIT = 'AUDIT',
  COMPLAINT = 'COMPLAINT',
  INTERNAL = 'INTERNAL',
  SUPPLIER = 'SUPPLIER',
}

export enum DispositionType {
  REWORK = 'REWORK',
  REPAIR = 'REPAIR',
  USE_AS_IS = 'USE_AS_IS',
  SCRAP = 'SCRAP',
  RTV = 'RTV',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Ncr {
  ncrNo: string;
  title: string;
  description?: string;
  occurrenceDate?: string;
  lotNo?: string;
  itemCode?: string;
  itemName?: string;
  defectQty: number;
  defectType?: DefectType;
  status: NcrStatus;
  source?: NcrSource;
  reportedBy?: string;
  reportedDate?: string;
  assignedTo?: string;
  dueDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  closedDate?: string;
  closedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  mrbReviews?: MrbReview[];
}

export interface MrbReview {
  reviewId: string;
  ncrNo: string;
  reviewedBy: string;
  reviewDate: string;
  disposition?: DispositionType;
  reason?: string;
  approvedBy?: string;
  approvedDate?: string;
  status: ReviewStatus;
  executionDate?: string;
  executionResult?: string;
  executedBy?: string;
  attachments?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNcrRequest {
  ncrNo: string;
  title: string;
  description?: string;
  occurrenceDate?: string;
  lotNo?: string;
  itemCode?: string;
  itemName?: string;
  defectQty?: number;
  defectType?: DefectType;
  source?: NcrSource;
  reportedBy?: string;
  reportedDate?: string;
  assignedTo?: string;
  dueDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  remarks?: string;
  createdBy?: string;
}

export interface UpdateNcrRequest {
  title?: string;
  description?: string;
  defectQty?: number;
  defectType?: DefectType;
  status?: NcrStatus;
  assignedTo?: string;
  dueDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  closedDate?: string;
  closedBy?: string;
  remarks?: string;
  updatedBy?: string;
}

export interface CreateMrbReviewRequest {
  reviewId: string;
  ncrNo: string;
  reviewedBy: string;
  reviewDate: string;
  disposition?: DispositionType;
  reason?: string;
  approvedBy?: string;
  approvedDate?: string;
  status?: ReviewStatus;
  attachments?: string;
  remarks?: string;
  createdBy?: string;
}

export interface ExecuteDispositionRequest {
  executionResult: string;
  executedBy?: string;
  executionDate?: string;
  updatedBy?: string;
}

export interface NcrQueryParams {
  ncrNo?: string;
  title?: string;
  lotNo?: string;
  itemCode?: string;
  itemName?: string;
  status?: NcrStatus;
  defectType?: DefectType;
  source?: NcrSource;
  reportedBy?: string;
  assignedTo?: string;
  occurrenceDateFrom?: string;
  occurrenceDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface NcrStatistics {
  totalNcrs: number;
  byStatus: Record<NcrStatus, number>;
  byDefectType: Record<DefectType, number>;
  bySource: Record<NcrSource, number>;
  openNcrs: number;
  closedNcrs: number;
}

export interface PaginatedNcrs {
  items: Ncr[];
  total: number;
  page: number;
  limit: number;
}
