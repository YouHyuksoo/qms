/**
 * Inspection Module Types
 */

export enum InspectionType {
  IQC = 'IQC',
  IPQC = 'IPQC',
  FQC = 'FQC',
  OQC = 'OQC',
}

export enum InspectionJudgment {
  PASS = 'PASS',
  FAIL = 'FAIL',
  HOLD = 'HOLD',
}

export enum InspectionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ResultJudgment {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

export interface InspectionLot {
  lotNo: string;
  itemCode: string;
  itemName?: string;
  inspectionType: InspectionType;
  inspectionDate?: string;
  inspector?: string;
  lotQty?: number;
  sampleQty?: number;
  judgment?: InspectionJudgment;
  status: InspectionStatus;
  supplierCode?: string;
  supplierName?: string;
  poNo?: string;
  workOrderNo?: string;
  remarks?: string;
  ncrNo?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  results?: InspectionResult[];
}

export interface InspectionResult {
  resultId: string;
  lotNo: string;
  characteristicName: string;
  characteristicNo?: string;
  specMin?: number;
  specMax?: number;
  specText?: string;
  measuredValue?: number;
  measuredText?: string;
  judgment?: ResultJudgment;
  inspectionMethod?: string;
  inspectionEquipment?: string;
  remarks?: string;
  sequenceNo: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInspectionLotRequest {
  lotNo: string;
  itemCode: string;
  itemName?: string;
  inspectionType: InspectionType;
  inspectionDate?: string;
  inspector?: string;
  lotQty?: number;
  sampleQty?: number;
  supplierCode?: string;
  supplierName?: string;
  poNo?: string;
  workOrderNo?: string;
  remarks?: string;
  createdBy?: string;
}

export interface UpdateInspectionLotRequest {
  itemCode?: string;
  itemName?: string;
  inspectionDate?: string;
  inspector?: string;
  lotQty?: number;
  sampleQty?: number;
  judgment?: InspectionJudgment;
  status?: InspectionStatus;
  supplierCode?: string;
  supplierName?: string;
  poNo?: string;
  workOrderNo?: string;
  ncrNo?: string;
  remarks?: string;
  updatedBy?: string;
}

export interface CreateInspectionResultRequest {
  resultId: string;
  lotNo: string;
  characteristicName: string;
  characteristicNo?: string;
  specMin?: number;
  specMax?: number;
  specText?: string;
  measuredValue?: number;
  measuredText?: string;
  judgment?: ResultJudgment;
  inspectionMethod?: string;
  inspectionEquipment?: string;
  remarks?: string;
  sequenceNo?: number;
  createdBy?: string;
}

export interface InspectionQueryParams {
  lotNo?: string;
  itemCode?: string;
  itemName?: string;
  inspectionType?: InspectionType;
  inspectionDateFrom?: string;
  inspectionDateTo?: string;
  inspector?: string;
  judgment?: InspectionJudgment;
  status?: InspectionStatus;
  supplierCode?: string;
  ncrNo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface InspectionStatistics {
  totalLots: number;
  passCount: number;
  failCount: number;
  holdCount: number;
  passRate: number;
}

export interface PaginatedInspectionLots {
  items: InspectionLot[];
  total: number;
  page: number;
  limit: number;
}
