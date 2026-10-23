/* Motion and small, browser-local interactions for the studio's inner pages. */
(() => {
  const page = document.body;
  if (!page.classList.contains('studio-inner-page')) return;
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:760px)');
  let manualPause = false;
  try { manualPause = sessionStorage.getItem('studio-motion-paused') === 'true'; } catch (_) {}
  let paused = capture || manualPause || (reduced.matches && !mobile.matches);
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'inner-motion-control';
  page.append(control);
  const reveals = [...document.querySelectorAll('.inner-reveal')];
  function sync() {
    userPaused = paused;
    syncMotion();
    page.classList.toggle('inner-motion-opt-in', !paused);
    control.textContent = paused ? '▶\uFE0E Play motion' : 'Ⅱ Pause motion';
    control.setAttribute('aria-label', paused ? 'Play website motion' : 'Pause website motion');
    control.setAttribute('aria-pressed', String(paused));
    if (paused) reveals.forEach(element => element.classList.add('is-visible'));
  }
  control.addEventListener('click', () => {
    paused = !paused;
    manualPause = paused;
    try { sessionStorage.setItem('studio-motion-paused', String(paused)); } catch (_) {}
    sync();
  });
  function syncPreference() { paused = capture || manualPause || (reduced.matches && !mobile.matches); sync(); }
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
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const draft = document.getElementById('email-draft');
  const select = document.getElementById('inquiry-service');
  const subjects = {general:'Website Inquiry',website:'Website Design or Refresh Inquiry','website-support':'Website & Content Support Inquiry','digital-support':'Digital Operations Support Inquiry'};
  const requested = new URLSearchParams(location.search).get('service');
  if (Object.hasOwn(subjects, requested)) select.value = requested;
  function updateDraft() {
    const fields = new FormData(form);
    const lines = ['Hi Ebin,', ''];
    if (fields.get('name')?.trim()) lines.push(`Name: ${fields.get('name').trim()}`);
    if (fields.get('organization')?.trim()) lines.push(`Organization: ${fields.get('organization').trim()}`);
    lines.push(`Interested in: ${select.options[select.selectedIndex].text}`, '', fields.get('message').trim());
    draft.href = `mailto:ebin@ebinjohnson.ca?subject=${encodeURIComponent(subjects[select.value])}&body=${encodeURIComponent(lines.join('\n'))}`;
  }
  form.addEventListener('input', updateDraft);
  form.addEventListener('change', updateDraft);
  form.addEventListener('submit', event => { event.preventDefault(); if (form.reportValidity()) draft.click(); });
  draft.addEventListener('click', event => { if (!form.reportValidity()) event.preventDefault(); });
  updateDraft();
})();
