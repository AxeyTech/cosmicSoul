// ═══════════════════════════════════════════════
//  COSMICSOUL — Premium Frontend Engine
//  With Hindi / English i18n Support
// ═══════════════════════════════════════════════

import './style.css';

(() => {
  'use strict';

  // ──────────────────────────────────────────
  //  i18n Translation System
  // ──────────────────────────────────────────

  const TRANSLATIONS = {
    en: {
      // Navbar
      'nav.tagline': 'Vedic Astrology',

      // Hero
      'hero.label': 'Powered by Ancient Vedic Wisdom',
      'hero.line1': 'Unveil Your',
      'hero.line2': 'Cosmic Blueprint',
      'hero.desc': 'Ancient Vedic astrology meets cosmic intelligence — discover the celestial forces shaping your destiny in love, career, wealth, and spiritual growth.',
      'hero.feat1': 'Mulank & Bhagyank',
      'hero.feat2': 'Planetary Positions',
      'hero.feat3': 'Love & Career',
      'hero.feat4': 'Cosmic Predictions',

      // Form
      'form.title': 'Enter Your Birth Details',
      'form.subtitle': 'The stars were aligned in a unique pattern at the moment of your birth — let us decode it.',
      'form.name': 'Full Name',
      'form.namePh': 'Enter your full name',
      'form.dob': 'Date of Birth',
      'form.time': 'Time of Birth',
      'form.place': 'Place of Birth',
      'form.placePh': 'e.g. Delhi, Mumbai, New York',
      'form.submit': '✦ Reveal My Cosmic Blueprint',

      // Loading
      'loading.title': 'Reading the Cosmos…',
      'loading.step0': 'Calculating planetary positions',
      'loading.steps': [
        'Mapping planetary positions…',
        'Calculating Vedic birth chart…',
        'Analyzing Nakshatra alignments…',
        'Computing Mulank & Bhagyank…',
        'Reading your cosmic blueprint…',
        'Channeling cosmic predictions…',
        'Almost there… aligning the stars…'
      ],

      // Results
      'results.greeting': 'Cosmic Reading for',
      'results.bornOn': 'Born',
      'results.at': 'at',
      'results.chartTitle': '🪐 Birth Chart — Kundli',
      'results.predTitle': '🔮 Your Cosmic Predictions',
      'results.newReading': '✦ New Reading',

      // Table headers
      'table.planet': 'Planet (Graha)',
      'table.sign': 'Sign (Rashi)',
      'table.degree': 'Degree',
      'table.nakshatra': 'Nakshatra',

      // Insight card labels
      'card.mulank': 'Mulank — Birth Number',
      'card.bhagyank': 'Bhagyank — Destiny Number',
      'card.nakshatra': 'Birth Nakshatra',
      'card.moon': 'Moon Sign — Rashi',
      'card.sun': 'Sun Sign — Rashi',
      'card.lagna': 'Ascendant — Lagna',
      'card.ruledBy': 'Ruled by',
      'card.lord': 'Lord',

      // Footer
      'footer.text': '✦ CosmicSoul — Vedic Astrology & Numerology • For Spiritual Guidance',

      // Errors
      'error.fillAll': 'Please fill in all fields to reveal your cosmic blueprint.'
    },

    hi: {
      // Navbar
      'nav.tagline': 'वैदिक ज्योतिष',

      // Hero
      'hero.label': 'प्राचीन वैदिक ज्ञान द्वारा संचालित',
      'hero.line1': 'जानिए अपना',
      'hero.line2': 'ब्रह्मांडीय नक्शा',
      'hero.desc': 'प्राचीन वैदिक ज्योतिष और खगोलीय बुद्धिमत्ता का संगम — प्रेम, करियर, धन और आध्यात्मिक विकास में आपकी नियति को आकार देने वाली खगोलीय शक्तियों की खोज करें।',
      'hero.feat1': 'मूलांक और भाग्यांक',
      'hero.feat2': 'ग्रह स्थिति',
      'hero.feat3': 'प्रेम और करियर',
      'hero.feat4': 'खगोलीय भविष्यवाणी',

      // Form
      'form.title': 'अपना जन्म विवरण दर्ज करें',
      'form.subtitle': 'आपके जन्म के क्षण में तारे एक अनोखे पैटर्न में संरेखित थे — आइए इसे डिकोड करें।',
      'form.name': 'पूरा नाम',
      'form.namePh': 'अपना पूरा नाम दर्ज करें',
      'form.dob': 'जन्म तिथि',
      'form.time': 'जन्म समय',
      'form.place': 'जन्म स्थान',
      'form.placePh': 'जैसे दिल्ली, मुंबई, न्यूयॉर्क',
      'form.submit': '✦ अपना ब्रह्मांडीय नक्शा देखें',

      // Loading
      'loading.title': 'ब्रह्मांड पढ़ रहे हैं…',
      'loading.step0': 'ग्रहों की स्थिति गणना कर रहे हैं',
      'loading.steps': [
        'ग्रहों की स्थिति मैप कर रहे हैं…',
        'वैदिक जन्म कुंडली बना रहे हैं…',
        'नक्षत्र संरेखण का विश्लेषण…',
        'मूलांक और भाग्यांक की गणना…',
        'आपका ब्रह्मांडीय नक्शा पढ़ रहे हैं…',
        'खगोलीय भविष्यवाणी तैयार कर रहे हैं…',
        'लगभग हो गया… तारों को संरेखित कर रहे हैं…'
      ],

      // Results
      'results.greeting': 'ब्रह्मांडीय रीडिंग —',
      'results.bornOn': 'जन्म',
      'results.at': 'समय',
      'results.chartTitle': '🪐 जन्म कुंडली',
      'results.predTitle': '🔮 आपकी ब्रह्मांडीय भविष्यवाणी',
      'results.newReading': '✦ नई रीडिंग',

      // Table headers
      'table.planet': 'ग्रह',
      'table.sign': 'राशि',
      'table.degree': 'अंश',
      'table.nakshatra': 'नक्षत्र',

      // Insight card labels
      'card.mulank': 'मूलांक — जन्म अंक',
      'card.bhagyank': 'भाग्यांक — भाग्य अंक',
      'card.nakshatra': 'जन्म नक्षत्र',
      'card.moon': 'चंद्र राशि',
      'card.sun': 'सूर्य राशि',
      'card.lagna': 'लग्न',
      'card.ruledBy': 'स्वामी',
      'card.lord': 'स्वामी',

      // Footer
      'footer.text': '✦ CosmicSoul — वैदिक ज्योतिष और अंकशास्त्र • आध्यात्मिक मार्गदर्शन हेतु',

      // Errors
      'error.fillAll': 'कृपया अपना ब्रह्मांडीय नक्शा देखने के लिए सभी फ़ील्ड भरें।'
    }
  };

  // ──────────────────────────────────────────
  //  i18n Manager
  // ──────────────────────────────────────────

  class I18n {
    constructor() {
      // Use localStorage with fallback for mobile browsers that block it
      try {
        this.lang = localStorage.getItem('cosmicsoul-lang') || 'en';
      } catch(e) {
        this.lang = 'en';
      }
    }

    t(key) {
      return TRANSLATIONS[this.lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    }

    setLang(lang) {
      this.lang = lang;
      try {
        localStorage.setItem('cosmicsoul-lang', lang);
      } catch(e) {
        // localStorage blocked (private mode etc.) — keep lang in memory only
      }
      this.applyToDOM();
    }

    applyToDOM() {
      // Text content
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = this.t(key);
        if (typeof text === 'string') el.textContent = text;
      });

      // Placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = this.t(key);
      });

      // Update toggle button highlights
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === this.lang);
      });

      // Update HTML lang attribute
      document.documentElement.lang = this.lang === 'hi' ? 'hi' : 'en';
    }
  }

  // ──────────────────────────────────────────
  //  Interactive Star Field with Constellations
  // ──────────────────────────────────────────

  class StarField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.stars = [];
      this.shootingStars = [];
      this.gridDots = [];
      this.mouse = { x: -1000, y: -1000 };
      this.time = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.interactRadius = 180;

      this.resize();
      this.createStars();
      this.createGrid();
      this.bindEvents();
      this.animate();
    }

    resize() {
      const { canvas, dpr } = this;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
    }

    createStars() {
      this.stars = [];
      const count = Math.min(200, Math.floor((this.w * this.h) / 7000));
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          baseX: 0, baseY: 0,
          r: Math.random() * 1.4 + 0.2,
          alpha: Math.random() * 0.5 + 0.2,
          speed: Math.random() * 0.015 + 0.003,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.15 ? 40 : Math.random() < 0.1 ? 220 : 0
        });
      }
      this.stars.forEach(s => { s.baseX = s.x; s.baseY = s.y; });
    }

    // ── Stitch-Style Interactive Dot Grid ──
    createGrid() {
      this.gridDots = [];
      const spacing = 28;
      const cols = Math.ceil(this.w / spacing) + 2;
      const rows = Math.ceil(this.h / spacing) + 2;
      const offsetX = (this.w - (cols - 1) * spacing) / 2;
      const offsetY = (this.h - (rows - 1) * spacing) / 2;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          this.gridDots.push({
            x: offsetX + col * spacing,
            y: offsetY + row * spacing,
            currentAlpha: 0.07,
            currentR: 0.8
          });
        }
      }
    }

    drawGrid() {
      const { ctx, gridDots, mouse } = this;
      const radius = 200;
      const radiusSq = radius * radius;

      for (let i = 0; i < gridDots.length; i++) {
        const dot = gridDots[i];
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distSq = dx * dx + dy * dy;

        // Smooth cubic falloff for a soft spotlight feel
        let targetAlpha, targetR;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          const t = 1 - dist / radius;
          const ease = t * t * (3 - 2 * t); // smoothstep
          targetAlpha = 0.07 + ease * 0.88;
          targetR = 0.8 + ease * 1.4;
        } else {
          targetAlpha = 0.07;
          targetR = 0.8;
        }

        // Smooth lerp for buttery animation
        dot.currentAlpha += (targetAlpha - dot.currentAlpha) * 0.15;
        dot.currentR += (targetR - dot.currentR) * 0.15;

        // Draw the dot — pure white, Stitch-style
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.currentR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.currentAlpha})`;
        ctx.fill();
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => { this.resize(); this.createStars(); this.createGrid(); });
      document.addEventListener('mousemove', e => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
      document.addEventListener('mouseleave', () => { this.mouse.x = -1000; this.mouse.y = -1000; });
    }

    spawnShootingStar() {
      if (Math.random() > 0.003 || this.shootingStars.length >= 2) return;
      this.shootingStars.push({
        x: Math.random() * this.w * 0.7,
        y: Math.random() * this.h * 0.3,
        len: 60 + Math.random() * 100,
        speed: 5 + Math.random() * 7,
        angle: Math.PI / 5 + Math.random() * 0.4,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.008,
        width: 1 + Math.random() * 0.8
      });
    }

    drawStars() {
      const { ctx, stars, mouse, time } = this;
      for (const star of stars) {
        const dx = mouse.x - star.baseX;
        const dy = mouse.y - star.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 500) * 0.15;
        star.x = star.baseX + dx * influence * (star.r / 2);
        star.y = star.baseY + dy * influence * (star.r / 2);

        const twinkle = Math.sin(time * star.speed + star.phase);
        const alpha = star.alpha * (0.45 + 0.55 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.hue === 40
          ? `rgba(246, 213, 96, ${alpha * 0.9})`
          : star.hue === 220
            ? `rgba(147, 197, 253, ${alpha * 0.8})`
            : `rgba(245, 240, 232, ${alpha})`;
        ctx.fill();

        if (star.r > 1.1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 4, 0, Math.PI * 2);
          const ga = alpha * 0.06;
          ctx.fillStyle = star.hue === 40
            ? `rgba(212, 160, 23, ${ga})`
            : star.hue === 220
              ? `rgba(139, 92, 246, ${ga})`
              : `rgba(245, 240, 232, ${ga})`;
          ctx.fill();
        }
      }
    }

    drawConstellations() {
      const { ctx, stars } = this;
      const bright = stars.filter(s => s.r > 0.9 && s.alpha > 0.5);
      let n = 0;
      for (let i = 0; i < bright.length && n < 40; i++) {
        for (let j = i + 1; j < bright.length && n < 40; j++) {
          const dx = bright[i].x - bright[j].x;
          const dy = bright[i].y - bright[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(bright[i].x, bright[i].y);
            ctx.lineTo(bright[j].x, bright[j].y);
            ctx.strokeStyle = `rgba(212, 160, 23, ${(1 - d / 100) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            n++;
          }
        }
      }
    }

    drawShootingStars() {
      const { ctx, shootingStars } = this;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const ex = s.x + Math.cos(s.angle) * s.len;
        const ey = s.y + Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.4, `rgba(255,255,255,${s.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.8})`;
        ctx.fill();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= s.decay;

        if (s.alpha <= 0 || s.x > this.w + 50 || s.y > this.h + 50) {
          shootingStars.splice(i, 1);
        }
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.time++;
      this.drawGrid();
      this.drawConstellations();
      this.drawStars();
      this.spawnShootingStar();
      this.drawShootingStars();
      requestAnimationFrame(() => this.animate());
    }
  }

  // ──────────────────────────────────────────
  //  App Controller
  // ──────────────────────────────────────────

  const PLANET_EMOJIS = {
    Sun: '☀️', Moon: '🌙', Mars: '♂️', Mercury: '☿', Jupiter: '♃',
    Venus: '♀️', Saturn: '♄', Rahu: '☊', Ketu: '☋'
  };

  class CosmicSoulApp {
    constructor() {
      this.i18n = new I18n();
      this.form = document.getElementById('birth-form');
      this.submitBtn = document.getElementById('submit-btn');
      this.loadingOverlay = document.getElementById('loading-overlay');
      this.resultsSection = document.getElementById('results-section');
      this.hero = document.getElementById('hero');
      this.formSection = document.getElementById('form-section');
      this.restartBtn = document.getElementById('restart-btn');
      this.errorToast = document.getElementById('error-toast');

      this.loadingInterval = null;
      this.lastData = null; // store last results for re-rendering on language switch
      this.init();
    }

    init() {
      new StarField(document.getElementById('star-canvas'));

      // Apply stored language
      this.i18n.applyToDOM();

      // Language toggle
      document.getElementById('lang-toggle').addEventListener('click', () => {
        const newLang = this.i18n.lang === 'en' ? 'hi' : 'en';
        this.i18n.setLang(newLang);

        // If results are visible, re-fetch reading in new language
        if (this.resultsSection.classList.contains('active') && this.lastData) {
          this.refetchReading();
        }
      });

      // Also support tapping individual EN/हि buttons directly
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation(); // prevent double-firing with parent button
          const clickedLang = opt.dataset.lang;
          if (clickedLang && clickedLang !== this.i18n.lang) {
            this.i18n.setLang(clickedLang);
            if (this.resultsSection.classList.contains('active') && this.lastData) {
              this.refetchReading();
            }
          }
        });
      });

      // Form submit
      this.form.addEventListener('submit', e => this.handleSubmit(e));

      // Restart
      this.restartBtn.addEventListener('click', () => this.resetToForm());

      // Focus animations
      document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => {
          input.parentElement.style.transform = 'scale(1.01)';
          input.parentElement.style.transition = '0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        input.addEventListener('blur', () => {
          input.parentElement.style.transform = 'scale(1)';
        });
      });
    }

    async handleSubmit(e) {
      e.preventDefault();
      this.submitBtn.disabled = true;

      const data = {
        name: document.getElementById('input-name').value.trim(),
        dateOfBirth: document.getElementById('input-dob').value,
        timeOfBirth: document.getElementById('input-time').value,
        placeOfBirth: document.getElementById('input-place').value.trim(),
        language: this.i18n.lang
      };

      if (!data.name || !data.dateOfBirth || !data.timeOfBirth || !data.placeOfBirth) {
        this.showError(this.i18n.t('error.fillAll'));
        this.submitBtn.disabled = false;
        return;
      }

      this.showLoading();

      try {
        const res = await fetch('/api/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed to generate reading.');

        this.hideLoading();
        this.lastData = result.data;
        this.lastFormData = data;
        this.renderResults(result.data);
      } catch (err) {
        this.hideLoading();
        this.showError(err.message);
        this.submitBtn.disabled = false;
      }
    }

    async refetchReading() {
      if (!this.lastFormData) return;
      this.showLoading();

      try {
        const payload = { ...this.lastFormData, language: this.i18n.lang };
        const res = await fetch('/api/reading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Failed.');

        this.hideLoading();
        this.lastData = result.data;
        this.renderResults(result.data);
      } catch (err) {
        this.hideLoading();
        // Still switch language for static text, just keep old predictions
        if (this.lastData) this.renderResults(this.lastData);
        this.showError(err.message);
      }
    }

    // ── Cinematic Loading ──

    showLoading() {
      this.loadingOverlay.classList.add('active');

      // Start loading canvas animation
      this.startLoadingCanvas();

      const steps = this.i18n.t('loading.steps');
      let i = 0;
      const stepEl = document.getElementById('loading-step');
      const dotsEl = document.getElementById('loading-dots');
      const barFill = document.getElementById('loading-bar-fill');

      // Create progress dots
      dotsEl.innerHTML = steps.map((_, idx) =>
        `<div class="loading-dot ${idx === 0 ? 'active' : ''}"></div>`
      ).join('');

      stepEl.textContent = steps[0] || '';
      barFill.style.width = `${(1 / steps.length) * 100}%`;

      this.loadingInterval = setInterval(() => {
        i++;
        if (i >= steps.length) i = 0;

        // Update text with fade
        stepEl.style.opacity = 0;
        setTimeout(() => {
          stepEl.textContent = steps[i];
          stepEl.style.opacity = 1;
        }, 200);

        // Update dots
        const dots = dotsEl.querySelectorAll('.loading-dot');
        dots.forEach((dot, idx) => {
          dot.classList.remove('active');
          if (idx < i) dot.classList.add('done');
          if (idx === i) dot.classList.add('active');
        });

        // Update progress bar
        barFill.style.width = `${((i + 1) / steps.length) * 100}%`;
      }, 2800);
    }

    startLoadingCanvas() {
      const canvas = document.getElementById('loading-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Generate floating particles
      const particles = [];
      for (let j = 0; j < 120; j++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.5 + 0.1,
          vy: -(Math.random() * 0.3 + 0.1),
          vx: (Math.random() - 0.5) * 0.2,
          phase: Math.random() * Math.PI * 2
        });
      }

      let t = 0;
      const animate = () => {
        if (!this.loadingOverlay.classList.contains('active')) return;
        ctx.clearRect(0, 0, w, h);
        t++;

        // Draw nebula glow
        const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
        grd.addColorStop(0, 'rgba(139, 92, 246, 0.04)');
        grd.addColorStop(0.5, 'rgba(212, 160, 23, 0.02)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        // Draw particles floating upward
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          const twinkle = Math.sin(t * 0.02 + p.phase) * 0.5 + 0.5;

          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 160, 23, ${p.alpha * twinkle})`;
          ctx.fill();

          if (p.r > 0.8) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 160, 23, ${p.alpha * twinkle * 0.08})`;
            ctx.fill();
          }
        }

        this._loadingRAF = requestAnimationFrame(animate);
      };
      animate();
    }

    hideLoading() {
      this.loadingOverlay.classList.remove('active');
      clearInterval(this.loadingInterval);
      if (this._loadingRAF) cancelAnimationFrame(this._loadingRAF);

      // Reset bar
      const barFill = document.getElementById('loading-bar-fill');
      if (barFill) barFill.style.width = '0%';
    }

    // ── Error ──

    showError(msg) {
      this.errorToast.textContent = msg;
      this.errorToast.classList.add('active');
      setTimeout(() => this.errorToast.classList.remove('active'), 5500);
    }

    // ── Reset ──

    resetToForm() {
      this.resultsSection.classList.remove('active');
      this.hero.style.display = '';
      this.formSection.style.display = '';
      this.submitBtn.disabled = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Render Results ──

    renderResults(data) {
      this.hero.style.display = 'none';
      this.formSection.style.display = 'none';
      this.resultsSection.classList.add('active');

      // Header
      document.getElementById('result-name').textContent = data.name;
      const dob = new Date(data.dateOfBirth);
      const locale = this.i18n.lang === 'hi' ? 'hi-IN' : 'en-IN';
      const bornOn = this.i18n.t('results.bornOn');
      const at = this.i18n.t('results.at');
      document.getElementById('result-meta').textContent =
        `${bornOn} ${dob.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })} ${at} ${data.timeOfBirth} • ${data.placeOfBirth}`;

      this.renderInsightCards(data);
      this.renderKundli(data.chart);
      this.renderPlanetTable(data.chart);
      this.renderPredictions(data.reading);

      setTimeout(() => {
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
    }

    renderInsightCards(data) {
      const grid = document.getElementById('insights-grid');
      const { numerology, chart } = data;
      const t = k => this.i18n.t(k);
      const ruledBy = t('card.ruledBy');
      const lord = t('card.lord');

      const cards = [
        { type: 'mulank', icon: '🔢', label: t('card.mulank'), value: numerology.mulank, detail: `${ruledBy} ${numerology.mulankRuler}` },
        { type: 'bhagyank', icon: '🌟', label: t('card.bhagyank'), value: numerology.bhagyank, detail: `${ruledBy} ${numerology.bhagyankRuler}` },
        { type: 'nakshatra', icon: '⭐', label: t('card.nakshatra'), value: chart.nakshatra, detail: `${lord}: ${chart.nakshatraLord}` },
        { type: 'moon', icon: '🌙', label: t('card.moon'), value: chart.moonSign, detail: '' },
        { type: 'sun', icon: '☀️', label: t('card.sun'), value: chart.sunSign, detail: '' },
        { type: 'lagna', icon: '🏛️', label: t('card.lagna'), value: chart.lagna.rashi, detail: chart.lagna.nakshatra }
      ];

      grid.innerHTML = cards.map((c, i) => `
        <div class="insight-card" data-type="${c.type}" style="animation: fadeInUp 0.6s ${i * 0.08}s var(--ease-out) both">
          <span class="insight-icon">${c.icon}</span>
          <div class="insight-label">${c.label}</div>
          <div class="insight-value">${c.value}</div>
          ${c.detail ? `<div class="insight-detail">${c.detail}</div>` : ''}
        </div>
      `).join('');
    }

    renderKundli(chart) {
      const el = document.getElementById('kundli-chart');
      let html = '';
      for (let h = 1; h <= 12; h++) {
        const planets = chart.houses[h] || [];
        const content = planets.length
          ? planets.map(p => `<span class="house-planet">${PLANET_EMOJIS[p.planet] || ''} ${p.planet}</span>`).join('')
          : '<span class="house-empty">·</span>';
        html += `<div class="house-cell" data-house="${h}"><span class="house-num">${h}</span><div class="house-planets">${content}</div></div>`;
      }
      html += `<div class="kundli-center"><div class="center-title">${this.i18n.lang === 'hi' ? 'कुंडली' : 'KUNDLI'}</div><div class="center-lagna">${chart.lagna.rashi} ${this.i18n.lang === 'hi' ? 'लग्न' : 'Lagna'}</div></div>`;
      el.innerHTML = html;
    }

    renderPlanetTable(chart) {
      const tbody = document.getElementById('planet-tbody');
      const order = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
      tbody.innerHTML = order.map(p => {
        const d = chart.planetPositions[p];
        if (!d) return '';
        return `<tr>
          <td><span class="planet-cell-name"><span class="p-emoji">${PLANET_EMOJIS[p]}</span>${p}</span></td>
          <td>${d.rashi}</td>
          <td>${d.degree}°</td>
          <td>${d.nakshatra}</td>
        </tr>`;
      }).join('');
    }

    renderPredictions(reading) {
      const tabNav = document.getElementById('tab-nav');
      const panels = document.getElementById('tab-panels');
      const tabKeys = ['personality', 'love', 'career', 'success', 'health', 'remedies', 'yearly'];
      const available = tabKeys.filter(k => reading[k]);

      tabNav.innerHTML = available.map((key, i) => {
        const s = reading[key];
        return `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${key}">${s.icon} ${s.title}</button>`;
      }).join('');

      // Create panels with empty prediction bodies (will be streamed in)
      panels.innerHTML = available.map((key, i) => {
        const s = reading[key];
        return `
          <div class="tab-panel ${i === 0 ? 'active' : ''}" data-tab="${key}">
            <div class="prediction-card" style="animation-delay: ${i * 0.15}s">
              <div class="prediction-top">
                <div class="prediction-icon-wrap">${s.icon}</div>
                <h4 class="prediction-title">${s.title}</h4>
              </div>
              <div class="prediction-body" id="pred-body-${key}"></div>
            </div>
          </div>`;
      }).join('');

      // Stream text into each section progressively
      this.streamAllSections(reading, available);

      // Tab switching (use fresh listener via clone trick)
      const newNav = tabNav.cloneNode(true);
      tabNav.parentNode.replaceChild(newNav, tabNav);
      newNav.id = 'tab-nav';
      newNav.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        const target = btn.dataset.tab;
        newNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = panels.querySelector(`.tab-panel[data-tab="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    }

    // Progressive text streaming — reveals paragraphs one by one with cursor
    streamAllSections(reading, keys) {
      keys.forEach((key, sectionIndex) => {
        const s = reading[key];
        const container = document.getElementById(`pred-body-${key}`);
        if (!container || !s.content) return;

        const paragraphs = s.content
          .split('\n\n')
          .filter(p => p.trim())
          .map(p => p.trim());

        // Stagger sections: each section starts after the previous one
        const sectionDelay = sectionIndex * 600;

        paragraphs.forEach((text, pIndex) => {
          setTimeout(() => {
            // Remove any existing cursor
            const oldCursor = container.querySelector('.streaming-cursor');
            if (oldCursor) oldCursor.remove();

            // Create new paragraph
            const p = document.createElement('p');
            p.className = 'stream-in';
            p.style.animationDelay = '0s';

            // Add cursor first
            const cursor = document.createElement('span');
            cursor.className = 'streaming-cursor';
            container.appendChild(cursor);

            // Type out the text character by character
            let charIndex = 0;
            const typeSpeed = Math.max(8, Math.min(20, 800 / text.length)); // Adaptive speed

            const typeChar = () => {
              if (charIndex < text.length) {
                p.textContent += text[charIndex];
                charIndex++;
                setTimeout(typeChar, typeSpeed);
              } else {
                // Done typing this paragraph — remove cursor
                const c = container.querySelector('.streaming-cursor');
                if (c) c.remove();
              }
            };

            container.insertBefore(p, cursor);
            typeChar();

          }, sectionDelay + pIndex * 900);
        });
      });
    }
  }

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', () => new CosmicSoulApp());

})();
