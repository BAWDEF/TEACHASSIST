export interface Question {
  id?: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correct_answer: string;
  points: number;
  explanation?: string;
}

export interface Assessment {
  id?: string;
  title: string;
  type: 'Quiz' | 'Test' | 'Worksheet' | 'Exit Ticket';
  subject: string;
  grade: string;
  description?: string;
  time_limit?: number;
  instructions?: string;
  tags: string[];
  questions: Question[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_published: boolean;
  is_assigned: boolean;
  total_questions: number;
  total_points: number;
}

export interface AssessmentFilters {
  search?: string;
  assessment_type?: string;
  subject?: string;
  grade?: string;
  sort_by?: string;
  sort_order?: number;
}

export interface AssessmentStats {
  total_assessments: number;
  total_questions: number;
  total_points: number;
  published_count: number;
  assigned_count: number;
}