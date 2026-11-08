/* Deck runtime: GSAP animations for Reveal.js decks, opened straight from disk.
 *
 *   data-enter="rise"   plays when its Slide appears, replays every visit
 *   data-step="rise"    one presenter click; plays forward on next, backward on previous
 *   data-delay="0.3"    seconds into the Slide for an enter (default: 0.08 s stagger in DOM order)
 *
 * Presets below; add your own before Deck.start():
 *   Deck.preset('name', el => gsap.timeline()...)   (synchronous; return a GSAP timeline/tween. Never return a
 *   Promise: GSAP animations are thenable, so awaiting one waits for it to finish playing. For async work, return
 *   a timeline now and add tweens to it when the work resolves.)
 * Several Steps may animate the same target (a slider knob, a counter): give later ones
 * immediateRender: false. Jumping to any Step applies them in order, so the result is always right.
 * Format: deck.html shows Landscape 1920x1080, deck.html?format=vertical shows Vertical 1080x1920.
 */
(function () {
  'use strict';
  const vertical = new URLSearchParams(location.search).get('format') === 'vertical';
  document.documentElement.classList.toggle('vertical', vertical);

  gsap.registerPlugin(...[window.SplitText, window.DrawSVGPlugin, window.MorphSVGPlugin, window.MotionPathPlugin,
    window.Flip, window.CustomEase, window.ScrambleTextPlugin, window.TextPlugin].filter(Boolean));

  // Measured eases, copied from motionmaxxing runtime/motion.js (Apache-2.0, Tejas Makwana).
  const powerOut = p => t => 1 - Math.pow(1 - t, p);
  const powerIn = p => t => Math.pow(t, p);
  const expoOut = k => { const d = 1 - Math.exp(-k); return t => (1 - Math.exp(-k * t)) / d; };
  const snapRamp = (w, tau) => { const n = w * (1 - Math.exp(-1 / tau)) + (1 - w); return t => (w * (1 - Math.exp(-t / tau)) + (1 - w) * t) / n; };
  const snapOver = (A, ta, td) => { const f = t => (1 + A * Math.exp(-t / td)) * (1 - Math.exp(-t / ta)); const n = f(1); return t => f(t) / n; };
  const spring = (c, om) => { const f = t => 1 - Math.exp(-c * t) * (Math.cos(om * t) + (c / om) * Math.sin(om * t)); const n = f(1); return t => f(t) / n; };
  const smoothP = p => t => { const a = Math.pow(t, p), b = Math.pow(1 - t, p); return a / (a + b); };
  const guard = f => t => (t <= 0 ? 0 : t >= 1 ? 1 : f(t));
  Object.entries({
    crashIn: snapOver(2.0, 0.19, 0.218), popOver: spring(2.67, 4.36), bounceHard: spring(1.34, 5.07),
    snapSettle: snapRamp(0.942, 0.118), softLand: expoOut(3.41), whip: powerOut(2.52), glide: powerOut(1.7),
    softInOut: smoothP(1.42), gentleIn: powerIn(2.07), accelExit: powerIn(2.6), crashOut: powerIn(3.97),
  }).forEach(([name, f]) => gsap.registerEase(name, guard(f)));

  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const NS = 'http://www.w3.org/2000/svg';
  const seeded = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5);   // same wobble every run
  // Grapheme clusters, so Bengali conjuncts and vowel signs are never split while typing.
  const graphemes = s => (window.Intl && Intl.Segmenter ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)].map(x => x.segment) : [...s]);
  // Arrive by moving; opacity only covers the first ~6 frames so nothing pops in.
  const show = (el, from, to, ease, dur) => gsap.timeline()
    .fromTo(el, { transformOrigin: '50% 50%', ...from }, { ...to, duration: dur, ease }, 0)   // SVG defaults to a top-left origin
    .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, 0);

  const presets = {
    rise: el => show(el, { y: 64 }, { y: 0 }, 'softLand', 0.4),
    slide: el => show(el, { x: vertical ? 96 : 160 }, { x: 0 }, 'softLand', 0.4),
    land: el => show(el, { scale: 1.6 }, { scale: 1 }, 'snapSettle', 0.4),      // from oversize; nothing grows from zero
    crash: el => show(el, { scale: 3.5 }, { scale: 1 }, 'crashIn', 0.35),       // logos
    stamp: el => {   // rubber stamp: slams in from oversize, lands tilted (data-rotate, default -8)
      const r = +(el.dataset.rotate ?? -8);
      return show(el, { scale: 2.4, rotation: r - 12 }, { scale: 1, rotation: r }, 'crashIn', 0.3);
    },
    hide: el => gsap.fromTo(el, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: 0.3, ease: 'accelExit' }),   // leave on a click
    words: el => {
      const s = SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'w' });
      return gsap.fromTo(s.words, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: 'softLand', stagger: 0.06 });
    },
    stream: el => {  // children appear one after another, like log lines (data-gap seconds, default 0.09)
      return gsap.fromTo(el.children, { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.14, ease: 'softLand', stagger: +(el.dataset.gap || 0.09) });
    },
    type: el => {    // types its own text with a human, irregular rhythm (data-cps chars per second, default 28)
      const g = graphemes(el.textContent), r = seeded(g.length * 13 + 7), cps = +(el.dataset.cps || 28), at = [];
      let t = 0;
      g.forEach(ch => { t += (1 / cps) * (0.55 + r() + 0.5) * (ch === ' ' ? 1.6 : /[.,?!।]/.test(ch) ? 3 : 1); at.push(t); });
      const o = { t: 0 }, draw = () => { let n = 0; while (n < at.length && at[n] <= o.t) n++; el.textContent = g.slice(0, n).join(''); };
      el.style.minHeight = `${el.offsetHeight}px`;   // keep layout still while text grows
      draw();
      return gsap.to(o, { t, duration: t, ease: 'none', onUpdate: draw });
    },
    draw: el => {
      const parts = el.matches('path,line,polyline,polygon,circle,rect,ellipse') ? el
        : el.querySelectorAll('path,line,polyline,polygon,circle,rect,ellipse');
      return gsap.fromTo(parts, { drawSVG: '0%' }, { drawSVG: '100%', duration: +(el.dataset.duration || 0.7), ease: 'softInOut', stagger: 0.05 });
    },
    count: el => {   // <span data-step="count" data-to="1250000" data-decimals="0" data-locale="bn-BD">0</span>
      const to = +el.dataset.to, from = +(el.dataset.from || 0), dp = +(el.dataset.decimals || 0), o = { v: from };
      const fmt = v => v.toLocaleString(el.dataset.locale || undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });
      el.textContent = fmt(from);
      return gsap.to(o, { v: to, duration: +(el.dataset.duration || 1.2), ease: 'glide', onUpdate: () => { el.textContent = fmt(o.v); } });
    },
    mark: el => {    // hand-drawn callout: <span data-step="mark" data-mark="underline|circle|box|highlight|strike">
      // Drawn in the element's own pixels, so Reveal's window scaling can't shift it. Single-line text only.
      const type = el.dataset.mark || 'underline', w = el.offsetWidth, h = el.offsetHeight, r = seeded(w * 31 + h * 7 + 1);
      const j = (v, a = 6) => (v + r() * a).toFixed(1);
      let d;
      if (type === 'circle') {
        const ph = r() * 6; d = '';
        for (let i = 0; i <= 56; i++) {   // a bit more than one lap, like a pen overshooting its start
          const t = -1.9 + (i / 56) * Math.PI * 2.15, k = 1 + 0.04 * Math.sin(3 * t + ph);
          d += `${i ? 'L' : 'M'}${(w / 2 + Math.cos(t) * (w / 2 + 28) * k).toFixed(1)},${(h / 2 + Math.sin(t) * (h / 2 + 20) * k).toFixed(1)}`;
        }
      } else d = {
        underline: `M${j(-4)},${j(h + 4, 4)} C${w * 0.3},${j(h)} ${w * 0.7},${j(h + 10)} ${j(w + 6)},${j(h + 2, 4)}`,
        strike: `M${j(-6)},${j(h * 0.55, 4)} L${j(w + 6)},${j(h * 0.5, 4)}`,
        box: `M${j(-12)},${j(-10)} L${j(w + 12)},${j(-12)} L${j(w + 14)},${j(h + 10)} L${j(-10)},${j(h + 12)} Z`,
        highlight: `M-6,${j(h * 0.55, 3)} L${w + 6},${j(h * 0.5, 3)}`,
      }[type];
      const svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
      Object.assign(el.style, { position: 'relative', zIndex: '0' });   // own stacking context so a highlight sits behind the text
      svg.setAttribute('style', `position:absolute;left:0;top:0;width:${w}px;height:${h}px;overflow:visible;pointer-events:none;z-index:-1`);
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke', el.dataset.color || css(type === 'highlight' ? '--chart-3' : '--chart-1'));
      path.setAttribute('stroke-width', type === 'highlight' ? h * 0.8 : 5);
      if (type === 'highlight') path.setAttribute('opacity', '0.45');
      svg.append(path); el.append(svg);
      return gsap.fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: type === 'circle' ? 0.6 : 0.4, ease: 'softInOut' });
    },
    // push an element back (data-to: final opacity, default 0.25)
    dim: el => gsap.fromTo(el, { autoAlpha: 1 }, { autoAlpha: +(el.dataset.to ?? 0.25), duration: 0.25, ease: 'softInOut' }),
  };

  const masters = new Map(), steps = new Map(), shown = new Map();
  function make(el, attr) {
    const f = presets[el.getAttribute(attr)];
    if (!f) { console.warn(`Deck: unknown preset "${el.getAttribute(attr)}"`, el); return null; }
    return f(el);
  }
  function sync(slide, instant) {
    const els = [...slide.querySelectorAll('[data-step]')].filter(el => steps.has(el));
    const on = el => el.classList.contains('visible');
    if (instant) {   // rewind hidden Steps last-to-first, then finish shown ones first-to-last: Steps sharing a target end right
      // progress() (unlike pause(t)) fires onUpdate, so counters and typed text redraw on a jump.
      els.filter(el => !on(el)).reverse().forEach(el => { steps.get(el).pause().progress(0); shown.set(el, false); });
      els.filter(on).forEach(el => { steps.get(el).pause().progress(1); shown.set(el, true); });
      return;
    }
    els.forEach(el => {
      if (on(el) === shown.get(el)) return;   // only touch Steps that changed
      shown.set(el, on(el));
      on(el) ? steps.get(el).play() : steps.get(el).reverse();
    });
  }
  function enter(slide) { masters.get(slide)?.progress(0).play(); sync(slide, true); }

  function build(slide) {
    // Reveal hides off-screen Slides (`hidden`, and display:none beyond its view distance), so everything would
    // measure 0. Lay the Slide out unpainted while building, then put Reveal's values back.
    const { hidden } = slide, { visibility, display } = slide.style;
    slide.hidden = false;
    slide.style.visibility = 'hidden';
    slide.style.display = 'flex';
    try {
      const master = gsap.timeline({ paused: true });
      let i = 0;
      for (const el of slide.querySelectorAll('[data-enter]')) {
        const tl = make(el, 'data-enter');
        if (tl) master.add(tl, el.dataset.delay != null ? +el.dataset.delay : 0.08 * i++);
        el.dataset.built = '';
      }
      masters.set(slide, master);
      for (const el of slide.querySelectorAll('[data-step]')) {
        const tl = make(el, 'data-step');
        if (tl) { steps.set(el, tl.pause(0)); shown.set(el, false); }
        el.dataset.built = '';
      }
    } finally {
      slide.hidden = hidden;
      slide.style.visibility = visibility;
      slide.style.display = display;
    }
  }

  async function start(options = {}) {
    await Promise.all([document.fonts.load('1em Inter'), document.fonts.load('1em "Anek Bangla"', 'অআক'),
      document.fonts.load('1em "JetBrains Mono"')]);
    if (window.lucide) lucide.createIcons();
    document.querySelectorAll('[data-step]').forEach(el => el.classList.add('fragment', 'custom'));
    const size = vertical ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
    await Reveal.initialize({
      ...size, margin: 0, center: false, display: 'flex', hash: true,
      controls: false, progress: false, slideNumber: false,       // nothing on screen but the Slide
      transition: 'none', backgroundTransition: 'none',            // hard cuts; motion comes from the enters
      plugins: [window.RevealNotes, window.RevealHighlight].filter(Boolean),
      ...options,
    });
    // Build everything up front so no Slide stalls on first visit while recording.
    document.querySelectorAll('.reveal .slides > section').forEach(build);
    Reveal.on('slidechanged', e => { masters.get(e.previousSlide)?.pause(0); enter(e.currentSlide); });
    Reveal.on('fragmentshown', () => sync(Reveal.getCurrentSlide(), false));
    Reveal.on('fragmenthidden', () => sync(Reveal.getCurrentSlide(), false));
    enter(Reveal.getCurrentSlide());
    document.documentElement.dataset.deckReady = '';
  }

  window.Deck = { start, preset: (name, fn) => { presets[name] = fn; }, presets, vertical, css, graphemes, seeded };
})();
