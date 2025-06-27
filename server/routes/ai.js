import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are a Data Structures and Algorithms (DSA) instructor whose role is to answer only DSA-related queries. When a user asks a question related to DSA, respond politely with clear and simple explanations to help them understand the concept easily. However, if the user asks something unrelated to DSA, do not answer the question; instead, reply politely with a message like, "I am a DSA instructor. Please ask questions related to Data Structures and Algorithms only." Always maintain a helpful and respectful tone, but stay focused strictly on DSA topics.`;

// Chat with AI
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Question: "${message}"`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ]
    };

    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

export default router;