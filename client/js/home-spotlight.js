(() => {
  const root = document.querySelector('.spotlight');
  if (!root) return;
  const slides = [...root.querySelectorAll('.spotlight-slide')];
  const picks = [...root.querySelectorAll('[data-spotlight]')];
  const pause = root.querySelector('[data-spotlight-pause]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = reduced.matches, visible = false, focused = false, hovered = false, timer;
  function show(index, announce = true) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    picks.forEach((pick, i) => pick.setAttribute('aria-pressed', String(i === current)));
    if (announce) root.querySelector('.spotlight-status').textContent = slides[current].getAttribute('aria-label');
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (visible && !paused && !focused && !hovered && !document.hidden) timer = setTimeout(() => show(current + 1, false), 7000);
  }
  function syncPause() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Play automatic slideshow' : 'Pause automatic slideshow');
    pause.textContent = paused ? '▷' : 'Ⅱ';
    schedule();
  }
  picks.forEach((pick, i) => pick.addEventListener('click', () => show(i)));
  root.querySelector('[data-spotlight-prev]').addEventListener('click', () => show(current - 1));
  root.querySelector('[data-spotlight-next]').addEventListener('click', () => show(current + 1));
  pause.addEventListener('click', () => { paused = !paused; syncPause(); });
  root.addEventListener('focusin', () => { focused = true; schedule(); });
  root.addEventListener('focusout', () => { focused = root.contains(document.activeElement); schedule(); });
  root.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  root.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  root.querySelector('.spotlight-picks').addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    show(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
    picks[current].focus();
  });
  let touch;
  const stage = root.querySelector('.spotlight-stage');
  stage.addEventListener('touchstart', event => { const point = event.changedTouches[0]; touch = { x: point.clientX, y: point.clientY }; }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touch) return;
    const point = event.changedTouches[0], dx = touch.x - point.clientX, dy = touch.y - point.clientY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) show(current + (dx > 0 ? 1 : -1));
    touch = null;
  }, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', event => { paused = event.matches; syncPause(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: .25 }).observe(root);
  syncPause();
})();
