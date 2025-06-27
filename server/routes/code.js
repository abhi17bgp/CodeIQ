import express from 'express';
import axios from 'axios';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Language ID mapping for Judge0
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  go: 60,
  rust: 73,
  php: 68,
  ruby: 72
};

// Execute code
router.post('/execute', authenticate, async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    // Submit code to Judge0
    const submissionResponse = await axios.post(
      `https://${process.env.JUDGE0_HOST}/submissions`,
      {
        source_code: code,
        language_id: languageId,
        stdin: input
      },
      {
        headers: {
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': process.env.JUDGE0_HOST,
          'Content-Type': 'application/json'
        }
      }
    );

    const { token } = submissionResponse.data;

    // Wait for execution and get result
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultResponse = await axios.get(
        `https://${process.env.JUDGE0_HOST}/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'X-RapidAPI-Host': process.env.JUDGE0_HOST
          }
        }
      );

      result = resultResponse.data;
      attempts++;
    } while (result.status?.id <= 2 && attempts < maxAttempts);

    // Format response
    const response = {
      success: result.status?.id === 3,
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      status: result.status?.description || 'Unknown',
      time: result.time || 0,
      memory: result.memory || 0
    };

    res.json(response);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ 
      error: 'Failed to execute code',
      details: error.response?.data?.message || error.message
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = Object.keys(LANGUAGE_IDS).map(lang => ({
    id: lang,
    name: lang.charAt(0).toUpperCase() + lang.slice(1),
    judgeId: LANGUAGE_IDS[lang]
  }));

  res.json(languages);
});

export default router;