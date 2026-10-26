const express = require('express');
const router = express.Router();
const { runAsync, allAsync, getAsync } = require('../db');
const { encryptText, decryptText } = require('../cryptoUtils');
const { scanCrisis, analyzeReflection } = require('../sentiment');
const { authenticateToken } = require('../middleware/auth');

// 1. Create an anonymous encrypted journal entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Journal content is required' });
    }

    const trimmedContent = content.trim();
    const entryTitle = (title && title.trim()) || 'Untitled Reflection';
    const tagList = Array.isArray(tags) ? tags : [];

    // Step A: Crisis Safety Net Scan
    const crisisResult = scanCrisis(trimmedContent);

    // Step B: AI Sentiment & Reflection Analysis
    const sentimentResult = analyzeReflection(trimmedContent);

    // Step C: AES-256 Client-Level Database Encryption
    const { encryptedData, iv } = encryptText(trimmedContent);

    const result = await runAsync(
      `INSERT INTO journal_entries 
       (user_id, title, encrypted_content, iv, sentiment_tone, tags, crisis_flagged)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        entryTitle,
        encryptedData,
        iv,
        sentimentResult.tone,
        JSON.stringify(tagList),
        crisisResult.isCrisis ? 1 : 0
      ]
    );

    res.json({
      success: true,
      entryId: result.lastID,
      title: entryTitle,
      sentiment: sentimentResult,
      crisis: crisisResult,
      isEncrypted: true,
      message: 'Journal entry securely encrypted and saved.'
    });
  } catch (err) {
    console.error('Journal create error:', err);
    res.status(500).json({ error: 'Failed to save encrypted journal entry' });
  }
});

// 2. Get user's encrypted journals (decrypted on retrieval for this user only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await allAsync(
      `SELECT id, title, encrypted_content, iv, sentiment_tone, tags, crisis_flagged, created_at
       FROM journal_entries
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    const decryptedEntries = rows.map(entry => {
      const plainContent = decryptText(entry.encrypted_content, entry.iv);
      return {
        id: entry.id,
        title: entry.title,
        content: plainContent,
        sentiment_tone: entry.sentiment_tone,
        tags: JSON.parse(entry.tags || '[]'),
        crisis_flagged: Boolean(entry.crisis_flagged),
        created_at: entry.created_at,
        isEncryptedAtRest: true
      };
    });

    res.json({
      success: true,
      count: decryptedEntries.length,
      entries: decryptedEntries
    });
  } catch (err) {
    console.error('Journal fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve journal entries' });
  }
});

// 3. Delete a journal entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const entryId = req.params.id;
    const existing = await getAsync(
      'SELECT id FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Entry not found or access denied' });
    }

    await runAsync('DELETE FROM journal_entries WHERE id = ?', [entryId]);
    res.json({ success: true, message: 'Journal entry securely erased.' });
  } catch (err) {
    console.error('Journal delete error:', err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;
