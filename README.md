# Il Pago — La tua casa fuori casa

Redesign del progetto esistente, completato a partire dai file della struttura. Homepage immersiva, otto pagine di approfondimento, pannello contatti e due pagine di servizio. Fotografie autentiche di Il Pago, Bodoni Moda / Pinyon Script / Manrope, atmosfera giorno/notte e firma finale conservate.

## Avvio

Per visitare il sito non serve installare dipendenze:

~~~sh
node tools/serve.mjs
~~~

Aprire **http://127.0.0.1:4173/**. Per un’altra porta: `node tools/serve.mjs 4174`. È possibile aprire direttamente `index.html`, ma per le verifiche usare il server locale.

## Contenuti e manutenzione

- `content/home-source.html`: base della homepage approvata.
- `content/pages.mjs`: Il Pago, ospitalità, ristorante ed esperienze.
- `content/discover.mjs`: prodotti, territorio, ricette e proposte.
- `tools/build.mjs`: genera gli undici documenti HTML, menu, footer e dialoghi condivisi.
- `style.css` e `motion.css`: impianto del progetto precedente.
- `refinement.css`: nuove composizioni, pagine interne e adattamenti responsive.
- `script.js`: tema, menu, contatti, galleria camere e richieste WhatsApp.
- `motion.js`: scene e scroll; `atmosphere.js`: brezza autonoma; `editorial.js`: pagine interne.
- `assets/images.json`: fonti locali e varianti responsive delle immagini.

Dopo aver modificato i contenuti eseguire `npm run build` oppure `node tools/build.mjs`. I file HTML generati sono versionati e pronti per un hosting statico. L’aggiornamento di tariffe, programmi e disponibilità richiede una modifica dei contenuti: non esiste una sincronizzazione automatica con il sito ufficiale.

## Esperienza

La hero introduce il benvenuto; il giardino illuminato passa dall’arco al pieno schermo. Lo scroll verticale conduce attraverso fattoria, raccolto e territorio, mentre gli ulivi rimangono davanti alle scene. Dopo storia, cucina e camere, la campagna lascia spazio all’atmosfera e alla costa ionica. Il mare compare una sola volta nella homepage, con distanza dalla struttura.

Il menu entra da destra; Contatti apre un pannello. Tastiera, Escape, click esterno, focus e blocco dello sfondo sono gestiti. Il modulo prepara il testo per WhatsApp: l’invio avviene nell’app con un’azione dell’utente. Le prenotazioni effettive si effettuano tramite il motore ufficiale TeamSystem. Nessun database, analytics o tracker; il solo tema si conserva in localStorage.

Su touch lo scroll resta nativo, si riducono i livelli e la parallasse. Le scene usano `svh` per limitare ricalcoli alla variazione della barra browser; i dialoghi seguono `dvh` e safe area. Movimento ridotto, assenza di JavaScript e mancata inizializzazione delle animazioni mantengono una versione leggibile.

## Verifiche riproducibili

~~~sh
npm ci
npm run check
npm test
npm run test:apple
~~~

Tenere attivo il server locale. I test usano Chrome installato e WebKit Playwright; quest’ultimo si installa con `npx playwright install webkit`. Per testare un indirizzo diverso, impostare `PAGO_TEST_URL` con slash finale. I report e gli screenshot vengono scritti in `artifacts/`, esclusa da Git.

I controlli comprendono collegamenti, asset, console, contenuti, overflow, dialoghi, tastiera, richieste senza invio reale, forward/reverse scroll, movimento autonomo, cambio orientamento e reduced motion. WebKit su Windows ed emulazione dei formati Apple non equivalgono a prove su iPhone/iPad fisici. Dettagli ed evidenze in [VALIDATION.md](VALIDATION.md).

## Consegna e fonti

Per pubblicare copiare gli undici `*.html`, i tre CSS, i quattro JS applicativi e `assets/` nella radice dell’hosting. Non pubblicare cache, ricerca, backup o `node_modules`. Nessun asset ERA fa parte di questo progetto. Il riferimento [ERA Residence](https://www.era-residence.com/) è stato usato per composizione e movimento; le informazioni e le fotografie provengono da [Il Pago](https://www.ilpago.eu/).

- [CONTENT_AUDIT.md](CONTENT_AUDIT.md): confronto, architettura, fonti e limiti della ricerca.
- [IMAGE_AUDIT.md](IMAGE_AUDIT.md): fotografie, provenienza e selezione.
- [IMAGE_AI_TODO.md](IMAGE_AI_TODO.md): miglioramenti fotografici conservativi possibili.
- [ASSET_GENERATION.md](ASSET_GENERATION.md): asset atmosferici e prompt eseguiti.
- `assets/licenses/`: licenze dei font, GSAP e Lenis, preservate.

I recapiti, il motore di prenotazione e i link social sono quelli pubblicati dalla struttura. Le foto delle camere restano documentarie; la variante notturna preesistente e i due ritagli atmosferici sono elaborazioni visive, senza inventare servizi o geografia.
