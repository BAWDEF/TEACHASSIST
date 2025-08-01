import { useState, useEffect } from 'react';
import { Assessment, AssessmentFilters } from '../types/Assesment';
import { assessmentAPI } from "../services/api";

export const useAssessments = (filters: AssessmentFilters = {}) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentAPI.getAssessments(filters);
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [JSON.stringify(filters)]);

  const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'created_at' | 'updated_at' | 'total_questions' | 'total_points'>) => {
    try {
      const newAssessment = await assessmentAPI.createAssessment(assessmentData);
      setAssessments(prev => [newAssessment, ...prev]);
      return newAssessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assessment');
      throw err;
    }
  };

  const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      const updatedAssessment = await assessmentAPI.updateAssessment(id, updates);
      setAssessments(prev => 
        prev.map(assessment => 
          assessment.id === id ? updatedAssessment : assessment
        )
      );
      return updatedAssessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assessment');
      throw err;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      await assessmentAPI.deleteAssessment(id);
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
      throw err;
    }
  };

  const duplicateAssessment = async (id: string) => {
    try {
      const duplicatedAssessment = await assessmentAPI.duplicateAssessment(id);
      setAssessments(prev => [duplicatedAssessment, ...prev]);
      return duplicatedAssessment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate assessment');
      throw err;
    }
  };

  return {
    assessments,
    loading,
    error,
    refetch: fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    duplicateAssessment
  };
};