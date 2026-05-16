/* ============================================================
   NOOR — Light of Islam  |  noor-app.js
   Features:
     1. Section navigation (with keyboard support)
     2. Live search / topic filter
     3. Digital Tasbih counter (33 / 99 / custom modes)
     4. Smooth entrance animations on section reveal
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   SEARCH INDEX
   Every searchable topic maps to: { section, keywords, label }
   Add new entries here as the app grows.
   ------------------------------------------------------------ */
const SEARCH_INDEX = [
  // Intro
  { section: 'intro', label: 'Introduction to Islam', keywords: 'islam introduction monotheistic faith prophet muhammad arabia submission allah muslim' },
  { section: 'intro', label: '1.8 Billion Muslims', keywords: 'billion muslims world religion continent global' },
  { section: 'intro', label: 'Founded 610 CE', keywords: 'founded history 610 hira cave revelation mecca year' },
  { section: 'intro', label: 'Religion of Peace', keywords: 'peace salam greeting harmony compassion mercy assalamu alaykum' },
  { section: 'intro', label: 'Abrahamic Faith', keywords: 'abrahamic abraham moses jesus prophets completion message' },

  // Pillars
  { section: 'pillars', label: 'Five Pillars of Islam', keywords: 'pillars five arkan five pillars worship structure life' },
  { section: 'pillars', label: 'Shahada — Declaration of Faith', keywords: 'shahada declaration faith testimony la ilaha illallah kalima' },
  { section: 'pillars', label: 'Salah — Daily Prayer', keywords: 'salah salat prayer five times daily fajr dhuhr asr maghrib isha worship' },
  { section: 'pillars', label: 'Zakat — Almsgiving', keywords: 'zakat charity almsgiving 2.5 percent savings poor giving wealth purification' },
  { section: 'pillars', label: 'Sawm — Fasting', keywords: 'sawm fasting ramadan abstain food drink dawn sunset self-discipline' },
  { section: 'pillars', label: 'Hajj — Pilgrimage', keywords: 'hajj pilgrimage mecca kaaba once lifetime unity equality' },

  // Beliefs
  { section: 'beliefs', label: 'Six Articles of Faith', keywords: 'beliefs six articles iman aqeedah theology' },
  { section: 'beliefs', label: 'Belief in Allah', keywords: 'tawhid oneness god allah creator sustainer lord partners' },
  { section: 'beliefs', label: 'Belief in Angels', keywords: 'angels malaika light revelation deeds jibril' },
  { section: 'beliefs', label: 'Belief in Scriptures', keywords: 'scriptures kutub quran torah tawrat psalms zabur gospel injeel books' },
  { section: 'beliefs', label: 'Belief in Prophets', keywords: 'prophets anbiya adam noah ibrahim moses jesus muhammad seal' },
  { section: 'beliefs', label: 'Day of Judgment', keywords: 'judgment qiyamah resurrection accountable paradise hell afterlife' },
  { section: 'beliefs', label: 'Divine Decree (Qadar)', keywords: 'qadar divine decree predestination free will knowledge god fate' },

  // Quran
  { section: 'quran', label: 'The Holy Quran', keywords: 'quran holy book scripture word god literal revealed' },
  { section: 'quran', label: '114 Surahs (Chapters)', keywords: 'surah chapter 114 ayat verses quran text' },
  { section: 'quran', label: 'Tajweed — Recitation Rules', keywords: 'tajweed recitation rules pronunciation quranic' },
  { section: 'quran', label: 'Huffaz — Quran Memorization', keywords: 'huffaz memorization hifz quran memory millions' },

  // Prayer / Salah
  { section: 'prayer', label: 'Salah — Five Daily Prayers', keywords: 'salah prayer five daily fajr dhuhr asr maghrib isha times' },
  { section: 'prayer', label: 'Fajr Prayer', keywords: 'fajr dawn pre-dawn prayer morning two units rakat' },
  { section: 'prayer', label: 'Dhuhr Prayer', keywords: 'dhuhr midday noon prayer four units rakat' },
  { section: 'prayer', label: 'Asr Prayer', keywords: 'asr afternoon prayer four units rakat' },
  { section: 'prayer', label: 'Maghrib Prayer', keywords: 'maghrib sunset prayer three units rakat' },
  { section: 'prayer', label: 'Isha Prayer', keywords: 'isha night prayer four units rakat' },
  { section: 'prayer', label: 'Wudu — Ritual Purification', keywords: 'wudu ablution washing purification cleanliness hands face' },
  { section: 'prayer', label: 'Qibla — Direction of Prayer', keywords: 'qibla direction kaaba mecca facing billion compass' },
  { section: 'prayer', label: "Jumu'ah — Friday Prayer", keywords: 'jumuah friday prayer congregational mosque khutbah sermon' },

  // Values
  { section: 'values', label: 'Islamic Values & Ethics', keywords: 'values ethics morals character islamic teaching' },
  { section: 'values', label: 'Rahma — Compassion', keywords: 'rahma compassion mercy al-rahman al-raheem god merciful' },
  { section: 'values', label: 'Adl — Justice', keywords: 'adl justice equality fairness social ethics cornerstone' },
  { section: 'values', label: 'Ukhuwwa — Brotherhood', keywords: 'ukhuwwa brotherhood sisterhood community ummah faith' },
  { section: 'values', label: 'Sidq — Truthfulness', keywords: 'sidq truthfulness honesty al-amin trustworthy character' },
  { section: 'values', label: 'Amanah — Trustworthiness', keywords: 'amanah trustworthiness responsibility duty earth khalifa' },
  { section: 'values', label: 'Shukr — Gratitude', keywords: 'shukr gratitude thankfulness blessings spiritual increase' },
];

/* ------------------------------------------------------------
   TASBIH DHIKR PRESETS
   Each preset defines the Arabic phrase, its transliteration,
   English meaning, and the classic count target.
   ------------------------------------------------------------ */
const DHIKR_PRESETS = [
  { arabic: 'سُبْحَانَ اللَّهِ',     latin: 'Subhan Allah',    english: 'Glory be to God',            target: 33 },
  { arabic: 'الْحَمْدُ لِلَّهِ',     latin: 'Alhamdulillah',  english: 'All praise be to God',        target: 33 },
  { arabic: 'اللَّهُ أَكْبَرُ',      latin: 'Allahu Akbar',   english: 'God is the Greatest',         target: 33 },
  { arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', latin: 'La ilaha illallah', english: 'There is no god but God', target: 99 },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ',  latin: 'Astaghfirullah', english: 'I seek forgiveness from God', target: 99 },
];

/* ============================================================
   STATE
   ============================================================ */
const state = {
  currentSection: 'intro',
  search: {
    query: '',
    results: [],
    visible: false,
  },
  tasbih: {
    count: 0,
    presetIndex: 0,
    total: 0,       // cumulative across rounds
    rounds: 0,
    animating: false,
  },
};

/* ============================================================
   1. NAVIGATION
   ============================================================ */
function showSection(sectionId, triggerEl) {
  if (sectionId === state.currentSection) return;

  // Hide old
  const old = document.getElementById(state.currentSection);
  if (old) old.classList.remove('active');

  // Show new
  const next = document.getElementById(sectionId);
  if (!next) return;
  next.classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const target = triggerEl || document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
  if (target) target.classList.add('active');

  state.currentSection = sectionId;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close search panel if open
  if (state.search.visible) closeSearch();
}

/* ============================================================
   2. SEARCH
   ============================================================ */
function buildSearchUI() {
  // Inject search bar below nav
  const nav = document.querySelector('nav');
  const wrapper = document.createElement('div');
  wrapper.id = 'search-wrapper';
  wrapper.innerHTML = `
    <div id="search-bar">
      <span id="search-icon">🔍</span>
      <input
        type="search"
        id="search-input"
        placeholder="Search topics — pillars, prayer, Quran…"
        autocomplete="off"
        aria-label="Search guide topics"
      />
      <button id="search-clear" aria-label="Clear search" title="Clear">✕</button>
    </div>
    <div id="search-results" role="listbox" aria-label="Search results"></div>
  `;
  nav.insertAdjacentElement('afterend', wrapper);

  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const resultsEl = document.getElementById('search-results');

  // Live search on input
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    state.search.query = q;
    clearBtn.style.display = q ? 'flex' : 'none';
    if (q.length < 2) {
      closeSearch();
      return;
    }
    runSearch(q, resultsEl);
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    input.value = '';
    state.search.query = '';
    clearBtn.style.display = 'none';
    closeSearch();
    input.focus();
  });

  // Keyboard: Escape closes, arrows navigate results
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSearch();
      input.blur();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = resultsEl.querySelector('.search-result-item');
      if (first) first.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) closeSearch();
  });
}

function runSearch(query, resultsEl) {
  const tokens = query.split(/\s+/);
  const matches = SEARCH_INDEX.filter(entry =>
    tokens.every(token =>
      entry.keywords.includes(token) || entry.label.toLowerCase().includes(token)
    )
  );

  state.search.results = matches;
  state.search.visible = matches.length > 0;
  renderResults(matches, query, resultsEl);
}

function renderResults(matches, query, resultsEl) {
  if (!matches.length) {
    resultsEl.innerHTML = `<div class="search-empty">No topics found for "<strong>${escHtml(query)}</strong>"</div>`;
    resultsEl.classList.add('open');
    return;
  }

  const html = matches.map((m, i) => {
    const sectionLabel = m.section.charAt(0).toUpperCase() + m.section.slice(1);
    const highlighted = highlightMatch(m.label, query);
    return `
      <button
        class="search-result-item"
        role="option"
        tabindex="0"
        data-section="${m.section}"
        data-index="${i}"
        aria-label="Go to ${m.label}"
      >
        <span class="result-label">${highlighted}</span>
        <span class="result-section">${sectionLabel}</span>
      </button>
    `;
  }).join('');

  resultsEl.innerHTML = html;
  resultsEl.classList.add('open');

  // Wire up result clicks + keyboard nav
  resultsEl.querySelectorAll('.search-result-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      showSection(item.dataset.section);
      closeSearch();
      document.getElementById('search-input').value = '';
      document.getElementById('search-clear').style.display = 'none';
    });

    item.addEventListener('keydown', e => {
      const items = [...resultsEl.querySelectorAll('.search-result-item')];
      if (e.key === 'ArrowDown') { e.preventDefault(); items[i + 1]?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); i > 0 ? items[i - 1].focus() : document.getElementById('search-input').focus(); }
      if (e.key === 'Enter')     { item.click(); }
      if (e.key === 'Escape')    { closeSearch(); document.getElementById('search-input').focus(); }
    });
  });
}

function closeSearch() {
  const resultsEl = document.getElementById('search-results');
  if (resultsEl) resultsEl.classList.remove('open');
  state.search.visible = false;
}

function highlightMatch(label, query) {
  const tokens = query.split(/\s+/).filter(Boolean);
  let result = escHtml(label);
  tokens.forEach(token => {
    const re = new RegExp(`(${escRegex(token)})`, 'gi');
    result = result.replace(re, '<mark>$1</mark>');
  });
  return result;
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function escRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ============================================================
   3. TASBIH COUNTER
   ============================================================ */
function buildTasbihUI() {
  // Inject Tasbih section into nav as a new tab + create the section
  const nav = document.querySelector('nav');
  const tasbihBtn = document.createElement('button');
  tasbihBtn.className = 'nav-btn';
  tasbihBtn.dataset.section = 'tasbih';
  tasbihBtn.textContent = 'Tasbih';
  tasbihBtn.addEventListener('click', e => showSection('tasbih', e.currentTarget));
  nav.appendChild(tasbihBtn);

  // Build the section HTML
  const section = document.createElement('section');
  section.id = 'tasbih';
  section.className = 'section';
  section.innerHTML = buildTasbihHTML();
  document.querySelector('main').appendChild(section);

  // Wire up interactions
  wireTasbih();
}

function buildTasbihHTML() {
  const preset = DHIKR_PRESETS[0];
  const presetOptions = DHIKR_PRESETS.map((p, i) =>
    `<option value="${i}">${p.latin} (${p.target})</option>`
  ).join('');

  return `
    <div class="section-header">
      <span class="section-arabic">التَّسْبِيح</span>
      <h2 class="section-title">Digital Tasbih</h2>
      <p class="section-subtitle">A tool for dhikr — the remembrance of God</p>
    </div>
    <div class="divider"><div class="divider-diamond"></div></div>

    <!-- Dhikr Selector -->
    <div class="tasbih-selector-wrap">
      <label for="dhikr-select" class="tasbih-label">Choose a Dhikr</label>
      <select id="dhikr-select" class="dhikr-select" aria-label="Select dhikr phrase">
        ${presetOptions}
        <option value="custom">Custom…</option>
      </select>
    </div>

    <!-- Custom dhikr input (hidden by default) -->
    <div id="custom-dhikr-wrap" class="custom-dhikr-wrap" style="display:none">
      <input type="text" id="custom-arabic" class="custom-input" placeholder="Arabic phrase (optional)" dir="rtl" />
      <input type="text" id="custom-label"  class="custom-input" placeholder="Label (e.g. My Dhikr)" />
      <input type="number" id="custom-target" class="custom-input" placeholder="Target count (e.g. 33)" min="1" max="9999" />
    </div>

    <!-- Dhikr display -->
    <div class="tasbih-dhikr-card">
      <div id="tasbih-arabic" class="tasbih-arabic">${preset.arabic}</div>
      <div id="tasbih-latin"  class="tasbih-latin">${preset.latin}</div>
      <div id="tasbih-meaning" class="tasbih-meaning">${preset.english}</div>
    </div>

    <!-- Counter display -->
    <div class="tasbih-counter-wrap">
      <div class="tasbih-progress-ring-wrap" aria-live="polite">
        <svg class="progress-ring" viewBox="0 0 180 180" aria-hidden="true">
          <circle class="ring-track" cx="90" cy="90" r="78"/>
          <circle id="ring-fill"  class="ring-fill"  cx="90" cy="90" r="78"/>
        </svg>
        <div class="tasbih-count-inner">
          <span id="tasbih-count" class="tasbih-count">0</span>
          <span id="tasbih-target-label" class="tasbih-target-label">/ ${preset.target}</span>
        </div>
      </div>

      <div class="tasbih-stats">
        <div class="stat-pill"><span class="stat-value" id="stat-rounds">0</span><span class="stat-name">Rounds</span></div>
        <div class="stat-pill"><span class="stat-value" id="stat-total">0</span><span class="stat-name">Total</span></div>
      </div>
    </div>

    <!-- Controls -->
    <div class="tasbih-controls">
      <button id="tasbih-btn" class="tasbih-tap-btn" aria-label="Count dhikr">
        <span class="tasbih-btn-arabic">اذكر</span>
        <span class="tasbih-btn-sub">Tap to Count</span>
      </button>
    </div>

    <div class="tasbih-actions">
      <button id="tasbih-reset" class="tasbih-action-btn" aria-label="Reset current count">↺ Reset Count</button>
      <button id="tasbih-reset-all" class="tasbih-action-btn danger" aria-label="Reset everything">✕ Reset All</button>
    </div>

    <!-- Completion message (hidden) -->
    <div id="tasbih-complete" class="tasbih-complete" style="display:none" aria-live="assertive">
      <span class="complete-arabic">مَاشَاءَ اللَّهُ</span>
      <span class="complete-text">Mashallah! Round complete 🌿</span>
    </div>
  `;
}

function wireTasbih() {
  const select      = document.getElementById('dhikr-select');
  const tapBtn      = document.getElementById('tasbih-btn');
  const resetBtn    = document.getElementById('tasbih-reset');
  const resetAllBtn = document.getElementById('tasbih-reset-all');
  const customWrap  = document.getElementById('custom-dhikr-wrap');

  // Preset selector
  select.addEventListener('change', () => {
    if (select.value === 'custom') {
      customWrap.style.display = 'flex';
    } else {
      customWrap.style.display = 'none';
      state.tasbih.presetIndex = parseInt(select.value, 10);
    }
    resetTasbih(false);
    updateTasbihDisplay();
  });

  // Custom inputs live-update display
  ['custom-arabic', 'custom-label', 'custom-target'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateTasbihDisplay);
  });

  // Tap / spacebar to count
  tapBtn.addEventListener('click', incrementTasbih);
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && state.currentSection === 'tasbih') {
      e.preventDefault();
      incrementTasbih();
    }
  });

  resetBtn.addEventListener('click',    () => { resetTasbih(false); updateTasbihDisplay(); });
  resetAllBtn.addEventListener('click', () => { resetTasbih(true);  updateTasbihDisplay(); });
}

function getActivePreset() {
  const select = document.getElementById('dhikr-select');
  if (!select || select.value !== 'custom') {
    return DHIKR_PRESETS[state.tasbih.presetIndex];
  }
  return {
    arabic:  document.getElementById('custom-arabic')?.value.trim()  || '﷽',
    latin:   document.getElementById('custom-label')?.value.trim()   || 'Custom Dhikr',
    english: 'Custom phrase',
    target:  parseInt(document.getElementById('custom-target')?.value, 10) || 33,
  };
}

function incrementTasbih() {
  if (state.tasbih.animating) return;
  const preset = getActivePreset();

  state.tasbih.count++;
  state.tasbih.total++;

  // Animate button
  pulseTasbihBtn();

  // Check completion
  if (state.tasbih.count >= preset.target) {
    state.tasbih.rounds++;
    state.tasbih.count = 0;
    showTasbihComplete();
  }

  updateTasbihDisplay();
}

function pulseTasbihBtn() {
  const btn = document.getElementById('tasbih-btn');
  if (!btn) return;
  state.tasbih.animating = true;
  btn.classList.add('pulse');
  setTimeout(() => {
    btn.classList.remove('pulse');
    state.tasbih.animating = false;
  }, 160);
}

function showTasbihComplete() {
  const el = document.getElementById('tasbih-complete');
  if (!el) return;
  el.style.display = 'flex';
  el.classList.add('pop-in');
  setTimeout(() => {
    el.classList.remove('pop-in');
    setTimeout(() => { el.style.display = 'none'; }, 300);
  }, 2200);
}

function resetTasbih(full = false) {
  state.tasbih.count = 0;
  if (full) {
    state.tasbih.total  = 0;
    state.tasbih.rounds = 0;
  }
  const el = document.getElementById('tasbih-complete');
  if (el) el.style.display = 'none';
}

function updateTasbihDisplay() {
  const preset = getActivePreset();
  const { count, rounds, total } = state.tasbih;
  const target = preset.target;

  // Text
  setText('tasbih-arabic', preset.arabic);
  setText('tasbih-latin',  preset.latin);
  setText('tasbih-meaning', preset.english);
  setText('tasbih-count', count);
  setText('tasbih-target-label', `/ ${target}`);
  setText('stat-rounds', rounds);
  setText('stat-total',  total);

  // Progress ring
  const ring = document.getElementById('ring-fill');
  if (ring) {
    const r = 78;
    const circ = 2 * Math.PI * r;
    const pct  = Math.min(count / target, 1);
    ring.style.strokeDasharray  = circ;
    ring.style.strokeDashoffset = circ * (1 - pct);
  }
}

/* ============================================================
   4. HELPERS
   ============================================================ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ============================================================
   5. NAV: attach data-section to existing buttons
   ============================================================ */
function initNav() {
  document.querySelectorAll('.nav-btn[onclick]').forEach(btn => {
    // Extract section id from old inline onclick="showSection('x')"
    const match = btn.getAttribute('onclick')?.match(/showSection\('(\w+)'\)/);
    if (match) {
      const id = match[1];
      btn.dataset.section = id;
      btn.removeAttribute('onclick');
      btn.addEventListener('click', e => showSection(id, e.currentTarget));
    }
  });
}

/* ============================================================
   6. STYLES injected via JS (search + tasbih UI)
      Keeps CSS in one place while staying external-JS-friendly.
   ============================================================ */
function injectStyles() {
  const css = `
  /* ---- Search Bar ---- */
  #search-wrapper {
    position: relative;
    z-index: 20;
    max-width: 560px;
    margin: 18px auto 0;
    padding: 0 16px;
  }
  #search-bar {
    display: flex;
    align-items: center;
    background: var(--green-800);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 0 14px;
    gap: 10px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  #search-bar:focus-within {
    border-color: var(--border-accent);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.10);
  }
  #search-icon { font-size: 16px; flex-shrink: 0; opacity: 0.6; }
  #search-input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text-main);
    font-family: var(--font-body);
    font-size: 15px;
    padding: 12px 0;
    width: 100%;
  }
  #search-input::placeholder { color: var(--text-dim); font-style: italic; }
  #search-clear {
    display: none;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--text-dim);
    font-size: 13px;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 50%;
    transition: color 0.2s, background 0.2s;
  }
  #search-clear:hover { color: var(--text-main); background: rgba(255,255,255,0.06); }

  #search-results {
    display: none;
    flex-direction: column;
    background: var(--green-800);
    border: 1px solid var(--border-accent);
    border-top: none;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    max-height: 320px;
    overflow-y: auto;
  }
  #search-results.open { display: flex; }

  .search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 16px;
    text-align: left;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-main);
    font-family: var(--font-body);
    font-size: 15px;
    cursor: pointer;
    transition: background 0.18s;
    gap: 12px;
  }
  .search-result-item:last-child { border-bottom: none; }
  .search-result-item:hover,
  .search-result-item:focus { background: rgba(212,168,83,0.08); outline: none; }
  .result-label { flex: 1; }
  .result-label mark { background: rgba(212,168,83,0.28); color: var(--gold-200); border-radius: 2px; padding: 0 2px; }
  .result-section {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dim);
    background: rgba(82,149,106,0.12);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .search-empty {
    padding: 16px;
    color: var(--text-dim);
    font-style: italic;
    font-size: 14px;
  }

  /* ---- Tasbih Section ---- */
  .tasbih-selector-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }
  .tasbih-label {
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-dim);
  }
  .dhikr-select {
    background: var(--green-800);
    border: 1px solid var(--border-accent);
    border-radius: var(--radius-md);
    color: var(--text-main);
    font-family: var(--font-body);
    font-size: 15px;
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    max-width: 300px;
    width: 100%;
    text-align: center;
    transition: border-color 0.2s;
  }
  .dhikr-select:focus { border-color: var(--gold-400); }

  .custom-dhikr-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 360px;
    margin: 0 auto 20px;
  }
  .custom-input {
    background: var(--green-800);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-main);
    font-family: var(--font-body);
    font-size: 15px;
    padding: 9px 14px;
    outline: none;
    width: 100%;
    transition: border-color 0.2s;
  }
  .custom-input:focus { border-color: var(--border-accent); }

  .tasbih-dhikr-card {
    text-align: center;
    background: var(--green-800);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: 28px 24px 22px;
    margin-bottom: 32px;
    transition: border-color 0.3s;
  }
  .tasbih-arabic {
    font-family: var(--font-arabic);
    font-size: clamp(26px, 5vw, 44px);
    color: var(--gold-300);
    line-height: 1.6;
    margin-bottom: 8px;
    text-shadow: 0 0 24px rgba(212,168,83,0.2);
  }
  .tasbih-latin  { font-size: 18px; font-weight: 600; color: var(--text-main); margin-bottom: 4px; }
  .tasbih-meaning { font-style: italic; font-size: 15px; color: var(--text-muted); }

  /* Progress ring */
  .tasbih-counter-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
  }
  .tasbih-progress-ring-wrap {
    position: relative;
    width: 180px;
    height: 180px;
  }
  .progress-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  .ring-track {
    fill: none;
    stroke: var(--green-700);
    stroke-width: 10;
  }
  .ring-fill {
    fill: none;
    stroke: var(--gold-400);
    stroke-width: 10;
    stroke-linecap: round;
    stroke-dasharray: 490;
    stroke-dashoffset: 490;
    transition: stroke-dashoffset 0.35s cubic-bezier(0.4,0,0.2,1);
    filter: drop-shadow(0 0 6px rgba(212,168,83,0.45));
  }
  .tasbih-count-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .tasbih-count {
    font-family: var(--font-arabic);
    font-size: 52px;
    line-height: 1;
    color: var(--gold-300);
    font-weight: 700;
    transition: transform 0.12s;
  }
  .tasbih-target-label {
    font-size: 14px;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* Stats */
  .tasbih-stats {
    display: flex;
    gap: 16px;
  }
  .stat-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--green-800);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    padding: 10px 24px;
    min-width: 90px;
  }
  .stat-value { font-size: 22px; font-weight: 600; color: var(--gold-300); line-height: 1; }
  .stat-name  { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-dim); margin-top: 4px; }

  /* Tap button */
  .tasbih-controls { display: flex; justify-content: center; margin-bottom: 16px; }
  .tasbih-tap-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: clamp(140px, 40vw, 180px);
    height: clamp(140px, 40vw, 180px);
    border-radius: 50%;
    background: linear-gradient(145deg, var(--green-600), var(--green-700));
    border: 2px solid var(--gold-800);
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    transition: transform 0.12s, box-shadow 0.12s, border-color 0.2s;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .tasbih-tap-btn:hover {
    border-color: var(--gold-400);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(212,168,83,0.15);
  }
  .tasbih-tap-btn:active,
  .tasbih-tap-btn.pulse {
    transform: scale(0.93);
    box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  }
  .tasbih-btn-arabic { font-family: var(--font-arabic); font-size: 28px; color: var(--gold-300); line-height: 1; }
  .tasbih-btn-sub    { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); margin-top: 6px; }

  /* Action buttons */
  .tasbih-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .tasbih-action-btn {
    background: var(--green-800);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 13px;
    letter-spacing: 0.08em;
    padding: 8px 20px;
    border-radius: var(--radius-pill);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .tasbih-action-btn:hover { background: var(--green-700); color: var(--text-main); border-color: var(--border-accent); }
  .tasbih-action-btn.danger:hover { border-color: rgba(180,60,60,0.5); color: #e07070; }

  /* Completion flash */
  .tasbih-complete {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: 24px;
    padding: 18px 28px;
    background: linear-gradient(135deg, rgba(30,61,36,0.8), rgba(21,43,26,0.9));
    border: 1px solid var(--green-400);
    border-radius: var(--radius-lg);
    text-align: center;
  }
  .complete-arabic { font-family: var(--font-arabic); font-size: 26px; color: var(--gold-300); }
  .complete-text   { font-size: 16px; font-style: italic; color: var(--text-muted); }

  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.85); }
    60%  { opacity: 1; transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  .pop-in { animation: popIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }

  @media (max-width: 420px) {
    .tasbih-tap-btn { width: 130px; height: 130px; }
    .tasbih-count   { font-size: 42px; }
    .tasbih-progress-ring-wrap { width: 160px; height: 160px; }
  }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  initNav();
  buildSearchUI();
  buildTasbihUI();
  updateTasbihDisplay(); // prime the ring to 0
});
