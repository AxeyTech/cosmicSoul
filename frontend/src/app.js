/* =====================================================================
   CosmicSoul — app.js
   Full Vedic/Western Astrology + Numerology + Google Gemini API
   ===================================================================== */

"use strict";

// The Gemini API key now lives server-side only (backend/.env) and is
// never sent to the browser. The frontend calls our own backend at
// /api/reading, which in turn talks to Gemini with retries + fallback.

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLANET_GLYPHS = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Rahu: "☊", Ketu: "☋",
  Uranus: "♅", Neptune: "♆", Pluto: "♇"
};

const NUMERAL_RULERS = {
  1: "Sun ☉",  2: "Moon ☽",  3: "Jupiter ♃", 4: "Rahu / Uranus ♅",
  5: "Mercury ☿", 6: "Venus ♀", 7: "Ketu / Neptune ♆",
  8: "Saturn ♄", 9: "Mars ♂",
  11: "Master Number — Moon / Intuition", 22: "Master Number — Uranus / Builder",
  33: "Master Number — Neptune / Teacher"
};

const PYTHAGOREAN = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

const LOADING_STEPS_DELAY = [600, 1200, 1800, 2600, 3400, 4200]; // ms

// ─────────────────────────────────────────────────────────────────────────────
// STARFIELD CANVAS
// ─────────────────────────────────────────────────────────────────────────────

(function initStarfield() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let shootingStars = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 3500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        hue: Math.random() > 0.85 ? 270 : 0 // some purple stars
      });
    }
  }

  function maybeSpawnShootingStar() {
    if (Math.random() < 0.004 && shootingStars.length < 3) {
      const startX = Math.random() * W * 0.8;
      const startY = Math.random() * H * 0.3;
      shootingStars.push({
        x: startX, y: startY,
        vx: Math.random() * 6 + 4,
        vy: Math.random() * 3 + 2,
        len: Math.random() * 80 + 60,
        alpha: 1, life: 0, maxLife: 60
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Twinkle stars
    stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
      if (s.alpha <= 0.15) { s.alpha = 0.15; s.twinkleDir = 1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.hue) {
        ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${s.alpha})`;
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      }
      ctx.fill();
    });

    // Shooting stars
    maybeSpawnShootingStar();
    shootingStars = shootingStars.filter(ss => {
      ss.life++;
      ss.alpha = 1 - ss.life / ss.maxLife;
      if (ss.alpha <= 0) return false;

      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y - ss.len * 0.5);
      grad.addColorStop(0, `rgba(255,255,255,${ss.alpha})`);
      grad.addColorStop(1, "rgba(167,139,250,0)");

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.len, ss.y - ss.len * 0.4);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ss.x += ss.vx; ss.y += ss.vy;
      return true;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); createStars(); });
  resize();
  createStars();
  draw();
})();

// ─────────────────────────────────────────────────────────────────────────────
// NUMEROLOGY CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Reduce number to single digit (preserving master numbers 11, 22, 33) */
function reduceNum(n, keepMaster = true) {
  if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n < 10) return n;
  const sum = String(n).split("").reduce((a, c) => a + Number(c), 0);
  return reduceNum(sum, keepMaster);
}

/** Mulank = day of birth reduced */
function calcMulank(day) {
  return reduceNum(Number(day));
}

/** Bhagyank = full DOB digit sum reduced */
function calcBhagyank(dateStr) {
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  const sum = digits.reduce((a, c) => a + c, 0);
  return reduceNum(sum);
}

/** Name number via Pythagorean */
function calcNameNumber(name) {
  const upper = name.toUpperCase().replace(/[^A-Z]/g, "");
  if (!upper) return null;
  const sum = upper.split("").reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0);
  return reduceNum(sum);
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM REFERENCES
// ─────────────────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const els = {
  fullName:       $("fullName"),
  dob:            $("dob"),
  tob:            $("tob"),
  birthPlace:     $("birthPlace"),
  submitBtn:      $("submitBtn"),
  submitBtnText:  $("submitBtnText"),
  btnSpinner:     $("btnSpinner"),
  formError:      $("formError"),
  numSection:     $("numSection"),
  mulankNum:      $("mulankNum"),
  bhagyankNum:    $("bhagyankNum"),
  nameNum:        $("nameNum"),
  mulankRuler:    $("mulankRuler"),
  bhagyankRuler:  $("bhagyankRuler"),
  nameNumRuler:   $("nameNumRuler"),
  loadingSection: $("loadingSection"),
  resultsSection: $("resultsSection"),
  resultsTitle:   $("resultsTitle"),
  resultsSubtitle:$("resultsSubtitle"),
  reportContent:  $("reportContent"),
  reportTabs:     $("reportTabs"),
  newReadingBtn:  $("newReadingBtn"),
  formSection:    $("formSection"),
  btnHeroCta:     $("btnHeroCta"),
  btnScrollForm:  $("btnScrollForm"),
};

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────

(function init() {
  // Max date = today
  const today = new Date().toISOString().split("T")[0];
  if (els.dob) els.dob.max = today;

  // Reading option toggle
  document.querySelectorAll(".reading-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".reading-option").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
    });
  });

  // Footer year
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Birth place: auto-grow the textarea so a full address stays visible instead of scrolling
  if (els.birthPlace) {
    const autoGrow = () => {
      els.birthPlace.style.height = "auto";
      els.birthPlace.style.height = els.birthPlace.scrollHeight + "px";
    };
    els.birthPlace.addEventListener("input", autoGrow);
    autoGrow();
  }

  // Header scroll state (adds weight/shadow once the page has scrolled)
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Scroll-reveal: fade+rise sections into view as the user scrolls
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  // Ambient cursor glow — follows the pointer within the hero for a soft, premium sense of depth
  const glow = document.getElementById("cursorGlow");
  const hero = document.querySelector(".hero");
  if (glow && hero && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mouseenter", () => glow.classList.add("active"));
    hero.addEventListener("mouseleave", () => glow.classList.remove("active"));
    hero.addEventListener("mousemove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  // Subtle mandala parallax — tracks pointer position within the hero
  const mandala = document.querySelector(".hero-mandala");
  if (mandala && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    hero?.addEventListener("mousemove", (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 16;
      const dy = (e.clientY / window.innerHeight - 0.5) * 16;
      mandala.style.transform = `translateY(-50%) translate(${dx}px, ${dy}px)`;
    });
    hero?.addEventListener("mouseleave", () => {
      mandala.style.transform = "translateY(-50%)";
    });
  }
})();

// ─────────────────────────────────────────────────────────────────────────────
// UI INTERACTIONS
// ─────────────────────────────────────────────────────────────────────────────


function scrollToForm() {
  els.formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}
els.btnHeroCta?.addEventListener("click", scrollToForm);
els.btnScrollForm?.addEventListener("click", scrollToForm);

els.newReadingBtn?.addEventListener("click", () => {
  els.resultsSection.style.display = "none";
  els.resultsSection.classList.remove("in-view");
  els.numSection.style.display = "none";
  els.numSection.classList.remove("in-view");
  els.formSection.style.display = "block";
  scrollToForm();
});

// Tab switching
els.reportTabs?.addEventListener("click", e => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const tab = btn.dataset.tab;
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const panel = document.querySelector(`.tab-panel[data-tab="${tab}"]`);
  if (panel) panel.classList.add("active");
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function showError(msg) {
  els.formError.textContent = msg;
  els.formError.style.display = "block";
  els.formError.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function clearError() { els.formError.style.display = "none"; }

function validate() {
  if (!els.fullName.value.trim()) { showError("Please enter your full name."); return false; }
  if (!els.dob.value) { showError("Please enter your date of birth."); return false; }
  if (!els.tob.value) { showError("Please enter your time of birth."); return false; }
  if (!els.birthPlace.value.trim()) { showError("Please enter your birth place."); return false; }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING ANIMATION
// ─────────────────────────────────────────────────────────────────────────────

let loadingTimers = [];

function startLoadingAnimation() {
  const steps = document.querySelectorAll(".ls-step");
  steps.forEach(s => s.classList.remove("active", "done"));
  steps[0]?.classList.add("active");

  loadingTimers = LOADING_STEPS_DELAY.map((delay, i) => {
    return setTimeout(() => {
      steps[i]?.classList.remove("active");
      steps[i]?.classList.add("done");
      if (steps[i + 1]) steps[i + 1].classList.add("active");
    }, delay);
  });
}

function stopLoadingAnimation() {
  loadingTimers.forEach(clearTimeout);
  loadingTimers = [];
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND API CALL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calls our own backend, which holds the Gemini key server-side and
 * handles retries + model fallback. Never talks to Gemini directly from
 * the browser (that's what leaked the key and burned the free quota).
 */
async function requestReading(name, dob, tob, place, readingType) {
  const res = await fetch("/api/reading", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, dob, tob, place, readingType })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || `Request failed (${res.status})`);
    error.code = data.error;
    throw error;
  }

  return data; // { mulank, bhagyank, nameNum, reading, cached }
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER RESULTS
// ─────────────────────────────────────────────────────────────────────────────

function renderResults(name, dob, parsedReading) {
  const [year, month, day] = dob.split("-");
  const monthNames = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  els.resultsTitle.textContent = `${name}'s Cosmic Blueprint`;
  els.resultsSubtitle.textContent = `Born ${day} ${monthNames[Number(month)]} ${year} · Complete Astrological Reading`;

  const tabs = ["overview","planets","love","career","wealth","health","spiritual","forecast","remedies"];
  const icons = { overview:"🌟", planets:"🪐", love:"❤️", career:"💼", wealth:"💰", health:"🏥", spiritual:"🧘", forecast:"📅", remedies:"💎" };

  const html = tabs.map(tab => {
    const content = parsedReading[tab] || `<p>Content for this section is being prepared…</p>`;
    return `<div class="tab-panel ${tab === "overview" ? "active" : ""}" data-tab="${tab}">${content}</div>`;
  }).join("\n");

  els.reportContent.innerHTML = html;

  // Animate stat bars if any
  setTimeout(() => {
    document.querySelectorAll(".stat-bar-fill").forEach(bar => {
      const w = bar.dataset.width || "70%";
      bar.style.width = w;
    });
  }, 300);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SUBMIT HANDLER
// ─────────────────────────────────────────────────────────────────────────────

els.submitBtn?.addEventListener("click", async () => {
  clearError();
  if (!validate()) return;

  const name      = els.fullName.value.trim();
  const dob       = els.dob.value;
  const tob       = els.tob.value;
  const place     = els.birthPlace.value.trim();
  const readingType = document.querySelector('input[name="readingType"]:checked')?.value || "vedic";

  // Calculate numerology instantly on the client for a snappy preview;
  // the backend recalculates the same numbers from trusted input too.
  const [, , day] = dob.split("-");
  const mulank    = calcMulank(day);
  const bhagyank  = calcBhagyank(dob);
  const nameNum   = calcNameNumber(name);

  // Show numerology cards
  els.mulankNum.textContent      = mulank;
  els.bhagyankNum.textContent    = bhagyank;
  els.nameNum.textContent        = nameNum ?? "—";
  els.mulankRuler.textContent    = NUMERAL_RULERS[mulank]   || "—";
  els.bhagyankRuler.textContent  = NUMERAL_RULERS[bhagyank] || "—";
  els.nameNumRuler.textContent   = nameNum ? (NUMERAL_RULERS[nameNum] || "—") : "—";
  els.numSection.style.display   = "block";
  requestAnimationFrame(() => els.numSection.classList.add("in-view"));

  // Scroll to numerology
  els.numSection.scrollIntoView({ behavior: "smooth", block: "start" });

  // Set loading state
  els.submitBtn.disabled = true;
  els.submitBtnText.style.display = "none";
  els.btnSpinner.style.display = "block";

  // Show loading
  setTimeout(() => {
    els.loadingSection.style.display = "flex";
    startLoadingAnimation();
    els.loadingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 800);

  try {
    const { reading: parsedReading } = await requestReading(name, dob, tob, place, readingType);

    stopLoadingAnimation();

    // Transition
    els.loadingSection.style.display = "none";
    els.formSection.style.display = "none";
    els.resultsSection.style.display = "block";
    requestAnimationFrame(() => els.resultsSection.classList.add("in-view"));

    renderResults(name, dob, parsedReading);

    els.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (err) {
    stopLoadingAnimation();
    els.loadingSection.style.display = "none";

    let friendlyMsg = "";
    if (err.code === "QUOTA_EXCEEDED") {
      friendlyMsg = "⚠️ All configured Gemini models are currently over quota. The server already retried with backoff and fallback models — please wait a few minutes and try again.";
    } else if (err.code === "INVALID_KEY" || err.code === "MISSING_KEY") {
      friendlyMsg = "🔑 The server's Gemini API key is missing or invalid. Add a valid key to backend/.env (see README) and restart the backend.";
    } else if (err.code === "RATE_LIMITED") {
      friendlyMsg = "⏳ You've requested a lot of readings recently. Please wait a few minutes before trying again.";
    } else if (err.code === "INVALID_INPUT") {
      friendlyMsg = friendlyMsg || err.message || "Please check your birth details and try again.";
    } else if (!navigator.onLine) {
      friendlyMsg = "🌐 No internet connection. Please check your network and try again.";
    } else {
      friendlyMsg = `Something went wrong: ${err.message}. Please try again.`;
    }

    showError(friendlyMsg);
    els.formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } finally {
    els.submitBtn.disabled = false;
    els.submitBtnText.style.display = "inline";
    els.btnSpinner.style.display = "none";
  }
});
