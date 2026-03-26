import { create } from 'zustand';
import {
  ApqpProject,
  ApqpPhase,
  GateDeliverable,
  ApqpProjectStatus,
  ApqpPhaseStatus,
  ApqpPhaseType,
  DeliverableStatus,
  CreateApqpProjectRequest,
  UpdateApqpProjectRequest,
  CreatePhaseRequest,
  ApqpQueryParams,
  TargetVsActualComparison,
  ProjectTimeline,
  PpapSubmission,
  PpapDocument,
  PpapApprovalHistory,
  PpapStatus,
  PpapSubmissionLevel,
  PpapDocumentType,
  CreatePpapSubmissionRequest,
  SubmitDocumentRequest,
  PpapQueryParams,
  DvpPlan,
  DvpResult,
  TestCategory,
  TestResult,
  CreateDvpPlanRequest,
  RecordDvpResultRequest,
  DvpQueryParams,
  ValidationStatus,
  InitialSample,
  SampleInspectionItem,
  SampleStatus,
  InspectionResult,
  CreateInitialSampleRequest,
  AddInspectionItemRequest,
  InitialSampleQueryParams,
} from '@/types';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

// ==================== APQP Store ====================

interface ApqpState {
  projects: ApqpProject[];
  selectedProject: ApqpProject | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  targetVsActual: TargetVsActualComparison | null;
  timeline: ProjectTimeline | null;

  fetchProjects: (params?: ApqpQueryParams) => Promise<void>;
  fetchProject: (projectNo: string) => Promise<void>;
  createProject: (data: CreateApqpProjectRequest) => Promise<ApqpProject | null>;
  updateProject: (projectNo: string, data: UpdateApqpProjectRequest) => Promise<boolean>;
  deleteProject: (projectNo: string) => Promise<boolean>;
  createPhase: (projectNo: string, data: CreatePhaseRequest) => Promise<ApqpPhase | null>;
  submitDeliverable: (phaseId: string, deliverableId: string, data: { submittedBy: string; documentPath?: string }) => Promise<boolean>;
  approvePhase: (phaseId: string, approvedBy: string) => Promise<boolean>;
  rejectPhase: (phaseId: string, reason: string) => Promise<boolean>;
  fetchTargetVsActual: (projectNo: string) => Promise<void>;
  fetchTimeline: (projectNo: string) => Promise<void>;
  setSelectedProject: (project: ApqpProject | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useApqpStore = create<ApqpState>()((set, get) => ({
  projects: [],
  selectedProject: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,
  targetVsActual: null,
  timeline: null,

  fetchProjects: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/apqp/projects?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch APQP projects');
      
      const data = await response.json();
      set({ projects: data.items, total: data.total, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchProject: async (projectNo: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects/${projectNo}`);
      if (!response.ok) throw new Error('Failed to fetch APQP project');
      
      const data = await response.json();
      set({ selectedProject: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createProject: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create APQP project');
      
      const result = await response.json();
      set({ isSubmitting: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return null;
    }
  },

  updateProject: async (projectNo, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects/${projectNo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update APQP project');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  deleteProject: async (projectNo) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects/${projectNo}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete APQP project');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  createPhase: async (projectNo, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects/${projectNo}/phases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create phase');
      
      const result = await response.json();
      set({ isSubmitting: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return null;
    }
  },

  submitDeliverable: async (phaseId, deliverableId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/phases/${phaseId}/deliverables/${deliverableId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit deliverable');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  approvePhase: async (phaseId, approvedBy) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/phases/${phaseId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy }),
      });
      if (!response.ok) throw new Error('Failed to approve phase');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  rejectPhase: async (phaseId, reason) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/phases/${phaseId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to reject phase');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  fetchTargetVsActual: async (projectNo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects/${projectNo}/comparison`);
      if (!response.ok) throw new Error('Failed to fetch target vs actual');
      
      const data = await response.json();
      set({ targetVsActual: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTimeline: async (projectNo) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/apqp/projects/${projectNo}/timeline`);
      if (!response.ok) throw new Error('Failed to fetch timeline');
      
      const data = await response.json();
      set({ timeline: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  clearError: () => set({ error: null }),
}));

// ==================== PPAP Store ====================

interface PpapState {
  submissions: PpapSubmission[];
  selectedSubmission: PpapSubmission | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchSubmissions: (params?: PpapQueryParams) => Promise<void>;
  fetchSubmission: (submissionId: string) => Promise<void>;
  createSubmission: (data: CreatePpapSubmissionRequest) => Promise<PpapSubmission | null>;
  submitDocument: (submissionId: string, data: SubmitDocumentRequest) => Promise<boolean>;
  approveSubmission: (submissionId: string, reviewedBy: string) => Promise<boolean>;
  rejectSubmission: (submissionId: string, reason: string, reviewedBy: string) => Promise<boolean>;
  resubmitSubmission: (submissionId: string, resubmittedBy: string) => Promise<boolean>;
  fetchApprovalHistory: (submissionId: string) => Promise<PpapApprovalHistory[]>;
  setSelectedSubmission: (submission: PpapSubmission | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const usePpapStore = create<PpapState>()((set, get) => ({
  submissions: [],
  selectedSubmission: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchSubmissions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/ppap/submissions?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch PPAP submissions');
      
      const data = await response.json();
      set({ submissions: data.items, total: data.total, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSubmission: async (submissionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions/${submissionId}`);
      if (!response.ok) throw new Error('Failed to fetch PPAP submission');
      
      const data = await response.json();
      set({ selectedSubmission: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createSubmission: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create PPAP submission');
      
      const result = await response.json();
      set({ isSubmitting: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return null;
    }
  },

  submitDocument: async (submissionId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions/${submissionId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit document');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  approveSubmission: async (submissionId, reviewedBy) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy }),
      });
      if (!response.ok) throw new Error('Failed to approve PPAP');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  rejectSubmission: async (submissionId, reason, reviewedBy) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions/${submissionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, reviewedBy }),
      });
      if (!response.ok) throw new Error('Failed to reject PPAP');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  resubmitSubmission: async (submissionId, resubmittedBy) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions/${submissionId}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resubmittedBy }),
      });
      if (!response.ok) throw new Error('Failed to resubmit PPAP');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  fetchApprovalHistory: async (submissionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/ppap/submissions/${submissionId}/history`);
      if (!response.ok) throw new Error('Failed to fetch approval history');
      
      const data = await response.json();
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return [];
    }
  },

  setSelectedSubmission: (submission) => set({ selectedSubmission: submission }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  clearError: () => set({ error: null }),
}));

// ==================== DVP Store ====================

interface DvpState {
  plans: DvpPlan[];
  selectedPlan: DvpPlan | null;
  validationStatus: ValidationStatus | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchPlans: (params?: DvpQueryParams) => Promise<void>;
  fetchPlan: (planId: string) => Promise<void>;
  createPlan: (data: CreateDvpPlanRequest) => Promise<DvpPlan | null>;
  recordResult: (planId: string, data: RecordDvpResultRequest) => Promise<boolean>;
  fetchValidationStatus: (projectNo?: string) => Promise<void>;
  setSelectedPlan: (plan: DvpPlan | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useDvpStore = create<DvpState>()((set, get) => ({
  plans: [],
  selectedPlan: null,
  validationStatus: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchPlans: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/dvp/plans?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch DVP plans');
      
      const data = await response.json();
      set({ plans: data.items, total: data.total, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchPlan: async (planId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/dvp/plans/${planId}`);
      if (!response.ok) throw new Error('Failed to fetch DVP plan');
      
      const data = await response.json();
      set({ selectedPlan: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createPlan: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/dvp/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create DVP plan');
      
      const result = await response.json();
      set({ isSubmitting: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return null;
    }
  },

  recordResult: async (planId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/dvp/plans/${planId}/results`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to record DVP result');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  fetchValidationStatus: async (projectNo?: string) => {
    set({ isLoading: true, error: null });
    try {
      const url = projectNo 
        ? `${API_BASE_URL}/dvp/validation-status?projectNo=${projectNo}`
        : `${API_BASE_URL}/dvp/validation-status`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch validation status');
      
      const data = await response.json();
      set({ validationStatus: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  clearError: () => set({ error: null }),
}));

// ==================== Initial Sample Store ====================

interface InitialSampleState {
  samples: InitialSample[];
  selectedSample: InitialSample | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchSamples: (params?: InitialSampleQueryParams) => Promise<void>;
  fetchSample: (sampleId: string) => Promise<void>;
  createSample: (data: CreateInitialSampleRequest) => Promise<InitialSample | null>;
  addInspectionItem: (sampleId: string, data: AddInspectionItemRequest) => Promise<boolean>;
  judgeSample: (sampleId: string, judgment: InspectionResult, approvedBy?: string, reason?: string) => Promise<boolean>;
  approveSample: (sampleId: string, approvedBy: string) => Promise<boolean>;
  rejectSample: (sampleId: string, reason: string) => Promise<boolean>;
  setSelectedSample: (sample: InitialSample | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useInitialSampleStore = create<InitialSampleState>()((set, get) => ({
  samples: [],
  selectedSample: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchSamples: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/initial-samples?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch initial samples');
      
      const data = await response.json();
      set({ samples: data.items, total: data.total, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchSample: async (sampleId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/initial-samples/${sampleId}`);
      if (!response.ok) throw new Error('Failed to fetch initial sample');
      
      const data = await response.json();
      set({ selectedSample: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createSample: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/initial-samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create initial sample');
      
      const result = await response.json();
      set({ isSubmitting: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return null;
    }
  },

  addInspectionItem: async (sampleId, data) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/initial-samples/${sampleId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add inspection item');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  judgeSample: async (sampleId, judgment, approvedBy, reason) => {
    set({ isSubmitting: true, error: null });
    try {
      const body: Record<string, string> = { judgment: judgment as string };
      if (approvedBy) body.approvedBy = approvedBy;
      if (reason) body.rejectionReason = reason;

      const response = await fetch(`${API_BASE_URL}/initial-samples/${sampleId}/judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to judge sample');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  approveSample: async (sampleId, approvedBy) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/initial-samples/${sampleId}/approve?approvedBy=${approvedBy}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve sample');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  rejectSample: async (sampleId, reason) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/initial-samples/${sampleId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error('Failed to reject sample');
      
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isSubmitting: false });
      return false;
    }
  },

  setSelectedSample: (sample) => set({ selectedSample: sample }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  clearError: () => set({ error: null }),
}));
