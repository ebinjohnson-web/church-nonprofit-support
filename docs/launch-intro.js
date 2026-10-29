/* Homepage launch scene, with a skip action and a bounded recovery timer. */
(() => {
  const root = document.documentElement;
  const intro = document.getElementById('launch-intro');
  if (!intro || !root.classList.contains('launch-pending')) return;
  const regions = [...document.querySelectorAll('body > .site-header, body > main, body > .site-footer')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:760px)');
  const skip = intro.querySelector('.launch-skip');
  let finished = false;
  let fallback;
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(fallback);
    clearTimeout(window.launchRecovery);
    root.classList.remove('launch-pending','launch-running');
    regions.forEach(region => { region.inert = false; });
    intro.setAttribute('aria-hidden','true');
    intro.inert = true;
    if (intro.contains(document.activeElement)) {
      const main = document.getElementById('main-content');
      main.setAttribute('tabindex','-1');
      main.focus({preventScroll:true});
    }
    document.removeEventListener('keydown', onKey);
  }
  function onKey(event) { if (event.key === 'Escape') { event.preventDefault(); finish(); } }
  function onPreference() { if (reduced.matches && !mobile.matches) finish(); }
  intro.inert = false;
  intro.setAttribute('aria-hidden','false');
  regions.forEach(region => { region.inert = true; });
  skip.addEventListener('click',finish);
  document.addEventListener('keydown',onKey);
  document.querySelector('.skip-link')?.addEventListener('click',finish);
  intro.addEventListener('animationend',event=>{if(event.target === intro && event.animationName === 'launch-curtain-out') finish();});
  // If a capture tool or stylesheet suppresses animation events, release the page anyway.
  fallback = setTimeout(finish,4800);
  root.classList.add('launch-running');
  skip.focus({preventScroll:true});
  reduced.addEventListener('change',onPreference);
  mobile.addEventListener('change',onPreference);
  window.addEventListener('pageshow',event=>{if(event.persisted) finish();});
  window.addEventListener('launch-recover',finish,{once:true});
})();
