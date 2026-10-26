// Sentiment and Crisis Safety Net Engine for CampusCalm

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'killing myself', 'end my life', 'ending my life',
  'want to die', 'wanna die', 'self harm', 'self-harm', 'cut myself', 'cutting myself',
  'hang myself', 'cant go on', "can't go on", 'no reason to live', 'end it all',
  'better off dead', 'take all my pills', 'slit my', 'slit wrists', 'jump off'
];

const EMOTIONAL_LEXICON = {
  overwhelmed: [
    'overwhelmed', 'drowning', 'suffocating', 'too much', 'breaking down', 'panic',
    'freaking out', 'paralyzed', 'so much work', 'exam tomorrow', 'failing'
  ],
  anxious: [
    'anxious', 'nervous', 'scared', 'worry', 'worried', 'stress', 'stressed', 
    'heart racing', 'restless', 'dread', 'tense', 'shaking', 'jittery', 'midterms'
  ],
  exhausted: [
    'exhausted', 'tired', 'drained', 'burned out', 'burnout', 'no energy',
    'fatigued', 'sleepless', 'insomnia', 'cant sleep', 'zombie', 'depleted'
  ],
  lonely: [
    'lonely', 'alone', 'isolated', 'nobody understands', 'homesick', 'hostel',
    'miss home', 'no friends', 'alienated', 'disconnected'
  ],
  hopeful: [
    'better', 'improving', 'hopeful', 'grateful', 'proud', 'accomplished',
    'passed', 'finished', 'relief', 'progress', 'calmer', 'peaceful'
  ],
  joyful: [
    'happy', 'great', 'awesome', 'amazing', 'excited', 'loved', 'celebrating',
    'energized', 'confident', 'wonderful', 'joy'
  ]
};

/**
 * Evaluates text for crisis keywords and returns crisis metadata if flagged
 * @param {string} text 
 * @returns {{ isCrisis: boolean, triggers: string[] }}
 */
function scanCrisis(text) {
  if (!text) return { isCrisis: false, triggers: [] };
  const lower = text.toLowerCase();
  const matched = [];

  for (const keyword of CRISIS_KEYWORDS) {
    if (lower.includes(keyword)) {
      matched.push(keyword);
    }
  }

  return {
    isCrisis: matched.length > 0,
    triggers: matched,
    helplines: {
      teleManas: '14416 / 1800-891-4416 (24/7 Toll-Free, 20+ languages)',
      kiran: '1800-599-0019 (Govt. of India Mental Health)',
      vandrevala: '9999 666 555',
      campusDutyOfficer: 'Campus Medical Wing ext. 2244'
    }
  };
}

/**
 * Analyzes journal/thought text for sentiment, emotion, and suggests wellness actions
 * @param {string} text 
 * @returns {object}
 */
function analyzeReflection(text) {
  if (!text) {
    return {
      tone: 'neutral',
      intensity: 0,
      reflection: 'Take a breath. Writing is the first step toward clearing your mind.',
      suggestedResource: 'box-breathing'
    };
  }

  const lower = text.toLowerCase();
  const scores = {
    overwhelmed: 0,
    anxious: 0,
    exhausted: 0,
    lonely: 0,
    hopeful: 0,
    joyful: 0
  };

  for (const [emotion, words] of Object.entries(EMOTIONAL_LEXICON)) {
    for (const word of words) {
      if (lower.includes(word)) {
        scores[emotion] += 1;
      }
    }
  }

  let topEmotion = 'reflective';
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      topEmotion = emotion;
    }
  }

  let reflection = '';
  let suggestedResource = 'box-breathing';

  switch (topEmotion) {
    case 'overwhelmed':
      reflection = "It sounds like a heavy storm of demands right now. Remember: you don't have to solve the entire semester in this one hour. Let's ground your senses.";
      suggestedResource = 'grounding-54321';
      break;
    case 'anxious':
      reflection = "Your nervous system is on high alert. That is a normal response to campus pressure, but your body needs a signal that you are safe in this moment.";
      suggestedResource = 'box-breathing';
      break;
    case 'exhausted':
      reflection = "You've been carrying a lot without enough rest. Acknowledge your fatigue without judging yourself for needing to slow down.";
      suggestedResource = 'sleep-hygiene';
      break;
    case 'lonely':
      reflection = "Hostel and campus life can strangely feel like the loneliest place in a crowd. It's okay to feel this way, and reaching out is a sign of courage, not weakness.";
      suggestedResource = 'hostel-connection';
      break;
    case 'hopeful':
      reflection = "Noticing even slight moments of light and progress helps rewire resilience. Savor this peaceful space you carved out for yourself.";
      suggestedResource = 'gratitude-log';
      break;
    case 'joyful':
      reflection = "What a wonderful recharge! Take a moment to anchor this positive sensation in your mind.";
      suggestedResource = 'lofi-soundscape';
      break;
    default:
      reflection = "Putting your inner thoughts into words gives your mind space to breathe. You showed up for yourself today.";
      suggestedResource = 'box-breathing';
  }

  return {
    tone: topEmotion,
    confidence: maxScore > 0 ? Math.min(0.95, 0.4 + maxScore * 0.15) : 0.5,
    reflection,
    suggestedResource
  };
}

module.exports = {
  scanCrisis,
  analyzeReflection
};
