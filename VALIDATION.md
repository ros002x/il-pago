# Verifiche della consegna

Revisione del 14 settembre 2026: arbusti ricomposti e transizione continua bianco → nuvole → mare. Il progetto statico è stato avviato nel browser a http://127.0.0.1:4174/. I comandi riproducibili sono nel README; report e screenshot restano in `artifacts/`, esclusa dalla pubblicazione.

## Risultati

| Suite | Controlli superati | Errori rilevati |
| --- | ---: | ---: |
| `tests/verify.mjs` — funzioni e contenuti | 684 | 0 |
| `tests/apple.mjs` — WebKit e formati Apple | 338 | 0 |
| `tests/depth.mjs` — foreground e atmosfera | 136 | 0 |
| `tests/continuity.mjs` — nuova sequenza | 189 | 0 |
| Totale | **1347** | **0** |

Build, sintassi JavaScript e riferimenti locali agli asset verificati. Le correzioni visive successive alla suite funzionale sono state ricontrollate con le suite di continuità e profondità. L'ultima regolazione del foreground basso è stata controllata separatamente su WebKit 375×667 e 320×700.

## Funzioni e completezza

Sette viewport: 320×700, 360×800, 390×844, 768×1024, 1366×768, 1440×900, 1920×1080. Undici documenti verificati: H1, ID, link interni e ancore, immagini, assenza di overflow, menu, contatti, prenotazione, tema e firma finale.

Controllati apertura/chiusura dei pannelli, Tab/Shift+Tab, Escape, ritorno del focus e blocco dello sfondo; passaggio menu → contatti → richiesta senza sovrapporre dialoghi. Validazione delle date e campi appropriati al servizio. Catalogo, filtro e prodotto preselezionato nella richiesta.

Le aperture WhatsApp sono state intercettate nei test: nessun messaggio o prenotazione inviato. La prenotazione reale resta affidata al motore ufficiale.

La riorganizzazione conserva gli approfondimenti, i recapiti, la fotografia della costa e le distanze. Le coltivazioni e “Lascia vagare lo sguardo” si trovano in `il-pago.html#azienda`. Fonti e copertura dei contenuti: [CONTENT_AUDIT.md](CONTENT_AUDIT.md).

## Composizione e continuità

Fotogrammi allo 0%, 25%, 50%, 75% e 100% per ingresso, capitoli e costa. Chrome 1440×900 e 2560×1440; WebKit 375×667, 390×844, 430×932, 820×1180 e 1180×820. Verifica aggiuntiva del landscape basso 844×390 nella suite profondità.

- Un solo foreground persistente tra ingresso e capitoli.
- Massa bassa compatta, uscita durante il raccolto, chioma destra nel capitolo Basilicata.
- Bianco, nuvole e fotografia presenti contemporaneamente; nessuna dissolvenza d'ingresso del mare.
- Tre fasce atmosferiche desktop, due touch; nessuna rotazione.
- Deriva orizzontale e variazione minima di scala a scroll fermo.
- Salti rapidi, percorso lento, ritorno ai medesimi punti e resize dentro l'atmosfera.
- Nessuna duplicazione dei pin o del foreground al cambio orientamento.
- Riempimento completo della fotografia della Basilicata, compreso WebKit sui telefoni alti.
- Atmosfera sospesa nei dialoghi; cleanup quando si attiva il movimento ridotto.

Il secondo passaggio visivo ha corretto giunture delle nuvole, saturazione e posizione delle masse floreali, comandi superiori, contrasto al punto iniziale della scena chiara e ritaglio WebKit. Un controllo finale sui telefoni bassi ha abbassato gradualmente l'arbusto prima della fattoria: screenshot e campionamento dell'alpha sul riquadro delle righe del paragrafo a 0/8/25% non rilevano coperture significative né overflow. Quest'ultimo è un controllo mirato, non una verifica universale di ogni pixel lungo lo scroll.

Il sito ERA è stato studiato direttamente prima delle modifiche e mantenuto aperto durante il lavoro. Il confronto è stato ripetuto dopo le rifiniture. Nessun asset ERA è incluso nel sito. Dettagli e prompt in [CONTINUITY_REVIEW.md](CONTINUITY_REVIEW.md).

## Formati Apple e fallback

WebKit 26.0 / Playwright 1.58.2 su Windows: 375×667, 390×844, 430×932, 768×1024, 820×1180, 1024×768, 1180×820, 1024×1366, 1366×1024, 844×390 e 1440×900. Verifiche Chrome aggiuntive: 375×667, 430×932, 820×1180, 1180×820 e 844×390.

Controllati touch, scroll nativo sui dispositivi touch, pannelli nella viewport, target di tocco, tipografia, inversione dello scroll e orientamento. Le scene usano `svh`; i dialoghi usano `dvh` e safe area. Riduzione del movimento e assenza di JavaScript mantengono i contenuti accessibili.

Queste sono prove di motore e viewport, **non prove su iPhone/iPad fisici**. Notch, barre della vera app Safari, elasticità dello scroll e prestazioni GPU richiedono ancora verifica hardware. I tempi rAF nel report non sono presentati come FPS di un dispositivo reale.

## Stabilità e risorse

I quattro pin principali usano trasformazioni per conservare il flusso del documento. Nella prova locale Chrome con rotella, ripetuta dopo la ricostruzione: somma degli eventi di layout shift iniziali **0** a 1440 e 390 px; durante il percorso **0,0040** e **0,0044**, rispettivamente. Si tratta del percorso locale provato, non di metriche reali degli utenti o di un punteggio Lighthouse.

Immagini responsive, dimensioni intrinseche, lazy loading e librerie locali. I master PNG originali non vengono caricati dalle pagine; le decorazioni usano WebP con alpha. Le fasce ripetute riutilizzano lo stesso file dalla cache. Il ciclo atmosferico rilascia `will-change` e si sospende quando non serve.

## Limiti residui

Le fotografie autentiche meno definite mantengono i limiti documentati in [IMAGE_AI_TODO.md](IMAGE_AI_TODO.md); non sono stati inventati dettagli di camere o panorami. Alcune fonti ufficiali non erano integralmente leggibili: i limiti della ricerca restano registrati nell'audit. Disponibilità, prezzi futuri e funzionamento dei servizi esterni non sono certificati dai test locali.

Il repository originale non ha un remote GitHub configurato. La consegna locale può essere completata senza scegliere arbitrariamente un account o una destinazione di pubblicazione.
