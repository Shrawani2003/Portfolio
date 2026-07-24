// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Animated sparkline in hero ----------
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let width, height, points, progress;

function resize() {
  width = canvas.width = canvas.offsetWidth * devicePixelRatio;
  height = canvas.height = canvas.offsetHeight * devicePixelRatio;
  generatePoints();
}

function generatePoints() {
  const count = 9;
  points = [];
  for (let i = 0; i < count; i++) {
    const x = (width / (count - 1)) * i;
    const baseline = height * 0.62;
    const amplitude = height * 0.28;
    const y = baseline - Math.abs(Math.sin(i * 1.3 + 1)) * amplitude - (i / count) * height * 0.15;
    points.push({ x, y });
  }
}

function drawStatic() {
  ctx.clearRect(0, 0, width, height);
  drawLine(1);
}

function drawLine(t) {
  ctx.clearRect(0, 0, width, height);

  const totalLen = points.length - 1;
  const visibleUpTo = totalLen * t;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i <= Math.ceil(visibleUpTo); i++) {
    const p = points[Math.min(i, totalLen)];
    if (i > visibleUpTo) {
      const prev = points[i - 1];
      const frac = visibleUpTo - (i - 1);
      const ix = prev.x + (p.x - prev.x) * frac;
      const iy = prev.y + (p.y - prev.y) * frac;
      ctx.lineTo(ix, iy);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }

  ctx.strokeStyle = '#4FD1C5';
  ctx.lineWidth = 2 * devicePixelRatio;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // fill under curve
  const lastVisible = points[Math.min(Math.ceil(visibleUpTo), totalLen)];
  ctx.lineTo(lastVisible.x, height);
  ctx.lineTo(points[0].x, height);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(79, 209, 197, 0.18)');
  gradient.addColorStop(1, 'rgba(79, 209, 197, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // dots on completed points
  points.forEach((p, i) => {
    if (i <= visibleUpTo) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = i === points.length - 1 ? '#F2B035' : '#4FD1C5';
      ctx.fill();
    }
  });
}

function animate() {
  progress += 0.006;
  if (progress > 1.15) progress = 1.15;
  drawLine(Math.min(progress, 1));
  if (progress < 1) requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  if (prefersReducedMotion) drawStatic();
});

resize();
if (prefersReducedMotion) {
  drawStatic();
} else {
  progress = 0;
  requestAnimationFrame(animate);
}

// ---------- Scroll reveal for sections ----------
const revealTargets = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach(el => {
  if (!prefersReducedMotion) {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  }
  observer.observe(el);
});
