// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Hero sparkline background
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4FD1C5';

let points = [];
let offset = 0;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.ceil(canvas.offsetWidth / 24) + 2;
  let v = 0.5;
  points = Array.from({ length: count }, () => {
    v = Math.min(0.85, Math.max(0.15, v + (Math.random() - 0.5) * 0.18));
    return v;
  });
}

function draw() {
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  const step = 24;
  ctx.clearRect(0, 0, w, h);

  ctx.beginPath();
  points.forEach((p, i) => {
    const x = i * step - offset;
    const y = h * (0.35 + p * 0.5);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.globalAlpha = 1;

  if (reduceMotion) return;

  offset += 0.3;
  if (offset >= step) {
    offset -= step;
    const last = points[points.length - 1];
    points.shift();
    points.push(Math.min(0.85, Math.max(0.15, last + (Math.random() - 0.5) * 0.18)));
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
  resize();
  if (reduceMotion) draw();
});

resize();
draw();
