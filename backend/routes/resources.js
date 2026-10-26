const express = require('express');
const router = express.Router();

const RESOURCES = {
  breathingProtocols: [
    {
      id: 'box-breathing',
      name: 'Box Breathing (Navy SEAL 4-4-4-4)',
      description: 'Equal intervals of inhale, hold, exhale, and hold to swiftly reset fight-or-flight heart rate.',
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
      recommendedFor: 'Acute exam panic, nervous jitters, rapid heartbeat'
    },
    {
      id: '478-breathing',
      name: '4-7-8 Deep Parasympathetic Sleep Breath',
      description: 'Extended exhalation stimulates the vagus nerve and triggers immediate physical calm.',
      inhale: 4,
      hold1: 7,
      exhale: 8,
      hold2: 0,
      recommendedFor: 'Late night insomnia, racing thoughts before bed, hostel noise anxiety'
    },
    {
      id: 'coherent-breathing',
      name: 'Coherent Resonance (5.5s Pace)',
      description: 'Brings heart rate variability (HRV) into optimal resonance for mental clarity and study focus.',
      inhale: 5,
      hold1: 0,
      exhale: 5,
      hold2: 0,
      recommendedFor: 'Pre-study focus, steadying hand tremors before viva presentations'
    }
  ],

  groundingExercises: [
    {
      id: '54321',
      title: '5-4-3-2-1 Sensory Reset',
      subtitle: 'Anchor your attention in the physical world when panic threatens to derail you.',
      steps: [
        { count: 5, prompt: 'Notice 5 things you can see right now (e.g., notebook, wall lamp, shoe, sky, pen)' },
        { count: 4, prompt: 'Notice 4 things you can physically touch or feel (e.g., texture of clothes, cool desk, feet on floor)' },
        { count: 3, prompt: 'Listen for 3 distinct sounds (e.g., ceiling fan hum, distant footsteps, clock ticking)' },
        { count: 2, prompt: 'Notice 2 things you can smell or scents in the air (e.g., paper, rain, tea)' },
        { count: 1, prompt: 'Notice 1 taste or swallow a sip of cool water.' }
      ]
    }
  ],

  examGuides: [
    {
      id: 'pre-exam-panic',
      title: 'The 10-Minute Pre-Exam Panic Protocol',
      category: 'Exam Stress',
      summary: 'What to do when your mind feels like a blank chalkboard 15 minutes before walking into the examination hall.',
      bullets: [
        'Physically uncurl your toes and drop your shoulders 2 inches away from your ears.',
        'Sip cold water slowly: the swallowing reflex halts the hyperventilation feedback loop.',
        'Stop cramming new formulas in the final 20 minutes—trust your subconscious pattern retrieval.',
        'Repeat to yourself: "This exam measures my recall of specific syllabus points, not my worth as a human."'
      ]
    },
    {
      id: 'hostel-overwhelm',
      title: 'Hostel Sensory Overload & Solitude Reclamation',
      category: 'Campus Living',
      summary: 'Navigating crowded 3-sharing rooms, late-night noise, and lack of personal emotional space.',
      bullets: [
        'Find low-stimulation campus sanctuaries: library corner stacks, early-morning campus track, terrace gardens.',
        'Use pink or brown noise headphones to buffer sudden hostel corridor slamming.',
        'Establish gentle boundaries: "Hey, I have a big assignment due tomorrow, plugging in my focus headphones now."'
      ]
    },
    {
      id: 'attendance-burnout',
      title: 'Conquering Attendance Anxiety & Academic Overwhelm',
      category: 'Burnout Recovery',
      summary: 'Breaking the vicious cycle of feeling too stressed to attend class, leading to worse attendance anxiety.',
      bullets: [
        'Chunk attendance into single morning blocks rather than agonizing over the whole week.',
        'Reach out to campus mentor or course counselor proactively before attendance drops below minimum threshold.',
        'Rest is productive. Burnout is your brain’s biological breaker switch tripping.'
      ]
    }
  ],

  emergencyHelplines: [
    {
      name: 'Tele-MANAS (Govt. of India)',
      number: '14416',
      alternate: '1800-891-4416',
      available: '24/7 Toll-Free, 20+ Regional Languages',
      badge: 'National Crisis Helpline'
    },
    {
      name: 'KIRAN Helpline',
      number: '1800-599-0019',
      available: '24/7 Mental Health Rehabilitation Line',
      badge: 'Govt. Sponsored'
    },
    {
      name: 'Vandrevala Foundation',
      number: '+91 9999 666 555',
      available: '24/7 Free Crisis Counseling',
      badge: 'Confidential NGO'
    },
    {
      name: 'Campus Medical & Counseling Wing',
      number: 'Ext. 2244 (Campus Line)',
      available: '8:00 AM - 10:00 PM (Emergency 24/7)',
      badge: 'On-Campus Support'
    }
  ]
};

router.get('/', (req, res) => {
  res.json({ success: true, resources: RESOURCES });
});

module.exports = router;
