const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getAsync, runAsync } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const ADJECTIVES = ['Calm', 'Quiet', 'Serene', 'Gentle', 'Mindful', 'Resilient', 'Hopeful', 'Brave', 'Steady', 'Pondering', 'Curious', 'Patient'];
const ANIMALS = ['Sparrow', 'Falcon', 'River', 'Otter', 'Panda', 'Pine', 'Cedar', 'Koala', 'Willow', 'Dolphin', 'Breeze', 'Meadow'];

function generatePseudonym() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${animal} #${num}`;
}

// 1. One-click instant anonymous session (Zero identifying data required)
router.post('/anonymous', async (req, res) => {
  try {
    const requestedName = req.body.pseudonym ? req.body.pseudonym.trim() : null;
    let pseudonym = requestedName || generatePseudonym();

    // Ensure uniqueness
    let existing = await getAsync('SELECT * FROM users WHERE pseudonym = ?', [pseudonym]);
    if (existing && !requestedName) {
      pseudonym = `${pseudonym.split('#')[0]}#${Math.floor(100 + Math.random() * 900)}`;
    }

    let user;
    if (existing && requestedName) {
      user = existing;
    } else {
      const pinHash = await bcrypt.hash('guest', 6);
      const result = await runAsync(
        `INSERT INTO users (pseudonym, role, pin_hash, avatar_seed, consent_share_mood) VALUES (?, ?, ?, ?, ?)`,
        [pseudonym, 'student', pinHash, pseudonym.toLowerCase().replace(/[^a-z]/g, ''), 0]
      );
      user = await getAsync('SELECT id, pseudonym, role, consent_share_mood, created_at FROM users WHERE id = ?', [result.lastID]);
    }

    const token = jwt.sign(
      { id: user.id, pseudonym: user.pseudonym, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        pseudonym: user.pseudonym,
        role: user.role,
        consent_share_mood: user.consent_share_mood
      }
    });
  } catch (err) {
    console.error('Anonymous auth error:', err);
    res.status(500).json({ error: 'Failed to initialize anonymous session' });
  }
});

// 2. Register with Pseudonym + 4-digit PIN
router.post('/register', async (req, res) => {
  try {
    const { pseudonym, pin } = req.body;
    if (!pseudonym || !pin || pin.length < 4) {
      return res.status(400).json({ error: 'Pseudonym and 4+ digit PIN required' });
    }

    const existing = await getAsync('SELECT id FROM users WHERE pseudonym = ?', [pseudonym.trim()]);
    if (existing) {
      return res.status(409).json({ error: 'This pseudonym is already active. Please pick another alias.' });
    }

    const pinHash = await bcrypt.hash(pin, 8);
    const result = await runAsync(
      `INSERT INTO users (pseudonym, role, pin_hash, avatar_seed, consent_share_mood) VALUES (?, ?, ?, ?, ?)`,
      [pseudonym.trim(), 'student', pinHash, pseudonym.toLowerCase().replace(/[^a-z]/g, ''), 0]
    );

    const user = { id: result.lastID, pseudonym: pseudonym.trim(), role: 'student', consent_share_mood: 0 };
    const token = jwt.sign(
      { id: user.id, pseudonym: user.pseudonym, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ success: true, token, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 3. Login with Pseudonym or Counselor name + PIN
router.post('/login', async (req, res) => {
  try {
    const { pseudonym, pin } = req.body;
    if (!pseudonym || !pin) {
      return res.status(400).json({ error: 'Pseudonym and PIN are required' });
    }

    const user = await getAsync('SELECT * FROM users WHERE pseudonym = ? COLLATE NOCASE', [pseudonym.trim()]);
    if (!user) {
      return res.status(401).json({ error: 'User alias not found' });
    }

    const isMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect PIN/password' });
    }

    // If counselor, also grab counselor profile id
    let counselorProfile = null;
    if (user.role === 'counselor') {
      counselorProfile = await getAsync('SELECT * FROM counselors WHERE user_id = ?', [user.id]);
    }

    const token = jwt.sign(
      { id: user.id, pseudonym: user.pseudonym, role: user.role, counselorId: counselorProfile ? counselorProfile.id : null },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        pseudonym: user.pseudonym,
        role: user.role,
        consent_share_mood: user.consent_share_mood,
        counselorProfile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// 4. Get Current User info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getAsync(
      'SELECT id, pseudonym, role, consent_share_mood, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let counselorProfile = null;
    if (user.role === 'counselor') {
      counselorProfile = await getAsync('SELECT * FROM counselors WHERE user_id = ?', [user.id]);
    }

    res.json({ success: true, user: { ...user, counselorProfile } });
  } catch (err) {
    console.error('/me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// 5. Update Consent Preferences
router.post('/consent', authenticateToken, async (req, res) => {
  try {
    const { consent_share_mood } = req.body;
    const value = consent_share_mood ? 1 : 0;
    await runAsync('UPDATE users SET consent_share_mood = ? WHERE id = ?', [value, req.user.id]);
    res.json({ success: true, consent_share_mood: value });
  } catch (err) {
    console.error('Consent update error:', err);
    res.status(500).json({ error: 'Failed to update consent' });
  }
});

module.exports = router;
