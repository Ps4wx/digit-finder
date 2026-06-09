// ── Matrix Rain ────────────────────────────────────────
(function () {
  const canvas  = document.getElementById('matrix');
  const ctx     = canvas.getContext('2d');
  const chars   = '0123456789ABCDEF$#@!%&*?<>{}[]\\|/~^';
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 16);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const ch  = chars[Math.floor(Math.random() * chars.length)];
      const hue = Math.random() > 0.97 ? '#ffffff' : '#00ff41';
      ctx.fillStyle = hue;
      ctx.font      = '14px "Share Tech Mono", monospace';
      ctx.fillText(ch, i * 16, drops[i] * 16);

      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 45);
})();
