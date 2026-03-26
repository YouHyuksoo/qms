import { create } from 'zustand';
import {
  InspectionLot,
  InspectionResult,
  InspectionType,
  InspectionJudgment,
  InspectionStatus,
  InspectionQueryParams,
  CreateInspectionLotRequest,
  CreateInspectionResultRequest,
  InspectionStatistics,
  PaginatedInspectionLots,
} from '@/types';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

interface InspectionState {
  // Data
  lots: InspectionLot[];
  selectedLot: InspectionLot | null;
  total: number;
  page: number;
  limit: number;
  statistics: InspectionStatistics | null;
  
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  fetchLots: (params?: InspectionQueryParams) => Promise<void>;
  fetchLot: (lotNo: string) => Promise<void>;
  createLot: (data: CreateInspectionLotRequest) => Promise<InspectionLot | null>;
  updateLot: (lotNo: string, data: Partial<CreateInspectionLotRequest>) => Promise<boolean>;
  deleteLot: (lotNo: string) => Promise<boolean>;
  addResult: (data: CreateInspectionResultRequest) => Promise<boolean>;
  addResults: (lotNo: string, results: CreateInspectionResultRequest[]) => Promise<boolean>;
  judgeLot: (lotNo: string, judgment: InspectionJudgment, options?: { judgedBy?: string; remarks?: string }) => Promise<{ autoNcrCreated: boolean; ncrNo?: string } | null>;
  fetchStatistics: (inspectionType?: InspectionType) => Promise<void>;
  setSelectedLot: (lot: InspectionLot | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

/**
 * 검사 관리 스토어
 */
export const useInspectionStore = create<InspectionState>()(
  (set, get) => ({
      // Initial state
      lots: [],
      selectedLot: null,
      total: 0,
      page: 1,
      limit: 20,
      statistics: null,
      isLoading: false,
      isSubmitting: false,
      error: null,

      // Fetch lots with pagination and filters
      fetchLots: async (params = {}) => {
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

          const response = await fetch(`${API_BASE_URL}/inspection/lots?${queryParams}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch inspection lots');
          }

          const data: PaginatedInspectionLots = await response.json();
          
          set({
            lots: data.items,
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

      // Fetch single lot with results
      fetchLot: async (lotNo: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/inspection/lots/${lotNo}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch inspection lot');
          }

          const lot: InspectionLot = await response.json();
          
          set({ selectedLot: lot, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Create new lot
      createLot: async (data: CreateInspectionLotRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/inspection/lots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create inspection lot');
          }

          const lot: InspectionLot = await response.json();
          
          set((state) => ({
            lots: [lot, ...state.lots],
            total: state.total + 1,
            isSubmitting: false,
          }));

          return lot;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return null;
        }
      },

      // Update lot
      updateLot: async (lotNo: string, data: Partial<CreateInspectionLotRequest>) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/inspection/lots/${lotNo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update inspection lot');
          }

          const updatedLot: InspectionLot = await response.json();
          
          set((state) => ({
            lots: state.lots.map((l) => (l.lotNo === lotNo ? updatedLot : l)),
            selectedLot: state.selectedLot?.lotNo === lotNo ? updatedLot : state.selectedLot,
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

      // Delete lot
      deleteLot: async (lotNo: string) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/inspection/lots/${lotNo}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete inspection lot');
          }

          set((state) => ({
            lots: state.lots.filter((l) => l.lotNo !== lotNo),
            total: state.total - 1,
            selectedLot: state.selectedLot?.lotNo === lotNo ? null : state.selectedLot,
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

      // Add inspection result
      addResult: async (data: CreateInspectionResultRequest) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/inspection/lots/${data.lotNo}/results`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error('Failed to add inspection result');
          }

          set({ isSubmitting: false });
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Add multiple results
      addResults: async (lotNo: string, results: CreateInspectionResultRequest[]) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/inspection/lots/${lotNo}/results/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ results }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to add inspection results');
          }

          set({ isSubmitting: false });
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return false;
        }
      },

      // Judge lot
      judgeLot: async (lotNo: string, judgment: InspectionJudgment, options = {}) => {
        set({ isSubmitting: true, error: null });
        
        try {
          const queryParams = new URLSearchParams({
            judgment,
            ...(options.judgedBy && { judgedBy: options.judgedBy }),
            ...(options.remarks && { remarks: options.remarks }),
          });

          const response = await fetch(`${API_BASE_URL}/inspection/lots/${lotNo}/judge?${queryParams}`, {
            method: 'POST',
          });
          
          if (!response.ok) {
            throw new Error('Failed to judge inspection lot');
          }

          const result = await response.json();
          
          set((state) => ({
            lots: state.lots.map((l) =>
              l.lotNo === lotNo ? { ...l, judgment, status: InspectionStatus.COMPLETED } : l
            ),
            selectedLot: state.selectedLot?.lotNo === lotNo
              ? { ...state.selectedLot, judgment, status: InspectionStatus.COMPLETED }
              : state.selectedLot,
            isSubmitting: false,
          }));

          return result;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isSubmitting: false,
          });
          return null;
        }
      },

      // Fetch statistics
      fetchStatistics: async (inspectionType?: InspectionType) => {
        try {
          const queryParams = new URLSearchParams();
          if (inspectionType) {
            queryParams.set('inspectionType', inspectionType);
          }

          const response = await fetch(`${API_BASE_URL}/inspection/statistics?${queryParams}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch statistics');
          }

          const statistics: InspectionStatistics = await response.json();
          
          set({ statistics });
        } catch (error) {
          console.error('Failed to fetch statistics:', error);
        }
      },

      // Set selected lot
      setSelectedLot: (lot: InspectionLot | null) => {
        set({ selectedLot: lot });
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
