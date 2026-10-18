/* Progressive enhancement: the site remains readable without JavaScript. */
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const captureMode = new URLSearchParams(location.search).get('capture') === '1';
const motionButton = document.querySelector('.motion-toggle');
let userPaused = false;
try { userPaused = sessionStorage.getItem('motion-paused') === 'true'; } catch (_) {}
let revealObserver;
const motionDisabled = () => userPaused || captureMode;

function closeMenu(returnFocus = false) {
  if (!siteNav || !menuToggle) return;
  const wasOpen = siteNav.classList.contains('open');
  siteNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  if (returnFocus && wasOpen) menuToggle.focus();
}
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('focusin', event => {
    if (!siteNav.contains(event.target) && event.target !== menuToggle) closeMenu();
  });
  window.addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); });
}

const revealTargets = Array.from(document.querySelectorAll('.studio-copy, .project-stage, .page-hero .container, .section-header, .service-visual-card, .marketing-service-card, .step-card, .audience-card, .contact-panel, .contact-card, .premium-gradient, .showcase-card, .proof-card, .demo-card, .trust-card, .social-spotlight'));
function revealAll() {
  revealObserver?.disconnect();
  revealTargets.forEach(el => el.classList.add('is-visible'));
}
function syncMotion() {
  document.body.classList.toggle('motion-paused', motionDisabled());
  if (captureMode) document.body.classList.add('capture-mode');
  if (motionButton) {
    motionButton.textContent = userPaused ? 'Resume motion' : 'Pause motion';
    motionButton.setAttribute('aria-pressed', String(motionDisabled()));
    motionButton.disabled = captureMode;
  }
  if (motionDisabled()) revealAll();
}
if (motionButton) motionButton.addEventListener('click', () => {
  userPaused = !userPaused;
  try { sessionStorage.setItem('motion-paused', String(userPaused)); } catch (_) {}
  syncMotion();
});


if (!motionDisabled() && 'IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  }), { threshold: 0.08 });
  revealTargets.forEach(el => {
    el.classList.add('reveal');
    const siblings = [...el.parentElement.children];
    el.style.setProperty('--reveal-delay', `${(siblings.indexOf(el) % 3) * 90}ms`);
    // Do not hide the initial screen or anything reached by keyboard navigation.
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-visible');
    else revealObserver.observe(el);
    el.addEventListener('focusin', () => { el.classList.add('is-visible'); revealObserver.unobserve(el); });
  });
}
syncMotion();

const progress = document.querySelector('.scroll-progress');
let scrollFrame = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
  scrollFrame = false;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const stage = document.querySelector('.project-stage');
if (stage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  stage.addEventListener('pointermove', event => {
    if (motionDisabled()) return;
    const rect = stage.getBoundingClientRect();
    stage.style.setProperty('--tilt-x', `${((event.clientX - rect.left) / rect.width - .5) * 6}deg`);
    stage.style.setProperty('--tilt-y', `${-((event.clientY - rect.top) / rect.height - .5) * 6}deg`);
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--tilt-x', '0deg');
    stage.style.setProperty('--tilt-y', '0deg');
  });
}

// Preserve the existing image fallbacks without retrying an already loaded image.
document.querySelectorAll('.resilient-image').forEach(image => {
  const shell = image.closest('.image-shell');
  const alternatives = (image.dataset.fallbackSrcs || '').split('|').filter(Boolean);
  let index = 0;
  const recover = () => {
    if (index < alternatives.length) image.src = alternatives[index++];
    else shell?.classList.add('is-broken');
  };
  image.addEventListener('error', recover);
  image.addEventListener('load', () => shell?.classList.remove('is-broken'));
  if (image.complete && image.naturalWidth === 0) recover();
});
/* Entry scene, colour curtains, navigation transitions, and a pointer trail. */
const entryScreen = document.querySelector('.entry-screen');
const entryPause = document.querySelector('.entry-pause');
const replayIntro = document.querySelector('.replay-intro');
const curtain = document.querySelector('.transition-curtain');
curtain?.querySelectorAll('i').forEach((column, index) => column.style.setProperty('--column', index));
let transitionBusy = false;
const readSession = key => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
const writeSession = (key, value) => { try { sessionStorage.setItem(key, value); } catch (_) {} };
const pageRegions = [...document.querySelectorAll('body > .site-header, body > main, body > .site-footer')];
function syncEntryPause() {
  if (entryPause) {
    entryPause.textContent = userPaused ? 'Resume motion' : 'Pause motion';
    entryPause.setAttribute('aria-pressed', String(userPaused));
  }
}
entryPause?.addEventListener('click', () => {
  userPaused = !userPaused;
  writeSession('motion-paused', String(userPaused));
  syncMotion();
  syncEntryPause();
});
motionButton?.addEventListener('click', syncEntryPause);
syncEntryPause();
let introFadeTimer;
let introEndTimer;
function clearIntroTimers() {
  clearTimeout(introFadeTimer);
  clearTimeout(introEndTimer);
}
function showEntry() {
  if (!entryScreen || transitionBusy) return;
  clearIntroTimers();
  if (motionDisabled()) { finishEntry('main-content'); return; }
  closeMenu();
  document.body.classList.remove('intro-finishing');
  document.body.classList.add('entry-active');
  document.body.classList.remove('site-entered', 'entry-leaving');
  pageRegions.forEach(region => { region.inert = true; });
  entryScreen.inert = false;
  entryScreen.querySelector('[data-enter]')?.focus({ preventScroll:true });
  introFadeTimer = setTimeout(() => document.body.classList.add('intro-finishing'), 6600);
  introEndTimer = setTimeout(() => finishEntry('main-content'), 7100);
}
function finishEntry(targetId) {
  clearIntroTimers();
  entryScreen.inert = true;
  pageRegions.forEach(region => { region.inert = false; });
  document.body.classList.remove('entry-active', 'entry-leaving', 'intro-finishing');
  document.body.classList.add('site-entered');
  const target = document.getElementById(targetId) || document.getElementById('main-content');
  if (targetId === 'selected-work') {
    target.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    target.scrollIntoView({ behavior:'instant', block:'start' });
  } else window.scrollTo({ top:0, behavior:'instant' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll:true });
}
function enterSite(targetId) {
  if (transitionBusy) return;
  clearIntroTimers();
  if (entryScreen?.classList.contains('cinematic-intro')) { finishEntry(targetId); return; }
  if (motionDisabled()) { finishEntry(targetId); return; }
  transitionBusy = true;
  document.body.classList.add('entry-leaving', 'transition-running');
  window.setTimeout(() => finishEntry(targetId), 820);
  window.setTimeout(() => {
    document.body.classList.remove('transition-running');
    transitionBusy = false;
  }, 1650);
}
entryScreen?.querySelectorAll('[data-enter]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  enterSite(link.dataset.enter);
}));
replayIntro?.addEventListener('click', showEntry);
document.querySelector('.skip-link')?.addEventListener('click', event => {
  if (document.body.classList.contains('entry-active')) {
    event.preventDefault();
    enterSite('main-content');
  }
});
if (entryScreen) {
  const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  if (!captureMode && (!location.hash || isRefresh)) showEntry();
  else entryScreen.inert = true;
}
if (readSession('page-transition') === 'true') {
  writeSession('page-transition', 'false');
  document.body.classList.add('page-arriving');
  setTimeout(() => document.body.classList.remove('page-arriving'), 1200);
}
// Standard browser controls, downloads, external links, and anchors retain native behaviour.
document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download') || link.hasAttribute('data-enter')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !/^https?:$/.test(url.protocol) || url.pathname === location.pathname || motionDisabled() || !curtain) return;
  event.preventDefault();
  if (transitionBusy) return;
  transitionBusy = true;
  closeMenu();
  document.body.classList.add('transition-running');
  writeSession('page-transition', 'true');
  setTimeout(() => location.assign(url.href), 820);
});
window.addEventListener('pageshow', () => {
  document.body.classList.remove('transition-running');
  transitionBusy = false;
});

const strip = document.querySelector('.colour-strip');
if (strip) {
  const original = strip.querySelector('.container');
  const moving = document.createElement('div');
  moving.className = 'moving-strip';
  moving.setAttribute('aria-hidden', 'true');
  for (let i=0;i<2;i++) {
    const copy = document.createElement('div');
    copy.className = 'strip-copy';
    copy.innerHTML = original.innerHTML;
    moving.append(copy);
  }
  strip.replaceChildren(moving);
}

if (matchMedia('(hover:hover) and (pointer:fine)').matches && !captureMode) {
  const trail = document.createElement('div');
  trail.className = 'pointer-trail';
  trail.setAttribute('aria-hidden', 'true');
  const dots = Array.from({ length:7 }, () => {
    const dot = document.createElement('i');
    trail.append(dot);
    return { dot, x:0, y:0 };
  });
  document.body.append(trail);
  let targetX=0,targetY=0,frame=0,fadeTimer,started=false;
  const fade = () => dots.forEach(({dot}) => { dot.style.opacity='0'; });
  function drawTrail() {
    frame=0;
    if (motionDisabled() || document.hidden) { fade(); return; }
    let x=targetX,y=targetY,distance=0;
    dots.forEach((item,index) => {
      item.x+=(x-item.x)*.38;
      item.y+=(y-item.y)*.38;
      item.dot.style.transform=`translate3d(${item.x-4}px,${item.y-4}px,0) scale(${1-index*.07})`;
      item.dot.style.opacity=String(.65-index*.06);
      distance+=Math.abs(x-item.x)+Math.abs(y-item.y);
      x=item.x;y=item.y;
    });
    if (distance>1) frame=requestAnimationFrame(drawTrail);
  }
  document.addEventListener('pointermove', event => {
    targetX=event.clientX;targetY=event.clientY;
    if (!started) { dots.forEach(item=>{item.x=targetX;item.y=targetY;});started=true; }
    if (!frame) frame=requestAnimationFrame(drawTrail);
    clearTimeout(fadeTimer);
    fadeTimer=setTimeout(fade,450);
  }, { passive:true });
  document.addEventListener('pointerleave',fade);
  document.addEventListener('visibilitychange',fade);
}
