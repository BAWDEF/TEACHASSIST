// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { generateAssessmentRouter } from './generate-assessment';
import path from 'path';
import generateLessonPlan from '../route/generate-lesson-plan'; // Keep this import as is, assuming your file structure

// Explicitly tell dotenv where to find the .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('Value of GEMINI_API_KEY from .env (explicit path):', process.env.GEMINI_API_KEY);

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- Route Handling ---
app.use('/api', generateAssessmentRouter);

// Corrected line for lesson plan router:
// This will make the router's internal '/generate-lesson-plan'
// directly accessible at '/TSAI-backend/route/generate-lesson-plan'
app.use('/TSAI-backend/route', generateLessonPlan); // <--- THIS IS THE KEY CHANGE!

// --- Basic Root Route ---
app.get('/', (req, res) => {
  res.status(200).send('TeachAssist Backend Server is running and ready to go, fam!');
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`TeachAssist Backend Server active and listening on port ${port}`);
  console.log(`Access it at: http://localhost:${port}`);
  console.log('Remember to set your GEMINI_API_KEY in your .env file!');
});