// src/generate-assessment.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import express, { Request, Response, Router } from 'express';

const router = Router();

// We no longer define GEMINI_API_KEY at the top level here.
// Instead, we will access process.env.GEMINI_API_KEY inside the route handler.

// Define interfaces for type safety
interface GenerateAssessmentRequestBody {
  title: string;
  subject: string;
  grade: string;
  numQuestions?: number;
  questionType?: string;
}

interface GeneratedQuestion {
  question: string;
  options: { [key: string]: string };
  correctAnswer: string;
}

// Define the handler for the POST /api/generate-assessment route
router.post('/generate-assessment', async (req: Request<{}, {}, GenerateAssessmentRequestBody>, res: Response) => {
  // IMPORTANT: Re-check API key here, inside the handler, after dotenv has definitely run.
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('API Error: GEMINI_API_KEY is missing. Request will fail.');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error: Gemini API key is not set.'
    });
  }

  // Initialize genAI and model *inside* the handler or when first needed
  // This ensures process.env has been populated by dotenv.config()
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Or "gemini-1.5-flash"

  const {
    title,
    subject,
    grade,
    numQuestions = 5,
    questionType = 'multiple choice'
  } = req.body;

  // Basic validation
  if (!title || !subject || !grade) {
    return res.status(400).json({ success: false, message: 'Missing required fields: title, subject, or grade.' });
  }

  // Craft a detailed prompt for Gemini.
  const prompt = `
  You are an expert educator tasked with creating assessment questions.
  Generate ${numQuestions} ${questionType} questions for a "${grade}" grade level on the subject of "${subject}".
  The assessment is titled "${title}".

  For each question, provide:
  1. The question text.
  2. Exactly four possible answer choices labeled A, B, C, D.
  3. The single correct answer choice label (e.g., "A", "B", "C", or "D").

  Output the result as a JSON array of objects. Each object should have the following structure:
  {
    "question": "The question text goes here?",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
    "correctAnswer": "A"
  }
  Ensure the JSON is well-formed and can be directly parsed. Do not include any additional text or markdown outside of the JSON array.
  `;

  console.log('Sending prompt to Gemini for:', { title, subject, grade });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw Gemini Response Text:', text); // Log raw text for debugging

    let generatedQuestions: GeneratedQuestion[] = [];
    try {
      const jsonString = text.replace(/```json\n|\n```/g, '').trim();
      generatedQuestions = JSON.parse(jsonString);

      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("Parsed content is not an array or is empty.");
      }
      generatedQuestions.forEach(q => {
        if (!q.question || !q.options || !q.correctAnswer) {
          throw new Error("Invalid question structure in parsed JSON.");
        }
      });

    } catch (parseError) {
      console.error('Error parsing Gemini JSON output:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse generated questions. Gemini might have returned malformed JSON.',
        rawGeminiResponse: text
      });
    }

    res.json({
      success: true,
      questions: generatedQuestions,
      message: `Successfully generated ${generatedQuestions.length} questions.`
    });

  } catch (error: any) {
    console.error('Error communicating with Gemini API:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions due to an API error.',
      error: error.message || 'Unknown error'
    });
  }
});

export { router as generateAssessmentRouter };