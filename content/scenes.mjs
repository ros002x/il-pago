// Restored photographic cutouts; GSAP owns only the outer parallax layers.
const layer = (picture, name, cls, sizes) => `<div class="${cls}" aria-hidden="true"><div class="atmosphere-skin">${picture(name,'','',false,sizes)}</div></div>`;
export const gardenCanopy = (picture, navigation) => `<div class="garden-canopy" data-atmosphere-scene>
 ${layer(picture, 'bougainvillea-mound','garden-plant canopy-distant atmosphere-optional','29vw')}
 ${layer(picture, 'bougainvillea-mound','garden-plant canopy-rise','(max-width: 760px) 80vw, 52vw')}
 ${layer(picture, 'bougainvillea-hanging','garden-plant canopy-hanging','(max-width: 760px) 50vw, 43vw')}
 ${layer(picture, 'bougainvillea-mound','garden-plant canopy-close atmosphere-optional','35vw')}
 ${navigation}
</div>`;

export const coastalScene = (picture, arrow) => {
 const bank = (name, depth, period, direction) => `<div class="coast-cloud ${name}" aria-hidden="true"><div class="atmosphere-skin cloud-drift" data-atmosphere="cloud" data-depth="${depth}" data-period="${period}" data-direction="${direction}">${Array.from({length:4},()=>picture('cloud-shore-edge','','',false,'(max-width: 760px) 100vw, 70vw')).join('')}</div></div>`;
 return `<section class="territory" id="territorio" aria-labelledby="territory-title">
 <div class="coast-stage" data-atmosphere-scene>
  <div class="coast-sea">${picture('beach-lido','Ombrelloni e lettini sulla costa ionica lucana nella luce del sole','','','max(100vw, 192svh)')}<div class="territory-shade" aria-hidden="true"></div></div>
  ${bank('cloud-back atmosphere-optional',.25,170,1)}${bank('cloud-middle',.55,125,-1)}${bank('cloud-one',1,95,1)}
  <div class="coast-white"><div class="coast-intro">
   <span class="micro">Rotondella, Basilicata</span>
   <div class="coast-itinerary" aria-label="Il Pago e i luoghi da raggiungere">
    <svg class="itinerary-line" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true"><path d="M15 62 C155 66 160 12 310 37 S480 88 615 45 S840 30 985 62"/></svg>
    <a href="il-pago.html"><svg class="small-flower" aria-hidden="true"><use href="#flower"/></svg><span class="micro">Il Pago</span><small>La tua casa in campagna</small></a>
    <a href="territorio.html#rotondella"><span class="itinerary-dot" aria-hidden="true"></span><span class="micro">Rotondella</span><small>Il borgo, da scoprire</small></a>
    <a href="territorio.html#mare"><span class="itinerary-dot" aria-hidden="true"></span><span class="micro">Mare Jonio</span><small>A 4,5 km dal Pago</small></a>
    <a href="territorio.html#matera"><span class="itinerary-dot" aria-hidden="true"></span><span class="micro">Matera</span><small>A 65 km dal Pago</small></a>
   </div>
  </div></div>
  <div class="coast-heading"><h2 class="coast-intro-title" id="territory-title">Dalla nostra terra,<br>fino al blu dello <span class="script">Ionio.</span></h2></div>
  <div class="territory-copy"><span class="micro">La costa ionica lucana · A 4,5 km dal Pago</span><a class="text-link" href="territorio.html#mare">Scopri la costa e i dintorni ${arrow}</a></div>
  <div class="territory-distances"><div><span class="distance">4,5 <small>km</small></span><span class="micro">Dal Pago al mare</span></div><svg class="small-flower" aria-hidden="true"><use href="#flower"/></svg><div><span class="distance">65 <small>km</small></span><span class="micro">Dal Pago a Matera</span></div></div>
 </div></section>`;
};
