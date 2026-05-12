/* ============================================================
   ourpillars.js – The Wave Africa · Our Pillars Page
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Mobile nav hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

  /* ---------- 2. "Learn More" scroll-to & highlight ---------- */
  document.querySelectorAll('.learn-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target   = document.getElementById(targetId);
      if (!target) return;

      // Smooth scroll with offset for fixed header
      const headerH = document.querySelector('.site-header')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;

      window.scrollTo({ top, behavior: 'smooth' });

      // Briefly highlight the target pillar item
      target.classList.remove('highlighted');
      void target.offsetWidth; // reflow to restart animation
      target.classList.add('highlighted');

      setTimeout(() => target.classList.remove('highlighted'), 1800);
    });
  });

  /* ---------- 3. Scroll-triggered reveal for cards & pillar items ---------- */
  const revealEls = document.querySelectorAll('.pillar-card, .pillar-item');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.style.opacity = '1';
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealEls.forEach(el => {
    // Pause animation until visible (pillar-items start hidden)
    if (el.classList.contains('pillar-item')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
    revealObserver.observe(el);
  });

  /* ---------- 4. Header shadow on scroll ---------- */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  /* ---------- 5. Pillar item entrance animation on scroll ---------- */
  const pillarItems = document.querySelectorAll('.pillar-item');

  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, i * 120);
        pillarObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  pillarItems.forEach(item => {
    pillarObserver.observe(item);
  });

})();
