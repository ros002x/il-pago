# Il Pago — La tua casa fuori casa

Anteprima pubblica: **https://ros002x.github.io/il-pago/**. Repository: **https://github.com/ros002x/il-pago**, branch `main`.

La notte interessa soltanto la hero. Vegetazione e nuvole usano i precedenti ritagli di qualità con parallasse allo scroll. La scena finale permette di esplorare cinque categorie a schermo intero. Cucina comprende tavola, brace, prodotti e quattro ricette fotografate; Territorio presenta un racconto dei luoghi con immagini dedicate. Dettagli in [COMPLETION_REVIEW.md](COMPLETION_REVIEW.md).

Redesign del progetto esistente, completato a partire dai file della struttura. Homepage immersiva, sette approfondimenti, quattro dettagli ricetta, ingresso compatibile per i vecchi link alle ricette e due pagine di servizio. Fotografie autentiche di Il Pago, Bodoni Moda / Pinyon Script / Manrope, atmosfera giorno/notte e firma finale conservate.

## Avvio

Per visitare il sito non serve installare dipendenze:

~~~sh
node tools/serve.mjs
~~~

Aprire **http://127.0.0.1:4173/**. Per un’altra porta: `node tools/serve.mjs 4174`. È possibile aprire direttamente `index.html`, ma per le verifiche usare il server locale.

## Contenuti e manutenzione

- `content/home-source.html`: base della homepage approvata.
- `content/pages.mjs`: Il Pago, ospitalità, ristorante ed esperienze.
- `content/discover.mjs`: prodotti, territorio e proposte.
- `content/recipes.mjs`, `content/territory.mjs`: ricette con nomi originali e itinerari fotografici.
- `content/recipe-page.mjs`: dettaglio generato dalla stessa fonte delle anteprime; precedente, elenco e successiva.
- `editorial-features.css`: racconti fotografici e sequenza delle ricette.
- `content/scenes.mjs`: composizioni floreali e passaggio continuo dal bianco al mare.
- `content/showcase.mjs`, `showcase.js`, `showcase.css`: categorie, fotografie e transizioni della scena finale.
- `tools/build.mjs`: genera i quindici documenti HTML, menu, footer e dialoghi condivisi.
- `style.css` e `motion.css`: impianto del progetto precedente.
- `refinement.css`: nuove composizioni, pagine interne e adattamenti responsive.
- `scenography.css`: bougainvillea continua fra le scene e profondità atmosferica della homepage.
- `script.js`: variante della hero, menu, contatti, galleria camere e richieste WhatsApp.
- `motion.js`: camera e scroll; `editorial.js`: pagine interne.
- `assets/images.json`: fonti locali e varianti responsive delle immagini.

Dopo aver modificato i contenuti eseguire `npm run build` oppure `node tools/build.mjs`. I file HTML generati sono versionati e pronti per un hosting statico. L’aggiornamento di tariffe, programmi e disponibilità richiede una modifica dei contenuti: non esiste una sincronizzazione automatica con il sito ufficiale.

## Esperienza

La hero introduce il benvenuto; il giardino illuminato passa dall’arco al pieno schermo. I precedenti rami di bougainvillea accompagnano fattoria, raccolto e Basilicata con parallasse della camera. Dopo “L’ospitalità si coltiva” il bianco scopre la costa sotto le nuvole. Un’unica frase accompagna il passaggio allo Ionio. Seguono cucina, camere e la scena finale: Ospitalità, Cucina, Fattoria, Esperienze, Territorio. Le categorie cambiano fotografia e racconto senza ricaricare la pagina; i link di approfondimento conservano l’accesso ai contenuti completi.

Il menu entra da destra; Contatti apre un pannello. Tastiera, Escape, click esterno, focus e blocco dello sfondo sono gestiti. Il modulo prepara il testo per WhatsApp: l’invio avviene nell’app con un’azione dell’utente. Le prenotazioni effettive si effettuano tramite il motore ufficiale TeamSystem. Nessun database, analytics o tracker; il solo tema si conserva in localStorage.

Touch, wheel e trackpad usano lo scroll nativo del browser. Le scene usano `svh` per limitare ricalcoli alla variazione della barra browser; i dialoghi seguono `dvh` e safe area. Resize e cambio orientamento conservano la posizione nella scena dopo il ricalcolo dei pin. Movimento ridotto, assenza di JavaScript e mancata inizializzazione delle animazioni mantengono una versione leggibile.

## Verifiche riproducibili

~~~sh
npm ci
npm run check
node tests/recipes-retina.mjs
node tests/scroll-devices.mjs
node tests/recipes-retina.mjs --public
node tests/scroll-devices.mjs --public
~~~

Le suite più ampie restano disponibili per modifiche future alle rispettive aree; non occorre ripeterle per una rifinitura degli asset:

~~~sh
npm test
npm run test:apple
npm run test:depth
npm run test:continuity
node tests/hero-canopy.mjs
node tests/navigation.mjs
~~~

Tenere attivo il server locale. I test usano Chrome installato e WebKit Playwright; quest’ultimo si installa con `npx playwright install webkit`. Per testare un indirizzo diverso, impostare `PAGO_TEST_URL` con slash finale. I report e gli screenshot vengono scritti in `artifacts/`, esclusa da Git.

I test mirati verificano percorsi ricetta, Back, delivery Retina modificata, pin avanti/indietro, resize/orientamento, sblocco dei pannelli e input wheel/touch. WebKit su Windows ed emulazione dei formati Apple non equivalgono a Safari/macOS, iPhone/iPad fisici o trackpad hardware. Dettagli e limiti in [RECIPE_SCROLL_REVIEW.md](RECIPE_SCROLL_REVIEW.md).

## Consegna e fonti

GitHub Pages serve il branch `main`, directory `/`, con `.nojekyll`. Per un altro hosting statico pubblicare i quindici `*.html`, i CSS e JS applicativi nella radice e `assets/`, conservando i percorsi relativi. Non pubblicare cache, ricerca, backup o `node_modules`. Nessun asset ERA fa parte di questo progetto. Il riferimento [ERA Residence](https://www.era-residence.com/) è usato per composizione e movimento; le fotografie documentarie provengono da [Il Pago](https://www.ilpago.eu/). Le nuove fonti fotografiche sono in [EDITORIAL_PHOTO_SOURCES.json](EDITORIAL_PHOTO_SOURCES.json).

- [CONTENT_AUDIT.md](CONTENT_AUDIT.md): confronto, architettura, fonti e limiti della ricerca.
- [IMAGE_AUDIT.md](IMAGE_AUDIT.md): fotografie, provenienza e selezione.
- [IMAGE_AI_TODO.md](IMAGE_AI_TODO.md): miglioramenti fotografici conservativi possibili.
- [ASSET_GENERATION.md](ASSET_GENERATION.md): asset atmosferici e prompt eseguiti.
- [CONTINUITY_REVIEW.md](CONTINUITY_REVIEW.md): revisione corrente, confronto diretto con ERA, asset e prompt, composizione e rifiniture.
- [FOREGROUND_REFINEMENT.md](FOREGROUND_REFINEMENT.md): archivio della prima revisione floreale.
- `assets/licenses/`: licenze dei font, GSAP e Lenis, preservate.

I recapiti, il motore di prenotazione e i link social sono quelli pubblicati dalla struttura. Le foto delle camere restano documentarie; la variante notturna preesistente e i ritagli scenografici sono elaborazioni visive, senza inventare servizi o geografia.

Le revisioni precedenti sono archiviate in [FINAL_REVIEW.md](FINAL_REVIEW.md) e [FOOTAGE_REVIEW.md](FOOTAGE_REVIEW.md). Il footage è stato rimosso su richiesta: nessun decoder video o renderer WebGL viene caricato. Per rigenerare le fotografie precedenti: `node tools/prepare-photos.mjs`. Per quelle di questa iterazione, scaricare i master elencati in `EDITORIAL_PHOTO_SOURCES.json` in `.research/editorial-originals/<asset>.jpg`, poi eseguire `python tools/prepare-editorial-photos.py` con Pillow. Nessun ingrandimento oltre la risoluzione nativa. Infine `npm run build`.

Per rigenerare le alternative AVIF delle quattro ricette dai medesimi master: `python tools/prepare-recipe-images.py`, poi `npm run build`.
