const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;
    const updates = {};
    
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Follow user
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const user = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(req.userId);

    await user.save();
    await targetUser.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
});

// Unfollow user
router.delete('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    
    const user = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.following = user.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.userId.toString());

    await user.save();
    await targetUser.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
});

module.exports = router;
