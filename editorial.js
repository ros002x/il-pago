(() => {
  'use strict';
  const legacyRecipes = document.querySelector('[data-recipe-redirects]');
  if (legacyRecipes) {
    // Old bookmarked recipe fragments resolve once, without adding a history entry.
    const routes = JSON.parse(legacyRecipes.dataset.recipeRedirects);
    location.replace(routes[location.hash.slice(1)] || 'ristorante.html#ricette');
    return;
  }
  const isHistoryReturn = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  const savedRecipeScroll = history.state?.ilPagoRecipeScroll;
  const restoreRecipeScroll = isHistoryReturn && Number.isFinite(savedRecipeScroll) && document.querySelector('#ricette');
  history.scrollRestoration = restoreRecipeScroll ? 'manual' : 'auto';
  // Keep this position on the current history entry. No new entries or hashes.
  // WebKit otherwise restores the #ricette anchor instead of the clicked card.
  document.querySelector('#ricette')?.addEventListener('click', event => {
    const link = event.target.closest('a[href^="ricetta-"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    history.replaceState({ ...history.state, ilPagoRecipeScroll: scrollY }, '');
  });
  addEventListener('pageshow', () => {
    if (restoreRecipeScroll) document.fonts.ready.then(() => requestAnimationFrame(() => {
      scrollTo({ top: savedRecipeScroll, behavior: 'instant' });
    }));
  });
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
  // Native links/history restore their own scroll. Only collapsed product details need opening.
  addEventListener('hashchange', () => {
    let target; try { target = document.querySelector(location.hash); } catch { return; }
    if (target?.matches('details')) revealHash();
  });
  document.fonts.ready.then(() => {
    if (!isHistoryReturn) revealHash();
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    // Editorial photographs use their own uncropped caption row; no overscan or hidden enlargement.
    document.querySelectorAll('details').forEach(item => item.addEventListener('toggle', () => ScrollTrigger.refresh()));
  });
})();
