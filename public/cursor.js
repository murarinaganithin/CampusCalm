/**
 * Interactive UI Cursor Engine for CampusCalm
 * Handles 3D perspective card tilt, dynamic light sheen reflections,
 * ambient background lighting, and magnetic breathing proximity on mouse move.
 * Uses standard clean cursor (no custom tracking circles/dots).
 */

(function () {
  // Ambient lighting spotlight that gently illuminates background
  const spotlight = document.createElement('div');
  spotlight.id = 'cursor-ambient-spotlight';
  document.body.appendChild(spotlight);

  window.addEventListener('mousemove', (e) => {
    // Ambient light follows mouse position smoothly
    spotlight.style.background = `radial-gradient(circle 460px at ${e.clientX}px ${e.clientY}px, rgba(30, 69, 62, 0.07), rgba(55, 99, 89, 0.035), transparent 75%)`;
  }, { passive: true });

  // ==========================================
  // 3D PERSPECTIVE TILT & SHEEN ON CARDS
  // ==========================================
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card, .mood-option, .sound-card');

    cards.forEach(card => {
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = 'true';

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((y - centerY) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;

        // Dynamic light reflection coordinates
        card.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);

        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px) scale3d(1.012, 1.012, 1.012)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
      });
    });
  }

  // Initialize on load and on tab/content changes
  document.addEventListener('DOMContentLoaded', initTiltCards);
  window.refreshTiltCards = initTiltCards;

  // ==========================================
  // MAGNETIC BREATHING BUBBLE PROXIMITY
  // ==========================================
  window.addEventListener('mousemove', (e) => {
    const bubble = document.getElementById('breathingBubble');
    if (!bubble) return;
    const rect = bubble.getBoundingClientRect();
    const bubbleCenterX = rect.left + rect.width / 2;
    const bubbleCenterY = rect.top + rect.height / 2;

    const distX = e.clientX - bubbleCenterX;
    const distY = e.clientY - bubbleCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < 280) {
      const intensity = (1 - distance / 280) * 8;
      const tiltX = (distY / 280) * intensity;
      const tiltY = -(distX / 280) * intensity;
      bubble.style.setProperty('--magnetic-rx', `${tiltX.toFixed(1)}deg`);
      bubble.style.setProperty('--magnetic-ry', `${tiltY.toFixed(1)}deg`);
    } else {
      bubble.style.setProperty('--magnetic-rx', '0deg');
      bubble.style.setProperty('--magnetic-ry', '0deg');
    }
  }, { passive: true });

})();
