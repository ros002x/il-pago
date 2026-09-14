// Original scenery, separate from documentary photographs and editorial content.
export const gardenCanopy = (layer, navigation) => `<div class="garden-canopy" data-atmosphere-scene>
 ${layer('bougainvillea-mound','garden-plant canopy-rise','(max-width: 760px) 80vw, 52vw','branch',.8)}
 ${layer('bougainvillea-hanging','garden-plant canopy-hanging','(max-width: 760px) 50vw, 43vw','branch',.5)}
 ${layer('bougainvillea-mound','garden-plant canopy-close atmosphere-optional','35vw','branch',1.25)}
 ${navigation}
</div>`;

export const coastalScene = (picture, arrow) => {
 const bank = (name, depth, period, direction) => `<div class="coast-cloud ${name}" aria-hidden="true"><div class="atmosphere-skin cloud-drift" data-atmosphere="cloud" data-depth="${depth}" data-period="${period}" data-direction="${direction}">${Array.from({length:4},()=>picture('cloud-shore-edge','','',false,'(max-width: 760px) 100vw, 70vw')).join('')}</div></div>`;
 return `<section class="territory" id="territorio" aria-labelledby="territory-title">
 <div class="coast-stage" data-atmosphere-scene>
  <div class="coast-sea">${picture('coast','Il mare Jonio e la spiaggia della costa lucana','','','(max-width: 760px) 180vw, 100vw')}<div class="territory-shade" aria-hidden="true"></div></div>
  ${bank('cloud-back atmosphere-optional',.25,170,1)}${bank('cloud-middle',.55,125,-1)}${bank('cloud-one',1,95,1)}
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
