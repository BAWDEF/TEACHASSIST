import { supabase } from '@/lib/supabaseClient'; // Adjust this path if your supabaseClient.ts is located elsewhere

// Define interfaces that match your Supabase table schemas and API responses
export interface QuestionFilters {
  subject?: string;
  grade?: string;
  type?: string;
  searchTerm?: string;
}

export interface GeneratedQuestion {
  id?: string;
  questionText: string;
  questionType: 'multiple-choice' | 'short-answer' | 'true-false';
  options?: string[]; // For multiple-choice questions
  correctAnswer?: string; // For multiple-choice (option text) or true/false ('true'/'false')
  suggestedAnswer?: string; // For short-answer questions
  explanation?: string; // Optional explanation for the answer
}

// Interface for a single question object stored in an assessment's 'questions' JSONB column
interface Question {
  id?: string; // Optional if backend generates it or not needed for client-side storage
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  options?: string[];
  correctAnswer?: string;
  suggestedAnswer?: string;
  explanation?: string;
}

// Interface for the main Assessment object
interface Assessment {
  id: string;
  title: string;
  type: 'Quiz' | 'Test' | 'Worksheet' | 'Exit Ticket';
  subject: string;
  grade: string;
  questions: Question[]; // Stored as JSONB array in Supabase
  timeLimit?: string;
  dateCreated: string;
  hasBeenAssigned: boolean;
  userId: string;
}

// API client for managing assessments
export const assessmentsApi = {
  /**
   * Fetches assessments from Supabase, with optional filters.
   * Assumes 'questions' is a JSONB column that Supabase can directly query or return.
   */
  async getAssessments(filters: QuestionFilters): Promise<Assessment[]> {
    let query = supabase.from('assessments').select(`
      id, title, type, subject, grade, timeLimit, dateCreated, hasBeenAssigned, userId,
      questions // Removed the comment from this line
    `);

    // Apply filters based on the provided criteria
    if (filters.subject) {
      query = query.eq('subject', filters.subject);
    }
    if (filters.grade) {
      query = query.eq('grade', filters.grade);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.searchTerm) {
      // Search across title and question text within the JSONB array
      // This requires Supabase full-text search or a specific JSONB operator
      // For basic string matching, you might need to adjust or use a different approach
      // or ensure your 'questions' column is indexed for full-text search if you
      // use it on the backend.
      query = query.or(`title.ilike.%${filters.searchTerm}%,questions->>text.ilike.%${filters.searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching assessments:", error);
      throw new Error(`Failed to fetch assessments: ${error.message}`);
    }

    // Explicitly cast to unknown first to satisfy TypeScript's strictness
    return data as unknown as Assessment[];
  },

  /**
   * Creates a new assessment in Supabase.
   */
  async createAssessment(assessment: Assessment): Promise<Assessment> {
    const { data, error } = await supabase.from('assessments').insert(assessment).select().single();

    if (error) {
      console.error("Error creating assessment:", error);
      throw new Error(`Failed to create assessment: ${error.message}`);
    }
    return data as Assessment;
  },

  /**
   * Updates an existing assessment in Supabase.
   */
  async updateAssessment(id: string, assessment: Assessment): Promise<Assessment> {
    const { data, error } = await supabase.from('assessments').update(assessment).eq('id', id).select().single();

    if (error) {
      console.error("Error updating assessment:", error);
      throw new Error(`Failed to update assessment: ${error.message}`);
    }
    return data as Assessment;
  },

  /**
   * Deletes an assessment from Supabase by ID.
   */
  async deleteAssessment(id: string): Promise<void> {
    const { error } = await supabase.from('assessments').delete().eq('id', id);

    if (error) {
      console.error("Error deleting assessment:", error);
      throw new Error(`Failed to delete assessment: ${error.message}`);
    }
  },
};

// API client for AI question generation
export const questionsApi = {
  /**
   * Calls an API endpoint to generate questions using AI.
   * You will need to implement this API endpoint on your backend
   * (e.g., a Next.js API route, an Edge Function, or a cloud function)
   * that interacts with your chosen AI model (e.g., Google Gemini, OpenAI GPT).
   */
  async generateQuestions(promptDetails: { topic: string; difficulty: string; questionType: string; numQuestions: number; }): Promise<GeneratedQuestion[]> {
    console.log("Attempting to generate AI questions with:", promptDetails);

    // This is a placeholder for your actual API call to an AI service.
    // Replace '/api/generate-questions' with the actual endpoint that handles
    // AI question generation.
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `AI generation failed with status: ${response.status}`);
      }

      const data: GeneratedQuestion[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error during AI question generation:", error);
      throw new Error(`Could not generate questions: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

