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
