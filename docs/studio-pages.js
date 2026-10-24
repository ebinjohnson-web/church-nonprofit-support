/* Motion and small, browser-local interactions for the studio's inner pages. */
(() => {
  const page = document.body;
  if (!page.classList.contains('studio-inner-page')) return;
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:760px)');
  let paused = capture || (reduced.matches && !mobile.matches);
  const reveals = [...document.querySelectorAll('.inner-reveal')];
  function sync() {
    userPaused = paused;
    syncMotion();
    page.classList.toggle('inner-motion-opt-in', !paused);
    if (paused) reveals.forEach(element => element.classList.add('is-visible'));
  }
  function syncPreference() { paused = capture || (reduced.matches && !mobile.matches); sync(); }
  reduced.addEventListener('change', syncPreference);
  mobile.addEventListener('change', syncPreference);
  if ('IntersectionObserver' in window) {
    page.classList.add('inner-motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.08});
    reveals.forEach((element, index) => {
      element.style.setProperty('--inner-delay', `${index % 3 * 65}ms`);
      if (element.getBoundingClientRect().top < innerHeight) element.classList.add('is-visible');
      else observer.observe(element);
      element.addEventListener('focusin', () => { element.classList.add('is-visible'); observer.unobserve(element); });
    });
  }
  sync();

  const copy = document.getElementById('copy-email');
  copy?.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try { await navigator.clipboard.writeText('ebin@ebinjohnson.ca'); status.textContent = 'Email address copied.'; }
    catch (_) { status.textContent = 'Email: ebin@ebinjohnson.ca'; }
  });
})();
