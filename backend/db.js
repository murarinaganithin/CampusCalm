const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { encryptText } = require('./cryptoUtils');

const DB_PATH = path.join(__dirname, '..', 'saathi.db');
const db = new sqlite3.Database(DB_PATH);

/**
 * Executes a query with Promise
 */
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  await runAsync(`PRAGMA foreign_keys = ON;`);

  // Users table (Students, Counselors, Admins)
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pseudonym TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      pin_hash TEXT,
      avatar_seed TEXT,
      consent_share_mood INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Mood Tracking table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS mood_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      energy_level INTEGER DEFAULT 5,
      sleep_hours REAL DEFAULT 7.0,
      factors TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Anonymous Encrypted Journal entries
  await runAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT,
      encrypted_content TEXT NOT NULL,
      iv TEXT NOT NULL,
      sentiment_tone TEXT,
      tags TEXT,
      crisis_flagged INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Counselors table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS counselors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      specialties TEXT NOT NULL,
      bio TEXT NOT NULL,
      available_days TEXT NOT NULL,
      avatar_emoji TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Appointments table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      counselor_id INTEGER NOT NULL,
      slot_date TEXT NOT NULL,
      slot_time TEXT NOT NULL,
      session_type TEXT NOT NULL DEFAULT 'chat',
      notes TEXT,
      shared_mood_snapshot INTEGER DEFAULT 0,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(counselor_id) REFERENCES counselors(id)
    );
  `);

  // Confidential Appointment Messages
  await runAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
    );
  `);

  // Seed sample data if empty
  await seedInitialData();
}

async function seedInitialData() {
  const existingCounselor = await getAsync(`SELECT COUNT(*) as count FROM counselors`);
  if (existingCounselor && existingCounselor.count > 0) {
    return; // Already seeded
  }

  console.log('Seeding initial counselors and demo student...');

  const defaultPinHash = await bcrypt.hash('1234', 8);

  // 1. Seed Counselors
  // Counselor 1: Dr. Ananya Sharma
  const c1User = await runAsync(
    `INSERT INTO users (pseudonym, role, pin_hash, avatar_seed) VALUES (?, ?, ?, ?)`,
    ['Dr. Ananya Sharma', 'counselor', defaultPinHash, 'ananya']
  );
  await runAsync(
    `INSERT INTO counselors (user_id, name, title, specialties, bio, available_days, avatar_emoji)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      c1User.lastID,
      'Dr. Ananya Sharma, Ph.D.',
      'Lead Campus Clinical Psychologist',
      JSON.stringify(['Exam Anxiety', 'Hostel Transitions', 'Panic Management', 'Sleep Issues']),
      'Over 9 years guiding university scholars through academic stress, exam fatigue, and building sustainable daily resilience.',
      JSON.stringify(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
      '👩‍⚕️'
    ]
  );

  // Counselor 2: Vikram Mehta
  const c2User = await runAsync(
    `INSERT INTO users (pseudonym, role, pin_hash, avatar_seed) VALUES (?, ?, ?, ?)`,
    ['Vikram Mehta', 'counselor', defaultPinHash, 'vikram']
  );
  await runAsync(
    `INSERT INTO counselors (user_id, name, title, specialties, bio, available_days, avatar_emoji)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      c2User.lastID,
      'Vikram Mehta, M.Phil',
      'Student Wellness & Burnout Specialist',
      JSON.stringify(['Academic Burnout', 'Impostor Syndrome', 'Relationship Stress', 'Social Isolation']),
      'Specialized in peer-level youth counseling, mindfulness-based stress reduction, and navigating campus social friction.',
      JSON.stringify(['Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
      '👨‍💼'
    ]
  );

  // Counselor 3: Dr. Ritu Sen
  const c3User = await runAsync(
    `INSERT INTO users (pseudonym, role, pin_hash, avatar_seed) VALUES (?, ?, ?, ?)`,
    ['Dr. Ritu Sen', 'counselor', defaultPinHash, 'ritu']
  );
  await runAsync(
    `INSERT INTO counselors (user_id, name, title, specialties, bio, available_days, avatar_emoji)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      c3User.lastID,
      'Dr. Ritu Sen, MD',
      'Campus Mental Health Consultant',
      JSON.stringify(['Deep Stress', 'Attendance Anxiety', 'Placement Pressure', 'Mindfulness']),
      'Consultant focused on helping engineering and college students conquer deadline pressure and cultivate self-compassion.',
      JSON.stringify(['Mon', 'Wed', 'Fri']),
      '👩‍🏫'
    ]
  );

  // 2. Seed Demo Student with realistic 14-day mood tracking and journal entries
  const studentUser = await runAsync(
    `INSERT INTO users (pseudonym, role, pin_hash, avatar_seed, consent_share_mood) VALUES (?, ?, ?, ?, ?)`,
    ['QuietSparrow #24', 'student', defaultPinHash, 'sparrow', 1]
  );
  const studentId = studentUser.lastID;

  // 14 days of realistic mood check-in data showing campus midterm pressure & recovery
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const mockMoods = [
    { daysAgo: 13, score: 4, energy: 7, sleep: 7.5, factors: ['Sleep', 'Social Life'], note: 'Good weekend recharge before syllabus rush.' },
    { daysAgo: 12, score: 3, energy: 6, sleep: 6.5, factors: ['Academic Pressure', 'Hostel Life'], note: 'Assignment deadline announced for lab.' },
    { daysAgo: 11, score: 3, energy: 5, sleep: 6.0, factors: ['Exams / Midterms', 'Attendance'], note: 'Attendance is tight, had back-to-back lectures.' },
    { daysAgo: 10, score: 2, energy: 4, sleep: 5.0, factors: ['Exams / Midterms', 'Sleep Deprivation'], note: 'Stayed up late revising syllabus.' },
    { daysAgo: 9, score: 2, energy: 3, sleep: 4.5, factors: ['Exams / Midterms', 'Overwhelmed'], note: 'Midterm 1 felt tricky. Feeling mentally drained.' },
    { daysAgo: 8, score: 1, energy: 2, sleep: 4.0, factors: ['Exams / Midterms', 'Panic / Anxiety'], note: 'Second exam day. Barely slept, feeling suffocated.' },
    { daysAgo: 7, score: 2, energy: 3, sleep: 5.5, factors: ['Hostel Life', 'Academic Pressure'], note: 'Exams half over, trying to catch my breath.' },
    { daysAgo: 6, score: 3, energy: 5, sleep: 6.5, factors: ['Exams / Midterms'], note: 'Finished math paper. One more to go.' },
    { daysAgo: 5, score: 4, energy: 7, sleep: 8.0, factors: ['Sleep', 'Relief'], note: 'Midterms completed! Slept 8 full hours.' },
    { daysAgo: 4, score: 4, energy: 6, sleep: 7.0, factors: ['Social Life', 'Hostel Life'], note: 'Walked to the college canteen with hostel friends.' },
    { daysAgo: 3, score: 3, energy: 5, sleep: 6.0, factors: ['Placement / Internships'], note: 'Resume drafting started. Mild apprehension.' },
    { daysAgo: 2, score: 4, energy: 7, sleep: 7.5, factors: ['Mindfulness', 'Personal Space'], note: 'Practiced 10 mins box breathing on the terrace.' },
    { daysAgo: 1, score: 4, energy: 8, sleep: 7.5, factors: ['Social Life', 'Peace'], note: 'Balanced day. Kept screen time lower in evening.' },
    { daysAgo: 0, score: 4, energy: 7, sleep: 7.0, factors: ['Academic Pressure'], note: 'Checking in today. Mind feels steady.' }
  ];

  for (const m of mockMoods) {
    const timestamp = new Date(now - m.daysAgo * dayMs).toISOString();
    await runAsync(
      `INSERT INTO mood_logs (user_id, score, energy_level, sleep_hours, factors, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentId, m.score, m.energy, m.sleep, JSON.stringify(m.factors), m.note, timestamp]
    );
  }

  // Seed sample encrypted journal entry for QuietSparrow
  const sampleJournal1 = encryptText(
    "Midterm week was brutally intense. On Wednesday night I was convinced I was going to blank out on the exam paper. Using the 4-7-8 breathing exercise in Saathi calmed my racing pulse down enough to fall asleep. Wrote this down to remind future me that panic passes."
  );
  await runAsync(
    `INSERT INTO journal_entries (user_id, title, encrypted_content, iv, sentiment_tone, tags, crisis_flagged, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      'Surviving the Wednesday Panic Wave',
      sampleJournal1.encryptedData,
      sampleJournal1.iv,
      'reflective',
      JSON.stringify(['Midterms', 'Breathing', 'Overcoming Panic']),
      0,
      new Date(now - 7 * dayMs).toISOString()
    ]
  );

  const sampleJournal2 = encryptText(
    "Hostel mess food was actually decent today, and spent an hour sitting in the quad under the trees without touching my phone. Small win, but my head feels significantly less cluttered."
  );
  await runAsync(
    `INSERT INTO journal_entries (user_id, title, encrypted_content, iv, sentiment_tone, tags, crisis_flagged, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      'A quiet afternoon under the trees',
      sampleJournal2.encryptedData,
      sampleJournal2.iv,
      'hopeful',
      JSON.stringify(['Hostel Life', 'Nature', 'Mental Space']),
      0,
      new Date(now - 2 * dayMs).toISOString()
    ]
  );

  // Seed a sample appointment between QuietSparrow and Dr. Ananya Sharma
  const appointment = await runAsync(
    `INSERT INTO appointments (student_id, counselor_id, slot_date, slot_time, session_type, notes, shared_mood_snapshot, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      1,
      new Date(now + 2 * dayMs).toISOString().split('T')[0],
      '15:00 - 15:45 PM',
      'chat',
      'Would love tips on managing sudden pre-exam adrenaline surges.',
      1,
      'confirmed'
    ]
  );

  // Seed initial greeting message
  await runAsync(
    `INSERT INTO messages (appointment_id, sender_id, sender_name, message, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      appointment.lastID,
      c1User.lastID,
      'Dr. Ananya Sharma',
      'Hello QuietSparrow! Looking forward to our chat. Feel free to jot down any questions here beforehand. Remember, this space is 100% confidential.',
      new Date(now - 1 * dayMs).toISOString()
    ]
  );

  console.log('Database initialized and seeded successfully.');
}

module.exports = {
  db,
  initDb,
  runAsync,
  getAsync,
  allAsync
};
