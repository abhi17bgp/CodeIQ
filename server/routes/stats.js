import express from 'express';
import User from '../models/User.js';
import CodeFile from '../models/CodeFile.js';

const router = express.Router();

// Get platform statistics
router.get('/', async (req, res) => {
  try {
    console.log('Stats route called');
    
    // Check if models are available
    if (!User || !CodeFile) {
      console.error('Models not available');
      return res.status(500).json({ error: 'Database models not initialized' });
    }

    const totalUsers = await User.countDocuments();
    const totalFiles = await CodeFile.countDocuments();
    
    console.log('Stats retrieved:', { totalUsers, totalFiles });
    
    // Format numbers with + suffix (e.g., 9+ users, 10+ files)
    const formatCount = (count) => {
      if (count >= 1000) {
        return `${Math.floor(count / 1000)}K+`;
      } else if (count >= 100) {
        return `${Math.floor(count / 100) * 100}+`;
      } else if (count >= 10) {
        // For numbers 10-99, round down to nearest 10 and add +
        return `${Math.floor(count / 10) * 10}+`;
      } else if (count > 0) {
        // For numbers 1-9, show exact count with +
        return `${count}+`;
      }
      return '0';
    };

    const response = {
      totalUsers: totalUsers,
      totalFiles: totalFiles,
      formattedUsers: formatCount(totalUsers),
      formattedFiles: formatCount(totalFiles)
    };
    
    console.log('Sending stats response:', response);
    res.json(response);
  } catch (error) {
    console.error('Stats error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to retrieve statistics',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

