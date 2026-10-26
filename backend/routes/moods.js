const express = require('express');
const router = express.Router();
const { runAsync, allAsync, getAsync } = require('../db');
const { authenticateToken } = require('../middleware/auth');

// 1. Log a new mood check-in
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { score, energy_level, sleep_hours, factors, note } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Valid mood score (1-5) is required' });
    }

    const energy = Number(energy_level) || 5;
    const sleep = Number(sleep_hours) || 7.0;
    const factorsJson = JSON.stringify(Array.isArray(factors) ? factors : []);

    const result = await runAsync(
      `INSERT INTO mood_logs (user_id, score, energy_level, sleep_hours, factors, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, score, energy, sleep, factorsJson, note || '']
    );

    // Check for low-mood streak in the last 4 logs
    const recentLogs = await allAsync(
      `SELECT score FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 4`,
      [req.user.id]
    );

    const lowCount = recentLogs.filter(l => l.score <= 2).length;
    const earlyWarningNudge = lowCount >= 3;

    res.json({
      success: true,
      logId: result.lastID,
      earlyWarningNudge,
      message: earlyWarningNudge 
        ? "We noticed your mood has felt heavy lately. You don't have to carry this alone. Would you like to try a calm breathing cycle or chat with a peer counselor?"
        : "Mood logged successfully. Thank you for checking in with yourself."
    });
  } catch (err) {
    console.error('Mood logging error:', err);
    res.status(500).json({ error: 'Failed to record mood' });
  }
});

// 2. Get mood history (14-day or 30-day)
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 14;
    const logs = await allAsync(
      `SELECT id, score, energy_level, sleep_hours, factors, note, created_at
       FROM mood_logs
       WHERE user_id = ?
       ORDER BY created_at ASC
       LIMIT ?`,
      [req.user.id, days * 3]
    );

    const parsedLogs = logs.map(l => ({
      ...l,
      factors: JSON.parse(l.factors || '[]')
    }));

    res.json({ success: true, count: parsedLogs.length, logs: parsedLogs });
  } catch (err) {
    console.error('Mood history error:', err);
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

// 3. Get comprehensive mood stats, streaks, and factor correlation
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const logs = await allAsync(
      `SELECT score, energy_level, sleep_hours, factors, created_at
       FROM mood_logs
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    if (logs.length === 0) {
      return res.json({
        success: true,
        totalLogs: 0,
        averageMood: 0,
        averageSleep: 0,
        streakDays: 0,
        topFactors: [],
        earlyWarningNudge: false
      });
    }

    const last14 = logs.slice(0, 14);
    const avgMood = (last14.reduce((sum, l) => sum + l.score, 0) / last14.length).toFixed(1);
    const avgSleep = (last14.reduce((sum, l) => sum + (l.sleep_hours || 7), 0) / last14.length).toFixed(1);
    const avgEnergy = (last14.reduce((sum, l) => sum + (l.energy_level || 5), 0) / last14.length).toFixed(1);

    // Calculate Streak
    let streak = 0;
    const now = new Date();
    const daySet = new Set();
    logs.forEach(l => {
      const d = new Date(l.created_at).toISOString().split('T')[0];
      daySet.add(d);
    });

    let checkDate = new Date();
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (daySet.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Check if user missed today but logged yesterday
        if (streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = checkDate.toISOString().split('T')[0];
          if (daySet.has(yesterdayStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }
    }

    // Factor frequency
    const factorCounts = {};
    last14.forEach(l => {
      try {
        const arr = JSON.parse(l.factors || '[]');
        arr.forEach(f => {
          factorCounts[f] = (factorCounts[f] || 0) + 1;
        });
      } catch (e) {}
    });

    const topFactors = Object.entries(factorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Early-warning nudge check (3 or more scores <= 2 in last 4 check-ins)
    const recentScores = logs.slice(0, 4).map(l => l.score);
    const lowCount = recentScores.filter(s => s <= 2).length;
    const earlyWarningNudge = lowCount >= 3;

    res.json({
      success: true,
      totalLogs: logs.length,
      averageMood: parseFloat(avgMood),
      averageSleep: parseFloat(avgSleep),
      averageEnergy: parseFloat(avgEnergy),
      streakDays: Math.max(streak, 1),
      topFactors,
      earlyWarningNudge
    });
  } catch (err) {
    console.error('Mood stats error:', err);
    res.status(500).json({ error: 'Failed to compute mood stats' });
  }
});

module.exports = router;
