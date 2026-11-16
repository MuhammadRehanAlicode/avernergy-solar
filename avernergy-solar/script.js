/* ==========================================================================
   Avernergy Solar – script.js
   Vanilla JavaScript only. No backend, no database, no build step.

   HOW TO CUSTOMISE (everything lives in CONFIG below):
   - contact.whatsappNumber : your WhatsApp number, digits only, with country code
                              (example: '923001234567'). Left empty on purpose.
   - packages               : names, sample prices, panels, inverter, warranty.
   - calculator / tariff    : sun hours, efficiency, sample electricity tariff slabs.
   - cities                 : peak-sun-hour assumptions per city.
   - testimonials           : replace the sample text with real customer feedback.
   ========================================================================== */
'use strict';

/* ==========================================================================
   1. CONFIGURATION  (edit this object – the site updates automatically)
   ========================================================================== */
const CONFIG = {
  company: {
    name: 'Avernergy Solar',
    tagline: 'Clean Energy. Brighter Future.',
  },

  contact: {
    // Digits only, including country code (e.g. '923001234567'). NOT invented – fill in your real number.
    whatsappNumber: '',
    phone: '+92 XXX XXXXXXX', // placeholder
    email: 'info@your-domain.com', // placeholder
    address: 'Office address placeholder, City, Pakistan', // placeholder
    social: {
      facebook: 'https://www.facebook.com/',
      instagram: 'https://www.instagram.com/',
      linkedin: 'https://www.linkedin.com/',
      youtube: 'https://www.youtube.com/',
    },
  },

  /* ---- Calculator assumptions (all editable) ---- */
  calculator: {
    daysPerMonth: 30,
    systemEfficiency: 0.78, // overall performance ratio: inverter, cable, dust, heat losses
    targetOffset: 1.0, // share of consumption the system is sized to cover (1.0 = 100 %)
    packageFitTolerance: 0.03, // a package within 3 % of the requirement still counts as a fit
    defaultSunHours: 5.3, // used for package cards and unknown cities
    maxBillReduction: 0.9, // savings never exceed 90 % of the current bill (fixed charges, taxes, meter rent)
    paybackCapYears: 25,
    limits: {
      bill: { min: 500, max: 5000000 }, // PKR / month
      units: { min: 20, max: 100000 }, // kWh / month
    },
  },

  /* ---- SAMPLE tariff used to convert bill <-> units and to value saved units.
          These are illustrative slabs, NOT an official tariff. Update to match
          your DISCO / NEPRA tariff for more accurate results. ---- */
  tariff: {
    taxMultiplier: 1.2, // approximate taxes & duties on top of slab charges
    slabs: [
      { upTo: 100, rate: 22 },
      { upTo: 200, rate: 28 },
      { upTo: 300, rate: 36 },
      { upTo: 400, rate: 42 },
      { upTo: 500, rate: 46 },
      { upTo: 700, rate: 52 },
      { upTo: Infinity, rate: 58 },
    ],
  },

  /* ---- Approximate average peak sun hours per day (editable) ---- */
  cities: [
    { name: 'Lahore', sunHours: 5.5 },
    { name: 'Karachi', sunHours: 5.9 },
    { name: 'Islamabad', sunHours: 5.2 },
    { name: 'Rawalpindi', sunHours: 5.2 },
    { name: 'Faisalabad', sunHours: 5.5 },
    { name: 'Multan', sunHours: 5.8 },
    { name: 'Gujranwala', sunHours: 5.4 },
    { name: 'Sialkot', sunHours: 5.2 },
    { name: 'Peshawar', sunHours: 5.3 },
    { name: 'Quetta', sunHours: 6.0 },
    { name: 'Hyderabad', sunHours: 5.9 },
    { name: 'Other city', sunHours: 5.3 },
  ],

  /* ---- SAMPLE packages. Prices and specs are placeholders – replace with real ones. ---- */
  packages: [
    {
      id: 'solar-3kw',
      name: '3 kW Solar System',
      kw: 3,
      price: 420000,
      featured: false,
      bestFor: 'Small homes & flats',
      panels: { count: 6, watt: 500, type: 'Mono PERC' },
      inverter: '3 kW on-grid inverter (hybrid-ready option)',
      installation: 'Rooftop structure, AC/DC cabling, earthing & surge protection, commissioning',
      warranty: { panels: '12-yr product / 25-yr performance', inverter: '5 years', workmanship: '1 year' },
    },
    {
      id: 'solar-5kw',
      name: '5 kW Solar System',
      kw: 5,
      price: 650000,
      featured: true,
      bestFor: 'Medium homes',
      panels: { count: 10, watt: 500, type: 'Mono PERC' },
      inverter: '5 kW on-grid inverter (hybrid-ready option)',
      installation: 'Rooftop structure, AC/DC cabling, earthing & surge protection, commissioning',
      warranty: { panels: '12-yr product / 25-yr performance', inverter: '5 years', workmanship: '1 year' },
    },
    {
      id: 'solar-7kw',
      name: '7 kW Solar System',
      kw: 7,
      price: 880000,
      featured: false,
      bestFor: 'Large homes & small shops',
      panels: { count: 14, watt: 500, type: 'Mono PERC' },
      inverter: '7 kW on-grid inverter (hybrid-ready option)',
      installation: 'Rooftop structure, AC/DC cabling, earthing & surge protection, commissioning',
      warranty: { panels: '12-yr product / 25-yr performance', inverter: '5 years', workmanship: '1 year' },
    },
    {
      id: 'solar-10kw',
      name: '10 kW Solar System',
      kw: 10,
      price: 1200000,
      featured: false,
      bestFor: 'Big houses, offices & businesses',
      panels: { count: 20, watt: 500, type: 'Mono PERC' },
      inverter: '10 kW on-grid inverter (hybrid-ready option)',
      installation: 'Rooftop/ground structure, AC/DC cabling, earthing & surge protection, commissioning',
      warranty: { panels: '12-yr product / 25-yr performance', inverter: '5 years', workmanship: '1 year' },
    },
  ],

  /* ---- SAMPLE testimonials – replace with real customer feedback before launch ---- */
  testimonials: [
    {
      name: 'Sample Customer A',
      role: 'Homeowner, Lahore',
      text: 'The team explained every step clearly, from the site survey to commissioning. Placeholder text – replace with a real review.',
    },
    {
      name: 'Sample Customer B',
      role: 'Shop owner, Faisalabad',
      text: 'I liked that the calculator showed realistic numbers and a clear payback estimate. Placeholder text – replace with a real review.',
    },
    {
      name: 'Sample Customer C',
      role: 'Factory manager, Sialkot',
      text: 'Installation was tidy and the monitoring app makes it easy to track generation. Placeholder text – replace with a real review.',
    },
  ],
};

/* ==========================================================================
   2. SMALL UTILITIES
   ========================================================================== */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatNumber(n, digits = 0) {
  return Number(n).toLocaleString('en-PK', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function formatPKR(n) {
  return 'PKR ' + formatNumber(Math.round(n));
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Parses a user-typed number. Returns null when empty, NaN when not a valid number. */
function parseNum(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[,\s]/g, '');
  if (cleaned === '') return null;
  if (!/^\d*\.?\d+$/.test(cleaned)) return NaN;
  return Number(cleaned);
}

function isPlaceholder(value) {
  return !value || /X{3,}|your-domain|placeholder/i.test(value);
}

function getPackage(id) {
  return CONFIG.packages.find((p) => p.id === id) || null;
}

function getCity(name) {
  return CONFIG.cities.find((c) => c.name === name) || null;
}

function packageMonthlyGeneration(pkg, sunHours = CONFIG.calculator.defaultSunHours) {
  const c = CONFIG.calculator;
  return pkg.kw * sunHours * c.systemEfficiency * c.daysPerMonth;
}

/* ==========================================================================
   3. SOLAR CALCULATOR LOGIC  (pure functions – no DOM access)
   ========================================================================== */

/** Monthly bill (PKR) for a number of units, using the sample slab tariff. */
function billFromUnits(units) {
  const { slabs, taxMultiplier } = CONFIG.tariff;
  let remaining = Math.max(0, units);
  let previousLimit = 0;
  let cost = 0;
  for (const slab of slabs) {
    const span = Math.min(remaining, slab.upTo - previousLimit);
    if (span <= 0) break;
    cost += span * slab.rate;
    remaining -= span;
    previousLimit = slab.upTo;
    if (remaining <= 0) break;
  }
  return cost * taxMultiplier;
}

/** Inverse of billFromUnits: estimates monthly units from a bill amount. */
function unitsFromBill(bill) {
  const { slabs, taxMultiplier } = CONFIG.tariff;
  let remaining = bill / taxMultiplier;
  let units = 0;
  let previousLimit = 0;
  for (const slab of slabs) {
    const span = slab.upTo - previousLimit;
    const slabCost = span * slab.rate;
    if (remaining <= slabCost) return units + remaining / slab.rate;
    remaining -= slabCost;
    units += span;
    previousLimit = slab.upTo;
  }
  return units;
}

/** Validates raw calculator inputs. Returns { valid, errors, values }. */
function validateCalcInput(mode, raw) {
  const limits = CONFIG.calculator.limits;
  const errors = {};
  const bill = parseNum(raw.bill);
  const units = parseNum(raw.units);

  const check = (key, value, required, label, limit) => {
    if (value === null) {
      if (required) errors[key] = `Please enter your ${label}.`;
      return;
    }
    if (Number.isNaN(value)) {
      errors[key] = 'Please enter numbers only (for example 25000).';
      return;
    }
    if (value < limit.min || value > limit.max) {
      errors[key] = `Please enter a value between ${formatNumber(limit.min)} and ${formatNumber(limit.max)}.`;
    }
  };

  check('bill', bill, mode === 'bill', 'monthly electricity bill', limits.bill);
  check('units', units, mode === 'units', 'monthly electricity units', limits.units);
  if (!raw.city || !getCity(raw.city)) errors.city = 'Please select your city.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { mode, bill: Number.isNaN(bill) ? null : bill, units: Number.isNaN(units) ? null : units, city: raw.city },
  };
}

/** Evaluates one package for a given customer profile. */
function evaluatePackage(pkg, profile) {
  const c = CONFIG.calculator;
  const monthlyGeneration = pkg.kw * profile.sunHours * c.systemEfficiency * c.daysPerMonth;
  const offsetUnits = Math.min(monthlyGeneration, profile.monthlyUnits);
  const coverage = profile.monthlyUnits > 0 ? offsetUnits / profile.monthlyUnits : 0;
  // Value the saved units at the customer's highest slabs first (what a real bill reduction looks like).
  const rawSaving = billFromUnits(profile.monthlyUnits) - billFromUnits(profile.monthlyUnits - offsetUnits);
  // A bill never drops to zero (fixed charges, meter rent, taxes), so cap the reduction.
  const monthlySavings = Math.min(rawSaving * profile.calibration, profile.monthlyBill * c.maxBillReduction);
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? pkg.price / annualSavings : Infinity;
  return { pkg, monthlyGeneration, offsetUnits, coverage, monthlySavings, annualSavings, paybackYears };
}

/** Main calculation. `values` must come from validateCalcInput(). */
function calculateSolar(values) {
  const c = CONFIG.calculator;
  const sunHours = (getCity(values.city) || { sunHours: c.defaultSunHours }).sunHours;
  const packages = [...CONFIG.packages].sort((a, b) => a.kw - b.kw);

  // Consumption: entered units win; otherwise estimate from the bill.
  const monthlyUnits = values.units !== null ? values.units : unitsFromBill(values.bill);
  const estimatedBill = billFromUnits(monthlyUnits);
  const monthlyBill = values.bill !== null ? values.bill : estimatedBill;

  // If both were entered, scale savings to the customer's real bill (kept within a sane range).
  const calibration = values.bill !== null && values.units !== null && estimatedBill > 0 ? clamp(values.bill / estimatedBill, 0.6, 1.6) : 1;

  const dailyUnits = monthlyUnits / c.daysPerMonth;
  const requiredKw = (dailyUnits * c.targetOffset) / (sunHours * c.systemEfficiency);

  let recIndex = packages.findIndex((p) => p.kw * (1 + c.packageFitTolerance) >= requiredKw);
  const exceedsLargest = recIndex === -1;
  if (exceedsLargest) recIndex = packages.length - 1;
  const budgetIndex = Math.max(recIndex - 1, 0);
  const premiumIndex = Math.min(recIndex + 1, packages.length - 1);

  const profile = { monthlyUnits, monthlyBill, sunHours, calibration };
  const recommended = evaluatePackage(packages[recIndex], profile);
  const budget = evaluatePackage(packages[budgetIndex], profile);
  const premium = evaluatePackage(packages[premiumIndex], profile);

  const notes = [];
  if (exceedsLargest) {
    notes.push(`Your estimated requirement (${formatNumber(requiredKw, 1)} kW) is above our largest sample package. A custom-sized system may suit you better – contact us for a tailored quote.`);
  } else if (recommended.pkg.kw > requiredKw * 1.6) {
    notes.push('Your usage is lower than our smallest package, so this system may be larger than you need. Ask us about a smaller custom size.');
  }
  if (calibration !== 1) notes.push('Savings were scaled to the electricity bill you entered.');
  if (values.units === null) notes.push('Monthly units were estimated from your bill using a sample tariff. Enter your units for a more accurate result.');

  return {
    values,
    sunHours,
    monthlyUnits,
    monthlyBill,
    dailyUnits,
    requiredKw,
    exceedsLargest,
    recommended,
    budget,
    premium,
    budgetIsRecommended: budgetIndex === recIndex,
    premiumIsRecommended: premiumIndex === recIndex,
    notes,
  };
}

function formatPayback(years) {
  const cap = CONFIG.calculator.paybackCapYears;
  if (!Number.isFinite(years)) return 'Not available';
  if (years > cap) return `More than ${cap} years`;
  if (years < 1) return `${Math.max(1, Math.round(years * 12))} months`;
  return `${formatNumber(years, 1)} years`;
}

/* ==========================================================================
   4. INQUIRY VALIDATION + WHATSAPP / EMAIL MESSAGES  (pure helpers)
   ========================================================================== */
function validateName(value) {
  const v = (value || '').trim();
  if (v.length < 2) return 'Please enter your full name.';
  if (v.length > 80) return 'Name is too long.';
  return '';
}

function validatePhone(value) {
  const cleaned = (value || '').replace(/[\s\-()]/g, '');
  if (!cleaned) return 'Please enter your phone number.';
  if (!/^(\+?92|0)?\d{9,10}$/.test(cleaned)) return 'Enter a valid phone number, e.g. 03XX XXXXXXX or +92 3XX XXXXXXX.';
  return '';
}

function validateEmailOptional(value) {
  const v = (value || '').trim();
  if (!v) return '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email address.';
}

function validateUnitsOptional(value) {
  const n = parseNum(value);
  if (n === null) return '';
  if (Number.isNaN(n)) return 'Please enter numbers only.';
  const l = CONFIG.calculator.limits.units;
  if (n < l.min || n > l.max) return `Enter a value between ${formatNumber(l.min)} and ${formatNumber(l.max)}.`;
  return '';
}

function isWhatsAppConfigured() {
  return /^\d{10,15}$/.test(String(CONFIG.contact.whatsappNumber).replace(/\D/g, '')) && CONFIG.contact.whatsappNumber !== '';
}

function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message);
  if (isWhatsAppConfigured()) return `https://wa.me/${String(CONFIG.contact.whatsappNumber).replace(/\D/g, '')}?text=${text}`;
  return `https://wa.me/?text=${text}`; // no recipient set: WhatsApp lets the user pick a contact
}

function buildInquiryMessage(data, calcSummary) {
  const lines = [
    `Hello ${CONFIG.company.name}, I would like to inquire about a solar package.`,
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `City: ${data.city}`,
    `Selected package: ${data.packageName}`,
  ];
  if (data.units) lines.push(`Monthly electricity units: ${data.units} kWh`);
  if (calcSummary) lines.push('', calcSummary);
  lines.push('', 'Please contact me with a quotation and site survey details. Thank you!');
  return lines.join('\n');
}

function buildContactMessage(data) {
  const lines = [`Hello ${CONFIG.company.name},`, '', `Name: ${data.name}`, `Phone: ${data.phone}`];
  if (data.email) lines.push(`Email: ${data.email}`);
  lines.push('', 'Message:', data.message || '(no message)');
  return lines.join('\n');
}

/* ==========================================================================
   5. ICONS  (inline SVG paths, injected into <span data-icon="name">)
   ========================================================================== */
const ICONS = {
  home: 'M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  building: 'M3 21h18M5 21V5a1 1 0 011-1h8a1 1 0 011 1v16M15 9h3a1 1 0 011 1v11M8.5 8h3M8.5 12h3M8.5 16h3',
  factory: 'M3 21V10l6 3.5V10l6 3.5V5h3v16H3zM8 17h.01M12 17h.01M16 17h.01',
  grid: 'M3 6h18M3 12h18M3 18h18M8 3v18M16 3v18',
  battery: 'M3.75 7.5h15a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 012.25 15V9a1.5 1.5 0 011.5-1.5zM21.75 10.5v3M12 9l-2 3h3l-2 3',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  bolt: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  sun: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  currency: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  trend: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941',
  checkCircle: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  check: 'M4.5 12.75l6 6 9-13.5',
  chat: 'M8.625 12h.01M12 12h.01M15.375 12h.01M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
  calculator: 'M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01',
  chevron: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  arrowRight: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3',
  arrowUp: 'M4.5 15.75l7.5-7.5 7.5 7.5',
  x: 'M6 18L18 6M6 6l12 12',
  menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  pin: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  zoom: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6',
  chevronLeft: 'M15.75 19.5L8.25 12l7.5-7.5',
  chevronRight: 'M8.25 4.5l7.5 7.5-7.5 7.5',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
};

function iconSvg(name, extraClass = '') {
  const d = ICONS[name];
  if (!d) return '';
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}

function injectIcons(root = document) {
  $$('[data-icon]', root).forEach((el) => {
    if (el.dataset.iconReady) return;
    el.innerHTML = iconSvg(el.dataset.icon);
    el.dataset.iconReady = '1';
  });
}

/* ==========================================================================
   6. RENDERERS (build dynamic sections from CONFIG)
   ========================================================================== */
function renderCityOptions() {
  const options = ['<option value="">Select your city</option>']
    .concat(CONFIG.cities.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`))
    .join('');
  $$('select[data-city-select]').forEach((sel) => {
    sel.innerHTML = options;
  });
}

function renderPackages() {
  const grid = $('#packages-grid');
  if (!grid) return;
  grid.innerHTML = CONFIG.packages
    .map((p) => {
      const gen = Math.round(packageMonthlyGeneration(p) / 10) * 10;
      return `
      <article id="pkg-${esc(p.id)}" class="pkg-card reveal ${p.featured ? 'is-featured' : ''}" data-pkg="${esc(p.id)}">
        ${p.featured ? '<span class="pkg-ribbon">Featured</span>' : ''}
        <p class="pkg-best">${esc(p.bestFor)}</p>
        <h3 class="pkg-name">${esc(p.name)}</h3>
        <p class="pkg-kw"><span>${formatNumber(p.kw)}</span> kW</p>
        <p class="pkg-price">${formatPKR(p.price)}</p>
        <p class="pkg-sample">Sample price – subject to site survey</p>
        <ul class="pkg-specs">
          <li><span class="pkg-spec-ico" data-icon="bolt"></span><span><strong>~${formatNumber(gen)} kWh/month</strong> estimated generation*</span></li>
          <li><span class="pkg-spec-ico" data-icon="sun"></span><span><strong>${p.panels.count} × ${p.panels.watt} W</strong> ${esc(p.panels.type)} panels</span></li>
          <li><span class="pkg-spec-ico" data-icon="battery"></span><span>${esc(p.inverter)}</span></li>
          <li><span class="pkg-spec-ico" data-icon="building"></span><span>${esc(p.installation)}</span></li>
          <li><span class="pkg-spec-ico" data-icon="shield"></span><span>Warranty: panels ${esc(p.warranty.panels)}; inverter ${esc(p.warranty.inverter)}; workmanship ${esc(p.warranty.workmanship)}</span></li>
        </ul>
        <button type="button" class="btn btn-primary w-full" data-open-modal="${esc(p.id)}">Get This Package ${iconSvg('arrowRight', 'btn-ico')}</button>
      </article>`;
    })
    .join('');
  injectIcons(grid);
}

function renderComparison(recommendedId = null) {
  const wrap = $('#compare-table-wrap');
  if (!wrap) return;
  const pkgs = [...CONFIG.packages].sort((a, b) => a.kw - b.kw);
  const rows = [
    ['System capacity', (p) => `${formatNumber(p.kw)} kW`],
    ['Sample price', (p) => formatPKR(p.price)],
    ['Est. generation*', (p) => `~${formatNumber(Math.round(packageMonthlyGeneration(p) / 10) * 10)} kWh/month`],
    ['Solar panels', (p) => `${p.panels.count} × ${p.panels.watt} W ${esc(p.panels.type)}`],
    ['Inverter', (p) => esc(p.inverter)],
    ['Best for', (p) => esc(p.bestFor)],
    ['Warranty (panels)', (p) => esc(p.warranty.panels)],
  ];
  const head = pkgs
    .map((p) => `<th scope="col" class="${p.id === recommendedId ? 'is-rec' : ''}">${esc(p.name)}${p.id === recommendedId ? '<span class="cmp-tag">Recommended for you</span>' : ''}</th>`)
    .join('');
  const body = rows
    .map(([label, fn]) => `<tr><th scope="row">${label}</th>${pkgs.map((p) => `<td class="${p.id === recommendedId ? 'is-rec' : ''}">${fn(p)}</td>`).join('')}</tr>`)
    .join('');
  const actions = pkgs
    .map((p) => `<td class="${p.id === recommendedId ? 'is-rec' : ''}"><button type="button" class="btn btn-primary btn-sm" data-open-modal="${esc(p.id)}">Get This Package</button></td>`)
    .join('');
  wrap.innerHTML = `<table class="cmp-table"><thead><tr><th scope="col" class="cmp-corner">Compare</th>${head}</tr></thead><tbody>${body}<tr><th scope="row"></th>${actions}</tr></tbody></table>`;
}

function renderTestimonials() {
  const grid = $('#testimonials-grid');
  if (!grid) return;
  grid.innerHTML = CONFIG.testimonials
    .map(
      (t) => `
    <figure class="testi-card reveal">
      <div class="testi-stars" aria-label="5 out of 5 stars">★★★★★</div>
      <blockquote>“${esc(t.text)}”</blockquote>
      <figcaption>
        <span class="testi-avatar" aria-hidden="true">${esc(t.name.trim().slice(-1).toUpperCase())}</span>
        <span><strong>${esc(t.name)}</strong><br><small>${esc(t.role)}</small></span>
      </figcaption>
    </figure>`
    )
    .join('');
}

/* ==========================================================================
   7. TOAST
   ========================================================================== */
let toastTimer = null;
function showToast(message, type = 'info') {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.dataset.type = type;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 6000);
}

/* ==========================================================================
   8. FIELD ERROR HELPERS
   ========================================================================== */
function setFieldError(form, name, message) {
  const err = $(`[data-error-for="${name}"]`, form);
  const input = $(`[name="${name}"]`, form);
  if (err) err.textContent = message || '';
  if (input) {
    input.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

function clearFormErrors(form) {
  $$('[data-error-for]', form).forEach((e) => (e.textContent = ''));
  $$('.has-error', form).forEach((i) => {
    i.classList.remove('has-error');
    i.setAttribute('aria-invalid', 'false');
  });
}

/* ==========================================================================
   9. CALCULATOR UI
   ========================================================================== */
const calcState = { mode: 'bill', lastResult: null };

function setCalcMode(mode) {
  calcState.mode = mode;
  const form = $('#calc-form');
  if (!form) return;

  $$('[data-calc-mode]').forEach((btn) => {
    const active = btn.dataset.calcMode === mode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
    btn.tabIndex = active ? 0 : -1;
  });

  const billField = $('[data-field="bill"]', form);
  const unitsField = $('[data-field="units"]', form);
  const primary = mode === 'bill' ? billField : unitsField;
  const secondary = mode === 'bill' ? unitsField : billField;
  primary.style.order = '1';
  secondary.style.order = '2';
  $('[data-field="city"]', form).style.order = '3';
  $('.req-tag', primary).textContent = 'Required';
  $('.req-tag', primary).dataset.kind = 'required';
  $('.req-tag', secondary).textContent = 'Optional';
  $('.req-tag', secondary).dataset.kind = 'optional';
  $('input', primary).required = true;
  $('input', secondary).required = false;
  clearFormErrors(form);
}

function readCalcForm() {
  const form = $('#calc-form');
  return { bill: form.bill.value, units: form.units.value, city: form.city.value };
}

function handleCalcSubmit(event) {
  event.preventDefault();
  const form = $('#calc-form');
  clearFormErrors(form);
  const { valid, errors, values } = validateCalcInput(calcState.mode, readCalcForm());
  if (!valid) {
    Object.entries(errors).forEach(([name, message]) => setFieldError(form, name, message));
    const firstBad = $('.has-error', form);
    if (firstBad) firstBad.focus();
    return;
  }
  const result = calculateSolar(values);
  calcState.lastResult = result;
  renderCalcResults(result);
  renderComparison(result.recommended.pkg.id);
  const out = $('#calc-results');
  out.hidden = false;
  requestAnimationFrame(() => out.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' }));
}

function resetCalculator() {
  const form = $('#calc-form');
  form.reset();
  clearFormErrors(form);
  calcState.lastResult = null;
  $('#calc-results').hidden = true;
  $('#calc-results').innerHTML = '';
  renderComparison(null);
  setCalcMode('bill');
}

function metricCard(icon, label, value, sub = '', accent = '') {
  return `<div class="metric ${accent}"><span class="metric-ico">${iconSvg(icon)}</span><p class="metric-label">${label}</p><p class="metric-value">${value}</p>${sub ? `<p class="metric-sub">${sub}</p>` : ''}</div>`;
}

function optionCard(kind, label, evaluation, isSameAsRecommended, sameNote) {
  const e = evaluation;
  const p = e.pkg;
  return `
    <article class="opt-card ${kind === 'recommended' ? 'is-recommended' : ''}">
      <p class="opt-label">${label}${kind === 'recommended' ? ' <span class="opt-star">★</span>' : ''}</p>
      <h4>${esc(p.name)}</h4>
      <p class="opt-price">${formatPKR(p.price)} <small>sample price</small></p>
      <dl class="opt-list">
        <div><dt>Bill covered</dt><dd>~${formatNumber(Math.round(e.coverage * 100))}%</dd></div>
        <div><dt>Est. monthly savings</dt><dd>${formatPKR(e.monthlySavings)}</dd></div>
        <div><dt>Est. payback</dt><dd>${formatPayback(e.paybackYears)}</dd></div>
      </dl>
      ${isSameAsRecommended && kind !== 'recommended' ? `<p class="opt-note">${sameNote}</p>` : ''}
      <div class="opt-actions">
        <button type="button" class="btn btn-ghost btn-sm" data-view-package="${esc(p.id)}">View Package</button>
        <button type="button" class="btn btn-primary btn-sm" data-open-modal="${esc(p.id)}">Get This Package</button>
      </div>
    </article>`;
}

function renderCalcResults(r) {
  const rec = r.recommended;
  const cityLabel = esc(r.values.city);
  const notes = r.notes
    .map((n) => `<p class="calc-note ${n.startsWith('Your estimated requirement') || n.startsWith('Your usage') ? 'is-warning' : ''}">${iconSvg(n.startsWith('Your estimated requirement') || n.startsWith('Your usage') ? 'warning' : 'info')}<span>${esc(n)}</span></p>`)
    .join('');

  $('#calc-results').innerHTML = `
    <div class="results-head">
      <div>
        <p class="eyebrow">Your estimate</p>
        <h3>Results for ${cityLabel}</h3>
        <p class="results-sub">You use about <strong>${formatNumber(r.monthlyUnits, 0)} kWh/month</strong> (≈ ${formatNumber(r.dailyUnits, 1)} kWh/day). With ${formatNumber(r.sunHours, 1)} peak sun hours and ${formatNumber(CONFIG.calculator.systemEfficiency * 100)}% system efficiency, you need roughly <strong>${formatNumber(r.requiredKw, 1)} kW</strong> of solar.</p>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" id="calc-recalc">Calculate again</button>
    </div>

    <div class="metrics">
      ${metricCard('sun', 'Recommended Solar Capacity', `${formatNumber(r.requiredKw, 1)} kW`, r.exceedsLargest ? 'Above our largest package' : `Closest package: ${formatNumber(rec.pkg.kw)} kW`, 'is-orange')}
      ${metricCard('checkCircle', 'Recommended Package', esc(rec.pkg.name), `${rec.pkg.panels.count} × ${rec.pkg.panels.watt} W panels`)}
      ${metricCard('currency', 'Estimated System Price', formatPKR(rec.pkg.price), 'Sample price')}
      ${metricCard('bolt', 'Estimated Monthly Savings', formatPKR(rec.monthlySavings), `~${formatNumber(Math.round(rec.coverage * 100))}% of your units offset`)}
      ${metricCard('trend', 'Estimated Annual Savings', formatPKR(rec.annualSavings), 'Before degradation & tariff changes')}
      ${metricCard('clock', 'Estimated Payback Period', formatPayback(rec.paybackYears), 'Simple payback = price ÷ annual savings')}
    </div>

    ${notes}

    <div class="disclaimer">
      ${iconSvg('info')}
      <p><strong>Preliminary estimate only – not a guarantee.</strong> Results use average sun hours for your city, an assumed system efficiency, and a sample electricity tariff. Real savings depend on your actual tariff, roof shading and orientation, weather, net-metering terms, equipment and usage. Final system size and price are confirmed after a site survey.</p>
    </div>

    <h3 class="options-title">Choose your package</h3>
    <div class="options-grid">
      ${optionCard('budget', 'Budget Package', r.budget, r.budgetIsRecommended, 'Same as the recommended option – it is already our smallest package.')}
      ${optionCard('recommended', 'Recommended Package', r.recommended, false, '')}
      ${optionCard('premium', 'Premium Package', r.premium, r.premiumIsRecommended, 'Same as the recommended option – it is already our largest package.')}
    </div>
    <p class="options-foot">Smaller packages cover less of your bill and leave more to the grid; larger ones give extra headroom for future appliances. Unused generation is not counted in the savings above.</p>`;
}

/* ==========================================================================
   10. PACKAGE VIEW HIGHLIGHT
   ========================================================================== */
function viewPackage(id) {
  const card = $(`#pkg-${CSS.escape(id)}`);
  if (!card) return;
  card.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  card.classList.remove('is-highlighted');
  void card.offsetWidth; // restart the animation
  card.classList.add('is-highlighted');
  setTimeout(() => card.classList.remove('is-highlighted'), 3200);
}

/* ==========================================================================
   11. INQUIRY MODAL
   ========================================================================== */
let lastFocusedBeforeModal = null;

function openInquiryModal(packageId) {
  const modal = $('#inquiry-modal');
  const form = $('#inquiry-form');
  if (!modal || !form) return;
  lastFocusedBeforeModal = document.activeElement;
  clearFormErrors(form);

  // Package select
  const select = form.package;
  select.innerHTML = CONFIG.packages.map((p) => `<option value="${esc(p.id)}">${esc(p.name)} – ${formatPKR(p.price)} (sample)</option>`).join('');
  if (packageId && getPackage(packageId)) select.value = packageId;

  // Prefill from calculator when available
  const last = calcState.lastResult;
  if (last) {
    if (!form.city.value) form.city.value = last.values.city;
    if (!form.units.value) form.units.value = String(Math.round(last.monthlyUnits));
  }

  const notice = $('[data-wa-notice]', modal);
  if (notice) notice.hidden = isWhatsAppConfigured();

  modal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modal.classList.add('is-open'));
  setTimeout(() => form.elements.name.focus(), 60);
}

function closeInquiryModal() {
  const modal = $('#inquiry-modal');
  if (!modal || modal.hidden) return;
  modal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    modal.hidden = true;
  }, 220);
  if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') lastFocusedBeforeModal.focus();
}

function handleInquirySubmit(event) {
  event.preventDefault();
  const form = $('#inquiry-form');
  clearFormErrors(form);

  const errors = {
    name: validateName(form.elements.name.value),
    phone: validatePhone(form.phone.value),
    city: form.city.value ? '' : 'Please select your city.',
    package: getPackage(form.package.value) ? '' : 'Please choose a package.',
    units: validateUnitsOptional(form.units.value),
  };
  const bad = Object.entries(errors).filter(([, m]) => m);
  if (bad.length) {
    bad.forEach(([k, m]) => setFieldError(form, k, m));
    $(`[name="${bad[0][0]}"]`, form).focus();
    return;
  }

  const pkg = getPackage(form.package.value);
  const last = calcState.lastResult;
  const calcSummary = last
    ? `Website calculator estimate: about ${formatNumber(last.requiredKw, 1)} kW needed (${formatNumber(last.monthlyUnits, 0)} kWh/month in ${last.values.city}). This is a preliminary estimate.`
    : '';
  const message = buildInquiryMessage(
    {
      name: form.elements.name.value.trim(),
      phone: form.phone.value.trim(),
      city: form.city.value,
      packageName: `${pkg.name} (sample price ${formatPKR(pkg.price)})`,
      units: parseNum(form.units.value) ? formatNumber(parseNum(form.units.value), 0) : '',
    },
    calcSummary
  );

  window.open(buildWhatsAppUrl(message), '_blank', 'noopener');
  showToast('WhatsApp opened with your message. Press send there to contact us – nothing is saved or submitted by this website.', 'success');
  closeInquiryModal();
}

function trapFocus(event, container) {
  if (event.key !== 'Tab') return;
  const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])', container).filter((el) => el.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ==========================================================================
   12. CONTACT FORM
   ========================================================================== */
function readContactForm() {
  const f = $('#contact-form');
  return { name: f.elements.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), message: f.message.value.trim() };
}

function validateContactForm() {
  const f = $('#contact-form');
  clearFormErrors(f);
  const d = readContactForm();
  const errors = {
    name: validateName(d.name),
    phone: validatePhone(d.phone),
    email: validateEmailOptional(d.email),
    message: d.message.length < 5 ? 'Please write a short message (at least 5 characters).' : '',
  };
  const bad = Object.entries(errors).filter(([, m]) => m);
  bad.forEach(([k, m]) => setFieldError(f, k, m));
  if (bad.length) {
    $(`[name="${bad[0][0]}"]`, f).focus();
    return null;
  }
  return d;
}

function handleContactWhatsApp(event) {
  event.preventDefault();
  const data = validateContactForm();
  if (!data) return;
  window.open(buildWhatsAppUrl(buildContactMessage(data)), '_blank', 'noopener');
  showToast('WhatsApp opened with your message. Press send there – nothing is saved or submitted by this website.', 'success');
}

function handleContactEmail() {
  const data = validateContactForm();
  if (!data) return;
  const to = isPlaceholder(CONFIG.contact.email) ? '' : CONFIG.contact.email;
  const subject = encodeURIComponent(`Website inquiry from ${data.name}`);
  const body = encodeURIComponent(buildContactMessage(data));
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  showToast('Your email app should open with the message ready. Nothing is saved or sent by this website.', 'info');
}

/* ==========================================================================
   13. NAVIGATION, SCROLL, ANIMATIONS
   ========================================================================== */
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initNavigation() {
  const header = $('#site-header');
  const toggle = $('#menu-toggle');
  const menu = $('#mobile-menu');
  const backTop = $('#back-to-top');

  const setMenu = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = iconSvg(open ? 'x' : 'menu');
    document.body.classList.toggle('menu-open', open);
  };
  toggle.innerHTML = iconSvg('menu');
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && !menu.hidden) setMenu(false);
  });

  // Smooth scrolling for in-page links (+ close the mobile menu)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    if (!menu.hidden) setMenu(false);
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });

  // Header style + back-to-top visibility
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    backTop.classList.toggle('is-visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));

  // Active link highlighting
  const links = $$('[data-nav-link]');
  const sections = links.map((l) => $(l.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }
}

let revealObserver = null;
function observeReveals(root = document) {
  const items = $$('.reveal:not(.is-visible)', root);
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
  }
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   14. FAQ ACCORDION
   ========================================================================== */
function initFaq() {
  const items = $$('.faq-item');
  const setOpen = (item, open) => {
    const btn = $('.faq-q', item);
    const panel = $('.faq-a', item);
    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);
    panel.style.maxHeight = open ? `${panel.scrollHeight}px` : '0px';
  };
  items.forEach((item) => {
    $('.faq-q', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((other) => setOpen(other, other === item ? willOpen : false));
    });
  });
  window.addEventListener('resize', () => items.filter((i) => i.classList.contains('is-open')).forEach((i) => setOpen(i, true)));
  if (items[0]) setOpen(items[0], true);
}

/* ==========================================================================
   15. GALLERY FILTER + LIGHTBOX
   ========================================================================== */
function initGallery() {
  const filters = $$('[data-gallery-filter]');
  const items = $$('.gallery-item');
  const lightbox = $('#lightbox');
  if (!items.length || !lightbox) return;

  let visible = items;
  let index = 0;

  filters.forEach((btn) =>
    btn.addEventListener('click', () => {
      const cat = btn.dataset.galleryFilter;
      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      items.forEach((it) => {
        const show = cat === 'all' || it.dataset.category === cat;
        it.classList.toggle('is-hidden', !show);
      });
      visible = items.filter((it) => !it.classList.contains('is-hidden'));
    })
  );

  const img = $('#lightbox-img');
  const title = $('#lightbox-title');
  const desc = $('#lightbox-desc');
  const counter = $('#lightbox-counter');

  const show = (i) => {
    index = (i + visible.length) % visible.length;
    const it = visible[index];
    img.src = $('img', it).getAttribute('src');
    img.alt = $('img', it).getAttribute('alt') || '';
    title.textContent = it.dataset.title || '';
    desc.textContent = it.dataset.desc || '';
    counter.textContent = `${index + 1} / ${visible.length}`;
  };
  const open = (it) => {
    visible = items.filter((x) => !x.classList.contains('is-hidden'));
    show(visible.indexOf(it));
    lightbox.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => lightbox.classList.add('is-open'));
    $('#lightbox-close').focus();
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    setTimeout(() => (lightbox.hidden = true), 200);
  };

  items.forEach((it) => $('button', it).addEventListener('click', () => open(it)));
  $('#lightbox-close').addEventListener('click', close);
  $('#lightbox-prev').addEventListener('click', () => show(index - 1));
  $('#lightbox-next').addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

/* ==========================================================================
   16. CONFIG -> PAGE (contact details, social links, WhatsApp buttons)
   ========================================================================== */
function applyConfigToPage() {
  const c = CONFIG.contact;

  $$('[data-config="phone"]').forEach((el) => {
    el.textContent = c.phone;
    if (!isPlaceholder(c.phone) && el.tagName === 'A') el.href = `tel:${c.phone.replace(/[^\d+]/g, '')}`;
    else el.removeAttribute('href');
  });
  $$('[data-config="email"]').forEach((el) => {
    el.textContent = c.email;
    if (!isPlaceholder(c.email) && el.tagName === 'A') el.href = `mailto:${c.email}`;
    else el.removeAttribute('href');
  });
  $$('[data-config="address"]').forEach((el) => (el.textContent = c.address));
  $$('[data-social]').forEach((el) => {
    const url = c.social[el.dataset.social];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else el.hidden = true;
  });

  const greeting = `Hello ${CONFIG.company.name}, I would like to know more about your solar packages.`;
  $$('[data-whatsapp-link]').forEach((el) => {
    el.href = buildWhatsAppUrl(greeting);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
  $$('[data-wa-notice]').forEach((el) => (el.hidden = isWhatsAppConfigured()));
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ==========================================================================
   17. EVENT WIRING + INIT
   ========================================================================== */
function initGlobalEvents() {
  // Delegated clicks: open modal / view package / recalc
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-modal]');
    if (openBtn) {
      openInquiryModal(openBtn.dataset.openModal);
      return;
    }
    const viewBtn = e.target.closest('[data-view-package]');
    if (viewBtn) {
      viewPackage(viewBtn.dataset.viewPackage);
      return;
    }
    if (e.target.closest('#calc-recalc')) {
      $('#calculator').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => $('#calc-form').querySelector('input').focus({ preventScroll: true }), 400);
      return;
    }
    if (e.target.closest('[data-close-modal]')) closeInquiryModal();
  });

  document.addEventListener('keydown', (e) => {
    const modal = $('#inquiry-modal');
    if (modal && !modal.hidden) {
      if (e.key === 'Escape') closeInquiryModal();
      trapFocus(e, $('.modal-panel', modal));
    }
  });

  // Compare toggle
  const compareBtn = $('#compare-toggle');
  const compareWrap = $('#compare-panel');
  if (compareBtn && compareWrap) {
    compareBtn.addEventListener('click', () => {
      const open = compareWrap.hidden;
      compareWrap.hidden = !open;
      compareBtn.setAttribute('aria-expanded', String(open));
      compareBtn.querySelector('span').textContent = open ? 'Hide comparison' : 'Compare all packages';
      if (open) compareWrap.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  // Calculator
  $$('[data-calc-mode]').forEach((btn) => btn.addEventListener('click', () => setCalcMode(btn.dataset.calcMode)));
  $('#calc-form').addEventListener('submit', handleCalcSubmit);
  $('#calc-reset').addEventListener('click', resetCalculator);
  $$('#calc-form input, #calc-form select').forEach((el) =>
    el.addEventListener('input', () => {
      setFieldError($('#calc-form'), el.name, '');
    })
  );

  // Modal + contact forms
  $('#inquiry-form').addEventListener('submit', handleInquirySubmit);
  $$('#inquiry-form input, #inquiry-form select').forEach((el) => el.addEventListener('input', () => setFieldError($('#inquiry-form'), el.name, '')));
  $('#contact-form').addEventListener('submit', handleContactWhatsApp);
  $('#contact-email-btn').addEventListener('click', handleContactEmail);
  $$('#contact-form input, #contact-form textarea').forEach((el) => el.addEventListener('input', () => setFieldError($('#contact-form'), el.name, '')));
}

function init() {
  renderCityOptions();
  renderPackages();
  renderComparison(null);
  renderTestimonials();
  applyConfigToPage();
  injectIcons();
  initNavigation();
  initFaq();
  initGallery();
  initGlobalEvents();
  setCalcMode('bill');
  observeReveals();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}

// Allows the pure calculation logic to be tested in Node (ignored in the browser).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, billFromUnits, unitsFromBill, validateCalcInput, calculateSolar, formatPayback, validatePhone, validateName, validateEmailOptional, buildInquiryMessage, buildWhatsAppUrl, parseNum };
}
