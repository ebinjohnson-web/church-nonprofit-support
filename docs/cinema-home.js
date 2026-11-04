/* Native video with an image fallback; media only plays while in view. */
(() => {
  const hero = document.getElementById('hero-film');
  const process = document.getElementById('process-film');
  const gallery = document.querySelector('.concept-gallery');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:760px)');
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  const visible = new Map([[hero,true],[process,false]]);
  const systemPaused = () => capture || (reduced.matches && !mobile.matches);
  function sync() {
    for (const film of [hero,process]) {
      if (systemPaused() || document.hidden || !visible.get(film)) film.pause();
      else film.play().catch(() => { /* The poster stays visible if autoplay is unavailable. */ });
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>{ for(const entry of entries) visible.set(entry.target,entry.isIntersecting); sync(); },{threshold:.05});
    observer.observe(hero); observer.observe(process);
  } else visible.set(process,true);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync); mobile.addEventListener('change',sync);

  sync();
})();

/* Advance one project at a time, without interrupting someone browsing the gallery. */
(() => {
  const gallery = document.querySelector('.concept-gallery');
  const section = gallery.closest('.concept-section');
  const cards = [...gallery.querySelectorAll('.concept-tile')];
  const toggle = section.querySelector('.gallery-autoplay');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover)');
  const delay = 4000;
  let visible = false;
  let paused = false;
  let dragging = false;
  let timer;

  function move(direction) {
    const left = gallery.scrollLeft;
    const limit = gallery.scrollWidth - gallery.clientWidth;
    const start = cards[0].getBoundingClientRect().left;
    const stops = cards.map(card => Math.min(limit, card.getBoundingClientRect().left - start));
    const target = direction > 0
      ? (stops.find(stop => stop > left + 2) ?? 0)
      : ([...stops].reverse().find(stop => stop < left - 2) ?? limit);
    gallery.scrollTo({ left: target, behavior: reduced.matches || Math.abs(target - left) > gallery.clientWidth * 1.5 ? 'instant' : 'smooth' });
  }

  function schedule() {
    clearTimeout(timer);
    if (!visible || paused || reduced.matches || dragging || document.hidden ||
        (hover.matches && gallery.matches(':hover')) || gallery.contains(document.activeElement)) return;
    timer = setTimeout(() => { move(1); schedule(); }, delay);
  }

  section.querySelectorAll('[data-gallery-direction]').forEach(button => {
    button.addEventListener('click', () => { move(Number(button.dataset.galleryDirection)); schedule(); });
  });
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Resume gallery' : 'Pause gallery';
    schedule();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }, { threshold: .15 }).observe(gallery);
    const syncPreference = () => { toggle.hidden = reduced.matches; schedule(); };
    reduced.addEventListener('change', syncPreference);
    syncPreference();
  }
  gallery.addEventListener('pointerdown', () => { dragging = true; schedule(); });
  for (const type of ['pointerup', 'pointercancel']) {
    window.addEventListener(type, () => { if (dragging) { dragging = false; schedule(); } });
  }
  for (const type of ['pointerenter', 'pointerleave', 'scroll']) {
    gallery.addEventListener(type, schedule, { passive: true });
  }
  section.addEventListener('focusin', schedule);
  section.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
})();
