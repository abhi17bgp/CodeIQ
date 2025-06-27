import express from 'express';
import CodeFile from '../models/CodeFile.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's files
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {
      author: req.user._id,
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const files = await CodeFile.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username profile.firstName profile.lastName');

    const total = await CodeFile.countDocuments(query);

    res.json({
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// Get single file
router.get('/:id', authenticate, async (req, res) => {
  try {
    const file = await CodeFile.findOne({
      _id: req.params.id,
      $or: [
        { author: req.user._id },
        { isPublic: true }
      ]
    }).populate('author', 'username profile.firstName profile.lastName');

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

// Create new file
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, language, code, input, isPublic, tags } = req.body;

    const file = new CodeFile({
      title,
      description,
      language,
      code,
      input,
      isPublic,
      tags,
      author: req.user._id
    });

    await file.save();
    await file.populate('author', 'username profile.firstName profile.lastName');

    res.status(201).json(file);
  } catch (error) {
    console.error('Create file error:', error);
    res.status(500).json({ error: 'Failed to create file' });
  }
});

// Update file
router.put('/:id', authenticate, async (req, res) => {
  try {
    const file = await CodeFile.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const { title, description, language, code, input, isPublic, tags } = req.body;

    if (title !== undefined) file.title = title;
    if (description !== undefined) file.description = description;
    if (language !== undefined) file.language = language;
    if (code !== undefined) file.code = code;
    if (input !== undefined) file.input = input;
    if (isPublic !== undefined) file.isPublic = isPublic;
    if (tags !== undefined) file.tags = tags;

    await file.save();
    await file.populate('author', 'username profile.firstName profile.lastName');

    res.json(file);
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// Delete file
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const file = await CodeFile.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;