// Groq service for generating course content
// Handles AI-powered syllabus and study plan generation using Groq (fastest inference)

import Groq from 'groq-sdk';
import env from '../config/env.js';
import { AppError } from '../utils/errors.js';

// Initialize Groq client
const groq = new Groq({
  apiKey: env.groqApiKey,
});

/**
 * Generate a structured course syllabus and study plan using Groq AI
 * 
 * Groq provides ultra-fast inference with zero lag, making course generation
 * much faster than traditional APIs.
 * 
 * This function:
 * 1. Creates a prompt with user requirements
 * 2. Calls Groq API to generate structured JSON
 * 3. Validates and parses the response
 * 4. Retries if response is malformed
 * 
 * @param {string} topic - Learning topic
 * @param {string} level - Skill level (beginner/intermediate/advanced)
 * @param {number} days - Total number of days
 * @param {number} timePerDay - Minutes per day
 * @returns {object} Structured course plan
 */
export const generateCoursePlan = async (topic, level, days, timePerDay) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Optimized prompt with day-level quizzes (4-5 per day)
      const prompt = `Create a ${days}-day study plan for "${topic}" (${level} level, ${timePerDay} min/day).

Return JSON only (no markdown):
{
  "overview": {
    "title": "Course Title",
    "description": "Brief description",
    "objectives": ["obj1", "obj2", "obj3"]
  },
  "modules": [
    {"id": "m1", "title": "Module Name", "description": "Brief", "objectives": ["obj"]}
  ],
  "dailyPlan": [
    {
      "day": 1,
      "moduleId": "m1",
      "lessons": [
        {
          "id": "l1",
          "title": "Lesson Title",
          "description": "Brief description",
          "objectives": ["learning objective"],
          "timeMinutes": ${Math.floor(timePerDay / 2)},
          "keywords": ["keyword1", "keyword2"],
          "importance": "core"
        }
      ],
      "quizzes": [
        {
          "question": "Question testing understanding of this day's lessons",
          "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
          "correctAnswer": "A",
          "explanation": "Why A is correct based on the lesson content"
        }
      ]
    }
  ]
}

STRICT Requirements:
- Exactly ${days} days in dailyPlan array
- 2-3 lessons per day, ~${timePerDay} min total per day
- importance: "core", "important", or "bonus"
- EXACTLY 4-5 quizzes per day (at day level, NOT inside lessons)
- Each quiz tests understanding of THAT DAY's specific lessons
- Each quiz has: question, options (4 choices with A/B/C/D prefix), correctAnswer (A/B/C/D), explanation`;

      // Call Groq API with timeout (60 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - Groq took too long to respond')), 60000)
      );

      // Current active Groq models (updated March 2025)
      // llama-3.1-70b-versatile was deprecated Jan 24 2025 → replaced by llama-3.3-70b-versatile
      // mixtral-8x7b-32768 was deprecated → use gemma2-9b-it as fallback
      const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];
      let response;
      let lastError;

      for (const model of models) {
        try {
          const apiPromise = groq.chat.completions.create({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational course designer. Always return valid JSON only, no markdown, no code blocks. Start with { and end with }.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 8000,
          });

          response = await Promise.race([apiPromise, timeoutPromise]);
          console.log(`✅ Successfully used model: ${model}`);
          break; // Success, exit loop
        } catch (modelError) {
          lastError = modelError;
          if (modelError.message?.includes('decommissioned') || modelError.status === 400) {
            console.log(`⚠️ Model ${model} not available, trying next...`);
            continue; // Try next model
          } else {
            throw modelError; // Other errors, throw immediately
          }
        }
      }

      if (!response) {
        throw lastError || new Error('All Groq models failed or are decommissioned');
      }

      // Extract content from response
      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Empty response from Groq');
      }

      // Remove markdown code blocks if present
      let jsonString = content;
      if (content.startsWith('```')) {
        jsonString = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      // Attempt to repair truncated JSON (happens when response hits token limit)
      const repairTruncatedJson = (str) => {
        // Count open brackets/braces and close any that are unclosed
        let depth = 0;
        let inString = false;
        let escape = false;
        const stack = [];
        for (let i = 0; i < str.length; i++) {
          const ch = str[i];
          if (escape) { escape = false; continue; }
          if (ch === '\\' && inString) { escape = true; continue; }
          if (ch === '"') { inString = !inString; continue; }
          if (inString) continue;
          if (ch === '{') stack.push('}');
          else if (ch === '[') stack.push(']');
          else if (ch === '}' || ch === ']') stack.pop();
        }
        // Close all unclosed structures
        return str + stack.reverse().join('');
      };


      // Parse JSON — try raw first, then attempt repair for truncated responses
      let coursePlan;
      try {
        coursePlan = JSON.parse(jsonString);
      } catch (parseError) {
        console.warn('JSON parse failed, attempting truncation repair...', parseError.message);
        try {
          coursePlan = JSON.parse(repairTruncatedJson(jsonString));
          console.log('✅ Truncated JSON successfully repaired');
        } catch (repairError) {
          throw new Error(`Invalid JSON from Groq: ${parseError.message}`);
        }
      }

      // Validate structure
      if (!coursePlan.overview || !coursePlan.modules || !coursePlan.dailyPlan) {
        throw new Error('Invalid course plan structure');
      }

      // Validate daily plan matches requested days
      if (coursePlan.dailyPlan.length !== days) {
        throw new Error(`Daily plan has ${coursePlan.dailyPlan.length} days, expected ${days}`);
      }

      // QUIZ VALIDATION: Warn only — don't throw so we avoid unnecessary retries
      coursePlan.dailyPlan.forEach((day, index) => {
        const dayNum = day.day || index + 1;

        if (!day.quizzes || !Array.isArray(day.quizzes) || day.quizzes.length === 0) {
          // Ensure quizzes array exists (even if empty)
          day.quizzes = [];
          console.warn(`Day ${dayNum}: No quizzes returned, defaulting to empty array`);
        } else {
          // Filter out malformed quizzes instead of rejecting entire response
          day.quizzes = day.quizzes.filter((quiz, qIndex) => {
            const isValid =
              quiz.question &&
              Array.isArray(quiz.options) &&
              quiz.options.length === 4 &&
              quiz.correctAnswer &&
              ['A', 'B', 'C', 'D'].includes(quiz.correctAnswer) &&
              quiz.explanation;
            if (!isValid) {
              console.warn(`Day ${dayNum}, Quiz ${qIndex + 1}: Malformed quiz removed`);
            }
            return isValid;
          });
        }
      });

      console.log(`✅ Course plan validated: ${coursePlan.dailyPlan.length} days, ${coursePlan.dailyPlan.reduce((sum, d) => sum + (d.quizzes?.length || 0), 0)} total quizzes`);

      return coursePlan;
    } catch (error) {
      attempt++;
      
      // Log detailed error for debugging
      console.error(`Groq attempt ${attempt} failed:`, {
        message: error.message,
        status: error.status,
        code: error.code,
        type: error.type,
      });
      
      if (attempt >= maxRetries) {
        console.error('Groq generation failed after all retries:', error);
        
        // Provide more specific error message
        let errorMessage = 'Failed to generate course plan. Please try again.';
        
        if (error.status === 401) {
          errorMessage = 'Invalid Groq API key. Please check your API key.';
        } else if (error.status === 400) {
          // Model decommissioned or invalid request
          if (error.message?.includes('decommissioned')) {
            errorMessage = 'The Groq model has been decommissioned. Please check available models at https://console.groq.com/docs/models';
          } else {
            errorMessage = `Groq API error: ${error.message || 'Invalid request'}`;
          }
        } else if (error.status === 429) {
          errorMessage = 'Groq API rate limit exceeded. Please try again later.';
        } else if (error.status === 402 || error.code === 'insufficient_quota') {
          errorMessage = 'Insufficient Groq credits. Please check your account.';
        } else if (error.message) {
          errorMessage = `Groq error: ${error.message}`;
        }
        
        throw new AppError(errorMessage, 500);
      }

      // Wait before retry (exponential backoff)
      // Groq is fast, so shorter wait times
      let waitTime;
      if (error.status === 429) {
        // Rate limit: wait 10 seconds (Groq has higher limits)
        waitTime = 10000; // 10 seconds
        console.log(`⏳ Rate limit detected. Waiting ${waitTime/1000} seconds before retry ${attempt}/${maxRetries}...`);
      } else {
        // Other errors: exponential backoff
        waitTime = 1000 * attempt;
        console.log(`⏳ Waiting ${waitTime/1000} seconds before retry ${attempt}/${maxRetries}...`);
      }
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

/**
 * Regenerate a single day in an existing course plan
 *
 * @param {object} existingPlan - The existing course plan
 * @param {number} dayNumber - The day number to regenerate (1-indexed)
 * @param {string} topic - Course topic
 * @param {string} level - Skill level
 * @param {number} timePerDay - Minutes per day
 * @returns {object} Updated day content
 */
export const regenerateSingleDay = async (existingPlan, dayNumber, topic, level, timePerDay) => {
  const maxRetries = 3;
  let attempt = 0;

  // Get module context if available
  const dayToRegenerate = existingPlan.dailyPlan?.find(d => d.day === dayNumber);
  const moduleId = dayToRegenerate?.moduleId;
  const moduleInfo = existingPlan.modules?.find(m => m.id === moduleId);

  while (attempt < maxRetries) {
    try {
      const prompt = `Regenerate day ${dayNumber} for "${topic}" course (${level} level, ${timePerDay} min/day).

${moduleInfo ? `This day belongs to module: "${moduleInfo.title}" - ${moduleInfo.description}` : ''}

Return JSON only for a SINGLE day:
{
  "day": ${dayNumber},
  "moduleId": "${moduleId || 'm1'}",
  "lessons": [
    {
      "id": "l1",
      "title": "Lesson Title",
      "description": "Brief description",
      "objectives": ["obj1", "obj2"],
      "timeMinutes": ${Math.floor(timePerDay / 2)},
      "keywords": ["keyword1", "keyword2"],
      "importance": "core",
      "quiz": [
        {
          "question": "Quiz question",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "correctAnswer": "A",
          "explanation": "Why A is correct"
        }
      ]
    }
  ]
}

Requirements:
- 2-3 lessons for this day
- Total ~${timePerDay} minutes
- Mix of importance levels (core/important/bonus)
- 2-3 quiz questions per lesson
- Different content from the previous version`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 60000)
      );

      const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];
      let response;
      let lastError;

      for (const model of models) {
        try {
          const apiPromise = groq.chat.completions.create({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational course designer. Return valid JSON only, no markdown.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.8, // Higher temperature for more variety
            max_tokens: 2000,
          });

          response = await Promise.race([apiPromise, timeoutPromise]);
          console.log(`✅ Successfully used model: ${model} for day regeneration`);
          break;
        } catch (modelError) {
          lastError = modelError;
          if (modelError.message?.includes('decommissioned') || modelError.status === 400) {
            console.log(`⚠️ Model ${model} not available, trying next...`);
            continue;
          } else {
            throw modelError;
          }
        }
      }

      if (!response) {
        throw lastError || new Error('All Groq models failed');
      }

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Empty response from Groq');
      }

      // Remove markdown code blocks if present
      let jsonString = content;
      if (content.startsWith('```')) {
        jsonString = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const regeneratedDay = JSON.parse(jsonString);

      // Validate structure
      if (!regeneratedDay.lessons || !Array.isArray(regeneratedDay.lessons)) {
        throw new Error('Invalid day structure');
      }

      return regeneratedDay;
    } catch (error) {
      attempt++;

      console.error(`Day regeneration attempt ${attempt} failed:`, error.message);

      if (attempt >= maxRetries) {
        throw new AppError('Failed to regenerate day. Please try again.', 500);
      }

      const waitTime = 1000 * attempt;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

