/* Sam — personal site interactions */

// ---------- mobile nav ----------
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// ---------- sticky nav border ----------
const nav = document.querySelector('.nav');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 20);
}, { passive: true });

// ---------- cursor glow ----------
const glow = document.getElementById('glow');
addEventListener('pointermove', (e) => {
  glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
}, { passive: true });

// ---------- terminal typing ----------
const TERM_LINES = [
  { t: '$ sam --whoami', c: 'c-d' },
  { t: 'developer + bot maker', c: 'c-g' },
  { t: '' },
  { t: '$ python -m sam.deploy --all', c: 'c-d' },
  { t: '✓ telegram  ·  4 bots  ·  healthy', c: 'c-g' },
  { t: '✓ discord   ·  3 bots  ·  healthy', c: 'c-g' },
  { t: '✓ scrapers  ·  9 sources ·  polling', c: 'c-b' },
  { t: '! 1 job failed  → retrying (2/5)', c: 'c-p' },
  { t: '' },
  { t: '$ cat focus.txt', c: 'c-d' },
  { t: 'turn repetitive work into one command', c: 'c-b' },
  { t: '' },
  { t: '$ _', c: 'c-g', cursor: true },
];

const term = document.getElementById('termBody');
if (term) {
  let li = 0, ci = 0, cur = null;
  const render = () => {
    let html = '';
    for (let i = 0; i < TERM_LINES.length; i++) {
      const L = TERM_LINES[i];
      const isCur = i === li;
      const partial = isCur ? L.t.slice(0, ci) : (i < li ? L.t : '');
      if (i > li) break;
      if (!partial && !(isCur && L.cursor)) continue;
      html += `<span class="${L.c || ''}">${escapeHtml(partial)}</span>`;
      if (isCur && L.cursor && ci >= L.t.length) html += '<span class="cursor"></span>';
      html += '\n';
    }
    term.innerHTML = html;
  };
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const tick = () => {
    if (li >= TERM_LINES.length) {
      // restart the loop after a pause so the terminal feels alive
      setTimeout(() => { li = 0; ci = 0; cur = null; tick(); }, 4200);
      return;
    }
    const line = TERM_LINES[li];
    if (!cur) { render(); cur = 'typing'; setTimeout(tick, 90); return; }
    if (ci < line.t.length) {
      ci++;
      render();
      setTimeout(tick, 22 + Math.random() * 34);
    } else {
      render();
      li++; ci = 0; cur = null;
      setTimeout(tick, line.t ? 220 : 120);
    }
  };
  render();
  setTimeout(tick, 500);
}

// ---------- count-up stats ----------
const counters = document.querySelectorAll('[data-count]');
const animate = (el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const dur = 1400;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// ---------- scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    en.target.querySelectorAll('[data-count]').forEach(animate);
    io.unobserve(en.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px' });

document.querySelectorAll('.section > *, .hero-grid, .hero-stats, .marquee').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = Math.min(i * 55, 260) + 'ms';
  io.observe(el);
});

// contact section always visible once scrolled to
document.querySelectorAll('.contact-inner').forEach((el) => el.classList.add('in'));
