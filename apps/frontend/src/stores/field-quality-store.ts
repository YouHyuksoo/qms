import { create } from 'zustand';
import {
  CustomerComplaint,
  WarrantyRecord,
  FieldFailure,
  RecallCampaign,
  ComplaintTrend,
  WarrantyPpm,
  FailurePattern,
  ComplaintQueryParams,
  WarrantyQueryParams,
  FieldFailureQueryParams,
  RecallQueryParams,
  PaginatedComplaints,
  PaginatedWarrantyRecords,
  PaginatedFieldFailures,
  PaginatedRecallCampaigns,
  ComplaintStatus,
  WarrantyStatus,
  TraceabilityStatus,
  RecallStatus,
  RecallLotStatus,
} from '@/types/field-quality';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

// Customer Complaint Store
interface ComplaintState {
  complaints: CustomerComplaint[];
  selectedComplaint: CustomerComplaint | null;
  trends: ComplaintTrend[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchComplaints: (params?: ComplaintQueryParams) => Promise<void>;
  fetchComplaint: (complaintId: string) => Promise<void>;
  createComplaint: (data: Partial<CustomerComplaint>) => Promise<CustomerComplaint | null>;
  updateComplaint: (complaintId: string, data: Partial<CustomerComplaint>) => Promise<boolean>;
  resolveComplaint: (complaintId: string, resolution: string) => Promise<boolean>;
  closeComplaint: (complaintId: string, satisfactionScore?: number) => Promise<boolean>;
  fetchTrends: (dateFrom: string, dateTo: string) => Promise<void>;
  setSelectedComplaint: (complaint: CustomerComplaint | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useComplaintStore = create<ComplaintState>()((set, get) => ({
  complaints: [],
  selectedComplaint: null,
  trends: [],
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchComplaints: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/complaints?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch complaints');

      const data: PaginatedComplaints = await response.json();
      set({ complaints: data.items, total: data.total, page: data.page, limit: data.limit, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  fetchComplaint: async (complaintId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}`);
      if (!response.ok) throw new Error('Failed to fetch complaint');

      const complaint: CustomerComplaint = await response.json();
      set({ selectedComplaint: complaint, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  createComplaint: async (data: Partial<CustomerComplaint>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create complaint');

      const complaint: CustomerComplaint = await response.json();
      set((state) => ({ complaints: [complaint, ...state.complaints], total: state.total + 1, isSubmitting: false }));
      return complaint;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return null;
    }
  },

  updateComplaint: async (complaintId: string, data: Partial<CustomerComplaint>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update complaint');

      const updatedComplaint: CustomerComplaint = await response.json();
      set((state) => ({
        complaints: state.complaints.map((c) => (c.complaintId === complaintId ? updatedComplaint : c)),
        selectedComplaint: state.selectedComplaint?.complaintId === complaintId ? updatedComplaint : state.selectedComplaint,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  resolveComplaint: async (complaintId: string, resolution: string) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });

      if (!response.ok) throw new Error('Failed to resolve complaint');

      const updatedComplaint: CustomerComplaint = await response.json();
      set((state) => ({
        complaints: state.complaints.map((c) => (c.complaintId === complaintId ? updatedComplaint : c)),
        selectedComplaint: state.selectedComplaint?.complaintId === complaintId ? updatedComplaint : state.selectedComplaint,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  closeComplaint: async (complaintId: string, satisfactionScore?: number) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satisfactionScore }),
      });

      if (!response.ok) throw new Error('Failed to close complaint');

      const updatedComplaint: CustomerComplaint = await response.json();
      set((state) => ({
        complaints: state.complaints.map((c) => (c.complaintId === complaintId ? updatedComplaint : c)),
        selectedComplaint: state.selectedComplaint?.complaintId === complaintId ? updatedComplaint : state.selectedComplaint,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  fetchTrends: async (dateFrom: string, dateTo: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/complaints/analytics/trends?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      if (!response.ok) throw new Error('Failed to fetch trends');

      const data = await response.json();
      set({ trends: data.trends });
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    }
  },

  setSelectedComplaint: (complaint) => set({ selectedComplaint: complaint }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  clearError: () => set({ error: null }),
}));

// Warranty Store
interface WarrantyState {
  records: WarrantyRecord[];
  selectedRecord: WarrantyRecord | null;
  expiringWarranties: WarrantyRecord[];
  ppmTrends: WarrantyPpm[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchRecords: (params?: WarrantyQueryParams) => Promise<void>;
  fetchRecord: (warrantyId: string) => Promise<void>;
  createRecord: (data: Partial<WarrantyRecord>) => Promise<WarrantyRecord | null>;
  recordClaim: (warrantyId: string, data: Partial<WarrantyRecord>) => Promise<boolean>;
  fetchPPM: (dateFrom: string, dateTo: string) => Promise<void>;
  fetchExpiringWarranties: (days?: number) => Promise<void>;
  setSelectedRecord: (record: WarrantyRecord | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useWarrantyStore = create<WarrantyState>()((set, get) => ({
  records: [],
  selectedRecord: null,
  expiringWarranties: [],
  ppmTrends: [],
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchRecords: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/warranty/records?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch warranty records');

      const data: PaginatedWarrantyRecords = await response.json();
      set({ records: data.items, total: data.total, page: data.page, limit: data.limit, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  fetchRecord: async (warrantyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/records/${warrantyId}`);
      if (!response.ok) throw new Error('Failed to fetch warranty record');

      const record: WarrantyRecord = await response.json();
      set({ selectedRecord: record, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  createRecord: async (data: Partial<WarrantyRecord>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create warranty record');

      const record: WarrantyRecord = await response.json();
      set((state) => ({ records: [record, ...state.records], total: state.total + 1, isSubmitting: false }));
      return record;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return null;
    }
  },

  recordClaim: async (warrantyId: string, data: Partial<WarrantyRecord>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/claims?warrantyId=${warrantyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to record warranty claim');

      const updatedRecord: WarrantyRecord = await response.json();
      set((state) => ({
        records: state.records.map((r) => (r.warrantyId === warrantyId ? updatedRecord : r)),
        selectedRecord: state.selectedRecord?.warrantyId === warrantyId ? updatedRecord : state.selectedRecord,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  fetchPPM: async (dateFrom: string, dateTo: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/warranty/ppm/trends?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      if (!response.ok) throw new Error('Failed to fetch PPM trends');

      const data = await response.json();
      set({ ppmTrends: data.trends });
    } catch (error) {
      console.error('Failed to fetch PPM trends:', error);
    }
  },

  fetchExpiringWarranties: async (days = 30) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/expiring?days=${days}`);
      if (!response.ok) throw new Error('Failed to fetch expiring warranties');

      const data: WarrantyRecord[] = await response.json();
      set({ expiringWarranties: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  setSelectedRecord: (record) => set({ selectedRecord: record }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  clearError: () => set({ error: null }),
}));

// Field Failure Store
interface FieldFailureState {
  failures: FieldFailure[];
  selectedFailure: FieldFailure | null;
  patterns: FailurePattern[];
  traceabilityResult: any | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchFailures: (params?: FieldFailureQueryParams) => Promise<void>;
  fetchFailure: (failureId: string) => Promise<void>;
  createFailure: (data: Partial<FieldFailure>) => Promise<FieldFailure | null>;
  updateFailure: (failureId: string, data: Partial<FieldFailure>) => Promise<boolean>;
  updateCountermeasure: (failureId: string, data: Record<string, any>) => Promise<boolean>;
  traceProduction: (failureId: string) => Promise<any>;
  fetchPatterns: (dateFrom: string, dateTo: string) => Promise<void>;
  setSelectedFailure: (failure: FieldFailure | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useFieldFailureStore = create<FieldFailureState>()((set, get) => ({
  failures: [],
  selectedFailure: null,
  patterns: [],
  traceabilityResult: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchFailures: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/field-failures?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch field failures');

      const data: PaginatedFieldFailures = await response.json();
      set({ failures: data.items, total: data.total, page: data.page, limit: data.limit, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  fetchFailure: async (failureId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/field-failures/${failureId}`);
      if (!response.ok) throw new Error('Failed to fetch field failure');

      const failure: FieldFailure = await response.json();
      set({ selectedFailure: failure, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  createFailure: async (data: Partial<FieldFailure>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/field-failures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create field failure');

      const failure: FieldFailure = await response.json();
      set((state) => ({ failures: [failure, ...state.failures], total: state.total + 1, isSubmitting: false }));
      return failure;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return null;
    }
  },

  updateFailure: async (failureId: string, data: Partial<FieldFailure>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/field-failures/${failureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update field failure');

      const updatedFailure: FieldFailure = await response.json();
      set((state) => ({
        failures: state.failures.map((f) => (f.failureId === failureId ? updatedFailure : f)),
        selectedFailure: state.selectedFailure?.failureId === failureId ? updatedFailure : state.selectedFailure,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  traceProduction: async (failureId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/field-failures/${failureId}/trace`);
      if (!response.ok) throw new Error('Failed to trace production history');

      const result = await response.json();
      set({ traceabilityResult: result });
      return result;
    } catch (error) {
      console.error('Failed to trace production:', error);
      return null;
    }
  },

  updateCountermeasure: async (failureId: string, data: Record<string, any>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/field-failures/${failureId}/countermeasure`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update countermeasure');
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  fetchPatterns: async (dateFrom: string, dateTo: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/field-failures/analysis/patterns?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      if (!response.ok) throw new Error('Failed to fetch patterns');

      const data = await response.json();
      set({ patterns: data.patterns });
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
    }
  },

  setSelectedFailure: (failure) => set({ selectedFailure: failure }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  clearError: () => set({ error: null }),
}));

export const useFieldAnalysisStore = useFieldFailureStore;

// Recall Store
interface RecallState {
  campaigns: RecallCampaign[];
  selectedCampaign: RecallCampaign | null;
  dashboard: any | null;
  statistics: any | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchCampaigns: (params?: RecallQueryParams) => Promise<void>;
  fetchCampaign: (recallId: string) => Promise<void>;
  createCampaign: (data: Partial<RecallCampaign>) => Promise<RecallCampaign | null>;
  updateCampaign: (recallId: string, data: Partial<RecallCampaign>) => Promise<boolean>;
  updateProgress: (recallId: string, data: Record<string, any>) => Promise<boolean>;
  completeRecall: (recallId: string) => Promise<boolean>;
  fetchProgress: (recallId: string) => Promise<any>;
  fetchCosts: (recallId: string) => Promise<any>;
  fetchDashboard: (recallId?: string) => Promise<void>;
  fetchStatistics: (recallId?: string) => Promise<void>;
  setSelectedCampaign: (campaign: RecallCampaign | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useRecallStore = create<RecallState>()((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  dashboard: null,
  statistics: null,
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchCampaigns: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const queryParams = new URLSearchParams({
        page: String(params.page || page),
        limit: String(params.limit || limit),
        ...Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && key !== 'page' && key !== 'limit') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(`${API_BASE_URL}/recalls/campaigns?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch recall campaigns');

      const data: PaginatedRecallCampaigns = await response.json();
      set({ campaigns: data.items, total: data.total, page: data.page, limit: data.limit, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  fetchCampaign: async (recallId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns/${recallId}`);
      if (!response.ok) throw new Error('Failed to fetch recall campaign');

      const campaign: RecallCampaign = await response.json();
      set({ selectedCampaign: campaign, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  createCampaign: async (data: Partial<RecallCampaign>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create recall campaign');

      const campaign: RecallCampaign = await response.json();
      set((state) => ({ campaigns: [campaign, ...state.campaigns], total: state.total + 1, isSubmitting: false }));
      return campaign;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return null;
    }
  },

  updateCampaign: async (recallId: string, data: Partial<RecallCampaign>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns/${recallId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update recall campaign');

      const updatedCampaign: RecallCampaign = await response.json();
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.recallId === recallId ? updatedCampaign : c)),
        selectedCampaign: state.selectedCampaign?.recallId === recallId ? updatedCampaign : state.selectedCampaign,
        isSubmitting: false,
      }));
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  fetchProgress: async (recallId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns/${recallId}/progress`);
      if (!response.ok) throw new Error('Failed to fetch recall progress');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      return null;
    }
  },

  fetchCosts: async (recallId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns/${recallId}/costs`);
      if (!response.ok) throw new Error('Failed to fetch recall costs');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch costs:', error);
      return null;
    }
  },

  updateProgress: async (recallId: string, data: Record<string, any>) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns/${recallId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update progress');
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  completeRecall: async (recallId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/recalls/campaigns/${recallId}/complete`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to complete recall');
      set({ isSubmitting: false });
      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isSubmitting: false });
      return false;
    }
  },

  fetchDashboard: async (recallId?: string) => {
    try {
      const url = recallId
        ? `${API_BASE_URL}/recalls/campaigns/${recallId}/dashboard`
        : `${API_BASE_URL}/recalls/dashboard`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      const data = await response.json();
      set({ dashboard: data });
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    }
  },

  fetchStatistics: async (recallId?: string) => {
    try {
      const url = recallId
        ? `${API_BASE_URL}/recalls/campaigns/${recallId}/statistics`
        : `${API_BASE_URL}/recalls/statistics`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      set({ statistics: data });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  },

  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  clearError: () => set({ error: null }),
}));
