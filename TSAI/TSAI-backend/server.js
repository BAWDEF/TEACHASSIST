import dotenv from 'dotenv';
dotenv.config(); // Loads your GEMINI_API_KEY from the .env file

import express from 'express'; // The web framework for Node.js
import bodyParser from 'body-parser'; // To parse JSON data sent from your frontend
import cors from 'cors'; // To allow your frontend (on a different port) to talk to this backend

import { GoogleGenerativeAI } from '@google/generative-ai'; // The official Google SDK for Gemini

const app = express();
const port = process.env.PORT || 3001; // Your backend server will listen on this port

app.use(cors()); // Apply the CORS middleware
app.use(bodyParser.json()); // Apply the body-parser middleware

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


if (!GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set in your .env file.');
    console.error('Please get your API key from https://aistudio.google.com/app/apikey and add it to .env');
    process.exit(1); // Stop the server if the key is missing
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// IMPORTANT: Changed model from "gemini-pro" to "gemini-1.5-flash" for better availability and performance
// If you encounter issues, check Google's documentation for currently available models.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/generate-questions', async (req, res) => {
    const { topic, grade, numQuestions, questionType } = req.body;

    if (!topic || !grade || !numQuestions || numQuestions <= 0) {
        return res.status(400).json({ message: 'Missing or invalid parameters for AI generation.' });
    }

    try {
        let prompt = `Generate ${numQuestions} questions about "${topic}" for a ${grade} level.`;
        prompt += ` Ensure the questions are clear, grammatically correct, and relevant to the topic.`;
        prompt += ` Format the output as a JSON array of objects.`;
        prompt += ` Each question object MUST have an "id" (unique string), "text" (the question string), and "type" property.`;

        if (questionType === 'multiple-choice' || questionType === 'any') {
            prompt += `\nFor multiple-choice questions, each object MUST also have an "options" array (exactly 4 distinct string options) and a "correctAnswer" property (the text of the correct option).`;
            prompt += ` Example MC: {"id": "uniqueId1", "text": "What is 2+2?", "type": "multiple-choice", "options": ["3", "4", "5", "6"], "correctAnswer": "4"}`;
        }
        if (questionType === 'short-answer' || questionType === 'any') {
            prompt += `\nFor short-answer questions, each object MUST also have a "suggestedAnswer" property (a brief string).`;
            prompt += ` Example SA: {"id": "uniqueId2", "text": "Explain photosynthesis.", "type": "short-answer", "suggestedAnswer": "Process by which plants convert light energy into chemical energy."}`;
        }
        if (questionType === 'true-false' || questionType === 'any') {
            prompt += `\nFor true/false questions, each object MUST also have a "correctAnswer" property (either "True" or "False").`;
            prompt += ` Example TF: {"id": "uniqueId3", "text": "The Earth is flat.", "type": "true-false", "correctAnswer": "False"}`;
        }

        prompt += `\nDo NOT include any conversational text, preamble, or postamble outside the JSON array. Just the JSON array itself.`;
        prompt += `\nIf you cannot generate a specific question type, generate another type instead, but maintain the total number of questions.`;

        console.log(`Sending prompt to Gemini: \n${prompt}\n`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let aiText = response.text();

        console.log(`Received raw AI response:\n${aiText}\n`);

        // Robust parsing: Attempt to extract JSON from various common AI outputs
        let jsonString = aiText.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.substring(jsonString.indexOf('\n') + 1, jsonString.lastIndexOf('```')).trim();
        } else if (jsonString.startsWith('```')) { // Handle generic code blocks
            jsonString = jsonString.substring(jsonString.indexOf('\n') + 1, jsonString.lastIndexOf('```')).trim();
        }
        // Attempt to find the first '[' and last ']' to isolate the JSON array
        const firstBracket = jsonString.indexOf('[');
        const lastBracket = jsonString.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            jsonString = jsonString.substring(firstBracket, lastBracket + 1);
        }

        let generatedQuestions;
        try {
            generatedQuestions = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', jsonString, parseError);
            return res.status(500).json({ message: 'AI returned malformed JSON or unexpected text. Please try again or refine your prompt.' });
        }

        // Validate the structure of the AI's output
        if (!Array.isArray(generatedQuestions) || generatedQuestions.some(q => !q.text || !q.type)) {
            console.warn('AI generated questions in an unexpected format after parsing (missing text/type):', generatedQuestions);
            return res.status(500).json({ message: 'AI generated questions in an unexpected format. Verify prompt and model behavior.' });
        }

        // Add unique IDs (important for React lists and potential database storage)
        const questionsWithIds = generatedQuestions.map((q, index) => ({
            ...q,
            id: `ai-q-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 9)}` // Ensure unique IDs
        }));

        res.json(questionsWithIds);

    } catch (error) {
        console.error('Error generating questions with Gemini API:', error);
        res.status(500).json({ message: 'An unexpected error occurred during AI generation. Check backend logs for details.' });
    }
});

app.listen(port, () => {
    console.log(`TeachAssist backend server listening on http://localhost:${port}`);
    console.log('Ensure your Gemini API Key is set in the .env file!');
});
