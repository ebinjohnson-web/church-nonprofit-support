/* Native video with an image fallback; media only plays while in view. */
(() => {
  const hero = document.getElementById('hero-film');
  const process = document.getElementById('process-film');
  const toggle = document.getElementById('film-toggle');
  const gallery = document.querySelector('.concept-gallery');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:760px)');
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  let userPaused = false;
  let userPlay = false;
  const visible = new Map([[hero,true],[process,false]]);
  const systemPaused = () => capture || (!userPlay && reduced.matches && !mobile.matches);
  function sync() {
    for (const film of [hero,process]) {
      if (systemPaused() || userPaused || document.hidden || !visible.get(film)) film.pause();
      else film.play().catch(() => { /* The poster stays visible if autoplay is unavailable. */ });
    }
    const paused = hero.paused;
    toggle.innerHTML = paused ? 'Play film <span aria-hidden="true">▶</span>' : 'Pause film <span aria-hidden="true">Ⅱ</span>';
    toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    toggle.setAttribute('aria-pressed',String(paused));
  }
  hero.addEventListener('play', () => { toggle.innerHTML='Pause film <span aria-hidden="true">Ⅱ</span>'; toggle.setAttribute('aria-label','Pause background video'); toggle.setAttribute('aria-pressed','false'); });
  toggle.addEventListener('click',() => { userPaused=!hero.paused; if (!userPaused) userPlay=true; sync(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>{ for(const entry of entries) visible.set(entry.target,entry.isIntersecting); sync(); },{threshold:.05});
    observer.observe(hero); observer.observe(process);
  } else visible.set(process,true);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync); mobile.addEventListener('change',sync);
  document.querySelectorAll('[data-gallery-direction]').forEach(button=>button.addEventListener('click',()=>gallery.scrollBy({left:Number(button.dataset.galleryDirection)*(gallery.querySelector('.concept-tile').getBoundingClientRect().width+28),behavior:reduced.matches?'instant':'smooth'})));
  sync();
})();
