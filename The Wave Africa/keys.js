/* ============================================================
   keyprograms.js – The Wave Africa · Key Programs Page
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Mobile nav hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

  /* ---------- 2. Header shadow on scroll ---------- */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 20
      ? '0 4px 24px rgba(0,0,0,0.55)'
      : 'none';
  }, { passive: true });

  /* ---------- 3. Scroll-triggered reveal for program cards ---------- */
  const cards = document.querySelectorAll('.program-card');

  // Set initial hidden state
  cards.forEach(card => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(32px)';
    card.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = Array.from(cards).indexOf(el) * 130;
        setTimeout(() => {
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        cardObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => cardObserver.observe(card));

  /* ---------- 4. "Learn More" button ---------- */
  document.querySelectorAll('.learn-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Pulse animation on click to show interaction
      btn.style.transform  = 'scale(0.95)';
      btn.style.transition = 'transform 0.15s ease';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 150);

      // TODO: link each button to its own detail page or modal.
      // Example: window.location.href = 'worshippers.html';
      // For now, we alert the program name as a placeholder.
      /* const card  = btn.closest('.program-card');
      const title = card.querySelector('.card-title')?.textContent || 'this program';
      alert(`More info about "${title}" coming soon!`); */
    });
  });

  /* ---------- 5. Smooth card-image zoom cursor effect ---------- */
  cards.forEach(card => {
    const imgWrapper = card.querySelector('.card-img-wrapper');
    const img        = card.querySelector('.card-img');
    if (!imgWrapper || !img) return;

    imgWrapper.addEventListener('mousemove', (e) => {
      const rect = imgWrapper.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      img.style.transform = `scale(1.07) translate(${x}px, ${y}px)`;
    });

    imgWrapper.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1) translate(0, 0)';
    });
  });

})();
