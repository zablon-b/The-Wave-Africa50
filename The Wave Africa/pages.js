/* ═══════════════════════════════════════════════════════════════════
   THE WAVE AFRICA — PAGES.JS
   Combined page-specific JS for:
     • impact.html    → counter animation
     • partner.html   → (no extra JS needed beyond main.js)
     • donate.html    → donation toggle, amount selection, Flutterwave payment
     • contact.html   → form validation & submission feedback
   Runs after main.js. Each block is guarded by a page-class check
   so functions don't fire on wrong pages.
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const body = document.body;

  /* ════════════════════════════════════════════════════════════
     1. OUR IMPACT — Animated number counter
  ════════════════════════════════════════════════════════════ */
  if (body.classList.contains('page-impact')) {

    const counters = document.querySelectorAll('[data-count]');

    if (counters.length && 'IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const dur    = 2000; // ms
          const step   = 30;  // ms per frame
          const inc    = target / (dur / step);
          let current  = 0;

          const tick = setInterval(() => {
            current += inc;
            if (current >= target) {
              current = target;
              clearInterval(tick);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, step);

          counterObserver.unobserve(el);
        });
      }, { threshold: 0.5 });

      counters.forEach(el => counterObserver.observe(el));
    }
  }

  const hamburger = document.getElementById("navHamburger");
  const navLinks  = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-open");
    });
  }

  if (body.classList.contains('page-impact')) {

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map('map', {
      zoomControl: false
    }).setView([-4.0435, 39.6682], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CARTO'
    }).addTo(map);

    const goldIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20]
    });

    L.marker([-4.0435, 39.6682], { icon: goldIcon })
      .addTo(map)
      .bindPopup('<b>Changamwe</b><br>Mombasa')
      .openPopup();

    setTimeout(() => { map.invalidateSize(); }, 200);
  }

  /* ════════════════════════════════════════════════════════════
     2. DONATE PAGE — Toggle, amount selection, Flutterwave payment
  ════════════════════════════════════════════════════════════ */
  if (body.classList.contains('page-donate')) {

    /* ── CONFIG ── 
       🔑 Replace with your real Flutterwave public key.
       Get it from: dashboard.flutterwave.com → Settings → API Keys
       Test key starts with:  FLWPUBK_TEST-...
       Live key starts with:  FLWPUBK-...
    ─────────────────────────────────────────────────────────── */
    const FLW_PUBLIC_KEY = 'YOUR_FLUTTERWAVE_PUBLIC_KEY';
    const ORG_NAME       = 'The Wave Africa';
    /* ────────────────────────────────────────────────────────── */

    /* Frequency toggle */
    const btnOneTime   = document.getElementById('btnOneTime');
    const btnMonthly   = document.getElementById('btnMonthly');
    let frequency      = 'once';

    function setFrequency(val, activeBtn, inactiveBtn) {
      frequency = val;
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-pressed', 'true');
      inactiveBtn.classList.remove('active');
      inactiveBtn.setAttribute('aria-pressed', 'false');
    }

    if (btnOneTime && btnMonthly) {
      btnOneTime.addEventListener('click', () => setFrequency('once',    btnOneTime, btnMonthly));
      btnMonthly.addEventListener('click', () => setFrequency('monthly', btnMonthly, btnOneTime));
    }

    /* Amount buttons */
    const amountBtns  = document.querySelectorAll('.donate-amount__btn:not(.donate-amount__btn--custom)');
    const btnCustom   = document.getElementById('btnCustom');
    const customWrap  = document.getElementById('customAmountWrap');
    const customInput = document.getElementById('customAmount');
    let selectedAmount = 2500; // default matches .active in HTML

    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        if (btnCustom) btnCustom.classList.remove('active');
        btn.classList.add('active');
        selectedAmount = parseInt(btn.dataset.amount, 10);
        if (customWrap) customWrap.hidden = true;
      });
    });

    if (btnCustom && customWrap && customInput) {
      btnCustom.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btnCustom.classList.add('active');
        customWrap.hidden = false;
        customInput.focus();
      });
      customInput.addEventListener('input', () => {
        const val = parseInt(customInput.value, 10);
        selectedAmount = isNaN(val) ? 0 : val;
      });
    }

    /* ── DONATE NOW — launch Flutterwave ── */
    const donateNowBtn = document.getElementById('donateNowBtn');
    if (donateNowBtn) {
      donateNowBtn.addEventListener('click', () => {

        const name  = document.getElementById('donorName').value.trim();
        const email = document.getElementById('donorEmail').value.trim();

        /* Validation */
        if (!name) {
          alert('Please enter your name before donating. 🙏');
          document.getElementById('donorName').focus();
          return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert('Please enter a valid email address.');
          document.getElementById('donorEmail').focus();
          return;
        }
        if (!selectedAmount || selectedAmount < 1) {
          alert('Please select or enter a donation amount.');
          return;
        }

        /* Developer reminder — remove once key is set */
        if (FLW_PUBLIC_KEY === 'YOUR_FLUTTERWAVE_PUBLIC_KEY') {
          alert('⚠️ Developer: Replace YOUR_FLUTTERWAVE_PUBLIC_KEY in pages.js with your real Flutterwave public key.');
          return;
        }

        /* Unique transaction reference */
        const txRef = 'WAVE-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

        /* Launch payment popup */
        FlutterwaveCheckout({
          public_key: FLW_PUBLIC_KEY,
          tx_ref:     txRef,
          amount:     selectedAmount,
          currency:   'KES',
          payment_options: 'card, mpesa, mobilemoney',

          customer: {
            email: email,
            name:  name,
          },

          customizations: {
            title:       ORG_NAME,
            description: (frequency === 'monthly' ? 'Monthly' : 'One-time') +
                         ' donation of KES ' + selectedAmount.toLocaleString() +
                         ' to ' + ORG_NAME,
            logo: '',   // Optional: add your logo URL e.g. 'https://yoursite.com/images/wave-africa-logo.jpeg'
          },

          callback: function (response) {
            console.log('Flutterwave response:', response);
            if (response.status === 'successful') {
              showThankYou(name, selectedAmount);
            } else {
              alert('Payment was not completed. Please try again or contact us at africathewave@gmail.com');
            }
          },

          onclose: function () {
            /* Donor closed popup without paying — do nothing */
          },
        });
      });
    }

    /* Thank-you screen replaces the hero content */
    function showThankYou(name, amount) {
      const content = document.querySelector('.donate-hero__content');
      if (!content) return;
      content.innerHTML = `
        <div class="donate-thankyou">
          <div class="donate-thankyou__icon">🙏</div>
          <h2 class="donate-thankyou__title">Thank You, ${name}!</h2>
          <p class="donate-thankyou__text">
            Your generous gift of <strong>KES ${amount.toLocaleString()}</strong> has been received.<br>
            Together, we are restoring ancient landmarks and transforming lives.
          </p>
          <p class="donate-thankyou__sub">
            A receipt has been sent to your email.<br>
            Questions? Reach us at <a href="mailto:africathewave@gmail.com">africathewave@gmail.com</a>
          </p>
          <a href="index.html" class="kp-btn kp-btn--gold" style="margin-top:2rem;">Back to Home</a>
        </div>
      `;
    }

  } /* end page-donate */

  /* ════════════════════════════════════════════════════════════
     3. CONTACT PAGE — Form validation & feedback
  ════════════════════════════════════════════════════════════ */
  if (body.classList.contains('page-contact')) {

    const form     = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form && feedback) {

      form.querySelectorAll('.contact-form__input').forEach(input => {
        input.addEventListener('blur',  () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) validateField(input);
        });
      });

      function validateField(input) {
        const ok = input.value.trim().length > 0 &&
                   (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        input.classList.toggle('error', !ok);
        return ok;
      }

      form.addEventListener('submit', e => {
        e.preventDefault();

        const inputs   = [...form.querySelectorAll('.contact-form__input')];
        const allValid = inputs.every(input => validateField(input));

        if (!allValid) {
          showFeedback('Please fill in all fields correctly.', 'error');
          return;
        }

        const submitBtn = form.querySelector('.contact-form__submit');
        submitBtn.textContent = 'SENDING…';
        submitBtn.disabled    = true;

        setTimeout(() => {
          showFeedback("✓ Message sent! We'll get back to you as soon as possible.", 'success');
          form.reset();
          submitBtn.textContent = 'SEND MESSAGE';
          submitBtn.disabled    = false;
        }, 1400);
      });

      function showFeedback(msg, type) {
        feedback.textContent = msg;
        feedback.className   = `contact-form__feedback ${type}`;
        feedback.hidden      = false;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (type === 'success') {
          setTimeout(() => { feedback.hidden = true; }, 6000);
        }
      }
    }
  }

})();