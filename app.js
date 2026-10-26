// Saathi (साथी) Frontend Application Logic

const isGitHubPages = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';
const API_BASE = '/api';

// ==========================================
// CLIENT-SIDE STORAGE ADAPTER FOR GITHUB PAGES
// Ensures 100% full interactive functionality on GitHub Pages without a live Node server
// ==========================================
(function setupGitHubPagesMock() {
  if (!isGitHubPages) return;

  console.log('🌿 Saathi: Running in GitHub Pages Client-Side Mode with LocalStorage DB');

  // Seed initial localStorage database if empty
  if (!localStorage.getItem('saathi_gh_initialized')) {
    const defaultMoods = [
      { id: 1, score: 4, energy_level: 7, sleep_hours: 7.5, factors: ['Sleep', 'Social Life'], note: 'Good weekend recharge before syllabus rush.', created_at: new Date(Date.now() - 13*86400000).toISOString() },
      { id: 2, score: 3, energy_level: 6, sleep_hours: 6.5, factors: ['Academic Pressure', 'Hostel Life'], note: 'Assignment deadline announced for lab.', created_at: new Date(Date.now() - 12*86400000).toISOString() },
      { id: 3, score: 3, energy_level: 5, sleep_hours: 6.0, factors: ['Exams / Midterms', 'Attendance'], note: 'Attendance is tight, had back-to-back lectures.', created_at: new Date(Date.now() - 11*86400000).toISOString() },
      { id: 4, score: 2, energy_level: 4, sleep_hours: 5.0, factors: ['Exams / Midterms', 'Sleep Deprivation'], note: 'Stayed up late revising syllabus.', created_at: new Date(Date.now() - 10*86400000).toISOString() },
      { id: 5, score: 2, energy_level: 3, sleep_hours: 4.5, factors: ['Exams / Midterms', 'Overwhelmed'], note: 'Midterm 1 felt tricky. Feeling mentally drained.', created_at: new Date(Date.now() - 9*86400000).toISOString() },
      { id: 6, score: 1, energy_level: 2, sleep_hours: 4.0, factors: ['Exams / Midterms', 'Panic / Anxiety'], note: 'Second exam day. Barely slept, feeling suffocated.', created_at: new Date(Date.now() - 8*86400000).toISOString() },
      { id: 7, score: 2, energy_level: 3, sleep_hours: 5.5, factors: ['Hostel Life', 'Academic Pressure'], note: 'Exams half over, trying to catch my breath.', created_at: new Date(Date.now() - 7*86400000).toISOString() },
      { id: 8, score: 3, energy_level: 5, sleep_hours: 6.5, factors: ['Exams / Midterms'], note: 'Finished math paper. One more to go.', created_at: new Date(Date.now() - 6*86400000).toISOString() },
      { id: 9, score: 4, energy_level: 7, sleep_hours: 8.0, factors: ['Sleep', 'Peace & Nature'], note: 'Midterms completed! Slept 8 full hours.', created_at: new Date(Date.now() - 5*86400000).toISOString() },
      { id: 10, score: 4, energy_level: 6, sleep_hours: 7.0, factors: ['Social Isolation', 'Hostel Life'], note: 'Walked to the college canteen with hostel friends.', created_at: new Date(Date.now() - 4*86400000).toISOString() },
      { id: 11, score: 3, energy_level: 5, sleep_hours: 6.0, factors: ['Placement / Career'], note: 'Resume drafting started. Mild apprehension.', created_at: new Date(Date.now() - 3*86400000).toISOString() },
      { id: 12, score: 4, energy_level: 7, sleep_hours: 7.5, factors: ['Peace & Nature'], note: 'Practiced 10 mins box breathing on the terrace.', created_at: new Date(Date.now() - 2*86400000).toISOString() },
      { id: 13, score: 4, energy_level: 8, sleep_hours: 7.5, factors: ['Social Life'], note: 'Balanced day. Kept screen time lower in evening.', created_at: new Date(Date.now() - 1*86400000).toISOString() },
      { id: 14, score: 4, energy_level: 7, sleep_hours: 7.0, factors: ['Academic Pressure'], note: 'Checking in today. Mind feels steady.', created_at: new Date().toISOString() }
    ];

    const defaultJournals = [
      {
        id: 1,
        title: 'Surviving the Wednesday Panic Wave',
        content: 'Midterm week was brutally intense. On Wednesday night I was convinced I was going to blank out on the exam paper. Using the 4-7-8 breathing exercise in Saathi calmed my racing pulse down enough to fall asleep. Wrote this down to remind future me that panic passes.',
        sentiment_tone: 'Reflective',
        tags: ['Midterms', 'Breathing', 'Overcoming Panic'],
        created_at: new Date(Date.now() - 7*86400000).toISOString()
      },
      {
        id: 2,
        title: 'A quiet afternoon under the trees',
        content: 'Hostel mess food was actually decent today, and spent an hour sitting in the quad under the trees without touching my phone. Small win, but my head feels significantly less cluttered.',
        sentiment_tone: 'Hopeful',
        tags: ['Hostel Life', 'Peace', 'Mental Space'],
        created_at: new Date(Date.now() - 2*86400000).toISOString()
      }
    ];

    const defaultCounselors = [
      {
        id: 1,
        name: 'Dr. Ananya Sharma, Ph.D.',
        title: 'Lead Campus Clinical Psychologist',
        specialties: ['Exam Anxiety', 'Hostel Transitions', 'Panic Management', 'Sleep Issues'],
        bio: 'Over 9 years guiding university scholars through academic stress, exam fatigue, and building sustainable daily resilience.',
        avatar_emoji: '👩‍⚕️'
      },
      {
        id: 2,
        name: 'Vikram Mehta, M.Phil',
        title: 'Student Wellness & Burnout Specialist',
        specialties: ['Academic Burnout', 'Impostor Syndrome', 'Relationship Stress', 'Social Isolation'],
        bio: 'Specialized in peer-level youth counseling, mindfulness-based stress reduction, and navigating campus social friction.',
        avatar_emoji: '👨‍💼'
      },
      {
        id: 3,
        name: 'Dr. Ritu Sen, MD',
        title: 'Campus Mental Health Consultant',
        specialties: ['Deep Stress', 'Attendance Anxiety', 'Placement Pressure', 'Mindfulness'],
        bio: 'Consultant focused on helping engineering and college students conquer deadline pressure and cultivate self-compassion.',
        avatar_emoji: '👩‍🏫'
      }
    ];

    const defaultAppointments = [
      {
        id: 1,
        counselor_name: 'Dr. Ananya Sharma, Ph.D.',
        slot_date: new Date(Date.now() + 2*86400000).toISOString().split('T')[0],
        slot_time: '15:00 - 15:45 PM',
        session_type: 'chat',
        notes: 'Would love tips on managing sudden pre-exam adrenaline surges.',
        shared_mood_snapshot: 1,
        avatar_emoji: '👩‍⚕️',
        student_pseudonym: 'QuietSparrow #24'
      }
    ];

    const defaultMessages = {
      1: [
        {
          id: 1,
          sender_id: 2,
          sender_name: 'Dr. Ananya Sharma',
          message: 'Hello QuietSparrow! Looking forward to our chat. Feel free to jot down any questions here beforehand. Remember, this space is 100% confidential.'
        }
      ]
    };

    localStorage.setItem('saathi_gh_moods', JSON.stringify(defaultMoods));
    localStorage.setItem('saathi_gh_journals', JSON.stringify(defaultJournals));
    localStorage.setItem('saathi_gh_counselors', JSON.stringify(defaultCounselors));
    localStorage.setItem('saathi_gh_appointments', JSON.stringify(defaultAppointments));
    localStorage.setItem('saathi_gh_messages', JSON.stringify(defaultMessages));
    localStorage.setItem('saathi_gh_user', JSON.stringify({ id: 1, pseudonym: 'QuietSparrow #24', role: 'student', consent_share_mood: 1 }));
    localStorage.setItem('saathi_gh_initialized', 'true');
  }

  // Intercept window.fetch for /api/* calls
  const originalFetch = window.fetch;
  window.fetch = async function(url, options = {}) {
    if (typeof url === 'string' && url.includes('/api/')) {
      const path = url.split('/api/')[1].split('?')[0];
      const method = (options.method || 'GET').toUpperCase();
      let body = {};
      if (options.body) {
        try { body = JSON.parse(options.body); } catch(e) {}
      }

      // 1. Auth endpoints
      if (path === 'auth/me' || path === 'auth/login') {
        const u = JSON.parse(localStorage.getItem('saathi_gh_user') || '{"id":1,"pseudonym":"QuietSparrow #24","role":"student","consent_share_mood":1}');
        if (body.pseudonym && body.pseudonym.includes('Dr.')) {
          u.pseudonym = body.pseudonym;
          u.role = 'counselor';
        } else if (body.pseudonym) {
          u.pseudonym = body.pseudonym;
          u.role = 'student';
        }
        localStorage.setItem('saathi_gh_user', JSON.stringify(u));
        return new Response(JSON.stringify({ success: true, token: 'mock-gh-token', user: u }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (path === 'auth/anonymous') {
        const adjs = ['Calm', 'Quiet', 'Serene', 'Mindful', 'Gentle', 'Hopeful'];
        const animals = ['Sparrow', 'River', 'Otter', 'Pine', 'Falcon', 'Cedar'];
        const name = `${adjs[Math.floor(Math.random()*adjs.length)]}${animals[Math.floor(Math.random()*animals.length)]} #${Math.floor(10+Math.random()*90)}`;
        const u = { id: Date.now(), pseudonym: name, role: 'student', consent_share_mood: 0 };
        localStorage.setItem('saathi_gh_user', JSON.stringify(u));
        return new Response(JSON.stringify({ success: true, token: 'mock-gh-token', user: u }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      if (path === 'auth/consent') {
        const u = JSON.parse(localStorage.getItem('saathi_gh_user') || '{}');
        u.consent_share_mood = body.consent_share_mood ? 1 : 0;
        localStorage.setItem('saathi_gh_user', JSON.stringify(u));
        return new Response(JSON.stringify({ success: true, consent_share_mood: u.consent_share_mood }), { status: 200 });
      }

      // 2. Moods endpoints
      if (path === 'moods' && method === 'POST') {
        const list = JSON.parse(localStorage.getItem('saathi_gh_moods') || '[]');
        const entry = {
          id: Date.now(),
          score: body.score,
          energy_level: body.energy_level || 5,
          sleep_hours: body.sleep_hours || 7,
          factors: body.factors || [],
          note: body.note || '',
          created_at: new Date().toISOString()
        };
        list.push(entry);
        localStorage.setItem('saathi_gh_moods', JSON.stringify(list));
        const lowStreak = list.slice(-4).filter(l => l.score <= 2).length >= 3;
        return new Response(JSON.stringify({ success: true, earlyWarningNudge: lowStreak }), { status: 200 });
      }

      if (path === 'moods/history') {
        const list = JSON.parse(localStorage.getItem('saathi_gh_moods') || '[]');
        return new Response(JSON.stringify({ success: true, logs: list.slice(-14) }), { status: 200 });
      }

      if (path === 'moods/stats') {
        const list = JSON.parse(localStorage.getItem('saathi_gh_moods') || '[]');
        const avgMood = list.length ? (list.reduce((s,l) => s + l.score, 0)/list.length).toFixed(1) : '3.5';
        const avgSleep = list.length ? (list.reduce((s,l) => s + l.sleep_hours, 0)/list.length).toFixed(1) : '7.0';
        return new Response(JSON.stringify({
          success: true,
          averageMood: parseFloat(avgMood),
          averageSleep: parseFloat(avgSleep),
          streakDays: 14,
          topFactors: [{ name: 'Exams / Deadlines', count: 8 }, { name: 'Sleep Deprivation', count: 5 }],
          earlyWarningNudge: false
        }), { status: 200 });
      }

      // 3. Journals endpoints
      if (path === 'journals' && method === 'POST') {
        const list = JSON.parse(localStorage.getItem('saathi_gh_journals') || '[]');
        const content = body.content || '';
        const lower = content.toLowerCase();
        const isCrisis = ['suicide', 'want to die', 'kill myself', 'self harm', 'end it all'].some(k => lower.includes(k));
        let tone = 'Reflective';
        let rec = 'It sounds like a lot is weighing on your mind. Giving voice to your thoughts is the first step toward lightness.';
        if (lower.includes('overwhelmed') || lower.includes('exam')) {
          tone = 'Overwhelmed';
          rec = "You don't have to carry the whole semester in one sitting. Take a short pause.";
        } else if (lower.includes('happy') || lower.includes('grateful')) {
          tone = 'Hopeful';
          rec = "Beautiful moment of joy! Savor this peace.";
        }
        const item = {
          id: Date.now(),
          title: body.title || 'Reflection',
          content,
          tags: body.tags || [],
          sentiment_tone: tone,
          created_at: new Date().toISOString()
        };
        list.unshift(item);
        localStorage.setItem('saathi_gh_journals', JSON.stringify(list));
        return new Response(JSON.stringify({
          success: true,
          sentiment: { tone, reflection: rec },
          crisis: { isCrisis, triggers: isCrisis ? ['distress keyword'] : [] }
        }), { status: 200 });
      }

      if (path === 'journals' && method === 'GET') {
        const list = JSON.parse(localStorage.getItem('saathi_gh_journals') || '[]');
        return new Response(JSON.stringify({ success: true, entries: list }), { status: 200 });
      }

      if (path.startsWith('journals/') && method === 'DELETE') {
        const id = Number(path.split('/')[1]);
        let list = JSON.parse(localStorage.getItem('saathi_gh_journals') || '[]');
        list = list.filter(j => j.id !== id);
        localStorage.setItem('saathi_gh_journals', JSON.stringify(list));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // 4. Counselors endpoints
      if (path === 'counselors') {
        const list = JSON.parse(localStorage.getItem('saathi_gh_counselors') || '[]');
        return new Response(JSON.stringify({ success: true, counselors: list }), { status: 200 });
      }

      if (path === 'counselors/book') {
        const apts = JSON.parse(localStorage.getItem('saathi_gh_appointments') || '[]');
        const newApt = {
          id: Date.now(),
          counselor_name: 'Dr. Ananya Sharma, Ph.D.',
          slot_date: body.slot_date,
          slot_time: body.slot_time,
          session_type: body.session_type || 'chat',
          notes: body.notes || '',
          shared_mood_snapshot: body.share_mood_trend ? 1 : 0,
          avatar_emoji: '👩‍⚕️',
          student_pseudonym: 'QuietSparrow #24'
        };
        apts.unshift(newApt);
        localStorage.setItem('saathi_gh_appointments', JSON.stringify(apts));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      if (path === 'counselors/my-appointments') {
        const apts = JSON.parse(localStorage.getItem('saathi_gh_appointments') || '[]');
        return new Response(JSON.stringify({ success: true, appointments: apts }), { status: 200 });
      }

      if (path === 'counselors/portal-appointments') {
        const apts = JSON.parse(localStorage.getItem('saathi_gh_appointments') || '[]');
        return new Response(JSON.stringify({ success: true, appointments: apts }), { status: 200 });
      }

      if (path.startsWith('counselors/student-trend/')) {
        const list = JSON.parse(localStorage.getItem('saathi_gh_moods') || '[]');
        return new Response(JSON.stringify({
          success: true,
          consentGranted: true,
          student_pseudonym: 'QuietSparrow #24',
          trend: list.slice(-14).map(l => ({ score: l.score, date: l.created_at.split('T')[0] }))
        }), { status: 200 });
      }

      if (path.startsWith('counselors/messages/') && method === 'GET') {
        const aptId = path.split('/')[2];
        const msgs = JSON.parse(localStorage.getItem('saathi_gh_messages') || '{}');
        return new Response(JSON.stringify({ success: true, messages: msgs[aptId] || [] }), { status: 200 });
      }

      if (path.startsWith('counselors/messages/') && method === 'POST') {
        const aptId = path.split('/')[2];
        const msgs = JSON.parse(localStorage.getItem('saathi_gh_messages') || '{}');
        if (!msgs[aptId]) msgs[aptId] = [];
        msgs[aptId].push({
          id: Date.now(),
          sender_id: 1,
          sender_name: 'QuietSparrow #24',
          message: body.message
        });
        localStorage.setItem('saathi_gh_messages', JSON.stringify(msgs));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      // 5. Campus Pulse
      if (path === 'campus/pulse') {
        return new Response(JSON.stringify({
          success: true,
          data: {
            totalCheckIns: 1420,
            activeAnonymousStudents: 312,
            campusAverageMood: 3.4,
            semesterTimeline: [
              { week: 'Wk 1: Orientation', stressIndex: 28 },
              { week: 'Wk 3: Course Load', stressIndex: 45 },
              { week: 'Wk 6: First Quizzes', stressIndex: 68 },
              { week: 'Wk 8: Midterms Wave', stressIndex: 86 },
              { week: 'Wk 10: Fest & Post-Mid', stressIndex: 40 },
              { week: 'Wk 12: Project Due', stressIndex: 72 },
              { week: 'Wk 14: Final Exams', stressIndex: 91 }
            ],
            topFactors: [
              { name: 'Exams / Deadlines', count: 520 },
              { name: 'Sleep Deprivation', count: 340 },
              { name: 'Hostel Life', count: 210 },
              { name: 'Attendance Rules', count: 180 },
              { name: 'Placement / Career', count: 150 }
            ]
          }
        }), { status: 200 });
      }
    }

    return originalFetch.apply(this, arguments);
  };
})();

// State
let currentUser = null;
let currentToken = localStorage.getItem('saathi_token') || null;
let selectedMoodScore = 4;
let selectedFactors = new Set();
let moodChartInstance = null;
let campusSemesterChartInstance = null;
let campusFactorsChartInstance = null;
let activeAppointmentId = null;

// Breathing Pacer State
let breathingTimer = null;
let breathingPhase = 'ready'; // 'inhale', 'hold1', 'exhale', 'hold2'
let breathingSecondsLeft = 4;
let breathingCycles = 0;
let isBreathingActive = false;
let currentBreathingPattern = 'box'; // 'box' or '478'

const BREATHING_CONFIGS = {
  box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  '478': { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) window.lucide.createIcons();
  await initUserSession();
  setupInitialUI();
});

async function initUserSession() {
  if (currentToken) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        updateUserUI();
        loadAllData();
        return;
      }
    } catch (e) {
      console.warn('Session check failed:', e);
    }
  }

  // Auto-login as default demo student QuietSparrow #24 for rich instant experience
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudonym: 'QuietSparrow #24', pin: '1234' })
    });
    if (res.ok) {
      const data = await res.json();
      currentToken = data.token;
      currentUser = data.user;
      localStorage.setItem('saathi_token', currentToken);
      updateUserUI();
      loadAllData();
      return;
    }
  } catch (e) {
    console.warn('Default demo login error:', e);
  }

  // Fallback: create random anonymous user
  await generateFreshAnonymousStudent(false);
}

function updateUserUI() {
  if (!currentUser) return;
  const nameEl = document.getElementById('userPseudonymDisplay');
  const roleEl = document.getElementById('userRoleBadge');
  const modalLabel = document.getElementById('modalCurrentUserLabel');
  const consentToggle = document.getElementById('consentShareToggle');
  const consentDisplay = document.getElementById('consentDisplayPseudonym');

  if (nameEl) nameEl.innerText = currentUser.pseudonym;
  if (roleEl) {
    roleEl.innerText = currentUser.role === 'counselor' ? 'Counselor Staff' : 'Student (Anonymous)';
  }
  if (modalLabel) {
    modalLabel.innerText = `${currentUser.pseudonym} (${currentUser.role})`;
  }
  if (consentToggle) {
    consentToggle.checked = Boolean(currentUser.consent_share_mood);
  }
  if (consentDisplay) {
    consentDisplay.innerText = currentUser.pseudonym;
  }

  const avatar = document.getElementById('userAvatarEmoji');
  if (avatar) {
    avatar.innerText = currentUser.role === 'counselor' ? '👩‍⚕️' : '🐦';
  }
}

function setupInitialUI() {
  // Set default booking date to tomorrow
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

async function loadAllData() {
  await Promise.all([
    loadMoodStats(),
    loadMoodHistory(),
    loadJournals(),
    loadCounselors(),
    loadAppointments(),
    loadCounselorPortalAppointments(),
    loadCampusPulse()
  ]);
  if (window.lucide) window.lucide.createIcons();
  if (window.refreshTiltCards) window.refreshTiltCards();
}

// ==========================================
// TAB NAVIGATION
// ==========================================
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(el => {
    el.classList.remove('active-tab', 'text-white', 'bg-forest-700/90');
    el.classList.add('text-cream-200');
  });

  const targetTab = document.getElementById(`tab-${tabId}`);
  const targetBtn = document.getElementById(`tab-btn-${tabId}`);

  if (targetTab) targetTab.classList.remove('hidden');
  if (targetBtn) {
    targetBtn.classList.add('active-tab', 'text-white', 'bg-forest-700/90');
    targetBtn.classList.remove('text-cream-200');
  }

  if (tabId === 'campus') {
    renderCampusCharts();
  }
  if (tabId === 'track' && moodChartInstance) {
    moodChartInstance.resize();
  }
  if (window.refreshTiltCards) setTimeout(window.refreshTiltCards, 50);
}

// ==========================================
// TAB 1: MOOD TRACKING & 14-DAY VISUALS
// ==========================================
function selectMood(score) {
  selectedMoodScore = score;
  document.querySelectorAll('.mood-option').forEach(el => {
    const s = parseInt(el.getAttribute('data-mood'));
    if (s === score) {
      el.classList.add('selected', 'border-coral-500', 'bg-coral-50/40');
      el.classList.remove('border-slate-200', 'bg-cream-50');
    } else {
      el.classList.remove('selected', 'border-coral-500', 'bg-coral-50/40', 'border-forest-600', 'bg-forest-50/50');
      el.classList.add('border-slate-200', 'bg-cream-50');
    }
  });
}

function toggleFactor(btn, factor) {
  if (selectedFactors.has(factor)) {
    selectedFactors.delete(factor);
    btn.classList.remove('selected');
  } else {
    selectedFactors.add(factor);
    btn.classList.add('selected');
  }
}

async function submitMoodLog() {
  const energy = parseInt(document.getElementById('energySlider').value) || 5;
  const sleep = parseFloat(document.getElementById('sleepSlider').value) || 7.0;
  const note = document.getElementById('quickMoodNote').value.trim();

  try {
    const res = await fetch(`${API_BASE}/moods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        score: selectedMoodScore,
        energy_level: energy,
        sleep_hours: sleep,
        factors: Array.from(selectedFactors),
        note
      })
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById('quickMoodNote').value = '';
      
      // Early warning nudge check
      if (data.earlyWarningNudge) {
        document.getElementById('earlyWarningBanner').classList.remove('hidden');
      }

      await loadMoodStats();
      await loadMoodHistory();
      alert('✓ Mood check-in logged! Thank you for pausing with yourself today.');
    } else {
      alert(data.error || 'Failed to log mood.');
    }
  } catch (err) {
    console.error('Error logging mood:', err);
    alert('Network error while saving mood.');
  }
}

async function loadMoodStats() {
  if (!currentToken) return;
  try {
    const res = await fetch(`${API_BASE}/moods/stats`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) return;
    const stats = await res.json();

    document.getElementById('statAvgMood').innerHTML = `${stats.averageMood || '3.5'} <span class="text-xs text-slate-400 font-normal">/ 5</span>`;
    document.getElementById('statAvgSleep').innerHTML = `${stats.averageSleep || '7.0'} <span class="text-xs text-slate-400 font-normal">hrs</span>`;
    document.getElementById('streakCountBadge').innerText = `${stats.streakDays || 1} Days`;

    if (stats.topFactors && stats.topFactors.length > 0) {
      document.getElementById('statTopStressor').innerText = stats.topFactors[0].name;
    }

    const nudgeStatusEl = document.getElementById('statNudgeStatus');
    if (stats.earlyWarningNudge) {
      nudgeStatusEl.innerText = 'Support Nudge Active';
      nudgeStatusEl.className = 'text-sm font-bold text-amber-600 mt-1';
      document.getElementById('earlyWarningBanner').classList.remove('hidden');
    } else {
      nudgeStatusEl.innerText = 'Steady ✓';
      nudgeStatusEl.className = 'text-sm font-bold text-emerald-700 mt-1';
    }
  } catch (e) {
    console.warn('Stats fetch error:', e);
  }
}

async function loadMoodHistory() {
  if (!currentToken) return;
  try {
    const res = await fetch(`${API_BASE}/moods/history?days=14`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    renderMoodChart(data.logs || []);
  } catch (e) {
    console.warn('Mood history error:', e);
  }
}

function renderMoodChart(logs) {
  const ctx = document.getElementById('moodChart');
  if (!ctx) return;

  const labels = logs.map(l => {
    const d = new Date(l.created_at);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const moodScores = logs.map(l => l.score);
  const energyScores = logs.map(l => (l.energy_level / 2)); // normalized to 1-5

  if (moodChartInstance) {
    moodChartInstance.destroy();
  }

  moodChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Mood Score (1-5)',
          data: moodScores,
          borderColor: '#1e453e',
          backgroundColor: 'rgba(30, 69, 62, 0.12)',
          borderWidth: 3,
          fill: true,
          tension: 0.38,
          pointBackgroundColor: '#16332f',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4.5,
          pointHoverRadius: 7
        },
        {
          label: 'Energy (Scaled 1-5)',
          data: energyScores,
          borderColor: '#e07a5f',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          tension: 0.2,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: (val) => {
              const labels = { 1: '🌧️ Down', 2: '☁️ Anxious', 3: '⛅ Neutral', 4: '🌿 Calm', 5: '☀️ Joy' };
              return labels[val] || val;
            }
          },
          grid: { color: '#f3efe6' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function dismissEarlyWarning() {
  document.getElementById('earlyWarningBanner').classList.add('hidden');
}

// ==========================================
// TAB 2: ANONYMOUS ENCRYPTED JOURNAL
// ==========================================
function applyPrompt(promptText) {
  const content = document.getElementById('journalContent');
  if (promptText) {
    content.value = `[Prompt: ${promptText}]\n\n`;
    content.focus();
  } else {
    content.value = '';
  }
}

async function saveJournalEntry() {
  const title = document.getElementById('journalTitle').value.trim();
  const content = document.getElementById('journalContent').value.trim();
  const tagsInput = document.getElementById('journalTags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

  if (!content) {
    alert('Please write a few thoughts before saving.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/journals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ title, content, tags })
    });

    const data = await res.json();
    if (res.ok) {
      // Check for Crisis Safety Net trigger
      if (data.crisis && data.crisis.isCrisis) {
        openCrisisModal();
      }

      // Show AI reflection response
      if (data.sentiment) {
        document.getElementById('aiReflectionContainer').classList.remove('hidden');
        document.getElementById('aiReflectionText').innerText = data.sentiment.reflection;
        document.getElementById('aiSentimentBadge').innerText = data.sentiment.tone.toUpperCase();
      }

      document.getElementById('journalTitle').value = '';
      document.getElementById('journalContent').value = '';
      document.getElementById('journalTags').value = '';

      await loadJournals();
      if (window.lucide) window.lucide.createIcons();
    } else {
      alert(data.error || 'Failed to save reflection.');
    }
  } catch (err) {
    console.error('Error saving journal:', err);
    alert('Network error while saving journal.');
  }
}

async function loadJournals() {
  if (!currentToken) return;
  const container = document.getElementById('journalsListContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/journals`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const entries = data.entries || [];

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-xs">
          No reflections yet. Write your first anonymous note above.
        </div>`;
      return;
    }

    container.innerHTML = entries.map(e => `
      <div class="p-4 rounded-xl border border-cream-200 bg-cream-50 hover:bg-white transition space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-forest-800">${escapeHtml(e.title || 'Untitled Reflection')}</span>
            <span class="text-[10px] bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full font-medium">
              ${escapeHtml(e.sentiment_tone || 'Reflective')}
            </span>
            <span class="text-[10px] text-slate-400 flex items-center space-x-1" title="Encrypted at rest on SQLite">
              <i data-lucide="lock" class="w-3 h-3 text-emerald-600"></i>
              <span>AES-256</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-[10px] text-slate-400">${new Date(e.created_at).toLocaleDateString()}</span>
            <button onclick="deleteJournal(${e.id})" class="text-slate-400 hover:text-red-500 p-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
        <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed">${escapeHtml(e.content)}</p>
        ${e.tags && e.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${e.tags.map(t => `<span class="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md">#${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error('Error fetching journals:', err);
  }
}

async function deleteJournal(id) {
  if (!confirm('Are you sure you want to permanently delete this encrypted entry?')) return;
  try {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (res.ok) {
      await loadJournals();
    }
  } catch (err) {
    console.error('Error deleting journal:', err);
  }
}

// ==========================================
// TAB 3: CALM TOOLKIT & AUDIO SYNTHESIZER
// ==========================================
function setBreathingPattern(pattern) {
  currentBreathingPattern = pattern;
  document.getElementById('btnPatternBox').className = pattern === 'box'
    ? 'text-xs font-semibold px-4 py-1.5 rounded-lg bg-forest-800 text-white shadow-sm transition'
    : 'text-xs font-semibold px-4 py-1.5 rounded-lg bg-cream-100 text-slate-700 hover:bg-cream-200 transition';
  
  document.getElementById('btnPattern478').className = pattern === '478'
    ? 'text-xs font-semibold px-4 py-1.5 rounded-lg bg-forest-800 text-white shadow-sm transition'
    : 'text-xs font-semibold px-4 py-1.5 rounded-lg bg-cream-100 text-slate-700 hover:bg-cream-200 transition';

  resetBreathing();
}

function toggleBreathing() {
  if (isBreathingActive) {
    pauseBreathing();
  } else {
    startBreathing();
  }
}

function startBreathing() {
  isBreathingActive = true;
  document.getElementById('breathingBtnText').innerText = 'Pause Breathing';
  document.getElementById('breathingStartBtn').classList.replace('bg-forest-800', 'bg-coral-500');
  runBreathingStep('inhale');
}

function pauseBreathing() {
  isBreathingActive = false;
  clearTimeout(breathingTimer);
  document.getElementById('breathingBtnText').innerText = 'Resume Breathing';
  document.getElementById('breathingStartBtn').classList.replace('bg-coral-500', 'bg-forest-800');
}

function resetBreathing() {
  pauseBreathing();
  breathingCycles = 0;
  document.getElementById('breathingCyclesCompleted').innerText = '0';
  document.getElementById('breathingBtnText').innerText = 'Start Breathing Session';
  const bubble = document.getElementById('breathingBubble');
  bubble.className = 'breathing-circle';
  document.getElementById('breathingInstruction').innerText = 'Ready';
  document.getElementById('breathingSeconds').innerText = '4s';
}

function runBreathingStep(phase) {
  if (!isBreathingActive) return;

  const cfg = BREATHING_CONFIGS[currentBreathingPattern];
  const bubble = document.getElementById('breathingBubble');
  const label = document.getElementById('breathingInstruction');
  const countEl = document.getElementById('breathingSeconds');

  let duration = 4;
  let nextPhase = 'hold1';

  if (phase === 'inhale') {
    duration = cfg.inhale;
    nextPhase = cfg.hold1 > 0 ? 'hold1' : 'exhale';
    label.innerText = 'Breathe In...';
    bubble.className = 'breathing-circle inhale';
    if (window.saathiAudio) saathiAudio.playChime();
  } else if (phase === 'hold1') {
    duration = cfg.hold1;
    nextPhase = 'exhale';
    label.innerText = 'Hold Gently';
    bubble.className = 'breathing-circle hold';
  } else if (phase === 'exhale') {
    duration = cfg.exhale;
    nextPhase = cfg.hold2 > 0 ? 'hold2' : 'inhale';
    label.innerText = 'Release & Exhale';
    bubble.className = 'breathing-circle exhale';
  } else if (phase === 'hold2') {
    duration = cfg.hold2;
    nextPhase = 'inhale';
    label.innerText = 'Rest / Empty';
    bubble.className = 'breathing-circle hold';
  }

  let remaining = duration;
  countEl.innerText = `${remaining}s`;

  const intervalId = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      countEl.innerText = `${remaining}s`;
    } else {
      clearInterval(intervalId);
      if (nextPhase === 'inhale') {
        breathingCycles++;
        document.getElementById('breathingCyclesCompleted').innerText = breathingCycles;
      }
      runBreathingStep(nextPhase);
    }
  }, 1000);

  breathingTimer = intervalId;
}

// Ambient Audio Synthesizer Controls
function playAmbientTrack(track) {
  document.querySelectorAll('.sound-card').forEach(el => {
    el.classList.remove('border-forest-600', 'bg-white', 'shadow-md');
    el.classList.add('border-slate-200', 'bg-cream-50');
  });

  const card = document.getElementById(`soundCard-${track}`);
  if (card) {
    card.classList.add('border-forest-600', 'bg-white', 'shadow-md');
    card.classList.remove('border-slate-200', 'bg-cream-50');
  }

  document.getElementById('btnStopAudio').classList.remove('hidden');

  if (track === 'rain') saathiAudio.playRain();
  else if (track === 'ocean') saathiAudio.playOcean();
  else if (track === 'forest') saathiAudio.playForest();
  else if (track === 'lofi') saathiAudio.playLofi();
}

function stopAmbientAudio() {
  if (window.saathiAudio) saathiAudio.stop();
  document.querySelectorAll('.sound-card').forEach(el => {
    el.classList.remove('border-forest-600', 'bg-white', 'shadow-md');
    el.classList.add('border-slate-200', 'bg-cream-50');
  });
  document.getElementById('btnStopAudio').classList.add('hidden');
}

// ==========================================
// TAB 4: CONNECT (COUNSELORS & CONSENT)
// ==========================================
async function updateConsentSetting(isChecked) {
  if (!currentToken) return;
  try {
    const res = await fetch(`${API_BASE}/auth/consent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ consent_share_mood: isChecked })
    });
    if (res.ok) {
      if (currentUser) currentUser.consent_share_mood = isChecked ? 1 : 0;
      alert(`Consent updated: ${isChecked ? '14-day mood trend sharing ENABLED' : 'Mood sharing DISABLED'}. Individual diaries are always kept private.`);
    }
  } catch (e) {
    console.error('Consent error:', e);
  }
}

async function loadCounselors() {
  const container = document.getElementById('counselorsDirectoryList');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/counselors`);
    if (!res.ok) return;
    const data = await res.json();
    const counselors = data.counselors || [];

    container.innerHTML = counselors.map(c => `
      <div class="p-5 rounded-2xl border border-cream-200 bg-cream-50 flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-3 mb-3">
            <span class="text-3xl">${c.avatar_emoji || '👩‍⚕️'}</span>
            <div>
              <h4 class="text-sm font-bold text-forest-800">${escapeHtml(c.name)}</h4>
              <p class="text-[11px] text-slate-500">${escapeHtml(c.title)}</p>
            </div>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed mb-3">${escapeHtml(c.bio)}</p>
          <div class="flex flex-wrap gap-1 mb-4">
            ${c.specialties.map(s => `<span class="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full">${escapeHtml(s)}</span>`).join('')}
          </div>
        </div>
        <button onclick="openBookingModal(${c.id}, '${escapeHtml(c.name)}')" class="w-full bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-sm transition">
          Book Confidential Slot
        </button>
      </div>
    `).join('');
  } catch (e) {
    console.warn('Counselors load error:', e);
  }
}

async function loadAppointments() {
  if (!currentToken) return;
  const container = document.getElementById('studentAppointmentsList');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/counselors/my-appointments`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const appointments = data.appointments || [];

    if (appointments.length === 0) {
      container.innerHTML = `<div class="text-center py-6 text-slate-400 text-xs">No active bookings found.</div>`;
      return;
    }

    container.innerHTML = appointments.map(a => `
      <div class="p-4 rounded-xl border border-cream-200 bg-cream-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${a.avatar_emoji || '👩‍⚕️'}</span>
          <div>
            <div class="text-xs font-bold text-forest-800">${escapeHtml(a.counselor_name)}</div>
            <div class="text-[11px] text-slate-500">${a.slot_date} · ${a.slot_time} (${a.session_type.toUpperCase()})</div>
            <div class="text-[10px] text-slate-400">Consent to share mood: ${a.shared_mood_snapshot ? '✓ Granted' : '✗ Private'}</div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="openChatModal(${a.id}, '${escapeHtml(a.counselor_name)}')" class="bg-forest-800 hover:bg-forest-700 text-white text-xs px-3.5 py-1.5 rounded-lg shadow-sm font-semibold transition flex items-center space-x-1">
            <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
            <span>Open Chat</span>
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  } catch (e) {
    console.warn('Appointments error:', e);
  }
}

function openBookingModal(counselorId, counselorName) {
  document.getElementById('bookingCounselorId').value = counselorId;
  document.getElementById('bookingCounselorName').innerText = `with ${counselorName}`;
  document.getElementById('bookingModal').classList.remove('hidden');
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.add('hidden');
}

async function confirmBooking() {
  const counselorId = document.getElementById('bookingCounselorId').value;
  const slotDate = document.getElementById('bookingDate').value;
  const slotTime = document.getElementById('bookingSlotTime').value;
  const sessionType = document.querySelector('input[name="sessionType"]:checked').value;
  const notes = document.getElementById('bookingNotes').value.trim();
  const consentMood = document.getElementById('bookingMoodConsentCheckbox').checked;

  if (!slotDate || !slotTime) {
    alert('Please pick a date and slot.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/counselors/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({
        counselor_id: counselorId,
        slot_date: slotDate,
        slot_time: slotTime,
        session_type: sessionType,
        notes,
        share_mood_trend: consentMood
      })
    });

    const data = await res.json();
    if (res.ok) {
      closeBookingModal();
      await loadAppointments();
      alert('✓ Confidential session confirmed! Check your appointments list to message your counselor.');
    } else {
      alert(data.error || 'Failed to book session.');
    }
  } catch (e) {
    console.error('Booking error:', e);
  }
}

// Confidential Consultation Chat
async function openChatModal(appointmentId, partnerName) {
  activeAppointmentId = appointmentId;
  document.getElementById('chatHeaderTitle').innerText = `Consultation with ${partnerName}`;
  document.getElementById('chatModal').classList.remove('hidden');
  await loadChatMessages();
}

function closeChatModal() {
  document.getElementById('chatModal').classList.add('hidden');
  activeAppointmentId = null;
}

async function loadChatMessages() {
  if (!activeAppointmentId || !currentToken) return;
  const container = document.getElementById('chatMessagesContainer');

  try {
    const res = await fetch(`${API_BASE}/counselors/messages/${activeAppointmentId}`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const messages = data.messages || [];

    if (messages.length === 0) {
      container.innerHTML = `<div class="text-center py-4 text-slate-400">No messages yet. Send a note below.</div>`;
      return;
    }

    container.innerHTML = messages.map(m => {
      const isMe = m.sender_id === (currentUser ? currentUser.id : 0);
      return `
        <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'}">
          <span class="text-[10px] text-slate-400 mb-0.5">${escapeHtml(m.sender_name)}</span>
          <div class="p-3 rounded-2xl max-w-xs ${isMe ? 'bg-forest-800 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'} shadow-sm">
            ${escapeHtml(m.message)}
          </div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  } catch (e) {
    console.error('Chat load error:', e);
  }
}

async function sendChatMessage() {
  const input = document.getElementById('chatInputMessage');
  const message = input.value.trim();
  if (!message || !activeAppointmentId) return;

  try {
    const res = await fetch(`${API_BASE}/counselors/messages/${activeAppointmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ message })
    });
    if (res.ok) {
      input.value = '';
      await loadChatMessages();
    }
  } catch (e) {
    console.error('Send error:', e);
  }
}

// ==========================================
// TAB 5: CAMPUS PULSE & AGGREGATE CHARTS
// ==========================================
async function loadCampusPulse() {
  try {
    const res = await fetch(`${API_BASE}/campus/pulse`);
    if (!res.ok) return;
    const json = await res.json();
    const pulse = json.data;

    const countEl = document.getElementById('campusTotalCheckins');
    if (countEl) countEl.innerText = pulse.totalCheckIns.toLocaleString();
  } catch (e) {
    console.warn('Campus pulse fetch error:', e);
  }
}

async function renderCampusCharts() {
  try {
    const res = await fetch(`${API_BASE}/campus/pulse`);
    if (!res.ok) return;
    const json = await res.json();
    const pulse = json.data;

    // 1. Semester Wave Chart
    const waveCtx = document.getElementById('campusSemesterChart');
    if (waveCtx) {
      if (campusSemesterChartInstance) campusSemesterChartInstance.destroy();

      campusSemesterChartInstance = new Chart(waveCtx, {
        type: 'line',
        data: {
          labels: pulse.semesterTimeline.map(t => t.week),
          datasets: [{
            label: 'Campus Stress Index (0-100)',
            data: pulse.semesterTimeline.map(t => t.stressIndex),
            borderColor: '#e07a5f',
            backgroundColor: 'rgba(224, 122, 95, 0.12)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#cb684e',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { min: 0, max: 100, grid: { color: '#f3efe6' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Factors Breakdown Chart
    const factorCtx = document.getElementById('campusFactorsChart');
    if (factorCtx) {
      if (campusFactorsChartInstance) campusFactorsChartInstance.destroy();

      const top5 = pulse.topFactors.slice(0, 5);
      campusFactorsChartInstance = new Chart(factorCtx, {
        type: 'doughnut',
        data: {
          labels: top5.map(f => f.name),
          datasets: [{
            data: top5.map(f => f.count),
            backgroundColor: [
              '#1e453e',
              '#e07a5f',
              '#3d5a80',
              '#cb684e',
              '#84a98c'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  } catch (e) {
    console.error('Campus charts error:', e);
  }
}

// ==========================================
// IDENTITY & PROFILE MODAL LOGIC
// ==========================================
function openProfileModal() {
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
}

function openCrisisModal() {
  document.getElementById('crisisModal').classList.remove('hidden');
}

function closeCrisisModal() {
  document.getElementById('crisisModal').classList.add('hidden');
}

async function switchRoleDemo(role) {
  closeProfileModal();
  if (role === 'counselor') {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudonym: 'Dr. Ananya Sharma', pin: '1234' })
      });
      if (res.ok) {
        const data = await res.json();
        currentToken = data.token;
        currentUser = data.user;
        localStorage.setItem('saathi_token', currentToken);
        updateUserUI();
        await loadAllData();
        switchTab('connect');
        alert('Switched to Dr. Ananya Sharma (Campus Psychologist Portal).');
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    // Switch to student QuietSparrow
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudonym: 'QuietSparrow #24', pin: '1234' })
      });
      if (res.ok) {
        const data = await res.json();
        currentToken = data.token;
        currentUser = data.user;
        localStorage.setItem('saathi_token', currentToken);
        updateUserUI();
        await loadAllData();
        switchTab('track');
        alert('Switched to Anonymous Student (QuietSparrow #24).');
      }
    } catch (e) {
      console.error(e);
    }
  }
}

async function generateFreshAnonymousStudent(promptAlert = true) {
  try {
    const res = await fetch(`${API_BASE}/auth/anonymous`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.ok) {
      const data = await res.json();
      currentToken = data.token;
      currentUser = data.user;
      localStorage.setItem('saathi_token', currentToken);
      updateUserUI();
      await loadAllData();
      closeProfileModal();
      if (promptAlert) {
        alert(`New anonymous pseudonym generated: ${currentUser.pseudonym}! Ready to check in.`);
      }
    }
  } catch (e) {
    console.error('Anonymous creation error:', e);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Counselor Portal Inspection & Management
let counselorTrendChartInstance = null;

async function loadCounselorPortalAppointments() {
  const container = document.getElementById('counselorPortalAppointmentsList');
  if (!container || !currentToken) return;

  try {
    const res = await fetch(`${API_BASE}/counselors/portal-appointments`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    const appointments = data.appointments || [];

    if (appointments.length === 0) {
      container.innerHTML = `<div class="text-center py-6 text-slate-400 text-xs">No active student appointments assigned.</div>`;
      return;
    }

    container.innerHTML = appointments.map(a => `
      <div class="p-4 rounded-xl border border-cream-200 bg-cream-50 hover:bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-forest-700 text-white flex items-center justify-center font-bold text-sm">
            ${a.student_pseudonym.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-forest-800">${escapeHtml(a.student_pseudonym)}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full font-medium ${a.shared_mood_snapshot ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                ${a.shared_mood_snapshot ? '✓ Mood Consent Active' : '🔒 Privacy Opt-Out'}
              </span>
            </div>
            <div class="text-[11px] text-slate-500">${a.slot_date} · ${a.slot_time} · ${a.session_type.toUpperCase()}</div>
            ${a.notes ? `<div class="text-[11px] text-slate-600 italic mt-0.5">"${escapeHtml(a.notes)}"</div>` : ''}
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <button onclick="inspectStudentMoodTrend(${a.id}, '${escapeHtml(a.student_pseudonym)}')" class="bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs px-3 py-1.5 rounded-lg border border-cream-200 font-semibold transition flex items-center space-x-1">
            <i data-lucide="line-chart" class="w-3.5 h-3.5"></i>
            <span>View Mood Curve</span>
          </button>
          <button onclick="openChatModal(${a.id}, '${escapeHtml(a.student_pseudonym)}')" class="bg-forest-800 hover:bg-forest-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm font-semibold transition flex items-center space-x-1">
            <i data-lucide="message-square" class="w-3.5 h-3.5"></i>
            <span>Consultation Chat</span>
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  } catch (e) {
    console.warn('Counselor portal appointments error:', e);
  }
}

async function inspectStudentMoodTrend(appointmentId, studentPseudonym) {
  const modal = document.getElementById('counselorTrendModal');
  const banner = document.getElementById('trendConsentBanner');
  const nameEl = document.getElementById('trendModalStudentName');
  const ctx = document.getElementById('counselorTrendChart');

  nameEl.innerText = `${studentPseudonym} - Mood Trajectory`;
  modal.classList.remove('hidden');

  try {
    const res = await fetch(`${API_BASE}/counselors/student-trend/${appointmentId}`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();

    if (!data.consentGranted) {
      banner.className = 'p-3 rounded-xl mb-4 text-xs bg-amber-50 border border-amber-200 text-amber-900';
      banner.innerHTML = `⚠️ <strong>Confidentiality Respected:</strong> ${escapeHtml(data.message)}`;
      if (counselorTrendChartInstance) counselorTrendChartInstance.destroy();
      return;
    }

    banner.className = 'p-3 rounded-xl mb-4 text-xs bg-emerald-50 border border-emerald-200 text-emerald-900';
    banner.innerHTML = `✓ <strong>Consent Granted:</strong> ${escapeHtml(data.student_pseudonym)} shared their 14-day mood scores and stress tags. Diary contents remain strictly private.`;

    const trend = data.trend || [];
    if (counselorTrendChartInstance) counselorTrendChartInstance.destroy();

    counselorTrendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.map(t => t.date ? t.date.split('-').slice(1).join('/') : ''),
        datasets: [{
          label: 'Student Mood Score (1-5)',
          data: trend.map(t => t.score),
          borderColor: '#1e453e',
          backgroundColor: 'rgba(30, 69, 62, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#1e453e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 1, max: 5 }
        }
      }
    });
  } catch (e) {
    console.error('Trend fetch error:', e);
  }
}

function closeCounselorTrendModal() {
  document.getElementById('counselorTrendModal').classList.add('hidden');
}
