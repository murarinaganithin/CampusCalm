const express = require('express');
const router = express.Router();
const { runAsync, allAsync, getAsync } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// 1. Get list of campus counselors
router.get('/', async (req, res) => {
  try {
    const counselors = await allAsync(`
      SELECT c.id, c.name, c.title, c.specialties, c.bio, c.available_days, c.avatar_emoji, u.pseudonym
      FROM counselors c
      JOIN users u ON c.user_id = u.id
    `);

    const formatted = counselors.map(c => ({
      ...c,
      specialties: JSON.parse(c.specialties || '[]'),
      available_days: JSON.parse(c.available_days || '[]')
    }));

    res.json({ success: true, counselors: formatted });
  } catch (err) {
    console.error('Counselor list error:', err);
    res.status(500).json({ error: 'Failed to load counselor directory' });
  }
});

// 2. Book an appointment with consent option
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { counselor_id, slot_date, slot_time, session_type, notes, share_mood_trend } = req.body;

    if (!counselor_id || !slot_date || !slot_time) {
      return res.status(400).json({ error: 'Counselor, date, and time slot are required' });
    }

    const shareConsent = share_mood_trend ? 1 : 0;

    const result = await runAsync(
      `INSERT INTO appointments 
       (student_id, counselor_id, slot_date, slot_time, session_type, notes, shared_mood_snapshot, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        counselor_id,
        slot_date,
        slot_time,
        session_type || 'chat',
        notes || '',
        shareConsent,
        'confirmed'
      ]
    );

    // Create initial system/greeting message
    const counselor = await getAsync('SELECT name FROM counselors WHERE id = ?', [counselor_id]);
    const greetingText = `Appointment confirmed with ${counselor ? counselor.name : 'Counselor'} for ${slot_date} at ${slot_time}. Feel free to share your thoughts beforehand.`;

    await runAsync(
      `INSERT INTO messages (appointment_id, sender_id, sender_name, message)
       VALUES (?, ?, ?, ?)`,
      [result.lastID, 0, 'Saathi Care Desk', greetingText]
    );

    res.json({
      success: true,
      appointmentId: result.lastID,
      message: 'Counselor appointment booked successfully with chosen privacy settings.'
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to book session' });
  }
});

// 3. Get Student's appointments
router.get('/my-appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await allAsync(
      `SELECT a.id, a.slot_date, a.slot_time, a.session_type, a.notes, a.shared_mood_snapshot, a.status, a.created_at,
              c.name as counselor_name, c.title as counselor_title, c.avatar_emoji
       FROM appointments a
       JOIN counselors c ON a.counselor_id = c.id
       WHERE a.student_id = ?
       ORDER BY a.slot_date DESC`,
      [req.user.id]
    );

    res.json({ success: true, appointments });
  } catch (err) {
    console.error('My appointments error:', err);
    res.status(500).json({ error: 'Failed to load your appointments' });
  }
});

// 4. Counselor Portal View (for counselors to manage incoming sessions)
router.get('/portal-appointments', authenticateToken, async (req, res) => {
  try {
    // Check if user is counselor
    let counselor = await getAsync('SELECT id, name FROM counselors WHERE user_id = ?', [req.user.id]);
    
    // If not counselor, provide default counselor view if demoing
    let counselorId = counselor ? counselor.id : 1;

    const appointments = await allAsync(
      `SELECT a.id, a.student_id, a.slot_date, a.slot_time, a.session_type, a.notes, a.shared_mood_snapshot, a.status, a.created_at,
              u.pseudonym as student_pseudonym
       FROM appointments a
       JOIN users u ON a.student_id = u.id
       WHERE a.counselor_id = ?
       ORDER BY a.slot_date ASC`,
      [counselorId]
    );

    res.json({ success: true, appointments, counselorId });
  } catch (err) {
    console.error('Portal appointments error:', err);
    res.status(500).json({ error: 'Failed to load counselor portal' });
  }
});

// 5. Consent-Gated Student Trend for Counselor (Strict Privacy Enforcement)
router.get('/student-trend/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const apt = await getAsync(
      `SELECT a.id, a.student_id, a.counselor_id, a.shared_mood_snapshot, u.pseudonym
       FROM appointments a
       JOIN users u ON a.student_id = u.id
       WHERE a.id = ?`,
      [req.params.appointmentId]
    );

    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (!apt.shared_mood_snapshot) {
      return res.json({
        success: true,
        consentGranted: false,
        message: `${apt.pseudonym} opted out of sharing mood telemetry. Individual journal records remain strictly private.`,
        trend: []
      });
    }

    // Consent was granted: Fetch only aggregated mood scores (NO journal contents whatsoever!)
    const moodLogs = await allAsync(
      `SELECT score, energy_level, sleep_hours, factors, created_at
       FROM mood_logs
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT 14`,
      [apt.student_id]
    );

    const formattedTrend = moodLogs.map(l => ({
      score: l.score,
      energy_level: l.energy_level,
      sleep_hours: l.sleep_hours,
      factors: JSON.parse(l.factors || '[]'),
      date: l.created_at.split('T')[0]
    }));

    res.json({
      success: true,
      consentGranted: true,
      student_pseudonym: apt.pseudonym,
      trend: formattedTrend,
      privacyNotice: 'Shared under student consent. Journal entries are strictly excluded.'
    });
  } catch (err) {
    console.error('Student trend fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch student trend' });
  }
});

// 6. Get Appointment Messages
router.get('/messages/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const apt = await getAsync(
      'SELECT id, student_id, counselor_id FROM appointments WHERE id = ?',
      [req.params.appointmentId]
    );

    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const messages = await allAsync(
      'SELECT * FROM messages WHERE appointment_id = ? ORDER BY created_at ASC',
      [req.params.appointmentId]
    );

    res.json({ success: true, messages });
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// 7. Send message in appointment thread
router.post('/messages/:appointmentId', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const apt = await getAsync(
      'SELECT id, student_id, counselor_id FROM appointments WHERE id = ?',
      [req.params.appointmentId]
    );

    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const senderName = req.user.pseudonym;
    const result = await runAsync(
      `INSERT INTO messages (appointment_id, sender_id, sender_name, message)
       VALUES (?, ?, ?, ?)`,
      [req.params.appointmentId, req.user.id, senderName, message.trim()]
    );

    res.json({
      success: true,
      messageId: result.lastID,
      sentMessage: {
        id: result.lastID,
        appointment_id: Number(req.params.appointmentId),
        sender_id: req.user.id,
        sender_name: senderName,
        message: message.trim(),
        created_at: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
