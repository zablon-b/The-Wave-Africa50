/* ============================================================
   THE WAVE AFRICA – main.js
   Features:
     1. Sticky Navbar — shadow on scroll + active link highlight
     2. Hamburger Mobile Menu — toggle open/close
     3. Scroll Reveal — fade-in elements as they enter viewport
     4. Animated Counter — count up stat numbers on scroll
     5. Back-to-Top Button — show/hide + smooth scroll
     6. Active Nav Link — highlight current section in navbar
     7. Close mobile menu on nav link click
   ============================================================ */


/* ── 1. STICKY NAVBAR SHADOW ──────────────────────────────── */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();


/* ── 2. HAMBURGER MOBILE MENU ─────────────────────────────── */
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
})();


/* ── 7. CLOSE MOBILE MENU ON LINK CLICK ──────────────────── */
(function initMobileMenuClose() {
  const mobileMenu  = document.getElementById('mobileMenu');
  const hamburger   = document.getElementById('hamburger');
  if (!mobileMenu || !hamburger) return;

  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ── 3. SCROLL REVEAL ─────────────────────────────────────── */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  // Use IntersectionObserver for performance
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent grid
          const parent    = entry.target.parentElement;
          const siblings  = Array.from(parent.querySelectorAll('.reveal'));
          const index     = siblings.indexOf(entry.target);
          const delay     = index * 120; // ms stagger per card

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ── 4. ANIMATED COUNTER ──────────────────────────────────── */
(function initCounters() {
  const counterElements = document.querySelectorAll('.stat-num[data-target]');
  if (!counterElements.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const steps    = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        el.textContent = target.toLocaleString() + '+';
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, stepTime);
  }

  // Trigger counter when the element scrolls into view
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterElements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ── 5. BACK-TO-TOP BUTTON ────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  // Show button after scrolling 400px
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  // Smooth scroll to top on click
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 6. ACTIVE NAV LINK HIGHLIGHT ─────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          // Remove active from all links
          navLinks.forEach(function (link) {
            link.classList.remove('active');
          });

          // Add active to matching link
          const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    },
    {
      threshold: 0.35,        // section must be 35% visible
      rootMargin: '-70px 0px 0px 0px' // offset for fixed navbar height
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();


/* ── WAVE SVG PATH ANIMATION (subtle float) ───────────────── */
(function initWaveAnimation() {
  const paths = document.querySelectorAll('.wave-path-1, .wave-path-2');
  if (!paths.length) return;

  let tick = 0;

  function animateWaves() {
    tick += 0.008;

    paths.forEach(function (path, i) {
      const offset = i === 0 ? 0 : Math.PI;
      const dy     = Math.sin(tick + offset) * 12;
      path.style.transform = 'translateY(' + dy + 'px)';
    });

    requestAnimationFrame(animateWaves);
  }

  animateWaves();
})();



/* =======main.js For Who We Are Page========= */
/* ==============================
   THE WAVE AFRICA — WHO WE ARE
   main.js
============================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAVBAR SCROLL EFFECT ===== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  /* ===== SCROLL REVEAL ===== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, observerOptions);

  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== HERO SCROLL HINT ===== */
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      const target = document.getElementById('mission-vision');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== PILLAR CARDS TILT EFFECT ===== */
  const pillarCards = document.querySelectorAll('.pillar-card');
  pillarCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = -(y / rect.height) * 8;
      const tiltY  =  (x / rect.width)  * 8;
      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.perspective = '600px';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ===== FLOATING BADGE COUNTER ANIMATION ===== */
  const badge = document.querySelector('.badge-number');
  if (badge) {
    const target  = 5000;
    const duration = 2000;
    let startTime = null;
    let animated  = false;

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCount();
        }
      });
    }, { threshold: 0.5 });

    countObserver.observe(badge);

    function animateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = easeOut(progress);
      const current  = Math.floor(eased * target);
      badge.textContent = current.toLocaleString() + '+';
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }
  }

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

});

/* ===============OUR PILLARS============ */

