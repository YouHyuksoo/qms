import { create } from 'zustand';
import {
  Ncr,
  MrbReview,
  NcrStatus,
  NcrSource,
  DispositionType,
  ReviewStatus,
  NcrQueryParams,
  CreateNcrRequest,
  UpdateNcrRequest,
  CreateMrbReviewRequest,
  ExecuteDispositionRequest,
  NcrStatistics,
  PaginatedNcrs,
} from '@/types';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

interface NonconformanceState {
  // Data
  ncrs: Ncr[];
  selectedNcr: Ncr | null;
  total: number;
  page: number;
  limit: number;
  statistics: NcrStatistics | null;
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  fetchNcrs: (params?: NcrQueryParams) => Promise<void>;
  fetchNcr: (ncrNo: string) => Promise<void>;
  createNcr: (data: CreateNcrRequest) => Promise<Ncr | null>;
  createNcrFromInspection: (params: {
    ncrNo: string;
    lotNo: string;
    itemCode?: string;
    itemName?: string;
    defectQty?: number;
    description?: string;
  }) => Promise<Ncr | null>;
  updateNcr: (ncrNo: string, data: UpdateNcrRequest) => Promise<boolean>;
  deleteNcr: (ncrNo: string) => Promise<boolean>;
  closeNcr: (ncrNo: string, closedBy: string, options?: {
    rootCause?: string;
    correctiveAction?: string;
    preventiveAction?: string;
  }) => Promise<boolean>;
  createMrbReview: (data: CreateMrbReviewRequest) => Promise<boolean>;
  approveMrbReview: (reviewId: string, approvedBy: string) => Promise<boolean>;
  rejectMrbReview: (reviewId: string, reason?: string) => Promise<boolean>;
  executeDisposition: (reviewId: string, data: ExecuteDispositionRequest) => Promise<boolean>;
  fetchStatistics: () => Promise<void>;
  setSelectedNcr: (ncr: Ncr | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

/**
 * 부적합 관리 스토어
 */
export const useNonconformanceStore = create<NonconformanceState>()(
  (set, get) => ({
      // Initial state
      ncrs: [],
      selectedNcr: null,
      total: 0,
      page: 1,
      limit: 20,
      statistics: null,
      isLoading: false,
      isSubmitting: false,
      error: null,

      // Fetch NCRs with pagination and filters
      fetchNcrs: async (params = {}) => {
        set({ isLoading: true, error: null });
        
        try {
          const { page, limit } = get();
          const queryParams = new URLSearchParams({
            page: String(params.page || page),
            limit: String(params.limit || limit),
            ...Object.entries(params).reduce((acc, [key, value]) => {
              if (value !== undefined && value !== null) {
                acc[key] = String(value);
              }
              return acc;
            }, {} as Record<string, string>),
          });

          const response = await fetch(`${API_BASE_URL}/ncr/ncrs?${queryParams}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch NCRs');
          }

          const data: PaginatedNcrs = await response.json();
          
          set({
            ncrs: data.items,
            total: data.total,
            page: data.page,
            limit: data.limit,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Fetch single NCR with reviews
      fetchNcr: async (ncrNo: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/ncrs/${ncrNo}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch NCR');
          }

          const ncr: Ncr = await response.json();
          
          set({ selectedNcr: ncr, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Create new NCR
      createNcr: async (data: CreateNcrRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/ncrs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create NCR');
          }

          const ncr: Ncr = await response.json();
          
          set((state) => ({
            ncrs: [ncr, ...state.ncrs],
            total: state.total + 1,
            isSubmitting: false,
          }));

          return ncr;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return null;
        }
      },

      // Create NCR from inspection failure
      createNcrFromInspection: async (params) => {
        const data: CreateNcrRequest = {
          ncrNo: params.ncrNo,
          title: `검사 불합격 - 로트 ${params.lotNo}`,
          description: params.description || `로트 ${params.lotNo}의 검사 결과 불합격`,
          lotNo: params.lotNo,
          itemCode: params.itemCode,
          itemName: params.itemName,
          defectQty: params.defectQty || 0,
          source: NcrSource.INSPECTION,
          reportedDate: new Date().toISOString().split('T')[0],
        };

        return get().createNcr(data);
      },

      // Update NCR
      updateNcr: async (ncrNo: string, data: UpdateNcrRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/ncrs/${ncrNo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update NCR');
          }

          const updatedNcr: Ncr = await response.json();
          
          set((state) => ({
            ncrs: state.ncrs.map((n) => (n.ncrNo === ncrNo ? updatedNcr : n)),
            selectedNcr: state.selectedNcr?.ncrNo === ncrNo ? updatedNcr : state.selectedNcr,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Delete NCR
      deleteNcr: async (ncrNo: string) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/ncrs/${ncrNo}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete NCR');
          }

          set((state) => ({
            ncrs: state.ncrs.filter((n) => n.ncrNo !== ncrNo),
            total: state.total - 1,
            selectedNcr: state.selectedNcr?.ncrNo === ncrNo ? null : state.selectedNcr,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Close NCR
      closeNcr: async (ncrNo: string, closedBy: string, options = {}) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const queryParams = new URLSearchParams({ closedBy });

          const response = await fetch(`${API_BASE_URL}/ncr/ncrs/${ncrNo}/close?${queryParams}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options),
          });
          
          if (!response.ok) {
            throw new Error('Failed to close NCR');
          }

          const closedNcr: Ncr = await response.json();
          
          set((state) => ({
            ncrs: state.ncrs.map((n) => (n.ncrNo === ncrNo ? closedNcr : n)),
            selectedNcr: state.selectedNcr?.ncrNo === ncrNo ? closedNcr : state.selectedNcr,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Create MRB review
      createMrbReview: async (data: CreateMrbReviewRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/mrb-reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error('Failed to create MRB review');
          }

          const review: MrbReview = await response.json();
          
          set((state) => ({
            selectedNcr: state.selectedNcr
              ? {
                  ...state.selectedNcr,
                  mrbReviews: [...(state.selectedNcr.mrbReviews || []), review],
                }
              : null,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Approve MRB review
      approveMrbReview: async (reviewId: string, approvedBy: string) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const queryParams = new URLSearchParams({ approvedBy });

          const response = await fetch(`${API_BASE_URL}/ncr/mrb-reviews/${reviewId}/approve?${queryParams}`, {
            method: 'POST',
          });
          
          if (!response.ok) {
            throw new Error('Failed to approve MRB review');
          }

          const approvedReview: MrbReview = await response.json();
          
          set((state) => ({
            selectedNcr: state.selectedNcr
              ? {
                  ...state.selectedNcr,
                  mrbReviews: state.selectedNcr.mrbReviews?.map((r) =>
                    r.reviewId === reviewId ? approvedReview : r
                  ),
                }
              : null,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Reject MRB review
      rejectMrbReview: async (reviewId: string, reason?: string) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const queryParams = new URLSearchParams();
          if (reason) queryParams.set('reason', reason);

          const response = await fetch(`${API_BASE_URL}/ncr/mrb-reviews/${reviewId}/reject?${queryParams}`, {
            method: 'POST',
          });
          
          if (!response.ok) {
            throw new Error('Failed to reject MRB review');
          }

          const rejectedReview: MrbReview = await response.json();
          
          set((state) => ({
            selectedNcr: state.selectedNcr
              ? {
                  ...state.selectedNcr,
                  mrbReviews: state.selectedNcr.mrbReviews?.map((r) =>
                    r.reviewId === reviewId ? rejectedReview : r
                  ),
                }
              : null,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Execute disposition
      executeDisposition: async (reviewId: string, data: ExecuteDispositionRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/mrb-reviews/${reviewId}/disposition`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error('Failed to execute disposition');
          }

          const executedReview: MrbReview = await response.json();
          
          set((state) => ({
            selectedNcr: state.selectedNcr
              ? {
                  ...state.selectedNcr,
                  mrbReviews: state.selectedNcr.mrbReviews?.map((r) =>
                    r.reviewId === reviewId ? executedReview : r
                  ),
                }
              : null,
            isSubmitting: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Fetch statistics
      fetchStatistics: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/ncr/statistics`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch statistics');
          }

          const statistics: NcrStatistics = await response.json();
          
          set({ statistics });
        } catch (error) {
          console.error('Failed to fetch statistics:', error);
        }
      },

      // Set selected NCR
      setSelectedNcr: (ncr: Ncr | null) => {
        set({ selectedNcr: ncr });
      },

      // Set page
      setPage: (page: number) => {
        set({ page });
      },

      // Set limit
      setLimit: (limit: number) => {
        set({ limit, page: 1 });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
  })
);
