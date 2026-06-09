// ── Boot Screen ────────────────────────────────────────
(function () {
  const bootLines = [
    { text: '[INIT]  Loading NUM_CRACK kernel...', cls: 'ok',   delay: 120 },
    { text: '[INIT]  Mounting filesystem...', cls: 'ok',        delay: 220 },
    { text: '[SYS]   CPU: Brute-Force Engine v2.0', cls: 'ok', delay: 340 },
    { text: '[SYS]   RAM: Combination Matrix Ready', cls: 'ok',delay: 460 },
    { text: '[NET]   Network adapter... BYPASSED', cls: 'warn', delay: 610 },
    { text: '[SEC]   Firewall... DISABLED', cls: 'warn',        delay: 760 },
    { text: '[MOD]   Loading digit-crack module...', cls: 'ok', delay: 900 },
    { text: '[MOD]   Combination engine... ARMED', cls: 'ok',  delay: 1050 },
    { text: '[DB]    10^3 lookup table compiled', cls: 'ok',    delay: 1180 },
    { text: '[AUTH]  Identity check... SKIPPED', cls: 'warn',  delay: 1320 },
    { text: '[SYS]   All systems nominal.', cls: 'ok',          delay: 1500 },
    { text: '[BOOT]  Launching interface...', cls: 'ok',        delay: 1680 },
  ];

  const linesEl = document.getElementById('bootLines');
  const barEl   = document.getElementById('bootBar');
  const pctEl   = document.getElementById('bootPct');
  const bootEl  = document.getElementById('bootScreen');
  const appEl   = document.getElementById('app');

  const totalDuration = 2400;

  // Print lines
  bootLines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = cls;
      line.textContent = text;
      linesEl.appendChild(line);
      linesEl.scrollTop = linesEl.scrollHeight;
    }, delay);
  });

  // Progress bar
  const startTime = Date.now();
  function animateBar() {
    const elapsed = Date.now() - startTime;
    const pct     = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    barEl.style.width = pct + '%';
    pctEl.textContent = pct + '%';
    if (pct < 100) requestAnimationFrame(animateBar);
  }
  requestAnimationFrame(animateBar);

  // Launch app
  setTimeout(() => {
    bootEl.style.transition = 'opacity 0.5s ease';
    bootEl.style.opacity    = '0';
    setTimeout(() => {
      bootEl.style.display = 'none';
      appEl.classList.remove('hidden');
      startClock();
    }, 500);
  }, totalDuration);
})();

// ── Clock ───────────────────────────────────────────────
function startClock() {
  const el = document.getElementById('clock');
  function tick() {
    const now = new Date();
    const h   = String(now.getHours()).padStart(2, '0');
    const m   = String(now.getMinutes()).padStart(2, '0');
    const s   = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `[${h}:${m}:${s}]`;
  }
  tick();
  setInterval(tick, 1000);
}
