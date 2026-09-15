/* Natural motion is in the licensed footage. GSAP moves only the outer scene layers. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const light=matchMedia('(pointer: coarse), (max-width: 760px)');
  const films=[...document.querySelectorAll('.ambient-film')].map(element=>({element,visible:false,video:element.querySelector('video'),fallback:element.querySelector('.ambient-fallback'),generation:0}));
  let capability;
  const alphaVideo=()=>capability||=(async()=>{
    const video=document.createElement('video');
    if(!video.canPlayType('video/webm; codecs="vp9"'))return false;
    return new Promise(resolve=>{
      let finished=false;
      const finish=ok=>{if(finished)return;finished=true;clearTimeout(timer);video.pause();video.removeAttribute('src');video.load();resolve(ok);};
      const timer=setTimeout(()=>finish(false),1800);
      video.muted=true;video.playsInline=true;video.preload='auto';
      video.addEventListener('error',()=>finish(false),{once:true});
      video.addEventListener('loadeddata',()=>{
        try{const canvas=document.createElement('canvas');canvas.width=8;canvas.height=8;const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(video,0,0,8,8);const empty=context.getImageData(1,4,1,1).data,solid=context.getImageData(6,4,1,1).data;finish(empty[3]<20&&solid[3]>230&&solid[0]>100);}catch{finish(false);}
      },{once:true});
      video.src='assets/motion/alpha-probe.webm';video.load();
    });
  })();
  let stopped=false;
  const allowed=film=>!stopped&&!reduced.matches&&!document.hidden&&!document.querySelector('dialog[open]')&&film.visible&&!(light.matches&&film.element.closest('.atmosphere-optional'));
  const fallback=film=>{
    const {element,video,fallback:image}=film;
    video.pause();element.classList.remove('has-video');element.dataset.format='webp';
    image.onload=()=>{if(allowed(film))element.classList.add('has-fallback');};
    if(!image.getAttribute('src'))image.src=element.dataset.webp;
    else if(image.complete)element.classList.add('has-fallback');
  };
  const update=async film=>{
    const generation=++film.generation,{element,video,fallback:image}=film;
    if(!allowed(film)){
      video.pause();
      if(image.getAttribute('src')){image.removeAttribute('src');element.classList.remove('has-fallback');}
      return;
    }
    const alpha=await alphaVideo();
    if(generation!==film.generation||!allowed(film))return;
    if(!alpha||film.videoFailed){fallback(film);return;}
    if(!video.getAttribute('src')){
      video.muted=true;video.defaultMuted=true;
      video.src=element.dataset.webm;
      video.addEventListener('loadedmetadata',()=>{if(Number.isFinite(video.duration))video.currentTime=Number(element.dataset.offset||0)%video.duration;},{once:true});
      video.addEventListener('error',()=>{film.videoFailed=true;if(allowed(film))fallback(film);},{once:true});
    }
    try{
      await video.play();
      if(!allowed(film)){video.pause();return;}
      element.dataset.format='webm';element.classList.add('has-video');
    }catch{if(allowed(film)){film.videoFailed=true;fallback(film);}}
  };
  const refresh=()=>films.forEach(update);
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){const film=films.find(f=>f.element===entry.target);film.visible=entry.isIntersecting;update(film);}
  },{rootMargin:'260px 100px',threshold:0});
  films.forEach(f=>observer.observe(f.element));
  reduced.addEventListener('change',refresh);light.addEventListener('change',refresh);
  document.addEventListener('visibilitychange',refresh);document.addEventListener('ilpago:dialog',refresh);
  window.addEventListener('pageshow',()=>{stopped=false;refresh();});
  window.addEventListener('pagehide',event=>{stopped=true;refresh();if(!event.persisted)observer.disconnect();});
})();
