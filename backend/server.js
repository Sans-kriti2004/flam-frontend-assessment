const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables from root first, fallback to local backend dir
const rootEnvPath = path.join(__dirname, '..', '.env');
const localEnvPath = path.join(__dirname, '.env');

if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else if (fs.existsSync(localEnvPath)) {
  require('dotenv').config({ path: localEnvPath });
} else {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// JSON Schema definition for Gemini
const STUDY_MATERIAL_SCHEMA = {
  type: "OBJECT",
  properties: {
    topic: { type: "STRING", description: "The overarching topic or subject of the study material" },
    summary: { type: "STRING", description: "A detailed summary, key takeaways, and context about the topic (1-2 paragraphs)" },
    roadmap: {
      type: "ARRAY",
      description: "A step-by-step learning path or roadmap to master this topic, containing 3 to 5 logical phases",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING", description: "Unique identifier, e.g., rm-1" },
          title: { type: "STRING", description: "Title of the learning step" },
          description: { type: "STRING", description: "Short description of what to learn or do in this phase" }
        },
        required: ["id", "title", "description"]
      }
    },
    flashcards: {
      type: "ARRAY",
      description: "A set of 5 to 8 interactive flashcards. Each card has a concept/term on front and explanation/details on back",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING", description: "Unique identifier, e.g., fc-1" },
          front: { type: "STRING", description: "The front side of the flashcard: a term, question, or key concept" },
          back: { type: "STRING", description: "The back side of the flashcard: the explanation, answer, or formula" }
        },
        required: ["id", "front", "back"]
      }
    },
    quiz: {
      type: "ARRAY",
      description: "A multiple-choice quiz with 5 to 8 conceptual questions testing understanding of the topic",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING", description: "Unique identifier, e.g., q-1" },
          question: { type: "STRING", description: "The quiz question" },
          options: {
            type: "ARRAY",
            description: "Exactly 4 options, including the correct one",
            items: { type: "STRING" }
          },
          correctAnswer: { type: "STRING", description: "The exact string match of the correct option (must be one of the elements in the options array)" },
          explanation: { type: "STRING", description: "Detailed explanation of why this answer is correct and why other options are incorrect" }
        },
        required: ["id", "question", "options", "correctAnswer", "explanation"]
      }
    }
  },
  required: ["topic", "summary", "roadmap", "flashcards", "quiz"]
};

// Route: Status check
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', apiConfigured: !!process.env.GEMINI_API_KEY });
});

// Helper: Call Gemini API
async function callGemini(promptText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured. Please add your key to the .env file.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: promptText
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: STUDY_MATERIAL_SCHEMA,
        temperature: 0.2 // Lower temperature for more consistent structural adherence
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error Response:', errorText);
    throw new Error(`Gemini API returned status ${response.status}: ${errorText || 'Unknown error'}`);
  }

  const result = await response.json();
  
  try {
    const textOutput = result.candidates[0].content.parts[0].text;
    return JSON.parse(textOutput);
  } catch (err) {
    console.error('Failed to parse Gemini output:', err, result);
    throw new Error('The AI model returned invalid or malformed content. Please try again.');
  }
}

// Route: Generate study material
app.post('/api/generate', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide some notes or a topic to study.' });
    }

    console.log(`Generating study material for input length: ${content.length}`);

    const promptText = `
You are an expert, highly pedagogical AI Study Assistant.
Your task is to analyze the following user input (which may be free-form notes, textbook transcripts, concepts, or a general topic) and generate comprehensive, interactive study material.

User input:
"""
${content}
"""

Instructions:
1. Conduct a deep analysis of the provided text/topic.
2. Formulate a concise summary that explains the core concepts clearly.
3. Build a sequential roadmap (3-5 steps) outlining how a learner should progress through this topic, with descriptive titles and action-oriented summaries.
4. Design a set of 5-8 flashcards covering terms, definitions, key formulas, or concepts. Keep front simple and back descriptive.
5. Create a 5-8 question multiple-choice quiz. Ensure questions are challenging and conceptual. Each question must have exactly 4 choices, a correct answer that matches one choice exactly, and a detailed educational explanation.
6. The entire output MUST be in valid JSON conforming to the requested schema. Do not include markdown wraps or anything outside the JSON structure.
`;

    const studyData = await callGemini(promptText);
    res.json(studyData);

  } catch (error) {
    console.error('Error in /api/generate:', error);
    res.status(500).json({ error: error.message || 'Failed to generate study materials.' });
  }
});

// Route: Refine existing study material
app.post('/api/refine', async (req, res) => {
  try {
    const { currentMaterial, refinementInstructions } = req.body;
    
    if (!currentMaterial || typeof currentMaterial !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid current study material.' });
    }
    if (!refinementInstructions || refinementInstructions.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide instructions on what you want to refine.' });
    }

    console.log(`Refining study material for topic: "${currentMaterial.topic}" with instruction: "${refinementInstructions}"`);

    const promptText = `
You are an expert AI Study Assistant.
You are given the following existing study material in JSON format:
"""
${JSON.stringify(currentMaterial, null, 2)}
"""

The user wants to refine/modify this material with the following instructions:
"${refinementInstructions}"

Your instructions are:
1. Apply the user's modifications to the study material.
2. You can rewrite explanations, add/replace flashcards, change quiz questions, or expand the roadmap as requested.
3. Keep unmodified portions consistent if they are still relevant.
4. Ensure the updated material continues to follow the pedagogical, clear, and high-quality tone.
5. Ensure the final response strictly matches the JSON schema structure. Do not output anything other than the JSON object.
`;

    const refinedData = await callGemini(promptText);
    res.json(refinedData);

  } catch (error) {
    console.error('Error in /api/refine:', error);
    res.status(500).json({ error: error.message || 'Failed to refine study materials.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
