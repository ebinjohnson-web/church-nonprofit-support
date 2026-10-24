/* Homepage motion: original project showreel, scroll depth, and readable reveals. */
(() => {
  const slides = [...document.querySelectorAll('.showcase-slide')];
  if (!slides.length) return;
  const dots = [...document.querySelectorAll('[data-showcase]')];
  const showcase = document.querySelector('.hero-showcase');
  const pause = document.querySelector('.showcase-pause');
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobileView = matchMedia('(max-width:760px)');
  const hoverPointer = matchMedia('(hover:hover) and (pointer:fine)');
  let current = 0;
  let slidePaused = false;
  let timer;
  let scrollFrame;
  const systemPausesMotion = () => reduced.matches && !mobileView.matches;
  let globalPaused = capture || systemPausesMotion();

  function showSlide(index) {
    current = index;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-current', active);
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
      slide.tabIndex = active ? 0 : -1;
    });
    dots.forEach((dot, i) => { dot.classList.toggle('is-current', i === index); dot.setAttribute('aria-pressed', String(i === index)); });
  }
  function schedule() {
    clearInterval(timer);
    const pointerPauses = hoverPointer.matches && (showcase.matches(':hover') || showcase.contains(document.activeElement));
    if (!globalPaused && !slidePaused && !document.hidden && !pointerPauses) {
      timer = setInterval(() => showSlide((current + 1) % slides.length), 6500);
    }
  }
  function sync() {
    document.body.classList.toggle('motion-paused', globalPaused);
    document.body.classList.toggle('motion-opt-in', !globalPaused);
    // Share the existing transition/reveal pause state without altering other pages.
    userPaused = globalPaused;
    syncMotion();
    pause.textContent = slidePaused || globalPaused ? '▶\uFE0E' : 'Ⅱ';
    pause.setAttribute('aria-label', slidePaused ? 'Play project slideshow' : 'Pause project slideshow');
    pause.setAttribute('aria-pressed', String(slidePaused || globalPaused));
    pause.disabled = globalPaused;
    showcase.style.setProperty('--showcase-scroll', '0px');
    schedule();
  }
  pause.addEventListener('click', () => { slidePaused = !slidePaused; sync(); });
  dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.showcase)); schedule(); }));
  showcase.addEventListener('mouseenter', () => { if (hoverPointer.matches) clearInterval(timer); });
  showcase.addEventListener('mouseleave', schedule);
  showcase.addEventListener('focusin', () => { if (hoverPointer.matches) clearInterval(timer); });
  showcase.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  function syncSystemPreference() {
    globalPaused = capture || systemPausesMotion();
    sync();
  }
  reduced.addEventListener('change', syncSystemPreference);
  mobileView.addEventListener('change', syncSystemPreference);

  function scrollMotion() {
    scrollFrame = null;
    if (globalPaused || innerWidth <= 760) return;
    const offset = Math.max(0, Math.min(scrollY * .1, 55));
    showcase.style.setProperty('--showcase-scroll', `${offset}px`);
  }
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollMotion); }, {passive:true});
  window.addEventListener('resize', () => { showcase.style.setProperty('--showcase-scroll', '0px'); });

  const introduction = document.querySelector('.studio-introduction');
  const heading = introduction.querySelector('h2');
  let word = 0;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(text => {
      if (!text.trim()) fragment.append(document.createTextNode(text));
      else { const span = document.createElement('span'); span.className = 'intro-word'; span.style.setProperty('--word-index', word++); span.textContent = text; fragment.append(span); }
    });
    node.replaceWith(fragment);
  });
  if ('IntersectionObserver' in window) {
    const introObserver = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { introduction.classList.add('is-visible'); introObserver.disconnect(); } }, {threshold:.25});
    introObserver.observe(introduction);
  } else introduction.classList.add('is-visible');
  sync();
})();
