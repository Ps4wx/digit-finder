// ── State ──────────────────────────────────────────────
const state = {
  selectedPos: new Set(),
  allResults:  [],
};

// ── DOM ────────────────────────────────────────────────
const numInput       = document.getElementById('numInput');
const charCount      = document.getElementById('charCount');
const numError       = document.getElementById('numError');
const posSelector    = document.getElementById('posSelector');
const posError       = document.getElementById('posError');
const preview        = document.getElementById('preview');
const resultsSection = document.getElementById('resultsSection');
const crackStatus    = document.getElementById('crackStatus');
const countBadge     = document.getElementById('countBadge');
const searchBox      = document.getElementById('searchBox');
const filterCount    = document.getElementById('filterCount');
const resultsGrid    = document.getElementById('resultsGrid');

// ── Build Position Buttons ─────────────────────────────
function initPosButtons() {
  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type        = 'button';
    btn.className   = 'pos-btn';
    btn.id          = 'pbtn-' + i;
    btn.textContent = i;
    btn.setAttribute('aria-label', 'Position ' + i);
    btn.addEventListener('click', () => togglePos(i));
    posSelector.appendChild(btn);
  }
}

// ── Toggle Position ────────────────────────────────────
function togglePos(pos) {
  const btn = document.getElementById('pbtn-' + pos);
  if (state.selectedPos.has(pos)) {
    state.selectedPos.delete(pos);
    btn.classList.remove('selected');
  } else {
    if (state.selectedPos.size >= 3) return;
    state.selectedPos.add(pos);
    btn.classList.add('selected');
  }
  refreshPosBtns();
  updatePreview();
  posError.classList.remove('show');
}

function refreshPosBtns() {
  const full = state.selectedPos.size >= 3;
  for (let i = 1; i <= 10; i++) {
    const btn = document.getElementById('pbtn-' + i);
    btn.disabled = full && !state.selectedPos.has(i);
  }
}

// ── Number Input ───────────────────────────────────────
numInput.addEventListener('input', () => {
  numInput.value = numInput.value.replace(/\D/g, '');
  charCount.textContent = numInput.value.length + '/10';
  numError.classList.remove('show');
  updatePreview();
});

// ── Preview ────────────────────────────────────────────
function updatePreview() {
  const num    = numInput.value;
  const sorted = getSortedPos();

  if (!num || state.selectedPos.size === 0) {
    preview.innerHTML = '<span class="preview-hint">// Awaiting input...</span>';
    return;
  }

  let html = '';
  for (let i = 0; i < 10; i++) {
    if (sorted.includes(i + 1)) {
      html += '<span class="d-blank">?</span>';
    } else {
      html += '<span class="d-fixed">' + (num[i] || '_') + '</span>';
    }
  }
  preview.innerHTML = html;
}

// ── Calculate ──────────────────────────────────────────
function calculate() {
  const num    = numInput.value.trim();
  const sorted = getSortedPos();
  let valid    = true;

  if (!/^\d{10}$/.test(num)) {
    numError.classList.add('show');
    valid = false;
  } else {
    numError.classList.remove('show');
  }

  if (state.selectedPos.size !== 3) {
    posError.classList.add('show');
    valid = false;
  } else {
    posError.classList.remove('show');
  }

  if (!valid) return;

  // Generate 1000 combinations
  state.allResults = [];
  for (let d1 = 0; d1 <= 9; d1++) {
    for (let d2 = 0; d2 <= 9; d2++) {
      for (let d3 = 0; d3 <= 9; d3++) {
        const arr = num.split('');
        arr[sorted[0] - 1] = String(d1);
        arr[sorted[1] - 1] = String(d2);
        arr[sorted[2] - 1] = String(d3);
        state.allResults.push({ full: arr.join(''), positions: sorted });
      }
    }
  }

  // Animate results appearing
  resultsSection.classList.remove('hidden');
  resultsSection.classList.add('fade-in');

  // Status lines
  const now = new Date();
  const ts  = '[' + String(now.getHours()).padStart(2,'0') + ':'
                  + String(now.getMinutes()).padStart(2,'0') + ':'
                  + String(now.getSeconds()).padStart(2,'0') + ']';

  crackStatus.innerHTML =
    ts + ' Bruteforce initiated...<br>' +
    '<span class="ok">' + ts + ' Target locked: positions [' + sorted.join(', ') + ']</span><br>' +
    '<span class="ok">' + ts + ' Combinations generated: 1000</span><br>' +
    '<span class="ok">' + ts + ' CRACK COMPLETE. All values enumerated.</span>';

  countBadge.textContent = '1000 COMBINATIONS';
  if (searchBox) searchBox.value = '';
  renderResults(state.allResults);

  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── Render ─────────────────────────────────────────────
function renderResults(results) {
  filterCount.textContent = results.length + ' found';
  if (results.length === 0) {
    resultsGrid.innerHTML = '<div class="no-match">// No matches found</div>';
    return;
  }
  resultsGrid.innerHTML = results.map(buildCard).join('');
}

function buildCard(r) {
  let s = '';
  for (let i = 0; i < 10; i++) {
    s += r.positions.includes(i + 1)
      ? '<span class="hi">' + r.full[i] + '</span>'
      : r.full[i];
  }
  return '<div class="result-card">' + s + '</div>';
}

// ── Filter ─────────────────────────────────────────────
function filterResults() {
  const q        = searchBox.value.trim();
  const filtered = q
    ? state.allResults.filter(r => r.full.includes(q))
    : state.allResults;
  filterCount.textContent = filtered.length + ' found';
  resultsGrid.innerHTML   = filtered.length
    ? filtered.map(buildCard).join('')
    : '<div class="no-match">// No matches found</div>';
}

// ── Reset ──────────────────────────────────────────────
function resetAll() {
  numInput.value = '';
  charCount.textContent = '0/10';
  numError.classList.remove('show');
  posError.classList.remove('show');
  state.selectedPos.clear();
  state.allResults = [];
  for (let i = 1; i <= 10; i++) {
    const btn = document.getElementById('pbtn-' + i);
    btn.classList.remove('selected');
    btn.disabled = false;
  }
  preview.innerHTML = '<span class="preview-hint">// Awaiting input...</span>';
  resultsSection.classList.add('hidden');
  numInput.focus();
}

// ── Keyboard ───────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') calculate();
});

// ── Helpers ────────────────────────────────────────────
function getSortedPos() {
  return [...state.selectedPos].sort((a, b) => a - b);
}

// ── Boot ───────────────────────────────────────────────
initPosButtons();
