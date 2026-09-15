const chapters = [
 {id:'ospitalita',label:'Ospitalità',image:'veranda',alt:'La veranda delle camere di Il Pago aperta sul giardino',title:'La tua casa,<br><span class="script">fuori casa.</span>',text:'Otto camere, una porta sul giardino. E tutto il tempo per ritrovare il tuo ritmo.',href:'ospitalita.html',link:'Camere e soggiorno',position:'50% 50%'},
 {id:'cucina',label:'Cucina',image:'garden-table',alt:'Torta fatta in casa e frutta del Pago sulla tavola in giardino',title:'Le cose buone,<br><span class="script">fatte in casa.</span>',text:'Cucina di stagione, ricette di famiglia. Dal raccolto al dolce, il piacere di una tavola condivisa.',href:'ristorante.html',link:'Entra in cucina',position:'55% 42%'},
 {id:'fattoria',label:'Fattoria',image:'farm',alt:'Un bambino incontra gli asinelli della fattoria Il Pago',title:'Piccole scoperte,<br><span class="script">grandi ricordi.</span>',text:'Dal seme al frutto, dal fiore al miele. La campagna diventa una scuola da vivere con le mani e con gli occhi.',href:'esperienze.html#fattoria',link:'Visite e laboratori',position:'40% 50%'},
 {id:'esperienze',label:'Esperienze',image:'horses',alt:'Una passeggiata a cavallo nella campagna, fotografia ufficiale Il Pago',title:'Segui la tua<br><span class="script">natura.</span>',text:'Una passeggiata a cavallo, una giornata in bicicletta, un nuovo sentiero. Il tuo modo di stare all’aperto.',href:'esperienze.html#cavalli',link:'Scegli cosa vivere',position:'46% 50%'},
 {id:'territorio',label:'Territorio',image:'coast',alt:'La spiaggia e il mare Jonio sulla costa lucana',title:'Tra la terra<br><span class="script">e il blu.</span>',text:'Il mare Jonio a 4,5 km. Rotondella, i borghi e Matera: una Basilicata da scoprire, partendo da qui.',href:'territorio.html',link:'Esplora i dintorni',position:'50% 50%'}
];

export const showcaseScene = (picture, arrow) => `<section class="showcase" id="scopri-il-pago" data-surface="dark" aria-labelledby="showcase-title">
 <h2 class="sr-only" id="showcase-title">Il Pago, da vivere</h2>
 <span class="showcase-eyebrow micro">Un luogo. Il tuo modo di viverlo.</span>
 <div class="showcase-tabs" role="tablist" aria-label="Scegli cosa scoprire" aria-orientation="vertical">${chapters.map((c,i)=>`<button type="button" role="tab" id="showcase-tab-${c.id}" aria-controls="showcase-${c.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-category="${c.id}"><span class="micro" aria-hidden="true">0${i+1}</span>${c.label}<span class="showcase-tab-mark" aria-hidden="true">↗</span></button>`).join('')}</div>
 <div class="showcase-stage">${chapters.map((c,i)=>{
   let photo=picture(c.image,c.alt,'showcase-photo',false,'(max-width: 760px) max(100vw, 155svh), max(100vw, 155svh)');
   if(i)photo=photo.replace(' src=',' data-src=').replace(' srcset=',' data-srcset=');
   return `<article class="showcase-panel${i===0?' is-active':''}" id="showcase-${c.id}" role="tabpanel" aria-labelledby="showcase-tab-${c.id}" aria-hidden="${i!==0}" ${i?'inert':''} tabindex="0" style="--photo-position:${c.position}">${photo}<div class="showcase-shade" aria-hidden="true"></div><div class="showcase-copy"><span class="micro">Il Pago · ${c.label}</span><h3>${c.title}</h3><p>${c.text}</p><a class="text-link" href="${c.href}">${c.link} ${arrow}</a></div></article>`;
 }).join('')}</div>
 <p class="showcase-status sr-only" role="status"></p>
</section>`;
