// Licensed moving scenery, separate from the documentary photographs of Il Pago.
const film = (name, cls, width, height, offset=0) => `<div class="${cls}" aria-hidden="true"><div class="ambient-film" data-webm="assets/motion/${name}.webm" data-webp="assets/motion/${name}.webp" data-offset="${offset}" style="aspect-ratio:${width}/${height}"><img class="ambient-poster" src="assets/motion/${name}-poster.webp" width="${width}" height="${height}" alt="" loading="lazy" decoding="async"><video width="${width}" height="${height}" muted loop playsinline preload="none" disablepictureinpicture tabindex="-1"></video><img class="ambient-fallback" width="${width}" height="${height}" alt=""></div></div>`;
export const gardenCanopy = navigation => `<div class="garden-canopy" data-atmosphere-scene>
 ${film('bougainvillea-branch','garden-plant canopy-distant atmosphere-optional',800,422,2.1)}
 ${film('bougainvillea-garden','garden-plant canopy-rise',900,474,.7)}
 ${film('bougainvillea-branch','garden-plant canopy-hanging',800,422,3.5)}
 ${film('bougainvillea-branch','garden-plant canopy-close atmosphere-optional',800,422,4.1)}
 ${navigation}
</div>`;

export const coastalScene = (picture, arrow) => {
 const bank = (name, offset) => film('coastal-cloud',`coast-cloud ${name}`,960,540,offset);
 return `<section class="territory" id="territorio" aria-labelledby="territory-title">
 <div class="coast-stage" data-atmosphere-scene>
  <div class="coast-sea">${picture('coast','Il mare Jonio e la spiaggia della costa lucana','','','(max-width: 760px) 180vw, 100vw')}<div class="territory-shade" aria-hidden="true"></div></div>
  ${bank('cloud-back atmosphere-optional',.3)}${bank('cloud-middle',2.2)}${bank('cloud-one',4.3)}
  <div class="coast-white"><div class="coast-intro">
   <span class="micro">Rotondella, Basilicata</span>
   <p class="coast-intro-title">Dalla nostra terra,<br>verso il <span class="script">blu.</span></p>
   <div class="coast-itinerary" aria-label="Il Pago e i luoghi da raggiungere">
    <svg class="itinerary-line" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true"><path d="M15 62 C155 66 160 12 310 37 S480 88 615 45 S840 30 985 62"/></svg>
    <a href="il-pago.html"><svg class="small-flower" aria-hidden="true"><use href="#flower"/></svg><span class="micro">Il Pago</span><small>La tua casa in campagna</small></a>
    <a href="territorio.html#rotondella"><span class="itinerary-dot" aria-hidden="true"></span><span class="micro">Rotondella</span><small>Il borgo, da scoprire</small></a>
    <a href="territorio.html#mare"><span class="itinerary-dot" aria-hidden="true"></span><span class="micro">Mare Jonio</span><small>A 4,5 km dal Pago</small></a>
    <a href="territorio.html#vicino"><span class="itinerary-dot" aria-hidden="true"></span><span class="micro">Matera</span><small>A 65 km dal Pago</small></a>
   </div>
  </div></div>
  <div class="territory-copy"><span class="micro">La costa ionica lucana · A 4,5 km dal Pago</span><h2 class="display" id="territory-title">E poi,<br>il <span class="script">mare.</span></h2><p>Il verde da abitare.<br>L’azzurro da raggiungere.</p><a class="text-link" href="territorio.html#mare">Scopri la costa e i dintorni ${arrow}</a></div>
  <div class="territory-distances"><div><span class="distance">4,5 <small>km</small></span><span class="micro">Dal Pago al mare</span></div><svg class="small-flower" aria-hidden="true"><use href="#flower"/></svg><div><span class="distance">65 <small>km</small></span><span class="micro">Dal Pago a Matera</span></div></div>
 </div></section>`;
};
