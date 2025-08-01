// src/routes/generate-lesson-plan.ts
import express from 'express';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Router } from 'express';

const router = Router();

dotenv.config(); // Load environment variables

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Supabase Client (if needed)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized for lesson plans.");
} else {
  console.warn("Supabase credentials not found. Lesson plans will not be saved to DB.");
}

// THIS IS THE ONLY router.post('/generate-lesson-plan', ...) BLOCK YOU NEED
router.post('/generate-lesson-plan', async (req, res) => {
  const {
    topic,
    gradeLevel,
    duration,
    learningObjectives,
    materials,
    assessmentMethod,
    notes,
    standards,
    userId
  } = req.body;

  // Basic validation
  if (!topic || !gradeLevel || !learningObjectives || !userId) {
    return res.status(400).json({ success: false, message: 'Missing required parameters: topic, gradeLevel, learningObjectives, userId.' });
  }

  const durationInMinutes = duration ? parseInt(duration.split(' ')[0]) : null;

  try {
    const prompt = `
      Generate a detailed lesson plan based on the following criteria:

      Topic: ${topic}
      Grade Level: ${gradeLevel}
      Duration: ${duration || 'unspecified'}
      Learning Objectives:
      ${learningObjectives.map((obj: string, i: number) => `- ${obj}`).join('\n')}

      ${materials && materials.length > 0 ? `Materials: ${materials.map((mat: string) => `- ${mat}`).join('\n')}\n` : ''}
      ${assessmentMethod ? `Assessment Method: ${assessmentMethod}\n` : ''}
      ${notes ? `Additional Notes: ${notes}\n` : ''}
      ${standards && standards.length > 0 ? `Educational Standards: ${standards.join(', ')}\n` : ''}

      Please structure the lesson plan clearly with the following sections, using a markdown-friendly format (e.g., bold headings, bullet points). Make sure each section is explicitly present, even if brief.

      **Lesson Title:**
      **Subject:**
      **Grade Level:**
      **Duration:**
      **Learning Objectives:** (List as bullet points)
      **Materials:** (List as bullet points)
      **Procedure:** (Detailed step-by-step, including Introduction, Main Activity, Conclusion)
      **Differentiated Instruction:**
      **Assessment Methods:**
      **Homework:**
      **Notes for Teacher:**
      **Educational Standards:** (List as bullet points, if applicable)
      **Reflection:**
    `;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const generatedText = response.text();

    const extractSection = (text: string, sectionName: string, nextSectionName?: string): string => {
      const startTag = `**${sectionName}:**`;
      const endTag = nextSectionName ? `**${nextSectionName}:**` : '';
      let startIndex = text.indexOf(startTag);

      if (startIndex === -1) return '';
      startIndex += startTag.length;

      let endIndex = text.length;
      if (nextSectionName) {
        const nextStartIndex = text.indexOf(endTag, startIndex);
        if (nextStartIndex !== -1) {
          endIndex = nextStartIndex;
        }
      }
      return text.substring(startIndex, endIndex).trim();
    };

    const lessonTitle = extractSection(generatedText, 'Lesson Title', 'Subject').split('\n')[0].trim();
    const subjectExtracted = extractSection(generatedText, 'Subject', 'Grade Level').split('\n')[0].trim();
    const gradeLevelExtracted = extractSection(generatedText, 'Grade Level', 'Duration').split('\n')[0].trim();
    const durationExtracted = extractSection(generatedText, 'Duration', 'Learning Objectives').split('\n')[0].trim();
    const objectivesExtracted = extractSection(generatedText, 'Learning Objectives', 'Materials').split('\n').filter(Boolean).map(s => s.replace(/^- /, '').trim());
    const materialsExtracted = extractSection(generatedText, 'Materials', 'Procedure').split('\n').filter(Boolean).map(s => s.replace(/^- /, '').trim());
    const procedureExtracted = extractSection(generatedText, 'Procedure', 'Differentiated Instruction').trim();
    const differentiatedInstructionExtracted = extractSection(generatedText, 'Differentiated Instruction', 'Assessment Methods').trim();
    const assessmentMethodsExtracted = extractSection(generatedText, 'Assessment Methods', 'Homework').split('\n')[0].trim();
    const homeworkExtracted = extractSection(generatedText, 'Homework', 'Notes for Teacher').split('\n')[0].trim();
    const notesExtracted = extractSection(generatedText, 'Notes for Teacher', 'Educational Standards').trim();
    const standardsExtracted = extractSection(generatedText, 'Educational Standards', 'Reflection').split('\n').filter(Boolean).map(s => s.replace(/^- /, '').trim());
    const reflectionExtracted = extractSection(generatedText, 'Reflection').trim();


    const lessonPlanData = {
      user_id: userId,
      title: lessonTitle || topic,
      subject: subjectExtracted || topic,
      grade_level: gradeLevelExtracted || gradeLevel,
      duration: durationInMinutes,
      objectives: objectivesExtracted.length > 0 ? objectivesExtracted : learningObjectives,
      materials: materialsExtracted.length > 0 ? materialsExtracted : materials,
      procedure: procedureExtracted || generatedText,
      assessment_methods: assessmentMethodsExtracted || assessmentMethod,
      homework: homeworkExtracted || notes,
      notes: notesExtracted || notes,
      standards: standardsExtracted.length > 0 ? standardsExtracted : standards,
      status: 'draft' as 'draft',
      privacy_level: 'private' as 'private',
      ai_generated: true,
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert([lessonPlanData])
        .select();

      if (error) {
        console.error('Error saving lesson plan to Supabase:', error.message);
        return res.status(500).json({ success: false, message: `Failed to save lesson plan to database: ${error.message}` });
      } else {
        console.log('Lesson plan saved to Supabase:', data);
        res.json({ success: true, lessonPlan: data[0] });
      }
    } else {
      res.json({ success: true, lessonPlan: lessonPlanData });
    }

  } catch (error: any) {
    console.error('Error generating lesson plan:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate lesson plan.' });
  }
});

export default router;