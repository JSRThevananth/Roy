'use strict';
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Copy email
  const btn = document.getElementById('copy'), toast = document.getElementById('toast'), mail = document.getElementById('mail');
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(mail.textContent.trim()); toast.textContent = 'Email copied.'; }
    catch { const r = document.createRange(); r.selectNodeContents(mail); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast.textContent = 'Email selected. Press Ctrl+C or ⌘C to copy.'; }
    setTimeout(() => { toast.textContent = ''; }, 3000);
  });

  // Section lift on enter (content stays visible at rest)
  if (!reduce && 'IntersectionObserver' in window) {
    const els = [...document.querySelectorAll('.rv')].filter(e => e.getBoundingClientRect().top > innerHeight);
    els.forEach(e => e.classList.add('lift'));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.remove('lift'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
    const flow = document.getElementById('flow');
    const fo = new IntersectionObserver(es => { if (es[0].isIntersecting) { [...flow.children].forEach((li, i) => li.style.transitionDelay = (i * 0.12) + 's'); flow.classList.add('run'); fo.disconnect(); } }, { threshold: .4 });
    fo.observe(flow);
  } else { document.getElementById('flow').classList.add('run'); }


  // ---- Build-in intro (as in the reference reel) ----
  const hero = document.querySelector('.hero');
  const CUR = '<svg class="cur" viewBox="0 0 24 24"><path d="M3 2l17 9-7.5 1.8L16 21l-3 1.2-3.3-8.1L4 19z" fill="COL" stroke="#0b0b0d" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const CC = ['#56c8ff', '#ffffff', '#a9b8ff', '#8fd9ff', '#2f5bea'];
  function build() {
    if (reduce || !hero.animate) return;
    hero.querySelector('.build')?.remove();
    const ov = document.createElement('div'); ov.className = 'build'; ov.setAttribute('aria-hidden', 'true'); hero.appendChild(ov);
    const H = hero.getBoundingClientRect();
    const items = [
      ['.hello', 'TEXT · Hello'], ['.hero h1', 'H1 · Name'], ['.role', 'TEXT · Role'], ['.hero .lede', 'P · Summary'],
      ['.hero .cta', 'FRAME · Buttons'], ['.portrait img', 'IMAGE · Portrait', true], ['.portrait .stamp', 'BADGE'], ['.stats', 'FRAME · Stats']
    ].map(([q, label, ph]) => ({ el: hero.querySelector(q), label, ph })).filter(o => o.el && o.el.getBoundingClientRect().width);
    const R = el => { const r = el.getBoundingClientRect(); return { x: r.left - H.left, y: r.top - H.top, w: r.width, h: r.height }; };
    // guides
    const ys = new Set(), xs = new Set();
    items.forEach(o => { const r = R(o.el); ys.add(Math.round(r.y)); xs.add(Math.round(r.x)); });
    [...ys].slice(0, 5).forEach((y, i) => { const g = document.createElement('div'); g.className = 'g h'; g.style.top = y + 'px'; ov.appendChild(g);
      g.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 520, delay: 80 + i * 70, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'backwards' }); });
    [...xs].slice(0, 3).forEach((x, i) => { const g = document.createElement('div'); g.className = 'g v'; g.style.left = x + 'px'; ov.appendChild(g);
      g.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 520, delay: 160 + i * 90, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'backwards' });
      [...ys].slice(0, 5).forEach(y => { const p = document.createElement('span'); p.className = 'plus'; p.textContent = '+'; p.style.left = x + 'px'; p.style.top = y + 'px'; ov.appendChild(p);
        p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 520 + i * 90, fill: 'backwards' }); }); });
    // ghost word slides in behind
    const gw = hero.querySelector('.ghostword');
    gw.animate([{ opacity: 0, transform: 'translateX(-6%)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 1500, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'backwards' });
    // each element: box appears, cursor flies in, grabs the corner and drags it into place
    let end = 0;
    items.forEach((o, i) => {
      const r = R(o.el), t = 420 + i * 200, fly = 380, drag = 650;
      const dx = (i % 2 ? 1 : -1) * (60 + Math.random() * 90), dy = (Math.random() - .5) * 120;
      const box = document.createElement('div'); box.className = 'sel' + (o.ph ? ' ph' : '');
      box.style.cssText = `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
      box.innerHTML = '<i></i><i></i><i></i><i></i><b>' + o.label + '</b>'; ov.appendChild(box);
      ov.insertAdjacentHTML('beforeend', CUR.replace('COL', CC[i % CC.length]));
      const cur = ov.lastElementChild;
      const cx = r.x + r.w - 6, cy = r.y + r.h - 6;   // grab the bottom-right handle
      const from = `translate(${dx}px,${dy}px)`;
      const ease = 'cubic-bezier(.45,0,.2,1)';
      box.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: from, offset: .35 }, { opacity: 1, transform: 'none' }], { duration: fly + drag, delay: t, easing: ease, fill: 'backwards' });
      o.el.animate([{ opacity: 0, transform: from }, { opacity: o.ph ? 0 : .9, transform: from, offset: .35 }, { opacity: o.ph ? 0 : 1, transform: 'none' }],
        { duration: fly + drag, delay: t, easing: ease, fill: 'backwards' });
      if (o.ph) { o.el.animate([{ opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'none' }], { duration: 600, delay: t + fly + drag, fill: 'backwards' });
        box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: t + fly + drag + 100, fill: 'forwards' }); }
      const sx = Math.random() < .5 ? -80 : H.width + 40, sy = Math.random() * H.height;
      cur.animate([
        { transform: `translate(${sx}px,${sy}px)`, opacity: 0 },
        { transform: `translate(${cx + dx}px,${cy + dy}px)`, opacity: 1, offset: .35 },
        { transform: `translate(${cx}px,${cy}px)`, opacity: 1, offset: .82 },
        { transform: `translate(${cx + 26}px,${cy + 30}px)`, opacity: 0 }
      ], { duration: (fly + drag) * 1.25, delay: t, easing: ease, fill: 'both' });
      end = Math.max(end, t + (fly + drag) * 1.25);
    });
    ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: end + 250, fill: 'forwards' }).finished.then(() => ov.remove()).catch(() => {});
  }
  build();
  document.getElementById('rebuild').addEventListener('click', build);

  // Arrow flock: cursor-shaped arrows that chase the pointer, orbit it in a ring,
  // orbit the hero stamp on load, the contact card and the closing "R" monogram when in view.
  if (reduce) return;
  const c = document.getElementById('fx'), x = c.getContext('2d');
  const COLS = ['#56c8ff', '#8fd9ff', '#ffffff', '#2f5bea', '#a9b8ff', '#c7f0ff'];
  let w, h, dpr, flock = [];
  const make = n => Array.from({ length: n }, (_, i) => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2,
    ph: (i / n) * Math.PI * 2, rj: .82 + Math.random() * .36, s: 7 + Math.random() * 5,
    col: COLS[i % COLS.length], tr: []
  }));
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!flock.length) flock = make(w < 600 ? 28 : 46); };
  size(); addEventListener('resize', size);

  const ptr = { x: 0, y: 0, t: -1e9 };
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now(); }, { passive: true });
  addEventListener('pointerdown', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now(); }, { passive: true });

  const stamp = document.querySelector('.portrait .stamp'), card = document.querySelector('.card'), mono = document.getElementById('mono');
  const t0 = performance.now();
  const ring = el => { if (!el) return null; const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > h || r.width === 0) return null;
    const cy = r.top + r.height / 2; if (cy < h * .1 || cy > h * .9) return null;
    return { x: r.left + r.width / 2, y: cy, r: Math.min(Math.max(r.width, r.height) * .62, 260) }; };

  function target(now) {
    if (now - ptr.t < 1800) return { x: ptr.x, y: ptr.y, r: 46 };          // follow the pointer
    if (now - t0 > 3000 && now - t0 < 6200) { const g = ring(stamp); if (g) return g; }        // intro: orbit the QA stamp
    return ring(mono) || ring(card) || null;                                 // closing ring, else free flight
  }

  let on = true; document.addEventListener('visibilitychange', () => { on = !document.hidden; if (on) requestAnimationFrame(tick); });
  function arrow(s) { // classic mouse-cursor silhouette, pointing up (-y)
    x.beginPath(); x.moveTo(0, -s); x.lineTo(s * .62, s * .42); x.lineTo(s * .16, s * .3); x.lineTo(s * .34, s * .95);
    x.lineTo(s * .12, s); x.lineTo(-s * .06, s * .38); x.lineTo(-s * .45, s * .62); x.closePath(); }

  function tick(now) {
    if (!on) return;
    x.clearRect(0, 0, w, h);
    const T = target(now), spin = now * .0011;
    for (const p of flock) {
      let ax, ay;
      if (T) {
        const a = p.ph + spin, R = T.r * p.rj;
        ax = (T.x + Math.cos(a) * R - p.x) * .012; ay = (T.y + Math.sin(a) * R - p.y) * .012;
      } else { // free flight: gentle wander with wrap-around
        p.ph += (Math.random() - .5) * .3;
        ax = Math.cos(p.ph) * .05; ay = Math.sin(p.ph) * .05;
      }
      p.vx = (p.vx + ax) * .93; p.vy = (p.vy + ay) * .93;
      const sp = Math.hypot(p.vx, p.vy), max = T ? 9 : 1.6;
      if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.x += p.vx; p.y += p.vy;
      if (!T) { if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20; if (p.y < -20) p.y = h + 20; if (p.y > h + 20) p.y = -20; }
      p.tr.push(p.x, p.y); if (p.tr.length > 12) p.tr.splice(0, 2);
      // tail
      x.strokeStyle = p.col; x.globalAlpha = .28; x.lineWidth = 1.4; x.beginPath();
      for (let i = 0; i < p.tr.length; i += 2) i ? x.lineTo(p.tr[i], p.tr[i + 1]) : x.moveTo(p.tr[i], p.tr[i + 1]);
      x.stroke();
      // body
      x.globalAlpha = .95; x.save(); x.translate(p.x, p.y); x.rotate(Math.atan2(p.vy, p.vx) + Math.PI / 2);
      arrow(p.s); x.fillStyle = p.col; x.fill(); x.lineWidth = 1; x.strokeStyle = 'rgba(11,11,13,.8)'; x.stroke(); x.restore();
    }
    x.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
