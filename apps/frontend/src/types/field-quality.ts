/**
 * Field Quality Module Types
 */

// Customer Complaint Types
export enum ComplaintType {
  QUALITY = 'QUALITY',
  DELIVERY = 'DELIVERY',
  PACKAGING = 'PACKAGING',
  DOCUMENTATION = 'DOCUMENTATION',
  OTHER = 'OTHER',
}

export enum ComplaintSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
}

export enum ComplaintStatus {
  RECEIVED = 'RECEIVED',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  ACTION_PLANNED = 'ACTION_PLANNED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface CustomerComplaint {
  complaintId: string;
  complaintNo: string;
  customerCode: string;
  customerName?: string;
  itemCode?: string;
  itemName?: string;
  occurrenceDate?: string;
  receiptDate: string;
  complaintType: ComplaintType;
  severity?: ComplaintSeverity;
  description: string;
  defectQty: number;
  lotNo?: string;
  status: ComplaintStatus;
  resolution?: string;
  resolvedDate?: string;
  resolvedBy?: string;
  responseTimeHours?: number;
  satisfactionScore?: number;
  reportedBy?: string;
  assignedTo?: string;
  closedDate?: string;
  closedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ComplaintTrend {
  period: string;
  customerCode: string;
  itemCode: string;
  complaintType: string;
  severity: string;
  complaintCount: number;
  totalDefectQty: number;
  avgResponseTime: number;
  avgSatisfaction: number;
}

// Warranty Types
export enum WarrantyStatus {
  ACTIVE = 'ACTIVE',
  CLAIMED = 'CLAIMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface WarrantyRecord {
  warrantyId: string;
  warrantyNo: string;
  itemCode: string;
  itemName?: string;
  serialNo?: string;
  saleDate: string;
  warrantyPeriodMonths: number;
  warrantyExpiryDate: string;
  customerCode: string;
  customerName?: string;
  salesOrderNo?: string;
  invoiceNo?: string;
  status: WarrantyStatus;
  claimDate?: string;
  failureDate?: string;
  failureDescription?: string;
  failurePart?: string;
  failureCause?: string;
  repairCost?: number;
  replacementCost?: number;
  laborCost?: number;
  shippingCost?: number;
  totalCost?: number;
  claimApprovedBy?: string;
  claimApprovedDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface WarrantyPpm {
  period: string;
  itemCode: string;
  totalSales: number;
  warrantyClaims: number;
  ppm: number;
  totalClaimCost: number;
}

// Field Failure Types
export enum TraceabilityStatus {
  TRACED = 'TRACED',
  UNTRACED = 'UNTRACED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface FieldFailure {
  failureId: string;
  failureNo: string;
  complaintId?: string;
  warrantyId?: string;
  itemCode: string;
  itemName?: string;
  lotNo?: string;
  serialNo?: string;
  failureDate: string;
  discoveryDate?: string;
  failureMode: string;
  failureCause?: string;
  failureDetail?: string;
  productionDate?: string;
  productionLine?: string;
  equipmentId?: string;
  equipmentName?: string;
  operatorId?: string;
  operatorName?: string;
  inspectionLotNo?: string;
  rawMaterialLot?: string;
  supplierCode?: string;
  supplierName?: string;
  traceabilityStatus: TraceabilityStatus;
  immediateAction?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  actionDeadline?: string;
  actionCompletedDate?: string;
  actionCompletedBy?: string;
  verificationResult?: string;
  verificationDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FailurePattern {
  failureMode: string;
  failureCause: string;
  itemCode: string;
  productionLine: string;
  equipmentId: string;
  operatorId: string;
  lotNo: string;
  rawMaterialLot: string;
  supplierCode: string;
  failureMonth: string;
  occurrenceCount: number;
  affectedLots: string;
  affectedEquipment: string;
  affectedOperators: string;
}

// Recall Types
export enum RecallRiskLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum RecallStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RecallLotStatus {
  IDENTIFIED = 'IDENTIFIED',
  NOTIFIED = 'NOTIFIED',
  RETURNED = 'RETURNED',
  DESTROYED = 'DESTROYED',
  REPLACED = 'REPLACED',
  REPAIRED = 'REPAIRED',
}

export interface RecallCampaign {
  recallId: string;
  recallNo: string;
  recallName: string;
  itemCode: string;
  itemName?: string;
  reason: string;
  riskLevel: RecallRiskLevel;
  startDate: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  targetQty: number;
  completedQty: number;
  status: RecallStatus;
  estimatedCost?: number;
  actualCost?: number;
  responsibleDept?: string;
  responsiblePerson?: string;
  regulatoryAuthority?: string;
  regulatoryReportDate?: string;
  customerNotificationDate?: string;
  publicAnnouncementDate?: string;
  totalCost?: number;
  affectedQty?: number;
  completionRate?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface RecallLot {
  recallLotId: string;
  recallId: string;
  lotNo: string;
  qty: number;
  customerCode?: string;
  customerName?: string;
  shipmentDate?: string;
  currentLocation?: string;
  status: RecallLotStatus;
  notificationDate?: string;
  returnDate?: string;
  returnQty?: number;
  disposalDate?: string;
  disposalMethod?: string;
  replacementLotNo?: string;
  repairCompletedDate?: string;
  cost?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// Query Types
export interface ComplaintQueryParams {
  page?: number;
  limit?: number;
  complaintId?: string;
  complaintNo?: string;
  customerCode?: string;
  itemCode?: string;
  complaintType?: ComplaintType;
  severity?: ComplaintSeverity;
  status?: ComplaintStatus;
  receiptDateFrom?: string;
  receiptDateTo?: string;
  assignedTo?: string;
  lotNo?: string;
}

export interface WarrantyQueryParams {
  page?: number;
  limit?: number;
  warrantyId?: string;
  warrantyNo?: string;
  itemCode?: string;
  serialNo?: string;
  customerCode?: string;
  status?: WarrantyStatus;
  saleDateFrom?: string;
  saleDateTo?: string;
  expiringInDays?: number;
}

export interface FieldFailureQueryParams {
  page?: number;
  limit?: number;
  failureId?: string;
  failureNo?: string;
  complaintId?: string;
  itemCode?: string;
  lotNo?: string;
  failureMode?: string;
  traceabilityStatus?: TraceabilityStatus;
  productionLine?: string;
  equipmentId?: string;
  operatorId?: string;
  failureDateFrom?: string;
  failureDateTo?: string;
}

export interface RecallQueryParams {
  page?: number;
  limit?: number;
  recallId?: string;
  recallNo?: string;
  itemCode?: string;
  riskLevel?: RecallRiskLevel;
  status?: RecallStatus;
  startDateFrom?: string;
  startDateTo?: string;
  responsibleDept?: string;
}

// Response Types
export interface PaginatedComplaints {
  items: CustomerComplaint[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedWarrantyRecords {
  items: WarrantyRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedFieldFailures {
  items: FieldFailure[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedRecallCampaigns {
  items: RecallCampaign[];
  total: number;
  page: number;
  limit: number;
}
