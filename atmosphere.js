/* Breeze lives on inner layers; ScrollTrigger owns their parents. No competing transforms. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const light = matchMedia('(pointer: coarse), (max-width: 760px)');
  const scenes = [...document.querySelectorAll('.passage-stage,.experiences,.coast-stage')].map(scene => ({
    scene, visible: false, time: 0,
    layers: [...scene.querySelectorAll('[data-atmosphere]')].map((element, index) => ({
      element, cloud: element.dataset.atmosphere === 'cloud', depth: Number(element.dataset.depth),
      phase: index * 2.37 + (scene.matches('.experiences') ? 1.7 : .4),
      optional: !!element.closest('.cloud-back,.journey-far,.leaf-far')
    }))
  }));
  let frame = 0, previous = 0, stopped = false;
  const allowed = () => !stopped && !preference.matches && !document.hidden && !document.querySelector('dialog[open]');
  const paint = now => {
    frame = 0;
    if (!allowed()) { previous = 0; return; }
    const dt = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    let active = false;
    for (const scene of scenes) {
      if (!scene.visible) continue;
      active = true;
      scene.time += dt;
      for (const {element,cloud,depth,phase,optional} of scene.layers) {
        if (light.matches && optional) continue;
        const t = scene.time, d = depth * (light.matches ? .72 : 1);
        if (cloud) {
          // Several-minute drift with independent fine changes: no resets, rotation or visible seams.
          const x = d * (5.8 * Math.sin(t * .019 + phase) + 1.1 * Math.sin(t * .037 + phase * .7));
          const y = d * (.7 * Math.sin(t * .063 + phase) + .25 * Math.sin(t * .103));
          const scale = 1.04 + d * .018 * Math.sin(t * .029 + phase);
          element.style.transform = `translate3d(${x}%,${y}%,0) scale(${scale})`;
        } else {
          // The woody base stays at the edge; the free tips respond to a small, irregular breeze.
          const wind = Math.sin(t * (.42 + depth * .06) + phase) + .24 * Math.sin(t * .79 + phase * 1.8);
          const x = d * 1.4 * Math.sin(t * .27 + phase);
          const y = d * .75 * Math.sin(t * .38 + phase * 1.3);
          element.style.transform = `translate3d(${x}px,${y}px,0) rotate(${d * 1.15 * wind}deg)`;
        }
      }
    }
    if (active) frame = requestAnimationFrame(paint);
    else previous = 0;
  };
  const update = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; previous = 0;
    scenes.forEach(scene => scene.layers.forEach(({element,optional}) => {
      const running = allowed() && scene.visible && !(light.matches && optional);
      element.style.willChange = running ? 'transform' : 'auto';
      if (preference.matches) element.style.removeProperty('transform');
    }));
    if (allowed() && scenes.some(scene => scene.visible)) frame = requestAnimationFrame(paint);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { scenes.find(s => s.scene === entry.target).visible = entry.isIntersecting; });
    update();
  }, {threshold: 0});
  scenes.forEach(({scene}) => observer.observe(scene));
  preference.addEventListener('change', update);
  light.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  document.addEventListener('ilpago:dialog', update);
  const restore = () => { stopped = false; update(); };
  window.addEventListener('pageshow', restore);
  window.addEventListener('pagehide', event => {
    stopped = true; update();
    if (event.persisted) return;
    observer.disconnect();
    preference.removeEventListener('change', update);
    light.removeEventListener('change', update);
    document.removeEventListener('visibilitychange', update);
    document.removeEventListener('ilpago:dialog', update);
    window.removeEventListener('pageshow', restore);
  });
})();
