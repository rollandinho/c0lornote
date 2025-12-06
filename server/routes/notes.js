const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');
const Note = require('../models/Note');
const User = require('../models/User');

// Create a new note
router.post('/', auth, createLimiter, async (req, res) => {
  try {
    const { content, color, backgroundColor, tags, isPublic } = req.body;

    const note = new Note({
      author: req.userId,
      content,
      color: color || '#FFD700',
      backgroundColor: backgroundColor || '#ffffff',
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    await note.save();
    
    const populatedNote = await Note.findById(note._id)
      .populate('author', 'username displayName avatar');

    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// Get feed (notes from followed users and own notes)
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const followingIds = [...user.following, req.userId];

    const notes = await Note.find({
      author: { $in: followingIds },
      isPublic: true,
    })
      .populate('author', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed', error: error.message });
  }
});

// Get public notes (discover feed)
router.get('/public', async (req, res) => {
  try {
    const notes = await Note.find({ isPublic: true })
      .populate('author', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public notes', error: error.message });
  }
});

// Get notes by user
router.get('/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notes = await Note.find({
      author: user._id,
      isPublic: true,
    })
      .populate('author', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user notes', error: error.message });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { content, color, backgroundColor, tags, isPublic } = req.body;

    if (content) note.content = content;
    if (color) note.color = color;
    if (backgroundColor) note.backgroundColor = backgroundColor;
    if (tags) note.tags = tags;
    if (isPublic !== undefined) note.isPublic = isPublic;

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate('author', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar');

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

// Like note
router.post('/:id/like', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Note already liked' });
    }

    note.likes.push(req.userId);
    await note.save();

    res.json({ message: 'Note liked successfully', likesCount: note.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking note', error: error.message });
  }
});

// Unlike note
router.delete('/:id/like', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.likes = note.likes.filter(id => id.toString() !== req.userId.toString());
    await note.save();

    res.json({ message: 'Note unliked successfully', likesCount: note.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking note', error: error.message });
  }
});

// Add comment
router.post('/:id/comments', auth, createLimiter, async (req, res) => {
  try {
    const { text } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.comments.push({
      user: req.userId,
      text,
    });

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate('author', 'username displayName avatar')
      .populate('comments.user', 'username displayName avatar');

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Delete comment
router.delete('/:noteId/comments/:commentId', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const comment = note.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.userId.toString() && note.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    note.comments.pull(req.params.commentId);
    await note.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

module.exports = router;
