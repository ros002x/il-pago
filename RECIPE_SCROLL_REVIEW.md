# Ricette, delivery Retina e scroll — 22 settembre 2026

Base recuperata: `624884c`. Sono state conservate le modifiche locali del 16 settembre, incluso il fix Back WebKit in `editorial.js`. Nessun nuovo audit fotografico o redesign.

## Ricette e cronologia

`ristorante.html#ricette` è l'unico elenco. Quattro pagine `ricetta-*.html` sono generate da `content/recipes.mjs`: nome, fotografia, descrizione, ingredienti e preparazione hanno una sola fonte.

Ogni dettaglio offre elenco e precedente/successiva. L'ultima ricetta termina con La Tavola; non ricomincia dalla prima. La pagina prodotti prosegue verso i contatti. I vecchi `ricette.html#...` usano `location.replace` una sola volta, con link di fallback senza JavaScript.

WebKit a 390 px ripristinava `4259` invece di `4791` dopo Back. Il punto cliccato è conservato sulla voce corrente con `replaceState`, senza aggiungere voci alla cronologia. Il ripristino avviene dopo i font e `pageshow`; il caso riprodotto ora torna a `4791`.

## Fotografie

La ricerca già completata ha verificato i master locali, il sito ufficiale e le immagini del suo motore di prenotazione. Non sono emersi originali 4K degli stessi scatti. Nessun upscale, nessun cambio di soggetto.

| Immagine | Originale | Consegna / visualizzazione corretta |
| --- | --- | --- |
| Veranda | 2000 × 1333 | Su iPhone passa da 1280 a 2000 px; `sizes` considera l'altezza del ritaglio. |
| Hero cortile | 1920 × 1000 | `sizes` e preload concordano e tengono conto della copertura verticale. |
| Pastizz, Torta della Nonna, Frizzul | 1920 × 1000 | AVIF ad alta qualità e fallback WebP; dettaglio largo al massimo 600 CSS px. |
| Pan Brioche | 1200 × 689 | Originale autentico al suo limite; dettaglio massimo 600 CSS px, nessun ingrandimento artificiale. |
| Camera / veranda | 2000 × 1333 | Master migliori già presenti, conservati. |
| Sala / altre camere | 1600 × 1200 | Master migliori già presenti, conservati. |

Le immagini del dettaglio conservano le proporzioni naturali. Le anteprime restano lazy; solo la fotografia iniziale del dettaglio ha priorità alta. Nessun preload aggiuntivo per le ricette. AVIF viene prodotto dai JPEG originali, con varianti mai superiori al master; il fallback WebP è stato usato realmente da WebKit nei test. Provenienza: `PHOTO_SOURCES.json` e `EDITORIAL_PHOTO_SOURCES.json`.

Il PASS della delivery significa scelta adeguata entro i pixel autentici disponibili. Hero/fullscreen molto ritagliati possono richiedere più pixel del master: quei dettagli non possono essere recuperati con `srcset` o compressione.

## Cause e correzioni dello scroll

- Prima della correzione, a metà storytelling: iPhone 390 → landscape tornava a `scrollY=0`; iPad 820 → landscape passava da progresso `0.50` a `1.00`. Il nuovo ricalcolo conserva il capitolo/progresso anche quando `matchMedia` ricrea i pin.
- I pin del viewport erano mantenuti tramite trasformazioni aggiornate da JavaScript. Ora usano pin fissi; l'input resta nativo e lo scrub touch è diretto.
- Desktop applicava sia Lenis sia lo smoothing delle animazioni. Lenis non viene più caricato; wheel e trackpad conservano l'inerzia nativa, senza un secondo motore di scroll.
- `overflow-x:hidden` sul body comportava `overflow-y:auto`. `clip` contiene le scenografie senza aggiungere un contenitore di scroll al body.
- Le durate delle scene dipendono dalle altezze reali basate su `svh`, coerenti con il CSS. Solo resize strutturali producono un refresh differito; la toolbar mobile non deve provocare refresh continui.
- Uscendo da una pagina, menu e dialoghi vengono chiusi e i lock rimossi. Il ritorno dalla cache del browser non conserva un pannello invisibile bloccante.

## Verifica riproducibile e limiti

`node tools/check.mjs`, `node tests/recipes-retina.mjs`, `node tests/scroll-devices.mjs`.

Esito locale finale: 88/88 controlli ricette/Back/Retina e 42/42 controlli scroll, senza errori JavaScript o HTTP. Sintassi, riferimenti locali e manifest immagini verificati.

Le prove mirate coprono Chrome desktop, WebKit desktop, 375/390/430 px, iPad portrait/landscape, ritorno alle ricette e dalla home, pin/release/reverse, apertura/chiusura pannelli e immagini modificate. I gesti touch con inerzia sono sintetizzati tramite il protocollo Chromium; WebKit mobile copre geometria, navigazione e orientamento. Le prove wheel desktop usano piccoli delta, impulsi veloci e inversione.

L'host è Windows: non è disponibile una verifica su Safari/macOS, Chrome/macOS, barre Safari o trackpad/dispositivi Apple fisici. Nessun PASS hardware viene dichiarato. Screenshot, report JSON, cache e master di ricerca restano in cartelle ignorate da Git.

## Copertura dei pannelli e finale del foreground

La successiva verifica mirata ha riprodotto una fascia scoperta di 84 px risolvendo separatamente viewport piccolo e grande: le superfici pinned basate soltanto su `svh` non coprivano lo spazio liberato dalla toolbar. Le superfici ora usano `100lvh`, stabile durante il gesto; la composizione interna mantiene `svh`. Il valore iniziale viene memorizzato dopo la creazione dei pin, evitando refresh alla prima variazione della toolbar. Il significato delle unità è documentato da [WebKit](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/).

I medesimi ritagli floreali hanno scala e presenza maggiori. Il gruppo basso rimane in scena, il ramo alto entra prima e il foreground ha un livello di compositing separato davanti alle fotografie. Il margine negativo di compensazione è stato trasferito dal livello sticky alla sezione successiva: prima tratteneva i fiori per un viewport extra; ora il rilascio segue la fotografia. Misura su 390 px dopo il pin: foto e fiori entrambi a −10 px e poi a −153 px, invece dei fiori fermi a 0.

`node tests/canopy-band.mjs`: 17/17 controlli mirati passati, senza errori JS/HTTP, su WebKit 390/820/1440 e Chrome 1440. Screenshot in movimento e del rilascio ispezionati. Nel caso riprodotto la fascia misurata passa da 84 a 0 px. Il test simula separatamente le due unità di viewport; non sostituisce una prova sulla toolbar Safari fisica. `--public` limita la verifica a mobile, fascia e finale, includendo anche il CSS pubblico senza intercettazione.
