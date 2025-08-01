import axios from 'axios';
import { Assessment, AssessmentFilters, AssessmentStats } from '../types/Assesment';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const assessmentAPI = {
  // Get all assessments with filters
  getAssessments: async (filters: AssessmentFilters = {}, skip = 0, limit = 20): Promise<Assessment[]> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.assessment_type) params.append('assessment_type', filters.assessment_type);
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order !== undefined) params.append('sort_order', filters.sort_order.toString());
    
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    // 👇 FIX: Add <Assessment[]> generic type here
    const response = await api.get<Assessment[]>(`/assessments?${params.toString()}`);
    return response.data;
  },

  // Get single assessment by ID
  getAssessment: async (id: string): Promise<Assessment> => {
    // 👇 FIX: Add <Assessment> generic type here
    const response = await api.get<Assessment>(`/assessments/${id}`);
    return response.data;
  },

  // Create new assessment
  createAssessment: async (assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at' | 'total_questions' | 'total_points'>): Promise<Assessment> => {
    // 👇 FIX: Add <Assessment> generic type here
    const response = await api.post<Assessment>('/assessments', assessment);
    return response.data;
  },

  // Update assessment
  updateAssessment: async (id: string, assessment: Partial<Assessment>): Promise<Assessment> => {
    // 👇 FIX: Add <Assessment> generic type here
    const response = await api.put<Assessment>(`/assessments/${id}`, assessment);
    return response.data;
  },

  // Delete assessment (return type is Promise<void>, so no data to type)
  deleteAssessment: async (id: string): Promise<void> => {
    await api.delete(`/assessments/${id}`);
  },

  // Duplicate assessment
  duplicateAssessment: async (id: string): Promise<Assessment> => {
    // 👇 FIX: Add <Assessment> generic type here
    const response = await api.post<Assessment>(`/assessments/${id}/duplicate`);
    return response.data;
  },

  // Get assessment statistics
  getStats: async (): Promise<AssessmentStats> => {
    // 👇 FIX: Add <AssessmentStats> generic type here
    const response = await api.get<AssessmentStats>('/assessments/stats/overview');
    return response.data;
  },

  // Get assessment types count
  getTypesCount: async (): Promise<Record<string, number>> => {
    // 👇 FIX: Add <Record<string, number>> generic type here
    const response = await api.get<Record<string, number>>('/assessments/stats/types');
    return response.data;
  },
};

export default api;