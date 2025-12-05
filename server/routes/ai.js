import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are an expert Data Structures and Algorithms (DSA) instructor and code assistant. Your primary role is to:

1. **Answer DSA-Related Questions**: Help users understand DSA concepts, algorithms, data structures, time/space complexity, and problem-solving approaches.

2. **Code Analysis & Assistance**: 
   - Analyze code written by users in the code editor
   - Help write, fix, optimize, and explain DSA-related code
   - Provide code examples for DSA problems (arrays, linked lists, trees, graphs, sorting, searching, dynamic programming, etc.)
   - When users ask to "write code for [DSA topic]", provide complete, working code in their selected language

3. **Code Fixing & Debugging**:
   - Identify syntax errors, logical errors, and bugs in DSA code
   - Suggest fixes and improvements
   - Explain what went wrong and why

4. **Code Execution & Input Handling**: 
   - When users ask to "run", "execute", or "test" the code, the code will be AUTOMATICALLY executed by the system
   - Acknowledge that you're running the code and the results will appear in the output panel
   - You can see the execution results and help debug based on output/errors
   - If code execution fails, provide fixes and explanations
   - **CRITICAL**: If code requires multiple inputs (e.g., "Enter number a" then "Enter number b"), explain that ALL inputs must be provided in the input field at once, separated by newlines
   - Example: For code asking "Enter a: " then "Enter b: ", user must provide: "5\\n10" (each on new line)
   - The execution system is NOT interactive - all inputs must be pre-written
   - When user says "run it", "run the code", "execute", etc., respond briefly acknowledging execution and let the system handle it automatically

5. **Context Awareness**:
   - You have access to the user's current code in the editor
   - You can see the programming language they're using
   - You can see any input they've provided
   - You can see execution errors/output
   - Use this context to provide relevant, personalized assistance

**Important Guidelines**:
- Focus on DSA topics: algorithms, data structures, problem-solving, complexity analysis
- When users ask about code (writing, fixing, running), help them with DSA-related code
- If asked about non-DSA topics (like general programming, web development, etc.), politely redirect: "I'm a DSA instructor. I can help you with Data Structures and Algorithms, code analysis, and DSA problem-solving. How can I assist you with DSA?"
- Always provide clear, educational explanations
- When providing code, include comments and explanations
- Be encouraging and supportive

Remember: Writing code for DSA problems, analyzing DSA code, fixing DSA algorithms, and explaining DSA concepts are all within your scope.`;

// Helper function to summarize chat history
async function summarizeChatHistory(chatHistory, modelName, apiKey) {
  if (!chatHistory || chatHistory.length === 0) {
    return null;
  }

  try {
    // Format chat history for summarization
    const historyText = chatHistory
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`)
      .join('\n\n');

    const summaryPrompt = `Please provide a brief, concise summary (2-3 sentences maximum) of the following conversation context. Focus on the main topics discussed, any problems the user was working on, and key information that would be relevant for continuing the conversation:\n\n${historyText}\n\nSummary:`;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const summaryResponse = await axios.post(API_URL, {
      contents: [{
        parts: [{ text: summaryPrompt }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });

    if (summaryResponse.data.candidates && summaryResponse.data.candidates.length > 0) {
      return summaryResponse.data.candidates[0].content.parts[0].text;
    }
  } catch (error) {
    console.error('Error summarizing chat history:', error.message);
    // If summarization fails, return null and continue without summary
  }

  return null;
}

// Chat with AI
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, chatHistory, code, language, error, input } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'AI service configuration error',
        details: 'API key is not configured. Please set GEMINI_API_KEY in your environment variables.'
      });
    }

    // Use a valid Gemini model name
    // Available models: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash-exp
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    // Summarize chat history if provided
    let contextSummary = null;
    if (chatHistory && chatHistory.length > 0) {
      contextSummary = await summarizeChatHistory(chatHistory, modelName, process.env.GEMINI_API_KEY);
    }

    // Build the message with all available context
    let contextualMessage = '';
    
    // Add previous conversation summary if available
    if (contextSummary) {
      contextualMessage += `Previous conversation context:\n${contextSummary}\n\n`;
    }
    
    // Add code context if available
    if (code || error || input !== undefined) {
      contextualMessage += `User Question: ${message}\n\n`;
      
      if (code) {
        contextualMessage += `Current Code (${language || 'unknown language'}):\n\`\`\`${language || 'text'}\n${code}\n\`\`\`\n\n`;
      }
      
      if (input !== undefined) {
        contextualMessage += `Current Input provided:\n\`\`\`\n${input || '(empty)'}\n\`\`\`\n\n`;
      }
      
      if (error) {
        contextualMessage += `Error/Output:\n\`\`\`\n${error}\n\`\`\`\n\n`;
      }
      
      contextualMessage += `IMPORTANT INPUT FORMATTING: 
- If the code requires multiple inputs (like "Enter number a" then "Enter number b"), ALL inputs must be provided in the input field at once, separated by newlines.
- Example: If code asks for 2 numbers, provide: "5\\n10" (each on a new line)
- The code execution system reads all inputs at once, not interactively.
- If user's code asks for inputs but they haven't provided them correctly, explain how to format the inputs properly.

Please analyze the code and help fix any issues. If the user asks to fix the code, provide the corrected version in a code block.`;
    } else {
      // No code context, just use the message (with summary if available)
      contextualMessage += message;
    }
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: contextualMessage
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: SYSTEM_PROMPT
          }
        ]
      }
    };

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    });

    // Handle the response structure
    if (!response.data.candidates || response.data.candidates.length === 0) {
      return res.status(500).json({ 
        error: 'No response from AI',
        details: 'The AI did not generate a response'
      });
    }

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Log the full error details for debugging
    if (error.response?.data) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.error?.message || 'Bad Request';
      
      if (errorMessage.includes('API Key') || errorMessage.includes('API_KEY')) {
        return res.status(500).json({ 
          error: 'Invalid API Key',
          details: 'The Gemini API key is invalid or not properly configured. Please check your GEMINI_API_KEY environment variable.'
        });
      }
      
      if (errorMessage.includes('model') || errorMessage.includes('Model')) {
        return res.status(500).json({ 
          error: 'Invalid Model',
          details: 'The specified model is not available. Please check the model name or use a different model.'
        });
      }
      
      return res.status(400).json({ 
        error: 'Invalid request',
        details: errorMessage
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

export default router;