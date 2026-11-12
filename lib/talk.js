// Talk keys, shared by every Talk Deck. Load after deck.js, then: Deck.start({ keyboard: Talk.keys })
// ← / → change Slides, ↓ / ↑ show / hide one point. Space, PageDown and N also go forward; PageUp and P back.
// Forward opens the next Slide at its first point; back returns to the previous Slide with every point showing.
// C (or ?cam in the URL) outlines the bottom-right face-cam zone, for lining up Cap's camera bubble before recording.
// A Demo's inputs should stop key events (and blur on Esc) so typing doesn't move the Deck: Talk.field(el).
window.Talk = (() => {
  function go(d) {
    const h = Reveal.getIndices().h + d, slide = Reveal.getSlide(h);
    if (!slide) return;
    const frags = [...slide.querySelectorAll('.fragment')];
    frags.forEach(f => f.classList.toggle('visible', d < 0));
    const last = Math.max(-1, ...frags.map(f => +f.dataset.fragmentIndex || 0));
    Reveal.slide(h, 0, d < 0 ? last : -1);
  }
  const cam = () => document.documentElement.classList.toggle('cam');
  if (new URLSearchParams(location.search).has('cam')) cam();
  const keys = { 40: () => Reveal.nextFragment(), 38: () => Reveal.prevFragment(), 67: cam };
  [39, 32, 34, 78].forEach(k => keys[k] = () => go(1));
  [37, 33, 80].forEach(k => keys[k] = () => go(-1));
  const field = el => el.addEventListener('keydown', e => { if (e.key === 'Escape') el.blur(); e.stopPropagation(); });
  return { keys, go, cam, field };
})();

// Agent trajectory (from the Clay Look reference, library/reference/lydia-hallie-claude-code-vlfCjWuv4es):
// a wavy line from a hollow start to an end box, with what the agent did placed on it.
//   <div class="traj" data-enter="traj" data-waves="2">                       draws the line (data-step works too)
//     <i data-step="node" data-at=".2">Read</i>                                dot + chip below (class "up": above)
//     <i data-step="node" data-at=".5" class="bad">Bash git reset --hard</i>   pink chip
//     <i data-step="node" data-at=".4" class="human up">Fix the code</i>       lavender person above the line
//     <i data-step="node" data-at=".6" class="check"></i>                      green ✓ square (class "fail": pink ✕)
//     <i data-step="node" data-at="1" class="check"></i>                       the end box turns green
//   </div>
// Wrap it in <div class="frame"> for a sandbox / cloud box (class "dashed" = unprotected).
(() => {
  const icon = {
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    fail: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    human: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.6"/><path d="M5.5 19.5c1.2-3.3 3.6-5 6.5-5s5.3 1.7 6.5 5"/></svg>',
  };
  // Line height (0..1 of the box) at p (0..1). Whole waves start and end on the middle; the bumps swell mid-line.
  const y = (p, waves) => 0.5 - 0.38 * Math.sin(2 * Math.PI * waves * p) * (0.55 + 0.45 * Math.sin(Math.PI * p));
  const place = (traj, el) => {
    const p = +el.dataset.at, waves = +(traj.dataset.waves || 2);
    el.style.left = p * 100 + '%';
    el.style.top = y(p, waves) * 100 + '%';
    if (el.dataset.placed != null) return;
    el.dataset.placed = '';
    const kind = ['check', 'fail', 'human'].find(k => el.classList.contains(k));
    const text = el.innerHTML.trim();   // may hold markup: <b>Bash</b> npm test
    el.innerHTML = (kind ? `<span class="mk ${kind}">${icon[kind]}</span>` : '<span class="mk"></span>') + (text ? `<span class="lab">${text}</span>` : '');
  };
  function build(traj) {
    if (traj.querySelector(':scope > svg')) return traj.querySelector(':scope > svg path');
    const waves = +(traj.dataset.waves || 2), pts = [];
    for (let i = 0; i <= 120; i++) pts.push(`${(i / 120 * 1000).toFixed(1)},${(y(i / 120, waves) * 200).toFixed(1)}`);
    traj.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 1000 200" preserveAspectRatio="none"><path d="M${pts.join('L')}"/></svg>`
      + '<b class="traj-start"></b><b class="traj-end"></b>');
    traj.querySelectorAll(':scope > [data-at]').forEach(el => place(traj, el));
    return traj.querySelector(':scope > svg path');
  }
  Deck.preset('traj', el => {
    const path = build(el), ends = el.querySelectorAll(':scope > .traj-start, :scope > .traj-end');
    return gsap.timeline()
      .fromTo(ends[0], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, 0)
      .fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: +(el.dataset.duration || 0.9), ease: 'softInOut' }, 0)
      .add(Deck.presets.land(ends[1]), '-=0.2');
  });
  // Code panel line (lib/talk.css .code): add / cur light the line, del strikes it out.
  Deck.preset('line', el => {
    if (el.dataset.as === 'del') return gsap.fromTo(el, { color: Deck.css('--fg'), textDecorationColor: 'rgba(0,0,0,0)' },
      { color: Deck.css('--dim'), textDecorationColor: Deck.css('--dim'), duration: 0.3, ease: 'softInOut' });
    const bg = el.querySelector(':scope > .bg') || el.insertAdjacentElement('afterbegin', document.createElement('b'));
    bg.className = 'bg';
    return gsap.fromTo(bg, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'softLand' });
  });
  Deck.preset('node', el => { const traj = el.closest('.traj'); build(traj); place(traj, el); return Deck.presets.land(el); });
})();
