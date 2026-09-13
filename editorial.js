(() => {
  'use strict';
  const body = document.body;
  const update = () => body.classList.toggle('has-scrolled', scrollY > 30);
  addEventListener('scroll', update, { passive: true }); update();
  document.querySelectorAll('.chapter-nav a').forEach(link => link.addEventListener('click', () => {
    document.querySelectorAll('.chapter-nav a').forEach(a => a.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'location');
  }));
  const rows = [...document.querySelectorAll('[data-product-category]')];
  const filters = [...document.querySelectorAll('[data-product-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const key = button.dataset.productFilter;
    rows.forEach(row => { row.hidden = key !== 'all' && row.dataset.productCategory !== key; });
    const count = rows.filter(row => !row.hidden).length;
    document.querySelector('[data-product-count]').textContent = `${count} ${count === 1 ? 'prodotto' : 'prodotti'}`;
  }));
  const revealHash = () => {
    let target; try { target = location.hash ? document.querySelector(location.hash) : null; } catch { return; }
    if (target?.matches('details')) { target.hidden = false; target.open = true; }
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };
  addEventListener('hashchange', revealHash);
  document.fonts.ready.then(() => {
    revealHash();
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      document.querySelectorAll('.detail-figure img').forEach(img => {
        gsap.fromTo(img, { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1.08, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .5 } });
      });
    });
    document.querySelectorAll('details').forEach(item => item.addEventListener('toggle', () => ScrollTrigger.refresh()));
    addEventListener('pagehide', event => { if (!event.persisted) media.revert(); });
  });
})();
