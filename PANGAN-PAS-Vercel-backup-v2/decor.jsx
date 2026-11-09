// PANGAN PAS — decorative & playful layer ("Pasar Pagi Nusantara").
// Purely visual: no data, routing or app logic lives here.
import React from 'react';

const useUid = () => React.useId().replace(/[^a-zA-Z0-9]/g, '');
const finePointer = () => typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

/* Pointer parallax: writes --px / --py (-1..1) on the element. */
export function useParallax(ref) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    let raf = 0, x = 0, y = 0;
    const onMove = e => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.setProperty('--px', x.toFixed(3)); el.style.setProperty('--py', y.toFixed(3)); });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [ref]);
}

/* ---------- Global interaction layer: 3D tilt cards + cursor glow ---------- */
const TILT = '.bento-tile,.about-step,.reading-card,.trend-index-card,.trend-chart-card,.market-option,.community-submission,.commodity-row,.landing-proof>div';
export function InteractionLayer() {
  const glow = React.useRef(null);
  React.useEffect(() => {
    if (!finePointer()) return;
    let current = null, raf = 0, last = null;
    const reset = el => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.style.removeProperty('--gx'); el.style.removeProperty('--gy'); el.classList.remove('is-tilting'); };
    const frame = () => {
      raf = 0;
      const e = last; if (!e) return;
      if (glow.current) glow.current.style.transform = `translate3d(${e.clientX - 160}px,${e.clientY - 160}px,0)`;
      const el = e.target instanceof Element ? e.target.closest(TILT) : null;
      if (current && current !== el) { reset(current); current = null; }
      if (!el) return;
      current = el;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.classList.add('is-tilting');
      el.style.setProperty('--rx', ((.5 - py) * 7).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((px - .5) * 9).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    };
    const onMove = e => { last = e; if (!raf) raf = requestAnimationFrame(frame); };
    const onLeave = () => { if (current) reset(current); current = null; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}

/* ---------- Ambient colourful background ---------- */
export function Ambient() {
  return <div className="ambient" aria-hidden="true">
    <span className="blob b1" /><span className="blob b2" /><span className="blob b3" /><span className="blob b4" />
    {Array.from({ length: 10 }, (_, i) => <span key={i} className={`grain g${i % 3}`} style={{ '--x': `${(i * 23 + 7) % 100}%`, '--d': `${-i * 2.3}s`, '--t': `${15 + (i % 4) * 4}s` }} />)}
  </div>;
}

/* ---------- 3D-style food illustrations ---------- */
export function FoodSvg({ kind }) {
  const id = useUid();
  switch (kind) {
    case 'rice': return <svg viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`${id}r`} cx=".35" cy=".3" r=".8"><stop offset="0" stopColor="#fff" /><stop offset=".7" stopColor="#f6f1e4" /><stop offset="1" stopColor="#ddd3bb" /></radialGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5ab8f0" /><stop offset="1" stopColor="#2a78c2" /></linearGradient>
      </defs>
      <g className="steam"><path d="M40 20 C 36 13 44 9 40 2" /><path d="M58 18 C 54 11 62 7 58 0" /></g>
      <path d="M16 52 Q18 24 50 22 Q82 24 84 52 Z" fill={`url(#${id}r)`} />
      {[[34, 40], [44, 32], [56, 36], [64, 44], [46, 46], [28, 48], [70, 50]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3.2" ry="1.6" fill="#fffdf6" stroke="#e7ddc4" strokeWidth=".6" transform={`rotate(${i * 40} ${x} ${y})`} />)}
      <path d="M10 52 Q50 108 90 52 Z" fill={`url(#${id}b)`} />
      <ellipse cx="50" cy="52" rx="40" ry="7" fill="#bfe4fb" />
      <path d="M22 62 Q34 80 52 84" stroke="#fff" strokeOpacity=".5" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M32 70 h6 M47 74 h6 M62 70 h6" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
    </svg>;
    case 'sack': return <svg viewBox="0 0 100 100">
      <defs><linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3dcae" /><stop offset=".6" stopColor="#dfba7a" /><stop offset="1" stopColor="#b98b49" /></linearGradient></defs>
      <path d="M26 30 C 18 50 16 76 24 90 C 40 96 60 96 76 90 C 84 76 82 50 74 30 Z" fill={`url(#${id}s)`} />
      <path d="M26 30 C 34 22 40 26 50 22 C 60 26 66 22 74 30 C 66 36 34 36 26 30 Z" fill="#fff8e6" />
      {[[42, 26], [50, 24], [58, 27], [46, 30], [54, 30]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.3" fill="#fff" stroke="#e5d8b8" strokeWidth=".5" transform={`rotate(${i * 50} ${x} ${y})`} />)}
      <rect x="30" y="54" width="40" height="20" rx="6" fill="#1f8a5b" />
      <path d="M38 64 h24" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 40 C 30 56 30 72 34 84" stroke="#fff" strokeOpacity=".45" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>;
    case 'sugar': return <svg viewBox="0 0 100 100">
      {[[30, 58], [62, 58], [46, 30]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
        <path d="M0 0 L16 -9 L32 0 L16 9 Z" fill="#ffffff" /><path d="M0 0 L16 9 L16 30 L0 21 Z" fill="#dfe9f5" /><path d="M32 0 L16 9 L16 30 L32 21 Z" fill="#c4d4ea" />
        <circle cx="10" cy="2" r="1" fill="#c4d4ea" /><circle cx="20" cy="-2" r="1" fill="#c4d4ea" /><circle cx="6" cy="14" r="1" fill="#fff" />
      </g>)}
    </svg>;
    case 'oil': return <svg viewBox="0 0 100 100">
      <defs><linearGradient id={`${id}o`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffe27a" /><stop offset=".5" stopColor="#ffc542" /><stop offset="1" stopColor="#e9a321" /></linearGradient></defs>
      <rect x="42" y="6" width="16" height="12" rx="3" fill="#1f8a5b" />
      <path d="M44 18 h12 l4 12 C 70 36 72 46 72 56 L 72 86 C 72 92 68 95 62 95 L 38 95 C 32 95 28 92 28 86 L 28 56 C 28 46 30 36 40 30 Z" fill={`url(#${id}o)`} />
      <rect x="34" y="58" width="32" height="20" rx="5" fill="#fff" fillOpacity=".9" />
      <path d="M44 68 C 46 62 54 62 56 68 C 54 74 46 74 44 68 Z" fill="#7cc06f" />
      <path d="M35 44 C 33 56 33 74 35 86" stroke="#fff" strokeOpacity=".6" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>;
    case 'egg': return <svg viewBox="0 0 100 100">
      <defs><radialGradient id={`${id}e`} cx=".38" cy=".32" r=".75"><stop offset="0" stopColor="#fffaf0" /><stop offset=".6" stopColor="#f6dfbf" /><stop offset="1" stopColor="#d9a676" /></radialGradient></defs>
      <path d="M44 14 C 64 14 76 46 76 62 C 76 82 62 92 44 92 C 26 92 14 82 14 62 C 14 46 24 14 44 14 Z" fill={`url(#${id}e)`} transform="rotate(-10 44 52)" />
      <path d="M70 34 C 84 34 92 58 92 70 C 92 84 82 92 70 92 C 62 92 56 88 54 82 C 66 76 72 60 70 34 Z" fill="#f3d2a8" />
      <ellipse cx="32" cy="38" rx="6" ry="11" fill="#fff" fillOpacity=".75" transform="rotate(14 32 38)" />
    </svg>;
    case 'chicken': return <svg viewBox="0 0 100 100">
      <defs><radialGradient id={`${id}c`} cx=".35" cy=".3" r=".85"><stop offset="0" stopColor="#ffc38a" /><stop offset=".55" stopColor="#e9893f" /><stop offset="1" stopColor="#b85c22" /></radialGradient></defs>
      <path d="M58 14 C 82 14 92 36 84 54 C 76 70 58 70 50 64 L 34 78 Z" fill={`url(#${id}c)`} />
      <rect x="20" y="70" width="22" height="9" rx="4.5" fill="#fff6e8" transform="rotate(-42 31 74)" />
      <circle cx="18" cy="80" r="7" fill="#fff6e8" /><circle cx="24" cy="88" r="7" fill="#fff6e8" />
      <ellipse cx="66" cy="28" rx="9" ry="5" fill="#fff" fillOpacity=".45" transform="rotate(-20 66 28)" />
    </svg>;
    case 'beef': return <svg viewBox="0 0 100 100">
      <defs><radialGradient id={`${id}m`} cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#ff8f8f" /><stop offset=".6" stopColor="#e2464f" /><stop offset="1" stopColor="#a8242f" /></radialGradient></defs>
      <path d="M18 44 C 18 22 46 14 66 20 C 88 26 92 52 80 70 C 68 88 30 90 20 72 C 16 64 18 54 18 44 Z" fill="#fff1ea" />
      <path d="M24 46 C 24 28 48 22 64 26 C 82 32 84 52 74 66 C 64 80 34 82 26 68 C 22 62 24 54 24 46 Z" fill={`url(#${id}m)`} />
      <path d="M36 40 C 46 48 56 40 64 50 M34 58 C 44 62 52 56 62 64" stroke="#ffd2d2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="58" cy="44" r="6" fill="#fff1ea" />
    </svg>;
    case 'chili': case 'rawit': {
      const green = kind === 'rawit';
      return <svg viewBox="0 0 100 100">
        <defs><linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={green ? '#ff9b6b' : '#ff8a6b'} /><stop offset=".55" stopColor={green ? '#f0462e' : '#ec4b38'} /><stop offset="1" stopColor="#b8261f" /></linearGradient></defs>
        {green && <g transform="translate(26 -6) rotate(18 50 50) scale(.75)"><path d="M34 28 C 22 52 40 84 84 90 C 64 80 52 62 50 34 Z" fill="#5fbf4f" /><path d="M30 30 C 34 22 46 22 52 32 C 46 30 38 30 30 30 Z" fill="#3f8f3f" /></g>}
        <g transform={green ? 'translate(-6 8) scale(.85)' : ''}>
          <path d="M34 28 C 22 52 40 84 84 90 C 64 80 52 62 50 34 Z" fill={`url(#${id}c)`} />
          <path d="M40 36 C 36 52 46 70 64 80" stroke="#fff" strokeOpacity=".55" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M30 30 C 34 22 46 22 52 32 C 46 30 38 30 30 30 Z" fill="#4caa5a" />
          <path d="M42 26 C 40 18 44 10 54 8" stroke="#3f8f4b" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </g>
      </svg>;
    }
    case 'corn': return <svg viewBox="0 0 100 100">
      <defs>
        <linearGradient id={`${id}k`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffe68a" /><stop offset=".5" stopColor="#ffd04a" /><stop offset="1" stopColor="#e9a821" /></linearGradient>
        <pattern id={`${id}p`} width="7" height="7" patternUnits="userSpaceOnUse"><rect x=".8" y=".8" width="5.4" height="5.4" rx="2.4" fill="#fff4b8" fillOpacity=".55" /></pattern>
      </defs>
      <g transform="rotate(-28 50 50)">
        <path d="M50 8 C 66 8 70 34 68 60 C 66 80 58 88 50 88 C 42 88 34 80 32 60 C 30 34 34 8 50 8 Z" fill={`url(#${id}k)`} />
        <path d="M50 8 C 66 8 70 34 68 60 C 66 80 58 88 50 88 C 42 88 34 80 32 60 C 30 34 34 8 50 8 Z" fill={`url(#${id}p)`} />
        <path d="M50 96 C 30 92 22 70 26 46 C 34 64 42 80 50 96 Z" fill="#5db86b" />
        <path d="M50 96 C 72 92 80 70 74 44 C 66 64 58 80 50 96 Z" fill="#3f9a55" />
        <path d="M40 18 C 38 30 38 44 40 58" stroke="#fff" strokeOpacity=".6" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>;
    case 'shallot': return <svg viewBox="0 0 100 100">
      <defs><radialGradient id={`${id}s`} cx=".35" cy=".4" r=".8"><stop offset="0" stopColor="#f39ab4" /><stop offset=".6" stopColor="#c8507a" /><stop offset="1" stopColor="#8b2c55" /></radialGradient></defs>
      <path d="M50 26 C 78 34 88 56 80 74 C 72 90 28 90 20 74 C 12 56 22 34 50 26 Z" fill={`url(#${id}s)`} />
      <path d="M50 28 C 40 46 40 70 48 88 M50 28 C 62 46 64 70 56 88" stroke="#7a2148" strokeOpacity=".35" strokeWidth="1.6" fill="none" />
      <path d="M50 28 C 46 18 48 10 52 4 M50 28 C 56 18 60 14 66 10" stroke="#5aaa5e" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="52" rx="5" ry="10" fill="#fff" fillOpacity=".45" transform="rotate(18 34 52)" />
    </svg>;
    case 'garlic': return <svg viewBox="0 0 100 100">
      <defs><radialGradient id={`${id}g`} cx=".35" cy=".35" r=".85"><stop offset="0" stopColor="#fff" /><stop offset=".65" stopColor="#f3ece1" /><stop offset="1" stopColor="#d6c7b2" /></radialGradient></defs>
      <path d="M50 18 C 60 30 86 38 84 64 C 82 84 64 90 50 90 C 36 90 18 84 16 64 C 14 38 40 30 50 18 Z" fill={`url(#${id}g)`} />
      <path d="M50 22 C 40 40 36 66 42 88 M50 22 C 62 40 66 66 58 88 M50 22 C 50 46 50 70 50 90" stroke="#c9b79c" strokeWidth="1.5" fill="none" />
      <path d="M50 20 C 48 12 50 8 54 4" stroke="#b9a37b" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="56" rx="5" ry="11" fill="#fff" fillOpacity=".8" transform="rotate(14 32 56)" />
    </svg>;
    default: return <svg viewBox="0 0 100 100">
      <path d="M18 84 C 14 46 40 16 86 14 C 86 56 60 84 18 84 Z" fill="#5fbf6c" />
      <path d="M20 82 C 40 62 58 42 80 20" stroke="#eaffdf" strokeOpacity=".7" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>;
  }
}

const FOOD = {
  'Beras medium': ['rice', 'sun'], 'Beras premium': ['sack', 'sun'], 'Gula pasir': ['sugar', 'sky'],
  'Minyak goreng': ['oil', 'sun'], 'Telur ayam': ['egg', 'peach'], 'Daging ayam ras': ['chicken', 'coral'],
  'Daging sapi': ['beef', 'coral'], 'Bawang merah': ['shallot', 'ube'], 'Bawang putih': ['garlic', 'sky'],
  'Cabai merah': ['chili', 'coral'], 'Cabai rawit merah': ['rawit', 'leaf'], 'Jagung pipilan': ['corn', 'sun'],
};
export function FoodIcon({ name, className = '' }) {
  const [kind, tint] = FOOD[name] || ['leaf', 'leaf'];
  return <span className={`food-icon tint-${tint} ${className}`} aria-hidden="true"><span className="food-icon-inner"><FoodSvg kind={kind} /></span></span>;
}

/* ---------- Food marquee (tidy, endless) ---------- */
export function FoodMarquee({ items = [] }) {
  const rows = [items, [...items].reverse()];
  return <div className="food-marquee" aria-hidden="true">
    {rows.map((row, r) => <div key={r} className={`marquee-row ${r ? 'reverse' : ''}`}>
      <div className="marquee-track">
        {[...row, ...row].map((name, i) => <span key={i} className="marquee-chip"><FoodIcon name={name} /><b>{name}</b></span>)}
      </div>
    </div>)}
  </div>;
}

/* ---------- Farmer avatar: eyes follow the cursor ---------- */
export function FarmerAvatar({ variant = 'pak', className = '' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    let raf = 0, e0 = null;
    const onMove = e => { e0 = e; if (!raf) raf = requestAnimationFrame(() => {
      raf = 0; const r = el.getBoundingClientRect(); const dx = e0.clientX - (r.left + r.width / 2), dy = e0.clientY - (r.top + r.height / 2); const d = Math.hypot(dx, dy) || 1;
      el.style.setProperty('--ex', (dx / d * 2.6).toFixed(2)); el.style.setProperty('--ey', (dy / d * 2.2).toFixed(2));
    }); };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);
  const shirt = { pak: '#ff6b4a', bu: '#9a7bf5', anak: '#5ab8f0' }[variant] || '#ff6b4a';
  const bg = { pak: '#ffe1d8', bu: '#eee8ff', anak: '#ddf1ff' }[variant] || '#ffe1d8';
  return <span ref={ref} className={`farmer-avatar fa-${variant} ${className}`} aria-hidden="true">
    <svg viewBox="0 0 120 120" focusable="false">
      <circle cx="60" cy="62" r="54" fill={bg} />
      <g className="fa-body">
        <path d="M24 120 C 26 92 40 82 60 82 C 80 82 94 92 96 120 Z" fill={shirt} />
        <path d="M50 84 L60 98 L70 84" fill="#fff" fillOpacity=".85" />
        <g className="fa-hand"><path d="M94 104 C 104 92 106 80 102 70" stroke={shirt} strokeWidth="11" fill="none" strokeLinecap="round" /><circle cx="102" cy="66" r="7" fill="#c98858" /></g>
        <rect x="52" y="70" width="16" height="14" rx="6" fill="#b97a4c" />
        <circle cx="60" cy="58" r="22" fill="#d39466" />
        {variant === 'bu' && <path d="M38 58 C 36 40 46 32 60 32 C 74 32 84 40 82 58 C 80 50 72 46 60 46 C 48 46 40 50 38 58 Z" fill="#3b2a24" />}
        <g className="fa-eyes">
          <ellipse cx="51" cy="60" rx="3.4" ry="4" fill="#1e2a22" /><ellipse cx="69" cy="60" rx="3.4" ry="4" fill="#1e2a22" />
          <circle cx="52" cy="58.6" r="1.2" fill="#fff" /><circle cx="70" cy="58.6" r="1.2" fill="#fff" />
        </g>
        <ellipse cx="45" cy="68" rx="4.6" ry="2.6" fill="#ff8a7a" fillOpacity=".55" /><ellipse cx="75" cy="68" rx="4.6" ry="2.6" fill="#ff8a7a" fillOpacity=".55" />
        <path d="M53 70 Q60 76 67 70" stroke="#1e2a22" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {variant === 'pak' && <path d="M50 66 Q60 63 70 66" stroke="#3b2a24" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
        <g className="fa-hat">
          <path d="M18 46 L60 14 L102 46 Q60 56 18 46 Z" fill="#f2cf7c" />
          <path d="M18 46 Q60 56 102 46" stroke="#c99a3e" strokeWidth="2" fill="none" />
          <path d="M34 42 L60 18 M46 46 L60 18 M74 46 L60 18 M86 42 L60 18" stroke="#c99a3e" strokeWidth="1.4" opacity=".6" />
        </g>
      </g>
    </svg>
  </span>;
}

/* ---------- The interactive rice-field world ---------- */
const LINES = {
  pak: ['Halo! Lagi tanam padi 🌱', 'Cek harga beras dulu, yuk!', 'Panen bulan depan 🌾'],
  bu: ['Sayur segar dari kebun 🥬', 'Cabai lagi naik, hemat ya 🌶️', 'Mampir ke pasar pagi!'],
  kerbau: ['Mooo~ 🐃', 'Bajak sawah dulu…', 'Lumpurnya enak 😄'],
  anak: ['Layanganku tinggi! 🪁', 'Wiii~ anginnya kencang!', 'Ayo main ke sawah!'],
};
function Bubble({ show, x, y, text, flip }) {
  if (!show) return null;
  const w = Math.max(150, text.length * 8.6 + 34);
  return <g className="scene-bubble" transform={`translate(${x} ${y})`}>
    <g className="bubble-pop">
      <rect x={flip ? -w + 20 : -20} y="-58" width={w} height="44" rx="22" />
      <path d={flip ? 'M2 -16 L14 -2 L18 -16 Z' : 'M-2 -16 L-14 -2 L-18 -16 Z'} />
      <text x={flip ? -w / 2 + 20 : w / 2 - 20} y="-30" textAnchor="middle">{text}</text>
    </g>
  </g>;
}

function Stalk({ x, y, s = 1, ripe }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} className={ripe ? 'stalk ripe' : 'stalk'}>
    <path className="blade" d="M0 0 C -2 -14 -7 -24 -14 -30" /><path className="blade" d="M0 0 C 1 -16 1 -28 -1 -40" /><path className="blade" d="M0 0 C 3 -13 9 -21 16 -26" />
    <path className="grain" d="M-1 -40 C 5 -42 11 -37 13 -29" />
  </g>;
}

export function RiceWorld({ compact = false, className = '' }) {
  const id = useUid();
  const ref = React.useRef(null);
  const svgRef = React.useRef(null);
  useParallax(ref);
  const [poked, setPoked] = React.useState({});
  const [sprouts, setSprouts] = React.useState([]);
  const counters = React.useRef({});
  const poke = who => e => {
    e.stopPropagation();
    const n = (counters.current[who] = ((counters.current[who] ?? -1) + 1) % LINES[who].length);
    const stamp = Date.now();
    setPoked(p => ({ ...p, [who]: { stamp, line: LINES[who][n] } }));
    setTimeout(() => setPoked(p => (p[who]?.stamp === stamp ? { ...p, [who]: null } : p)), 2600);
  };
  const plant = e => {
    const svg = svgRef.current; if (!svg) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM(); if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    if (p.y < 600) return;
    setSprouts(list => [...list.slice(-13), { x: p.x, y: p.y, k: Date.now() + Math.random() }]);
  };
  const rows = React.useMemo(() => [
    { y: 640, n: compact ? 26 : 36, s: .62, cls: 'p1' },
    { y: 700, n: compact ? 22 : 30, s: .78, cls: 'p2', ripe: true },
    { y: 770, n: compact ? 18 : 26, s: .95, cls: 'p3' },
    { y: 852, n: compact ? 14 : 20, s: 1.2, cls: 'p4' },
  ].map(r => ({ ...r, stalks: Array.from({ length: r.n }, (_, i) => ({ x: (i + .5) * (1600 / r.n) + (((i * 37) % 11) - 5) * 2, s: r.s * (.85 + ((i * 13) % 7) / 22) })) })), [compact]);

  return <div ref={ref} className={`rice-world ${compact ? 'is-compact' : ''} ${className}`} aria-hidden="true">
    <svg ref={svgRef} viewBox="0 0 1600 900" preserveAspectRatio={compact ? 'xMidYMax slice' : 'xMidYMax slice'} focusable="false">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="w-sky1" /><stop offset=".55" className="w-sky2" /><stop offset="1" className="w-sky3" /></linearGradient>
        <linearGradient id={`${id}mt`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="w-mt1" /><stop offset="1" className="w-mt2" /></linearGradient>
        <radialGradient id={`${id}sun`}><stop offset="0" stopColor="#fff7d1" /><stop offset=".6" stopColor="#ffd45a" /><stop offset="1" stopColor="#ffb23a" /></radialGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="w-gold1" /><stop offset="1" className="w-gold2" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}sky)`} />

      <g className="layer" style={{ '--depth': 6 }}>
        <g transform="translate(1270 210)">
          <g className="w-sun"><circle r="150" className="sun-halo" /><g className="sun-rays">{Array.from({ length: 16 }, (_, i) => <rect key={i} x="-5" y="-118" width="10" height="34" rx="5" transform={`rotate(${i * 22.5})`} />)}</g><circle r="74" fill={`url(#${id}sun)`} /></g>
          <g className="w-moon"><circle r="120" className="moon-halo" /><circle r="58" fill="#fbf5d8" /><circle cx="-18" cy="-12" r="11" fill="#ece3bd" /><circle cx="20" cy="16" r="7" fill="#ece3bd" /><circle cx="14" cy="-24" r="5" fill="#ece3bd" /></g>
        </g>
        <g className="w-stars">{Array.from({ length: 26 }, (_, i) => <circle key={i} cx={(i * 211) % 1600} cy={30 + ((i * 97) % 380)} r={i % 4 ? 1.8 : 2.8} style={{ '--d': `${(i * .41) % 3}s` }} />)}</g>
      </g>

      <g className="layer" style={{ '--depth': 10 }}>
        {[[0, 120, 1.2, '0s', 90], [1, 250, .8, '-30s', 120], [2, 70, .9, '-62s', 105], [3, 330, .6, '-12s', 140]].map(([k, y, s, d, dur]) => <g key={k} transform={`translate(0 ${y})`}><g className="w-cloud" style={{ '--d': d, '--dur': `${dur}s` }}><g transform={`scale(${s})`}>
          <ellipse cx="80" cy="30" rx="80" ry="26" /><circle cx="50" cy="14" r="32" /><circle cx="96" cy="2" r="40" /><circle cx="134" cy="20" r="26" />
        </g></g></g>)}
        <g transform="translate(0 180)"><g className="w-flock">{[[0, 0], [34, -16], [58, 8], [86, -6]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><path className="w-bird" style={{ '--d': `${i * .15}s` }} d="M-11 0 Q-5 -8 0 0 Q5 -8 11 0" /></g>)}</g></g>
      </g>

      <g className="layer" style={{ '--depth': 14 }}>
        <path fill={`url(#${id}mt)`} d="M0 560 L140 470 L250 360 Q300 318 350 360 L480 470 L600 430 L760 500 L900 420 L1010 330 Q1060 292 1110 330 L1250 450 L1400 410 L1600 480 L1600 640 L0 640 Z" />
        <path className="w-snow" d="M250 360 Q300 318 350 360 L332 372 L316 360 L300 376 L284 362 L268 374 Z M1010 330 Q1060 292 1110 330 L1092 342 L1076 330 L1060 346 L1044 332 L1028 344 Z" />
        <g className="w-smoke" transform="translate(300 330)"><circle r="14" /><circle r="10" className="s2" /><circle r="12" className="s3" /></g>
      </g>

      <g className="layer" style={{ '--depth': 20 }}>
        <path className="w-hill" d="M0 600 C 200 540 380 552 560 580 C 740 608 900 548 1100 556 C 1300 564 1450 590 1600 572 L1600 700 L0 700 Z" />
        <path className="w-hill-line" d="M0 616 C 200 560 380 570 560 598 C 740 626 900 566 1100 574 C 1300 582 1450 608 1600 590" />
        <g className="w-house" transform="translate(1360 586)">
          <g className="w-house-smoke"><circle cx="22" cy="-80" r="9" /><circle cx="26" cy="-80" r="7" className="s2" /><circle cx="18" cy="-80" r="8" className="s3" /></g>
          <rect x="-46" y="-34" width="92" height="40" rx="4" className="wall" />
          <path d="M-62 -30 L0 -78 L62 -30 Z" className="roof" />
          <rect x="16" y="-90" width="12" height="24" className="chim" />
          <rect x="-12" y="-18" width="22" height="24" rx="3" className="door" />
          <rect x="-38" y="-24" width="18" height="14" rx="2" className="win" /><rect x="22" y="-24" width="18" height="14" rx="2" className="win" />
        </g>
        {!compact && <g className="w-kid" onClick={poke('anak')}>
          <g transform="translate(520 588)">
            <g className={poked.anak ? 'actor-jump on' : 'actor-jump'}>
              <path d="M-5 0 L-3 -16 M5 0 L3 -16" className="leg" />
              <path d="M-9 -16 C -10 -30 -4 -36 0 -36 C 4 -36 10 -30 9 -16 Z" className="shirt-sky" />
              <circle cy="-43" r="7" className="skin" />
              <path d="M-7 -47 Q0 -54 7 -47" className="hair" />
            </g>
            <g className={poked.anak ? 'w-kite loop' : 'w-kite'}>
              <path d="M6 -30 C 60 -160 120 -240 150 -330" className="kite-string" />
              <g transform="translate(150 -330)">
                <g className="kite-body"><path d="M0 -34 L24 0 L0 40 L-24 0 Z" className="kite-a" /><path d="M0 -34 L0 40 M-24 0 L24 0" className="kite-x" /><path d="M0 40 C 10 56 -10 66 4 82 C 14 94 -6 104 6 118" className="kite-tail" /><circle cx="6" cy="62" r="4" className="kite-bow" /><circle cx="2" cy="96" r="4" className="kite-bow b2" /></g>
              </g>
            </g>
          </g>
          <Bubble show={!!poked.anak} x={540} y={540} text={poked.anak?.line || ''} />
        </g>}
      </g>

      <g className="layer" style={{ '--depth': 28 }}>
        {[[110, 680, 1], [1500, 690, 1.15], [240, 700, .8]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`} className="w-palm">
          <path className="trunk" d="M0 0 C 6 -40 2 -80 14 -124" />
          <g transform="translate(14 -124)"><g className="fronds" style={{ '--d': `${-i * 1.3}s` }}>
            <path d="M0 0 C -20 -14 -48 -12 -66 6 C -46 -2 -24 -1 0 0Z" /><path d="M0 0 C 18 -20 48 -20 66 -2 C 46 -8 22 -6 0 0Z" />
            <path d="M0 0 C -8 -24 -2 -44 14 -56 C 6 -38 3 -20 0 0Z" /><path d="M0 0 C -30 4 -50 22 -56 42 C -40 24 -22 12 0 0Z" /><path d="M0 0 C 26 4 48 22 54 42 C 36 24 18 12 0 0Z" />
            <circle cx="-3" cy="6" r="6" className="coco" /><circle cx="6" cy="8" r="6" className="coco" />
          </g></g>
        </g>)}
      </g>

      <g className="field" onClick={plant}>
        {rows.map((r, ri) => <g key={r.cls} className="layer" style={{ '--depth': 30 + ri * 10 }}>
          <path className={`paddy ${r.cls}`} fill={r.ripe ? `url(#${id}gold)` : undefined} d={`M-40 ${r.y - 12} C 300 ${r.y - 26} 700 ${r.y + 2} 1000 ${r.y - 14} S 1640 ${r.y - 8} 1640 ${r.y - 8} L1640 940 L-40 940 Z`} />
          <path className="dike" d={`M-40 ${r.y - 12} C 300 ${r.y - 26} 700 ${r.y + 2} 1000 ${r.y - 14} S 1640 ${r.y - 8} 1640 ${r.y - 8}`} />
          {!r.ripe && <g className="shimmer" style={{ '--d': `${-ri * 1.1}s` }}><path d={`M${120 + ri * 160} ${r.y + 22} h90 M${640 + ri * 80} ${r.y + 30} h60 M${1140 - ri * 90} ${r.y + 18} h100`} /></g>}

          {ri === 1 && <g onClick={poke('bu')} className="actor">
            <g className="w-walker">
              <g transform="translate(0 698) scale(1.5)"><g className={poked.bu ? 'actor-jump on' : 'actor-jump'}><g className="walker-bob">
                <path className="leg l" d="M-3 -18 L-5 0" /><path className="leg r" d="M3 -18 L5 0" />
                <path d="M-9 -18 C -11 -34 -6 -44 0 -44 C 6 -44 11 -34 9 -18 Z" className="shirt-ube" />
                <circle cy="-50" r="6" className="skin" />
                <path d="M-14 -55 L0 -66 L14 -55 Q0 -51 -14 -55 Z" className="hat" />
                <g transform="translate(0 -66)"><path d="M-14 -2 h28 l-4 -12 h-20 z" className="basket" /><circle cx="-6" cy="-15" r="4" className="veg-r" /><circle cx="2" cy="-16" r="4.4" className="veg-y" /><path d="M6 -14 C 10 -24 16 -22 18 -18 C 12 -18 9 -15 6 -14 Z" className="veg-g" /></g>
              </g></g></g>
            </g>
            <g className="w-walker-pos"><Bubble show={!!poked.bu} x={0} y={600} text={poked.bu?.line || ''} /></g>
          </g>}

          {ri === 2 && <>
            <g onClick={poke('kerbau')} className="actor">
              <g className="w-plow">
                <g transform="translate(0 772) scale(1.25)"><g className={poked.kerbau ? 'actor-jump on' : 'actor-jump'}>
                  <ellipse cx="0" cy="2" rx="60" ry="7" className="mud" />
                  <g className="ox-bob">
                    <path d="M-44 -30 C -44 -52 -20 -58 6 -56 C 30 -54 40 -44 40 -28 L 40 -16 L -44 -16 Z" className="ox" />
                    <path className="ox-leg a" d="M-36 -18 v18" /><path className="ox-leg b" d="M-20 -18 v18" /><path className="ox-leg a" d="M18 -18 v18" /><path className="ox-leg b" d="M32 -18 v18" />
                    <g transform="translate(46 -40)"><ellipse rx="14" ry="11" className="ox" /><ellipse cx="8" cy="5" rx="7" ry="5" className="ox-snout" /><circle cx="2" cy="-3" r="1.8" fill="#111" /><path d="M-8 -10 C -16 -22 -4 -26 -2 -16 M6 -10 C 10 -22 22 -20 14 -12" className="horn" /></g>
                    <path d="M-44 -34 C -52 -30 -56 -20 -52 -10" className="ox-tail" />
                  </g>
                  <path d="M-46 -30 L-78 -16 L-92 -2" className="plow" />
                  <g transform="translate(-100 0)"><g className="walker-bob">
                    <path className="leg l" d="M-3 -18 L-5 0" /><path className="leg r" d="M3 -18 L5 0" />
                    <path d="M-9 -18 C -11 -34 -6 -44 0 -44 C 6 -44 11 -34 9 -18 Z" className="shirt-sky" />
                    <path d="M6 -34 L 18 -26" className="arm" />
                    <circle cy="-50" r="6" className="skin" />
                    <path d="M-14 -55 L0 -66 L14 -55 Q0 -51 -14 -55 Z" className="hat" />
                  </g></g>
                </g></g>
              </g>
              <g className="w-plow-pos"><Bubble show={!!poked.kerbau} x={40} y={690} text={poked.kerbau?.line || ''} /></g>
            </g>
            <g onClick={poke('pak')} className="actor">
              <g transform="translate(920 800) scale(1.9)"><g className={poked.pak ? 'actor-jump on' : 'actor-jump'}>
                <ellipse className="ripple" cy="2" rx="22" ry="4" /><ellipse className="ripple d2" cy="2" rx="22" ry="4" />
                <g className="planter-body">
                  <path d="M-9 -2 L-7 -22 L3 -22 L5 -2 Z" className="pants" /><path d="M2 -2 L4 -22 L11 -21 L12 -2 Z" className="pants" />
                  <path d="M-10 -22 C -12 -36 -4 -50 10 -52 C 20 -50 22 -40 14 -22 Z" className="shirt-coral" />
                  <g className="planter-arm"><path d="M10 -44 C 18 -38 22 -28 24 -18" className="arm-coral" /><circle cx="24" cy="-16" r="3.2" className="skin" /><path d="M24 -14 l-3 -9 M24 -14 l1 -10 M24 -14 l5 -8" className="seedling" /></g>
                  <circle cx="14" cy="-56" r="7" className="skin" />
                  <path d="M-6 -58 L14 -76 L34 -58 Q14 -53 -6 -58 Z" className="hat" />
                </g>
              </g></g>
              <Bubble show={!!poked.pak} x={940} y={672} text={poked.pak?.line || ''} flip />
            </g>
          </>}

          <g className="stalks" style={{ '--d': `${-ri * .6}s` }}>{r.stalks.map((s, i) => <Stalk key={i} x={s.x} y={r.y + 30 + ri * 6} s={s.s} ripe={r.ripe} />)}</g>
        </g>)}
        {sprouts.map(s => <g key={s.k} transform={`translate(${s.x} ${s.y})`}><g className="sprout">
          <g className="sprout-burst">{Array.from({ length: 6 }, (_, i) => <circle key={i} r="3" style={{ '--a': `${i * 60}deg` }} />)}</g>
          <path d="M0 0 C 0 -10 1 -18 0 -26" className="sprout-stem" />
          <path d="M0 -18 C -8 -30 -22 -30 -26 -22 C -18 -16 -8 -15 0 -18 Z" className="sprout-leaf" />
          <path d="M0 -22 C 8 -36 24 -36 28 -28 C 20 -22 8 -20 0 -22 Z" className="sprout-leaf" />
        </g></g>)}
      </g>

      <g className="w-dragonflies">{[[300, 610, 0], [1200, 650, 1]].map(([x, y, i]) => <g key={i} transform={`translate(${x} ${y})`}><g className={`dragonfly df${i}`}>
        <ellipse rx="14" ry="2.6" className="df-body" /><ellipse cx="2" cy="-4" rx="8" ry="3" className="df-wing" /><ellipse cx="-4" cy="-4" rx="8" ry="3" className="df-wing w2" /><circle cx="14" r="3" className="df-body" />
      </g></g>)}</g>
      <g className="w-fireflies">{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 131 + 60) % 1600} cy={620 + ((i * 53) % 240)} r="3.4" style={{ '--d': `${(i * .47) % 3.6}s` }} />)}</g>
      <g className="w-lanterns">{[[180, 600], [1420, 520], [760, 560]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><g className="lantern" style={{ '--d': `${-i * .8}s` }}><path d="M0 -40 v14" className="l-cord" /><rect x="-10" y="-26" width="20" height="26" rx="8" className="l-body" /><circle cy="-13" r="22" className="l-glow" /></g></g>)}</g>
    </svg>
  </div>;
}

/* ---------- Compact animated banner for inner pages ---------- */
export function PageBanner({ variant = 'pak' }) {
  return <div className="page-banner" aria-hidden="true">
    <RiceWorld compact />
    <FarmerAvatar variant={variant} className="page-banner-avatar" />
  </div>;
}

/* ---------- Footer rice field ---------- */
export function FooterField() {
  const stalks = React.useMemo(() => Array.from({ length: 70 }, (_, i) => ({ x: i * 18 + ((i * 7) % 9), s: .7 + ((i * 11) % 6) / 12 })), []);
  return <div className="footer-field" aria-hidden="true">
    <svg viewBox="0 0 1260 80" preserveAspectRatio="xMidYMax slice" focusable="false">
      <g className="ff-row back">{stalks.map((s, i) => <Stalk key={i} x={s.x + 9} y={82} s={s.s * .9} ripe={i % 3 === 0} />)}</g>
      <g className="ff-walker"><g transform="translate(0 78) scale(1.2)"><g className="walker-bob">
        <path className="leg l" d="M-3 -18 L-5 0" /><path className="leg r" d="M3 -18 L5 0" />
        <path d="M-9 -18 C -11 -34 -6 -44 0 -44 C 6 -44 11 -34 9 -18 Z" className="shirt-coral" />
        <circle cy="-50" r="6" className="skin" /><path d="M-14 -55 L0 -66 L14 -55 Q0 -51 -14 -55 Z" className="hat" />
        <path d="M-22 -40 L22 -40" className="pole" /><path d="M-26 -40 v10 h-8 l3 8 h10 l3 -8 h-8 M26 -40 v10 h-8 l3 8 h10 l3 -8 h-8" className="pole-basket" />
      </g></g></g>
      <g className="ff-row front">{stalks.map((s, i) => i % 2 ? <Stalk key={i} x={s.x} y={86} s={s.s * 1.15} ripe={i % 5 === 0} /> : null)}</g>
    </svg>
  </div>;
}

/* ---------- Animated underline squiggle ---------- */
export function Squiggle({ className = '' }) {
  return <svg className={`squiggle ${className}`} viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M4 14 C 30 2 52 22 78 12 S 128 2 154 12 S 204 22 230 12 S 280 4 296 12" /></svg>;
}
