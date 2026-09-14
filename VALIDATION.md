# Verifiche della consegna

Aggiornamento del 14 settembre 2026: foreground e atmosfera ricostruiti e verificati. Progetto statico avviato sia nel workspace sia dal proprio server autonomo. I comandi riproducibili sono nel README; i report completi e gli screenshot locali sono in `artifacts/` e non vengono pubblicati su GitHub.

## Funzioni e contenuti

`tests/verify.mjs`: **680 controlli superati**, zero errori JavaScript/HTTP locale rilevati. Viewport: 320×700, 360×800, 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.

- Undici documenti: un H1, ID univoci, destinazioni di tutti i link interni e relative ancore.
- Homepage, tema giorno/notte, foto approvata, caricamento delle immagini e firma finale.
- Dimensione del menu, blocco dello scroll, ciclo Tab/Shift+Tab, Escape, ripristino del focus.
- Contatti → richiesta senza dialoghi sovrapposti; campi diversi per soggiorno e prodotti; partenza precedente all’arrivo rifiutata.
- Filtro del catalogo e richiesta del prodotto selezionato; URL WhatsApp codificato correttamente. Apertura esterna intercettata nei test: nessun messaggio o prenotazione inviato.
- Reversibilità di ingresso, racconto orizzontale e costa; contenuti leggibili su tutte le pagine; assenza di overflow.
- Movimento ridotto e JavaScript disabilitato; cambio breakpoint senza duplicare pin o benvenuto.

`tools/check.mjs`: sintassi JavaScript e riferimenti locali agli asset verificati.

## Nuova scenografia — 14 settembre 2026

`tests/depth.mjs`: **136 controlli superati**, zero errori rilevati. Chrome 1440×900 e 390×844; WebKit 820×1180 e 844×390. Cinque momenti per ciascuna delle tre scene, con screenshot completi e tavole di confronto in `artifacts/depth/`.

- Un solo foreground persistente e allineato alla viewport dall'ingresso a tutti i capitoli.
- Nessun overflow nelle fasi iniziali, intermedie o finali.
- Quattro piani di nuvole desktop e due touch, movimento e opacità che cambiano a scroll fermo, nessuna rotazione.
- Atmosfera sospesa nei dialoghi e cleanup del movimento ridotto.

La prima sequenza è stata seguita da un secondo passaggio: chioma superiore specchiata e spostata per lasciare leggibili i comandi, navigazione dei capitoli sopra le piante, uscita del primo piano vicino e apertura maggiore del cielo dietro il titolo finale. I master originali sono stati verificati per trasparenza e bordi su fondi chiaro e azzurro. Dettagli e prompt: [FOREGROUND_REFINEMENT.md](FOREGROUND_REFINEMENT.md).

Totale delle suite funzionali, Apple e scenografiche: **1154 controlli superati**. Le prove di stabilità ripetute dopo queste modifiche mantengono gli stessi valori locali indicati sotto.

## Formati Apple e WebKit

`tests/apple.mjs`: **338 controlli superati**, zero errori rilevati.

WebKit 26.0 / Playwright 1.58.2 su Windows: 375×667, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 1180×820, 1024×1366, 1366×1024, 844×390 e 1440×900. Verifiche aggiuntive Chrome: 375×667, 430×932, 820×1180, 1180×820 e 844×390.

Controllati touch, assenza di Lenis sui dispositivi touch, pannelli nella viewport, target di tocco, sblocco dello sfondo, testo effettivamente renderizzato senza tagli, orientamento portrait/landscape e ricostruzione dei pin. `viewport-fit=cover`, safe area e altezza dinamica dei dialoghi sono implementati. Le scene usano altezze stabili per non inseguire continuamente le barre del browser.

Verificato a scroll fermo che arbusti fucsia e nuvole cambino trasformazione mentre il progresso ScrollTrigger rimane identico. La preferenza di movimento ridotto attivata durante la visita rimuove le animazioni autonome e i pin; riattivarla ricostruisce ogni scena una sola volta.

Limite: questi sono test di motore e viewport, non test su dispositivi Apple fisici. Notch/Dynamic Island, elasticità dello scroll e barre della vera app Safari richiedono ancora una prova hardware. Il campionamento di requestAnimationFrame nel report non viene presentato come FPS di iPhone/iPad.

## Passaggi visivi e movimento

Sono stati eseguiti passaggi distinti dopo l’implementazione: revisione della composizione, quindi osservazione delle sole animazioni avanti, indietro e a pagina ferma. Gli screenshot in `artifacts/review`, `artifacts/apple` e `artifacts/final` documentano i punti intermedi delle sequenze e le pagine interne.

Rifiniture conseguenti: testo Benvenuti separato dalla maschera, tempo della dissolvenza, bordi atmosferici sfumati, passaggio attraverso il cielo per evitare sovrapposizioni geografiche tra campagna e mare, contrasto del menu durante la fase chiara, rami allontanati dai link, dimensioni dei titoli a 320/360 px e contenimento della transizione della cucina a 768 px. Il formato landscape basso ha composizioni specifiche e mantiene raggiungibile la navigazione delle scene.

Il percorso finale verifica anche salti rapidi tra le scene, ritorno a uno stato stabile e unicità dei quattro pin principali. Gli elementi atmosferici si sospendono fuori scena, nei dialoghi e quando la pagina è nascosta; i `will-change` vengono rilasciati. Il codice contiene cleanup di media query, observer e ticker.

Il controllo di stabilità ha individuato spostamenti segnalati ai confini dei pin con posizionamento fixed. I quattro pin ora usano trasformazioni, conservando gli spazi nel documento. Nella prova Chrome con rotella: somma degli eventi di layout shift iniziali 0 a 1440 e 390 px; durante il percorso 0,0040 e 0,0044, rispettivamente. Sono misure locali della sequenza provata, non metriche di utenti reali o un punteggio Lighthouse. Le verifiche responsive e WebKit sono state ripetute dopo la correzione.

## Controllo del brief

| Richiesta | Risultato e file |
| --- | --- |
| Preservare parti riuscite | Hero, tipografia, tema e footer dalla base esistente; `content/home-source.html` |
| Side menu, contatti | Componenti condivisi generati, comportamento in `script.js` |
| Ingresso nel giardino | Fotografia ufficiale, arco → fullscreen, `motion.js` e `refinement.css` |
| Livelli fotografici e vegetazione | Alpha reali, foreground condiviso tra tre scene, `atmosphere.js` |
| Storytelling orizzontale | Pin guidato dallo scroll verticale, indici e accesso da tastiera |
| Transizione campagna/costa | Campagna → cielo/nuvole → mare locale, distanza esplicita |
| Nuvole vive e arbusti fucsia asincroni | Movimento indipendente, fasi diverse, deriva lenta; nessuna rotazione delle nuvole |
| Ristorante e camere | Tavola autentica e migliore camera come prima immagine; audit fotografico |
| Completezza informativa | Otto approfondimenti, catalogo, proposte e fonti in `CONTENT_AUDIT.md` |
| Mobile, iPhone e iPad | Layout e livelli adattati, test Chrome/WebKit, limite hardware esplicito |
| Performance e fallback | Immagini responsive, preload coerente, lazy loading, SVG e librerie locali, reduced motion |
| AI enhancement | `IMAGE_AI_TODO.md`, interventi conservativi facoltativi con prompt |
| GitHub | Ignore di ricerca, cache, report e file sensibili; destinazione da configurare se manca il remote |

## Limiti residui

Le foto autentiche meno definite sono elencate in `IMAGE_AI_TODO.md`. Non sono stati inventati dettagli per compensarne la risoluzione. Alcune schede remote hanno impedito la lettura integrale: il contenuto verificabile è coperto dalle pagine indice e il limite è registrato nell’audit. Disponibilità, prezzi futuri, aperture dei luoghi esterni e funzionamento dei servizi di terzi non vengono garantiti dai test locali.
