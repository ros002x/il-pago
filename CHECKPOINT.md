# Stato attuale — 15 settembre 2026

PROJECT ROOT: C:\Users\rosar\Desktop\Lavoro\il-pago

Questa è la copia modificata nelle sessioni precedenti e in questa iterazione. Prima degli interventi sono stati confrontati commit, stato Git, struttura e hash SHA-256 di atmosphere.js, canopy.js e scenography.css con C:\Users\rosar\Desktop\rotondella\il pago. Entrambe partivano da 72c18e864866b6fc6b167e1c5f28d02cec58e8f9. L'altra copia non è stata modificata.

## Recupero e repository

Fotografie aggiornate di veranda, sala e camere, varianti responsive, ritaglio famiglia, didascalie separate e prima versione della chioma erano già nel checkpoint. Nessun file troncato o conflitto rilevato; nessuna modifica valida annullata.

Account autenticato: ros002x. Verificata l'assenza di un repository Il Pago, è stato creato il repository dedicato autorizzato: https://github.com/ros002x/il-pago. Origin: https://github.com/ros002x/il-pago.git. Branch: main. Il checkpoint 72c18e864866b6fc6b167e1c5f28d02cec58e8f9 è stato pushato prima dei nuovi fix.

Destinazione dell'anteprima: https://ros002x.github.io/il-pago/ — GitHub Pages da main, root del repository. .nojekyll mantiene il sito statico. Conferma del deployment e commit finale sono riportati nella consegna conclusiva.

## Interventi

- Vegetazione: mesh WebGL 48×32 con cinque gruppi di rami, rotazioni locali attorno a punti di attacco, brezza lenta e risposta secondaria delle estremità. Ridotto il movimento dell'immagine completa.
- Profondità: massa distante più piccola, arbusto in primo piano, elemento ravvicinato all'ingresso, chioma sospesa nel capitolo finale. Il primo piano resta nel capitolo centrale e passa sotto il testo. I livelli aggiuntivi sono esclusi sui dispositivi touch. Restano pinning e progressione verticale/orizzontale.
- ERA Residence rivisitato dal vivo con scroll lento, normale, inverso e soste di 10 secondi. Nessuna risorsa proprietaria inserita nel progetto. Acquisizioni in ../.reference/direct-study/.
- Hero: stato locale data-time; eliminati body.night, variabili globali e cambi di theme-color/footer. La fotografia riutilizzata nel benvenuto torna diurna. Pagine interne e pannelli condivisi non dipendono dalla preferenza salvata.
- Retina: sizes delle foto nello storytelling e della camera tiene conto dell'altezza del ritaglio. Su iPhone 390/DPR3 e iPad 820/DPR2 vengono selezionati farm.jpg, products.jpg, matera.jpg da 1920 px e room-garden-2000.webp.
- Navigazione: ripristino dopo il refresh iniziale dei pin, aggiornamento dei limiti Lenis e gestione del frammento dopo il posizionamento nativo. Risolta la regressione WebKit del checkpoint precedente.

## Verifiche

- npm run build e npm run check: sintassi, riferimenti locali, dimensioni e byte del manifest responsive.
- npm test: 684 controlli, zero errori.
- npm run test:apple: 338 controlli, zero errori; Chrome/WebKit, orientazioni, touch target, dialoghi, forward/reverse e reduced motion.
- node tests/hero-canopy.mjs: 428 controlli, zero errori. Chrome 1440 e 2560; WebKit 1440, 375, 390, 430, 820 e 1180, DPR fino a 3. Confronto pixel giorno/notte in 13 punti della homepage e nei tre pannelli condivisi; confronto degli stili di tutte le dieci pagine interne con preferenza salvata.
- Movimento interno: fotogrammi a 0, 2, 5 e 10 secondi senza scroll e con trasformazione dell'intera pianta bloccata. I fotogrammi continuano a cambiare in tutte le otto configurazioni. Ulteriori soste normali di 10 secondi nel capitolo centrale su desktop e telefono.
- node tests/navigation.mjs: 12 controlli, zero errori. Chrome desktop, WebKit desktop e telefono: reload, ritorno da Territorio, link diretto Esperienze e reduced motion.
- npm run test:refinement: 133 controlli, zero errori sulla versione finale; movimento interno, refresh, camere, didascalie, reduced motion e fallback GPU.
- Retina: scelta dei file verificata in artifacts/retina-delivery.json.
- Performance locale Chrome: 829.883 byte di immagini all'ingresso, 2.231.523 dopo le tre scene; CLS 0 iniziale e 0,004 durante lo scroll. Limite canvas DPR 1,5; aggiornamento massimo 30 fps touch e 60 desktop, sospensione fuori scena e nei dialoghi. I tempi headless non sono un benchmark su dispositivi fisici. WebKit non espone in modo attendibile tutti i byte/CLS in questo ambiente.

Totale delle cinque suite: 1595 controlli, zero errori. Le suite generali e hero/canopy precedono gli ultimi aggiustamenti a navigazione e sizes; questi sono verificati separatamente da navigation e refinement sulla versione finale. Screenshot e report in artifacts/, esclusa da Git.

## Limiti reali

WebKit su Windows e viewport emulati non sostituiscono iPhone/iPad fisici. Reduced motion disattiva la scenografia animata; in caso di perdita del contesto GPU resta l'immagine originale.

I master documentari disponibili arrivano generalmente a 1600–2000 px; il giardino serale è 1440×1080. Non sono master 4K nativi. Limiti fotografici in IMAGE_AI_TODO.md. Le geometrie reali delle fotografie sono preservate.

Il precedente brief sul redesign del menu non fa parte dell'iterazione corrente, limitata dall'utente a cartella corretta, vegetazione, hero notte, qualità della delivery e GitHub.
