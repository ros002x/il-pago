(() => {
  'use strict';
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const body = document.body;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const welcome = document.querySelector('#benvenuti');
  const passage = document.querySelector('.passage');
  const experienceSection = document.querySelector('#esperienze');
  const track = document.querySelector('.experience-grid');
  const cards = [...track.children];
  const experienceButtons = [...document.querySelectorAll('[data-experience-jump]')];
  const progressText = document.querySelector('[data-scroll-percent]');
  const progressLine = document.querySelector('.journey-line i');
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  let heroScene = null;
  let passageScene = null;
  let galleryScene = null;
  let coastScene = null;
  let chromeFrame = 0;
  let scrollLimit = 1;
  let activeExperience = -1;
  let destroyed = false;

  // Update small fixed navigation from cached ScrollTrigger ranges, not layout reads.
  let surfaces = [];
  const updateChrome = () => {
    chromeFrame = 0;
    const y = window.scrollY;
    const ratio = Math.max(0, Math.min(1, y / scrollLimit));
    progressText.textContent = String(Math.round(ratio * 100)).padStart(2, '0');
    progressLine.style.transform = innerWidth > 760 ? `scaleY(${ratio})` : `scaleX(${ratio})`;
    body.classList.toggle('has-scrolled', y > 120);
    body.classList.toggle('in-gallery', !!galleryScene && y >= galleryScene.start - 120 && y <= galleryScene.end + 120);
    body.classList.toggle('in-canopy', !!passageScene && !!galleryScene && y >= passageScene.start - 80 && y <= galleryScene.end + 80);
    let dark = y < (heroScene?.end ?? hero.offsetHeight) && (!heroScene || heroScene.progress < .57);
    if (passageScene?.isActive && passageScene.progress > .56) dark = true;
    if (coastScene?.isActive) dark = true;
    for (const surface of surfaces) {
      if (y >= surface.start - 70 && y < surface.end - 70) dark = surface.dark;
    }
    if (coastScene?.isActive && coastScene.progress > .28 && coastScene.progress < .68) dark = false;
    body.classList.toggle('chrome-dark', dark);
  };
  const scheduleChrome = () => { if (!chromeFrame) chromeFrame = requestAnimationFrame(updateChrome); };
  const refreshChrome = () => {
    scrollLimit = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    surfaces = [...document.querySelectorAll('.table-section,.territory')].map(el => {
      const box = el.getBoundingClientRect();
      return { start: box.top + scrollY, end: box.bottom + scrollY, dark: true };
    });
    updateChrome();
  };
  window.addEventListener('scroll', scheduleChrome, { passive: true });
  ScrollTrigger.addEventListener('refresh', refreshChrome);

  const scrollTo = (position, immediate = false) => {
    const y = Math.max(0, Math.min(position, ScrollTrigger.maxScroll(window)));
    if (lenis) lenis.scrollTo(y, { immediate, duration: immediate ? 0 : 1.1, force: !document.querySelector('dialog[open]') });
    else window.scrollTo({ top: y, behavior: immediate || motionPreference.matches ? 'instant' : 'smooth' });
  };
  const targetPosition = (target) => {
    if (target === hero || target.id === 'main') return 0;
    if (target === welcome && heroScene) return heroScene.start + (heroScene.end - heroScene.start) * .98;
    if (target === experienceSection && galleryScene) return galleryScene.start;
    if (target === passage && passageScene) return passageScene.start;
    return target.getBoundingClientRect().top + scrollY - 85;
  };
  const followHash = () => {
    if (!location.hash) return;
    requestAnimationFrame(() => {
      let target;
      try { target = document.querySelector(location.hash); } catch { return; }
      if (target) scrollTo(targetPosition(target), true);
    });
  };
  window.addEventListener('hashchange', followHash);
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = link.getAttribute('href');
    if (hash.length < 2) return;
    let target;
    try { target = document.querySelector(hash); } catch { return; }
    if (!target) return;
    event.preventDefault();
    requestAnimationFrame(() => {
      scrollTo(targetPosition(target), motionPreference.matches);
      try { history.replaceState(null, '', hash); } catch { /* Also supports file://. */ }
      if (link.classList.contains('skip-link')) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
  document.addEventListener('ilpago:dialog', ({ detail }) => {
    if (detail.open) lenis?.stop();
    else { lenis?.start(); scheduleChrome(); }
  });

  const setActiveExperience = (index) => {
    if (index === activeExperience) return;
    activeExperience = index;
    experienceButtons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  };
  const goToExperience = (index, immediate = false) => {
    if (galleryScene) {
      const ratio = index / Math.max(1, cards.length - 1);
      scrollTo(galleryScene.start + ratio * (galleryScene.end - galleryScene.start - 1), immediate);
    } else cards[index].scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth', block: 'center' });
  };
  experienceButtons.forEach(button => button.addEventListener('click', () => goToExperience(Number(button.dataset.experienceJump))));
  // Keyboard users can reach every panel; focusing an off-screen link reveals its scene.
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.experience-card');
    if (!card || !galleryScene) return;
    const index = cards.indexOf(card);
    document.querySelector('.experience-viewport').scrollLeft = 0;
    const rect = card.getBoundingClientRect();
    if (rect.left < -40 || rect.right > innerWidth + 40) goToExperience(index, true);
  });

  const splitTitle = (element) => {
    const original = element.innerHTML;
    const fragments = [];
    let line = document.createElement('span');
    line.className = 'title-line-inner';
    [...element.childNodes].forEach(node => {
      if (node.nodeName === 'BR') { fragments.push(line); line = document.createElement('span'); line.className = 'title-line-inner'; }
      else line.append(node);
    });
    fragments.push(line);
    element.replaceChildren(...fragments.map(inner => {
      const mask = document.createElement('span');
      mask.className = 'title-line';
      mask.append(inner);
      return mask;
    }));
    return { lines: fragments, restore: () => { element.innerHTML = original; } };
  };

  document.fonts.ready.then(() => {
    if (destroyed) return;
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)', touch: '(pointer: coarse)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const { mobile, touch, reduced } = context.conditions;
      if (reduced) { refreshChrome(); return; }
      body.classList.add('premium-ready');
      hero.append(welcome);
      const titles = [];
      const events = [];
      let ticker;
      if (!mobile && !touch && Lenis) {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, wheelMultiplier: .9, anchors: false });
        lenis.on('scroll', ScrollTrigger.update);
        ticker = time => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
        if (document.querySelector('dialog[open]')) lenis.stop();
      }
      const scrub = mobile || touch ? .22 : .6;
      // Transform pins keep the same containing block across boundaries and avoid fixed-pin layout shifts.
      const activeLayer = (element, property = 'transform') => self => {
        element.style.willChange = self.isActive ? property : 'auto';
      };

      // HERO SCENE → EDITORIAL SCENE: one photograph stays on screen throughout.
      gsap.set(welcome, { autoAlpha: 1, clipPath: mobile ? 'inset(0% 0% 100% 0%)' : 'inset(0% 0% 0% 100%)' });
      gsap.set('.hero-visual', { clipPath: 'inset(0% 0% 0% 0%)' });
      const heroTimeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'hero-scene', trigger: hero, start: 'top top', end: () => `+=${innerHeight * (mobile ? 1.35 : 1.75)}`,
        pin: true, pinType: 'transform', scrub, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => { welcome.classList.toggle('is-present', self.progress > .64); scheduleChrome(); },
        onToggle: activeLayer(document.querySelector('.hero-images'))
      } });
      heroTimeline
        .to('.hero-title', { yPercent: -135, scaleX: .58, duration: .48 }, .15)
        .to('.hero-script', { y: () => -innerHeight * .55, rotation: -15, duration: .46 }, .2)
        .to('.hero-motto', { y: -150, autoAlpha: 0, duration: .2 }, .18)
        .to('.day-night,.hero-bottom', { autoAlpha: 0, duration: .14 }, .14)
        .to('.hero-center', { autoAlpha: 0, duration: .12 }, .46)
        .to('.hero-images', { scale: mobile ? 1.12 : 1.23, duration: .65 }, .24)
        .to('.hero-images', { xPercent: mobile ? -55 : -21, yPercent: mobile ? 22 : 0, duration: .48, ease: 'power2.inOut' }, .42)
        .to('.hero-visual', { clipPath: mobile ? 'inset(51% 60% 10% 6%)' : 'inset(14% 58% 9% 6%)', duration: .48, ease: 'power2.inOut' }, .42)
        .to(welcome, { clipPath: mobile ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 42%)', duration: mobile ? .18 : .48, ease: 'power2.inOut' }, mobile ? .76 : .42)
        .fromTo('.welcome-heading', { y: mobile ? 85 : 150 }, { y: 0, duration: .3, ease: 'power2.out' }, .61)
        .fromTo('.welcome-bottom', { y: 80 }, { y: 0, duration: .3, ease: 'power2.out' }, .65)
        .to({ hold: 0 }, { hold: 1, duration: .05 }, .95);
      heroScene = heroTimeline.scrollTrigger;

      // An entrance photograph becomes the entire viewport; the image is the transition.
      const frame = document.querySelector('.passage-frame');
      const passageTitle = document.querySelector('.passage-title');
      gsap.set(passageTitle, { xPercent: -50, yPercent: -50, x: 0, y: 35, autoAlpha: 0 });
      const entrance = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'entrance-scene', trigger: passage, pin: '.passage-stage', pinType: 'transform', start: 'top top',
        end: () => `+=${innerHeight * (mobile ? 1.25 : 1.6)}`, scrub, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: scheduleChrome, onToggle: activeLayer(frame, 'clip-path')
      } });
      entrance
        .fromTo(frame, { clipPath: mobile ? 'inset(52% 8% 9% 25% round 42% 42% 0% 0%)' : 'inset(19% 8% 10% 53% round 43% 43% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)', duration: .65, ease: 'power2.inOut' }, .19)
        .fromTo('.passage-frame>img', { scale: 1.12, yPercent: 3 }, { scale: 1, yPercent: 0, duration: .9 }, .05)
        .to('.passage-invitation', { autoAlpha: 0, y: -35, duration: .2 }, .24)
        .to('.passage-label', { autoAlpha: 0, duration: .18 }, .23)
        .to('.passage-shade', { opacity: 1, duration: .25 }, .58)
        .to(passageTitle, { autoAlpha: 1, y: 0, duration: .2 }, .77)
        .to('.passage-foot', { color: '#fff9e8', duration: .2 }, .6)
        .to({ hold: 0 }, { hold: 1, duration: .15 }, .97);
      passageScene = entrance.scrollTrigger;

      // Calm editorial passages: continuous depth, not repeated entrance presets.
      const story = gsap.timeline({ scrollTrigger: { id: 'story-scene', trigger: '.story', start: 'top bottom', end: 'bottom top', scrub } });
      story.fromTo('.story-main img', { yPercent: -9 }, { yPercent: 0, ease: 'none' }, 0)
        .fromTo('.family-photo', { y: mobile ? 30 : 100 }, { y: mobile ? -20 : -70, ease: 'none' }, 0);
      for (const selector of ['#story-title','#rooms-title']) {
        const element = document.querySelector(selector);
        if (!element) continue;
        const split = splitTitle(element);
        titles.push(split);
        gsap.fromTo(split.lines, { yPercent: 110, rotation: 2 }, { yPercent: 0, rotation: 0, stagger: .1, ease: 'none', scrollTrigger: {
          trigger: element, start: 'top 94%', end: 'top 48%', scrub: mobile ? .15 : .4, invalidateOnRefresh: true
        } });
      }
      gsap.fromTo('.room-photo-wrap>img', { yPercent: -11, scale: 1.06 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: {
        id: 'rooms-photo', trigger: '.room-gallery', start: 'top bottom', end: 'bottom top', scrub
      } });

      const table = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'table-scene', trigger: '.table-section', start: 'top 95%', end: mobile ? 'top 15%' : 'top top', scrub
      } });
      table.fromTo('.table-photo', { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
        .fromTo('.table-photo>img', { scale: 1.16, yPercent: -5 }, { scale: 1, yPercent: 0, duration: 1 }, 0)
        .fromTo('#table-title', { x: mobile ? 0 : 90 }, { x: 0, duration: .7 }, .25);

      // PINNED GALLERY: three photographic compositions share one viewport.
      const distance = () => Math.max(0, track.scrollWidth - cards[0].getBoundingClientRect().width);
      const horizontal = gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: {
        id: 'experience-scene', trigger: experienceSection, start: 'top top', end: () => `+=${distance() * (mobile ? 1.4 : 1)}`,
        pin: true, pinType: 'transform', scrub: mobile ? .2 : .5, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => setActiveExperience(Math.round(self.progress * (cards.length - 1))),
        onToggle: activeLayer(track)
      } });
      galleryScene = horizontal.scrollTrigger;
      // One sticky canopy crosses the garden, the unpinned handover and all three chapters.
      // Its outer transforms describe camera travel; the inner skins keep their own wind clock.
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'canopy-travel', trigger: '.nature-journey', start: () => passageScene.start, end: () => galleryScene.end,
        scrub, invalidateOnRefresh: true, refreshPriority: -1
      } })
        .fromTo('.canopy-rise', { xPercent: 0, yPercent: 0, scale: 1 }, { xPercent: -9, yPercent: 4, scale: 1.13, duration: .3 }, 0)
        .to('.canopy-rise', { xPercent: 2, yPercent: -3, scale: 1.03, duration: .23, ease: 'sine.inOut' }, .3)
        .to('.canopy-rise', { xPercent: -39, yPercent: 9, scale: 1.27, duration: .47, ease: 'sine.in' }, .53)
        .fromTo('.canopy-hanging', { xPercent: 0, yPercent: 0, scale: 1 }, { xPercent: 6, yPercent: -5, scale: 1.1, duration: .3 }, 0)
        .to('.canopy-hanging', { xPercent: -2, yPercent: 2, scale: .96, duration: .25, ease: 'sine.inOut' }, .3)
        .to('.canopy-hanging', { xPercent: 6, yPercent: -43, scale: 1.24, duration: .45, ease: 'sine.in' }, .55)
        .fromTo('.canopy-close', { xPercent: 7, yPercent: 12, scale: 1.06 }, { xPercent: -4, yPercent: -5, scale: 1.3, duration: .34 }, 0)
        .to('.canopy-close', { xPercent: 57, yPercent: 35, scale: 1.5, duration: .23 }, .3);
      cards.forEach(card => {
        gsap.fromTo(card.querySelector('.experience-photo img'), { xPercent: -9 }, { xPercent: 0, ease: 'none', scrollTrigger: {
          trigger: card, containerAnimation: horizontal, start: 'left right', end: 'right left', scrub: true
        } });
      });
      setActiveExperience(0);

      // Move into the cloud bank, then past its front edge. The distant plane lingers in the sky.
      const coast = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        id: 'coast-scene', trigger: '.territory', pin: '.coast-stage', pinType: 'transform', start: 'top top', end: () => `+=${innerHeight * (mobile ? 1.5 : 1.9)}`, scrub, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: scheduleChrome
      } });
      coast.fromTo('.coast-land>img', { scale: 1.04, yPercent: 0 }, { scale: 1.22, yPercent: 16, duration: .56 }, 0)
        .fromTo('.coast-bloom', { xPercent: 0, yPercent: 0, scale: 1, opacity: 1 }, { xPercent: 45, yPercent: 22, scale: 1.4, opacity: 0, duration: .4, ease: 'sine.in' }, 0)
        .to('.coast-land-copy', { autoAlpha: 0, y: -55, duration: .19 }, .1)
        .fromTo('.cloud-back', { yPercent: 12, scale: .94, opacity: 0 }, { yPercent: 5, scale: 1.03, opacity: .72, duration: .36 }, .12)
        .fromTo('.cloud-middle', { yPercent: -14, xPercent: 9, scale: .83, opacity: 0 }, { yPercent: 20, xPercent: 3, scale: 1.1, opacity: .96, duration: .36, ease: 'sine.inOut' }, .1)
        .fromTo('.cloud-one', { xPercent: 5, yPercent: 16, scale: .76, opacity: 0 }, { xPercent: 1, yPercent: -33, scale: 1.22, opacity: 1, duration: .37, ease: 'sine.inOut' }, .13)
        .fromTo('.cloud-two', { xPercent: 8, yPercent: -16, scale: .8, opacity: 0 }, { xPercent: -8, yPercent: 20, scale: 1.1, opacity: .96, duration: .34 }, .17)
        .to('.coast-land', { autoAlpha: 0, duration: .17 }, .34)
        .fromTo('.coast-sea', { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, .48)
        .to('.coast-sky', { autoAlpha: 0, duration: .27 }, .52)
        .fromTo('.coast-sea>img', { scale: 1.16, yPercent: -5 }, { scale: 1, yPercent: 0, duration: .63 }, .4)
        .to('.cloud-one', { xPercent: -20, yPercent: mobile ? 24 : 28, scale: mobile ? 2 : 2.35, duration: .55, ease: 'sine.in' }, .5)
        .to('.cloud-one', { opacity: 0, duration: .14 }, .91)
        .to('.cloud-two', { xPercent: 20, yPercent: -40, scale: 1.75, duration: .5, ease: 'sine.in' }, .51)
        .to('.cloud-two', { opacity: 0, duration: .12 }, .89)
        .to('.cloud-middle', { xPercent: -7, yPercent: -13, scale: 1.16, opacity: .68, duration: .51 }, .46)
        .to('.cloud-back', { yPercent: -5, xPercent: 2, opacity: .44, duration: .5 }, .48)
        .fromTo('.territory-copy', { autoAlpha: 0, y: 55 }, { autoAlpha: 1, y: 0, duration: .23 }, .79)
        .fromTo('.territory-distances', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .2 }, .87)
        .to({ hold: 0 }, { hold: 1, duration: .18 }, 1.1);
      coastScene = coast.scrollTrigger;
      gsap.fromTo('.footer-wordmark', { y: 55 }, { y: 0, ease: 'none', scrollTrigger: {
        id: 'final-scene', trigger: '.site-footer', start: 'top bottom', end: 'bottom bottom', scrub: .4
      } });

      // Refresh only on structural changes; no repeated measuring in scroll handlers.
      let refreshTimer;
      const onDetails = () => { clearTimeout(refreshTimer); refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120); };
      document.querySelectorAll('.farm-paths details').forEach(detail => {
        detail.addEventListener('toggle', onDetails);
        events.push(() => detail.removeEventListener('toggle', onDetails));
      });
      const finish = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); refreshChrome(); };
      const initFrame = requestAnimationFrame(finish);
      return () => {
        cancelAnimationFrame(initFrame);
        clearTimeout(refreshTimer);
        events.forEach(remove => remove());
        if (ticker) gsap.ticker.remove(ticker);
        lenis?.destroy(); lenis = null;
        heroScene = passageScene = galleryScene = coastScene = null;
        hero.after(welcome);
        welcome.classList.remove('is-present');
        titles.forEach(title => title.restore());
        body.classList.remove('premium-ready', 'in-gallery', 'in-canopy');
        activeExperience = -1;
        requestAnimationFrame(refreshChrome);
      };
    });
    const onLoad = () => { ScrollTrigger.refresh(); refreshChrome(); };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    // Respect direct links after pinned ranges have been measured.
    followHash();
    window.addEventListener('pagehide', (event) => {
      if (event.persisted) return;
      destroyed = true;
      media.revert();
      if (chromeFrame) cancelAnimationFrame(chromeFrame);
      window.removeEventListener('scroll', scheduleChrome);
      window.removeEventListener('hashchange', followHash);
      ScrollTrigger.removeEventListener('refresh', refreshChrome);
    });
    window.addEventListener('pageshow', event => { if (event.persisted) onLoad(); });
  }).catch(error => {
    // Content remains accessible if animation initialization is unavailable.
    console.error('Il Pago motion:', error);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
    gsap.globalTimeline.clear();
    lenis?.destroy();
    body.classList.remove('premium-ready','motion-ready');
    if (welcome.parentElement === hero) hero.after(welcome);
    gsap.set('.reveal,.hero-center,.hero-bottom,.welcome', { clearProps: 'all' });
  });
})();
