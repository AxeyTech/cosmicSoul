require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const Astronomy = require('astronomy-engine');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ──────────────────────────────────────────────
//  Serve frontend build in production
// ──────────────────────────────────────────────

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// ──────────────────────────────────────────────
//  Numerology Helpers
// ──────────────────────────────────────────────

function sumDigits(num) {
  let n = Math.abs(num);
  while (n > 9) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  }
  return n;
}

function calculateMulank(day) {
  return sumDigits(day);
}

function calculateBhagyank(dateStr) {
  // dateStr = "YYYY-MM-DD"
  const digits = dateStr.replace(/-/g, '');
  const total = digits.split('').reduce((a, d) => a + parseInt(d), 0);
  return sumDigits(total);
}

// ──────────────────────────────────────────────
//  Vedic Astrology Calculations
// ──────────────────────────────────────────────

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const RASHIS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrischika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const PLANET_RULERS = {
  1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu',
  5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Saturn', 9: 'Mars'
};

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
  'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury'
];

// ──────────────────────────────────────────────
//  Vedic Astrology Calculations (astronomy-engine)
//  Using VSOP87 theory — ±1 arcminute accuracy
// ──────────────────────────────────────────────



// Lahiri Ayanamsa — accurate polynomial
// Based on the standard Lahiri (Chitrapaksha) ayanamsa
// Reference: Indian Astronomical Ephemeris standard
function lahiriAyanamsa(jd) {
  // T in Julian centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // IAU precession in longitude (Lieske 1979)
  // General precession = 5029.0966" per century
  const precession = (5029.0966 + 2.22226 * T - 0.000042 * T * T) * T;

  // Lahiri ayanamsa at J2000.0 = 23°51'11" = 23.85306°
  // The ayanamsa at epoch B1900 was 22°27'37.76"
  // Using the standard: ayanamsa = precession_from_epoch + initial_value
  // Simplified Lahiri: starts at 23.85306° at J2000.0, increases ~50.29"/year
  const ayanamsaArcsec = 23.0 * 3600 + 51 * 60 + 11.0 + precession;

  // Convert from reference to actual:
  // At J2000.0 (T=0), ayanamsa = 23°51'11" = 23.85306°
  // The precession adds/subtracts from this base for other dates
  const ayanamsa = 23.85306 + (50.290966 * T + 1.11113 * T * T - 0.000021 * T * T * T) / 3600.0;

  return ayanamsa;
}

// Julian Day calculation
function toJulianDay(year, month, day, hour) {
  if (month <= 2) { year--; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24.0 + B - 1524.5;
}

// Convert tropical to sidereal using Lahiri Ayanamsa
function toSidereal(tropicalLon, jd) {
  const aya = lahiriAyanamsa(jd);
  return ((tropicalLon - aya) % 360 + 360) % 360;
}

// Get Rashi index from sidereal longitude
function getRashi(siderealLon) {
  return Math.floor(siderealLon / 30);
}

// Get Nakshatra index from sidereal longitude
function getNakshatra(siderealLon) {
  return Math.floor(siderealLon / (360 / 27));
}

// Mean Lunar Node (Rahu) — proper calculation
function rahuLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  // Mean longitude of ascending node (Meeus, Astronomical Algorithms)
  let omega = 125.04452
    - 1934.136261 * T
    + 0.0020708 * T * T
    + T * T * T / 450000.0;
  return ((omega % 360) + 360) % 360;
}

// Calculate Lagna (Ascendant) — FIXED: now uses Local Sidereal Time
function calculateLagna(jd, latitude, longitude) {
  const T = (jd - 2451545.0) / 36525.0;

  // Greenwich Mean Sidereal Time (in degrees)
  let GMST = 280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - T * T * T / 38710000.0;
  GMST = ((GMST % 360) + 360) % 360;

  // Local Sidereal Time = GMST + observer's longitude (EAST positive)
  let LST = GMST + longitude;
  LST = ((LST % 360) + 360) % 360;

  // Mean obliquity of the ecliptic (Laskar 1986)
  const obliquity = 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;

  const oblRad = obliquity * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const lstRad = LST * Math.PI / 180;

  // Ascendant formula
  const y = -Math.cos(lstRad);
  const x = Math.sin(oblRad) * Math.tan(latRad) + Math.cos(oblRad) * Math.sin(lstRad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  asc = ((asc % 360) + 360) % 360;

  return asc;
}

// Assign planets to houses based on Lagna
function assignHouses(planetPositions, lagnaRashi) {
  const houses = {};
  for (let i = 1; i <= 12; i++) houses[i] = [];

  for (const [planet, data] of Object.entries(planetPositions)) {
    const rashiIndex = data.rashiIndex;
    let house = ((rashiIndex - lagnaRashi + 12) % 12) + 1;
    houses[house].push({
      planet,
      rashi: RASHIS[rashiIndex],
      degree: data.degree.toFixed(2),
      nakshatra: NAKSHATRAS[data.nakshatraIndex]
    });
  }
  return houses;
}

function calculateChart(dateStr, timeStr, latitude, longitude) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const hourDecimal = hours + minutes / 60.0;

  const jd = toJulianDay(year, month, day, hourDecimal);

  // Create astronomy-engine time from birth date/time components
  // Using MakeTime with Date.UTC for correct results
  const astroDate = Astronomy.MakeTime(new Date(Date.UTC(year, month - 1, day, hours, minutes, 0)));

  const planetPositions = {};

  // Sun — using SunPosition for geocentric ecliptic longitude
  const sunTrop = Astronomy.SunPosition(astroDate).elon;
  const sunSid = toSidereal(sunTrop, jd);
  planetPositions['Sun'] = {
    degree: sunSid,
    rashiIndex: getRashi(sunSid),
    nakshatraIndex: getNakshatra(sunSid)
  };

  // Moon — using EclipticGeoMoon for geocentric ecliptic longitude
  const moonTrop = Astronomy.EclipticGeoMoon(astroDate).lon;
  const moonSid = toSidereal(moonTrop, jd);
  planetPositions['Moon'] = {
    degree: moonSid,
    rashiIndex: getRashi(moonSid),
    nakshatraIndex: getNakshatra(moonSid)
  };

  // Mars, Mercury, Jupiter, Venus, Saturn — all via astronomy-engine
  ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].forEach(p => {
    const trop = Astronomy.EclipticLongitude(p, astroDate);
    const sid = toSidereal(trop, jd);
    planetPositions[p] = {
      degree: sid,
      rashiIndex: getRashi(sid),
      nakshatraIndex: getNakshatra(sid)
    };
  });

  // Rahu (Mean North Node)
  const rahuTrop = rahuLongitude(jd);
  const rahuSid = toSidereal(rahuTrop, jd);
  planetPositions['Rahu'] = {
    degree: rahuSid,
    rashiIndex: getRashi(rahuSid),
    nakshatraIndex: getNakshatra(rahuSid)
  };

  // Ketu (opposite Rahu)
  const ketuSid = (rahuSid + 180) % 360;
  planetPositions['Ketu'] = {
    degree: ketuSid,
    rashiIndex: getRashi(ketuSid),
    nakshatraIndex: getNakshatra(ketuSid)
  };

  // Lagna (Ascendant) — now using both lat AND lon
  const lagnaTrop = calculateLagna(jd, latitude, longitude);
  const lagnaSid = toSidereal(lagnaTrop, jd);
  const lagnaRashi = getRashi(lagnaSid);
  const lagnaNakshatra = getNakshatra(lagnaSid);

  // Assign planets to houses
  const houses = assignHouses(planetPositions, lagnaRashi);

  // Moon Nakshatra / Rashi for main display
  const moonNakshatraIndex = planetPositions['Moon'].nakshatraIndex;
  const moonRashiIndex = planetPositions['Moon'].rashiIndex;
  const sunRashiIndex = planetPositions['Sun'].rashiIndex;

  return {
    lagna: {
      rashi: RASHIS[lagnaRashi],
      rashiIndex: lagnaRashi,
      degree: lagnaSid.toFixed(2),
      nakshatra: NAKSHATRAS[lagnaNakshatra]
    },
    moonSign: RASHIS[moonRashiIndex],
    sunSign: RASHIS[sunRashiIndex],
    nakshatra: NAKSHATRAS[moonNakshatraIndex],
    nakshatraLord: NAKSHATRA_LORDS[moonNakshatraIndex],
    planetPositions: Object.fromEntries(
      Object.entries(planetPositions).map(([p, d]) => [p, {
        rashi: RASHIS[d.rashiIndex],
        degree: d.degree.toFixed(2),
        nakshatra: NAKSHATRAS[d.nakshatraIndex]
      }])
    ),
    houses
  };
}

// ──────────────────────────────────────────────
//  Geocoding (200+ cities from external database)
// ──────────────────────────────────────────────

const { CITY_COORDS } = require('./cities');

function getCoordinates(place) {
  const normalized = place.toLowerCase().trim();
  // Try exact match first, then substring match
  if (CITY_COORDS[normalized]) return CITY_COORDS[normalized];
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (normalized.includes(city)) return coords;
  }
  // Default to Delhi if no match found
  return { lat: 28.6139, lon: 77.2090 };
}

// ──────────────────────────────────────────────
//  Gemini AI Integration
// ──────────────────────────────────────────────

async function generateReading(userData, numerology, chart, language) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const isHindi = language === 'hi';

  const langInstruction = isHindi
    ? '\n\nIMPORTANT: You MUST write ALL content (titles AND content fields) in Hindi (Devanagari script). The JSON keys must remain in English, but all string values (title and content) must be in fluent, natural Hindi. Do NOT use English for titles or content.'
    : '';

  const titleExamples = isHindi ? {
    personality: { title: 'आपका ब्रह्मांडीय व्यक्तित्व', icon: '✨' },
    love: { title: 'प्रेम और रिश्ते', icon: '💕' },
    career: { title: 'करियर और पेशा', icon: '💼' },
    success: { title: 'सफलता और धन', icon: '🏆' },
    health: { title: 'स्वास्थ्य और कल्याण', icon: '🌿' },
    remedies: { title: 'उपाय और मार्गदर्शन', icon: '🔮' },
    yearly: { title: 'इस वर्ष का दृष्टिकोण', icon: '📅' }
  } : {
    personality: { title: 'Your Cosmic Personality', icon: '✨' },
    love: { title: 'Love & Relationships', icon: '💕' },
    career: { title: 'Career & Profession', icon: '💼' },
    success: { title: 'Success & Wealth', icon: '🏆' },
    health: { title: 'Health & Wellbeing', icon: '🌿' },
    remedies: { title: 'Remedies & Guidance', icon: '🔮' },
    yearly: { title: 'Current Year Outlook', icon: '📅' }
  };

  const now = new Date();
  const currentDate = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleDateString('en-IN', { month: 'long' });

  const systemPrompt = `You are "CosmicSoul", a world-class Vedic astrologer and numerologist with decades of expertise. You provide deeply insightful, personalized astrological readings combining Vedic astrology (Jyotish), numerology, and spiritual wisdom.

CRITICAL: Today's date is ${currentDate}. The current year is ${currentYear}. The current month is ${currentMonth}. ALL your predictions, forecasts, and yearly outlooks MUST be for ${currentYear} and the months ahead from ${currentMonth} ${currentYear}. Do NOT reference any past year like 2024 or 2025. Always use ${currentYear} as the current year.

You MUST respond ONLY with a valid JSON object. Do NOT include any markdown, code fences, or explanatory text outside the JSON. The response must parse with JSON.parse().${langInstruction}

Respond with this exact JSON structure:
{
  "personality": {
    "title": "${titleExamples.personality.title}",
    "icon": "${titleExamples.personality.icon}",
    "content": "3-4 paragraph detailed personality analysis based on mulank, bhagyank, moon sign, nakshatra, and lagna. Be specific and insightful."
  },
  "love": {
    "title": "${titleExamples.love.title}",
    "icon": "${titleExamples.love.icon}",
    "content": "3-4 paragraph detailed love life analysis. Cover romantic compatibility, marriage prospects, relationship patterns, and ideal partner traits based on 7th house, Venus placement, and nakshatra."
  },
  "career": {
    "title": "${titleExamples.career.title}",
    "icon": "${titleExamples.career.icon}",
    "content": "3-4 paragraph career analysis. Cover ideal professions, professional strengths, timing of career growth, and financial prospects based on 10th house, Saturn, Mercury, and Sun placements."
  },
  "success": {
    "title": "${titleExamples.success.title}",
    "icon": "${titleExamples.success.icon}",
    "content": "3-4 paragraph analysis on success potential, wealth accumulation, lucky periods, and prosperity indicators based on 11th house, Jupiter placement, and bhagyank."
  },
  "health": {
    "title": "${titleExamples.health.title}",
    "icon": "${titleExamples.health.icon}",
    "content": "2-3 paragraph health overview covering physical constitution, areas of concern, and wellness advice based on lagna, 6th house, and planetary aspects."
  },
  "remedies": {
    "title": "${titleExamples.remedies.title}",
    "icon": "${titleExamples.remedies.icon}",
    "content": "2-3 paragraphs with specific Vedic remedies including gemstones, mantras, favorable days, colors, and spiritual practices personalized to the chart."
  },
  "yearly": {
    "title": "${titleExamples.yearly.title}",
    "icon": "${titleExamples.yearly.icon}",
    "content": "2-3 paragraph forecast for the current period covering major themes, opportunities, and challenges."
  }
}`;

  const readingLangNote = isHindi
    ? '\n\nIMPORTANT: Write the ENTIRE reading in Hindi (Devanagari script). All titles and content must be in natural, fluent Hindi. Do NOT use English.'
    : '';

  const userPrompt = `Generate a comprehensive Vedic astrology reading for:

**Personal Details:**
- Name: ${userData.name}
- Date of Birth: ${userData.dateOfBirth}
- Time of Birth: ${userData.timeOfBirth}
- Place of Birth: ${userData.placeOfBirth}

**Numerology:**
- Mulank (Birth Number): ${numerology.mulank} — Ruled by ${PLANET_RULERS[numerology.mulank]}
- Bhagyank (Destiny Number): ${numerology.bhagyank} — Ruled by ${PLANET_RULERS[numerology.bhagyank]}

**Vedic Chart Data:**
- Lagna (Ascendant): ${chart.lagna.rashi} at ${chart.lagna.degree}° — Nakshatra: ${chart.lagna.nakshatra}
- Moon Sign: ${chart.moonSign}
- Sun Sign: ${chart.sunSign}
- Birth Nakshatra: ${chart.nakshatra} — Lord: ${chart.nakshatraLord}

**Planetary Positions:**
${Object.entries(chart.planetPositions).map(([planet, data]) =>
  `- ${planet}: ${data.rashi} at ${data.degree}° — Nakshatra: ${data.nakshatra}`
).join('\n')}

**House Placements:**
${Object.entries(chart.houses).map(([house, planets]) =>
  `- House ${house}: ${planets.length > 0 ? planets.map(p => p.planet).join(', ') : 'Empty'}`
).join('\n')}

Provide a deeply personal, insightful, and specific reading. Use the person's name. Reference specific planetary positions and house placements in your analysis. Be warm, wise, and encouraging while being honest about challenges.

CRITICAL REMINDER: Today is ${currentDate}. The current year is ${currentYear}. The "Current Year Outlook" section MUST be about ${currentYear} specifically — mention ${currentYear} by name. All transit predictions should be for ${currentMonth} ${currentYear} onwards. NEVER mention 2024 or any past year as current.${readingLangNote}`;

  async function callGemini(model, systemPrompt, userPrompt) {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      }
    });
    return result.response.text();
  }

  function parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error('Invalid JSON response');
    }
  }

  // Retry with backoff for temporary errors (503, 429)
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const text = await callGemini(model, systemPrompt, userPrompt);
      try {
        return parseJSON(text);
      } catch {
        if (attempt < MAX_RETRIES) {
          console.log(`Retry ${attempt}/${MAX_RETRIES}: JSON parse error, retrying...`);
          continue;
        }
        throw new Error('Reading generated but could not be processed. Please try again.');
      }
    } catch (err) {
      const msg = err.message || '';
      const isTemporary = msg.includes('503') || msg.includes('429') || msg.includes('overloaded') || msg.includes('high demand') || msg.includes('RESOURCE_EXHAUSTED');
      const isAuthError = msg.includes('401') || msg.includes('403') || msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED');

      if (isTemporary && attempt < MAX_RETRIES) {
        const delay = attempt * 2000; // 2s, 4s
        console.log(`Retry ${attempt}/${MAX_RETRIES}: Server busy, waiting ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      console.error(`Gemini Error (attempt ${attempt}):`, msg);

      if (isAuthError) {
        throw new Error('Invalid API key. Please update your GEMINI_API_KEY in the .env file.');
      } else if (isTemporary) {
        throw new Error('The cosmic servers are experiencing high demand. Please try again in a few moments.');
      } else {
        throw new Error('Unable to generate your reading right now. Please try again.');
      }
    }
  }
}

// ──────────────────────────────────────────────
//  Health Check (for AWS Elastic Beanstalk)
// ──────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ──────────────────────────────────────────────
//  API Route
// ──────────────────────────────────────────────

app.post('/api/reading', async (req, res) => {
  try {
    const { name, dateOfBirth, timeOfBirth, placeOfBirth, language } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env file.' });
    }

    const day = parseInt(dateOfBirth.split('-')[2]);
    const mulank = calculateMulank(day);
    const bhagyank = calculateBhagyank(dateOfBirth);
    const coords = getCoordinates(placeOfBirth);
    const chart = calculateChart(dateOfBirth, timeOfBirth, coords.lat, coords.lon);

    const reading = await generateReading(
      { name, dateOfBirth, timeOfBirth, placeOfBirth },
      { mulank, bhagyank },
      chart,
      language || 'en'
    );

    res.json({
      success: true,
      data: {
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        numerology: {
          mulank,
          bhagyank,
          mulankRuler: PLANET_RULERS[mulank],
          bhagyankRuler: PLANET_RULERS[bhagyank]
        },
        chart,
        reading
      }
    });

  } catch (err) {
    console.error('Reading Error:', err);
    res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// ──────────────────────────────────────────────
//  Crash Prevention — Keep Server Always Running
// ──────────────────────────────────────────────

// Prevent server crash on unhandled promise rejections (e.g. Gemini API timeout)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash — just log and continue
});

// Prevent server crash on uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't crash — just log and continue
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✦ CosmicSoul server running at http://0.0.0.0:${PORT}`);

  // Self-ping every 4 minutes to keep server warm & prevent cold starts
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      const http = require('http');
      http.get(`http://localhost:${PORT}/api/health`, (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`);
      }).on('error', () => {});
    }, 4 * 60 * 1000);
  }
});
