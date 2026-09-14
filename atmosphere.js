/* Breeze lives on inner layers; ScrollTrigger owns their parents. No competing transforms. */
(() => {
  'use strict';
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const light = matchMedia('(pointer: coarse), (max-width: 760px)');
  const scenes = [...document.querySelectorAll('[data-atmosphere-scene]')].map(scene => ({
    scene, visible: false, time: 0,
    layers: [...scene.querySelectorAll('[data-atmosphere]')].map((element, index) => ({
      element, cloud: element.dataset.atmosphere === 'cloud', depth: Number(element.dataset.depth),
      period: Number(element.dataset.period || 125), direction: Number(element.dataset.direction || 1),
      phase: index * 2.37 + (scene.matches('.garden-canopy') ? 1.7 : .4),
      optional: !!element.closest('.atmosphere-optional'), mesh: null, attempted: false
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
      for (const layer of scene.layers) {
        const {element,cloud,depth,phase,optional,period,direction} = layer;
        if (light.matches && optional) continue;
        const t = scene.time, d = depth * (light.matches ? .72 : 1);
        if (cloud) {
          // Repeated overlapping tiles make a seamless, several-minute passage of vapor.
          const travel=(t/(period*(light.matches?1.2:1))+phase/(Math.PI*2))%1;
          const x=direction>0?travel:1-travel;
          const y=d*3*Math.sin(t*.071+phase);
          const scaleY=1+d*.006*Math.sin(t*.053+phase);
          element.style.transform=`translate3d(calc(var(--cloud-step) * ${x}),${y}px,0) scaleY(${scaleY})`;
          element.style.opacity=.985+.015*Math.sin(t*.037+phase);
        } else {
          // The woody base stays at the edge; the free tips respond to a small, irregular breeze.
          if (!layer.attempted) { layer.attempted = true; layer.mesh = window.createCanopy?.(element); }
          layer.mesh?.render(t + phase * 5, light.matches);
          const wind = Math.sin(t * (.21 + depth * .043) + phase) + .26 * Math.sin(t * .57 + phase * 1.8);
          const x = d * 1.5 * Math.sin(t * .19 + phase);
          const y = d * .7 * Math.sin(t * .31 + phase * 1.3);
          element.style.transform = `translate3d(${x}px,${y}px,0) rotate(${d * .18 * wind}deg) scale(1.008)`;
        }
      }
    }
    if (active) frame = requestAnimationFrame(paint);
    else previous = 0;
  };
  const update = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; previous = 0;
    scenes.forEach(scene => scene.layers.forEach(layer => {
      const {element,optional} = layer;
      const running = allowed() && scene.visible && !(light.matches && optional);
      element.style.willChange = running ? 'transform' : 'auto';
      if (preference.matches) { element.style.removeProperty('transform'); element.style.removeProperty('opacity'); }
      if (preference.matches || (light.matches && optional) || stopped) { layer.mesh?.dispose(); layer.mesh = null; layer.attempted = false; }
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
