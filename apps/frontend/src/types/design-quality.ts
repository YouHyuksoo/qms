/**
 * Design Quality Module Types
 * APQP, PPAP, DVP, Initial Sample
 */

// ==================== APQP Types ====================

export enum ApqpProjectStatus {
  PLANNING = 'PLANNING',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  PROCESS_DESIGN = 'PROCESS_DESIGN',
  VALIDATION = 'VALIDATION',
  PRODUCTION = 'PRODUCTION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ApqpPhaseType {
  PLANNING = 'PLANNING',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  PROCESS_DESIGN = 'PROCESS_DESIGN',
  VALIDATION = 'VALIDATION',
  PRODUCTION = 'PRODUCTION',
}

export enum ApqpPhaseStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DeliverableStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface GateDeliverable {
  deliverableId: string;
  phaseId: string;
  deliverableName: string;
  deliverableCode?: string;
  isRequired: boolean;
  isSubmitted: boolean;
  submittedDate?: string;
  submittedBy?: string;
  status: DeliverableStatus;
  approvedDate?: string;
  approvedBy?: string;
  documentPath?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApqpPhase {
  phaseId: string;
  projectNo: string;
  phaseType: ApqpPhaseType;
  phaseName: string;
  sequenceNo: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  targetQualityLevel?: number;
  actualQualityLevel?: number;
  status: ApqpPhaseStatus;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  deliverables?: GateDeliverable[];
}

export interface ApqpProject {
  projectNo: string;
  projectName: string;
  customerCode?: string;
  customerName?: string;
  itemCode?: string;
  itemName?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  projectManager?: string;
  status: ApqpProjectStatus;
  targetQualityLevel?: number;
  actualQualityLevel?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  phases?: ApqpPhase[];
}

export interface CreateApqpProjectRequest {
  projectNo: string;
  projectName: string;
  customerCode?: string;
  customerName?: string;
  itemCode?: string;
  itemName?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  projectManager?: string;
  status?: ApqpProjectStatus;
  targetQualityLevel?: number;
  remarks?: string;
  createdBy?: string;
}

export interface UpdateApqpProjectRequest {
  projectName?: string;
  customerCode?: string;
  customerName?: string;
  itemCode?: string;
  itemName?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  projectManager?: string;
  status?: ApqpProjectStatus;
  targetQualityLevel?: number;
  actualQualityLevel?: number;
  remarks?: string;
  updatedBy?: string;
}

export interface CreatePhaseRequest {
  phaseId: string;
  phaseType: ApqpPhaseType;
  phaseName: string;
  sequenceNo?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  targetQualityLevel?: number;
  status?: ApqpPhaseStatus;
  remarks?: string;
  createdBy?: string;
}

export interface ApqpQueryParams {
  projectNo?: string;
  projectName?: string;
  customerCode?: string;
  itemCode?: string;
  status?: ApqpProjectStatus;
  projectManager?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TargetVsActualComparison {
  project: ApqpProject;
  comparison: Array<{
    phaseId: string;
    phaseName: string;
    phaseType: string;
    targetQualityLevel: number | null;
    actualQualityLevel: number | null;
    variance: number | null;
    status: string;
  }>;
  overallTarget: number | null;
  overallActual: number | null;
  overallVariance: number | null;
}

export interface ProjectTimeline {
  project: ApqpProject;
  timeline: Array<{
    phaseId: string;
    phaseName: string;
    phaseType: string;
    plannedStart: string | null;
    plannedEnd: string | null;
    actualStart: string | null;
    actualEnd: string | null;
    duration: number | null;
    delay: number | null;
    status: string;
  }>;
}

// ==================== PPAP Types ====================

export enum PpapSubmissionLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5,
}

export enum PpapStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INTERIM_APPROVED = 'INTERIM_APPROVED',
}

export enum PpapDocumentType {
  DESIGN_RECORDS = 'DESIGN_RECORDS',
  FMEA = 'FMEA',
  CONTROL_PLAN = 'CONTROL_PLAN',
  MSA = 'MSA',
  DIMENSIONAL_RESULTS = 'DIMENSIONAL_RESULTS',
  MATERIAL_PERFORMANCE = 'MATERIAL_PERFORMANCE',
  INITIAL_PROCESS_STUDIES = 'INITIAL_PROCESS_STUDIES',
  QUALIFIED_LAB_DOCUMENTATION = 'QUALIFIED_LAB_DOCUMENTATION',
  AAR = 'AAR',
  SAMPLE_PARTS = 'SAMPLE_PARTS',
  MASTER_SAMPLE = 'MASTER_SAMPLE',
  CHECKING_AIDS = 'CHECKING_AIDS',
  CUSTOMER_SPECIFIC = 'CUSTOMER_SPECIFIC',
  PSW = 'PSW',
}

export enum DocumentStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ApprovalAction {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RESUBMITTED = 'RESUBMITTED',
  INTERIM_APPROVED = 'INTERIM_APPROVED',
}

export interface PpapDocument {
  documentId: string;
  submissionId: string;
  documentType: PpapDocumentType;
  documentName: string;
  documentCode?: string;
  isRequired: boolean;
  isSubmitted: boolean;
  submittedDate?: string;
  status: DocumentStatus;
  documentPath?: string;
  version?: string;
  reviewedBy?: string;
  reviewDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PpapApprovalHistory {
  historyId: string;
  submissionId: string;
  action: ApprovalAction;
  actionDate: string;
  actionBy: string;
  reason?: string;
  previousStatus?: string;
  newStatus: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PpapSubmission {
  submissionId: string;
  projectNo: string;
  submissionNo: string;
  submissionLevel: PpapSubmissionLevel;
  submissionDate?: string;
  customerCode?: string;
  customerName?: string;
  status: PpapStatus;
  pswNo?: string;
  pswPath?: string;
  reviewedBy?: string;
  reviewDate?: string;
  rejectionReason?: string;
  resubmissionDate?: string;
  resubmissionCount: number;
  approvalDeadline?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  documents?: PpapDocument[];
  approvalHistory?: PpapApprovalHistory[];
}

export interface CreatePpapSubmissionRequest {
  submissionId: string;
  projectNo: string;
  submissionNo: string;
  submissionLevel?: PpapSubmissionLevel;
  submissionDate?: string;
  customerCode?: string;
  customerName?: string;
  pswNo?: string;
  approvalDeadline?: string;
  remarks?: string;
  createdBy?: string;
}

export interface SubmitDocumentRequest {
  documentId: string;
  documentType: PpapDocumentType;
  documentName: string;
  documentCode?: string;
  isRequired?: boolean;
  submittedDate?: string;
  documentPath?: string;
  version?: string;
  remarks?: string;
  createdBy?: string;
}

export interface PpapQueryParams {
  submissionId?: string;
  projectNo?: string;
  submissionNo?: string;
  submissionLevel?: PpapSubmissionLevel;
  customerCode?: string;
  status?: PpapStatus;
  pswNo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// ==================== DVP Types ====================

export enum TestCategory {
  FUNCTIONAL = 'FUNCTIONAL',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  RELIABILITY = 'RELIABILITY',
  SAFETY = 'SAFETY',
  DURABILITY = 'DURABILITY',
  ELECTRICAL = 'ELECTRICAL',
  MECHANICAL = 'MECHANICAL',
  CHEMICAL = 'CHEMICAL',
}

export enum TestResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_TESTED = 'NOT_TESTED',
}

export interface DvpResult {
  resultId: string;
  planId: string;
  actualStartDate?: string;
  actualEndDate?: string;
  testedQty: number;
  passedQty: number;
  failedQty: number;
  testResult: TestResult;
  testReportNo?: string;
  testReportPath?: string;
  testedBy?: string;
  measuredValues?: string;
  defectDescription?: string;
  correctiveAction?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DvpPlan {
  planId: string;
  projectNo: string;
  itemCode?: string;
  itemName?: string;
  testCategory: TestCategory;
  testItem: string;
  testMethod?: string;
  acceptanceCriteria?: string;
  testFacility?: string;
  testEquipment?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  sampleQty: number;
  responsiblePerson?: string;
  referenceSpec?: string;
  priority: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  results?: DvpResult[];
}

export interface CreateDvpPlanRequest {
  planId: string;
  projectNo: string;
  itemCode?: string;
  itemName?: string;
  testCategory: TestCategory;
  testItem: string;
  testMethod?: string;
  acceptanceCriteria?: string;
  testFacility?: string;
  testEquipment?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  sampleQty?: number;
  responsiblePerson?: string;
  referenceSpec?: string;
  priority?: number;
  remarks?: string;
  createdBy?: string;
}

export interface RecordDvpResultRequest {
  resultId: string;
  actualStartDate?: string;
  actualEndDate?: string;
  testedQty?: number;
  passedQty?: number;
  failedQty?: number;
  testResult?: TestResult;
  testReportNo?: string;
  testReportPath?: string;
  testedBy?: string;
  measuredValues?: string;
  defectDescription?: string;
  correctiveAction?: string;
  remarks?: string;
  createdBy?: string;
}

export interface DvpQueryParams {
  planId?: string;
  projectNo?: string;
  itemCode?: string;
  testCategory?: TestCategory;
  testItem?: string;
  testResult?: TestResult;
  responsiblePerson?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ValidationStatus {
  totalPlans: number;
  byCategory: Record<string, number>;
  byResult: Record<string, number>;
  passRate: number;
  inProgressCount: number;
  notStartedCount: number;
  completedCount: number;
  failedCount: number;
}

// ==================== Initial Sample Types ====================

export enum InspectionResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  CONDITIONAL = 'CONDITIONAL',
}

export enum SampleStatus {
  REGISTERED = 'REGISTERED',
  INSPECTING = 'INSPECTING',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface SampleInspectionItem {
  itemId: string;
  sampleId: string;
  inspectionItem: string;
  inspectionItemCode?: string;
  specMin?: number;
  specMax?: number;
  specNominal?: number;
  specTolerance?: number;
  unit?: string;
  measuredValue?: number;
  measuredValues?: string;
  judgment: InspectionResult;
  isCritical: boolean;
  inspectionMethod?: string;
  inspectionEquipment?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitialSample {
  sampleId: string;
  projectNo: string;
  sampleNo: string;
  itemCode: string;
  itemName?: string;
  sampleQty: number;
  submissionDate: string;
  inspector?: string;
  inspectionResult: InspectionResult;
  status: SampleStatus;
  inspectionDate?: string;
  approvalDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  dimensionalReportNo?: string;
  materialReportNo?: string;
  performanceReportNo?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  inspectionItems?: SampleInspectionItem[];
}

export interface CreateInitialSampleRequest {
  sampleId: string;
  projectNo: string;
  sampleNo: string;
  itemCode: string;
  itemName?: string;
  sampleQty?: number;
  submissionDate: string;
  inspector?: string;
  dimensionalReportNo?: string;
  materialReportNo?: string;
  performanceReportNo?: string;
  remarks?: string;
  createdBy?: string;
}

export interface AddInspectionItemRequest {
  itemId: string;
  inspectionItem: string;
  inspectionItemCode?: string;
  specMin?: number;
  specMax?: number;
  specNominal?: number;
  specTolerance?: number;
  unit?: string;
  measuredValue?: number;
  measuredValues?: string;
  judgment?: InspectionResult;
  isCritical?: boolean;
  inspectionMethod?: string;
  inspectionEquipment?: string;
  remarks?: string;
  createdBy?: string;
}

export interface InitialSampleQueryParams {
  sampleId?: string;
  projectNo?: string;
  sampleNo?: string;
  itemCode?: string;
  inspectionResult?: InspectionResult;
  status?: SampleStatus;
  inspector?: string;
  approvedBy?: string;
  submissionDateFrom?: string;
  submissionDateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SampleStatistics {
  totalSamples: number;
  byStatus: Record<string, number>;
  byResult: Record<string, number>;
  approvalRate: number;
  pendingCount: number;
}

