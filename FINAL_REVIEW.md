# Revisione finale — Il Pago

Questa revisione descrive il lavoro fotografico e scenografico recuperato. Il successivo brief su deploy prioritario, menu, storytelling e notturno limitato alla hero resta aperto: stato esatto in [CHECKPOINT.md](CHECKPOINT.md).

## Ripresa dopo l’interruzione

Il repository di lavoro conteneva tutti i sorgenti salvati, gli undici nuovi master fotografici, il manifest e le varianti responsive. Non sono state annullate modifiche valide. Il server e due processi di verifica erano stati interrotti: i loro report parziali non sono stati considerati prove di completamento. La ripresa è partita dal problema ancora aperto del refresh a metà scena.

## Vegetazione e continuità

Il confronto live con ERA aveva già incluso avanzamento lento, sosta di sei secondi e ritorno nelle sequenze floreali e atmosferiche. L’implementazione mantiene gli asset originali del progetto.

- **Movimento generale:** brezza leggera su un livello interno, parallax e ricomposizione sui contenitori esterni. Rotazione e variazione di scala ridotte per evitare l’effetto di un cartoncino oscillante.
- **Movimento della chioma:** mesh GPU 28×20, con tre gruppi di rami a frequenze e fasi diverse, attenuazione alla base e deformazione minima. Un solo bitmap per arbusto, senza contorni duplicati o separazioni tra porzioni. Verificato confrontando fotogrammi con il contenitore rigido tenuto fermo.
- **Profondità:** il piccolo primo piano destro resta anche nei capitoli centrali; il foreground si arresta al limite della sequenza e non invade la storia della famiglia.
- **Nuvole:** livelli lontani più morbidi e traslucidi, derive indipendenti, nessuna rotazione orbitale. La trasparenza del livello resta costante con lo scroll: il mare è già presente e viene scoperto dal movimento delle coperture.
- **Risorse:** il renderer parte con la scena visibile; su touch sono esclusi i livelli opzionali, il movimento interno è limitato a 30 aggiornamenti/s e la risoluzione del canvas a DPR 1,5. Tab nascosta e dialoghi fermano l’atmosfera. Reduced motion rilascia le risorse GPU; perdita del contesto o WebGL assente lasciano visibile l’immagine originale.

## Fotografie, testo e composizione

Undici foto aggiornate usando gli originali pubblicati nel motore di prenotazione della struttura. Quattro selezioni mantengono lo stesso scatto/allestimento con campo più ampio; le altre usano alternative autentiche migliori. Origini, dimensioni, motivazioni e limiti sono elencati in [IMAGE_AUDIT.md](IMAGE_AUDIT.md) e [PHOTO_SOURCES.json](PHOTO_SOURCES.json).

Le didascalie delle figure interne hanno una riga propria, senza sovrapporsi ai soggetti. La famiglia mantiene un’inquadratura di gruppo. Le grandi figure hanno larghezza limitata, niente overscan parallax e un crop responsive; le hero conservano l’arco e ricevono sorgenti dimensionate anche in base all’altezza. Il carosello utilizza il manifest e aggiorna correttamente foto, alt, dimensioni e didascalia.

I candidati rilevati dall’audit geometrico nella homepage sono stati confrontati con gli screenshot: gli ingombri delle immagini in movimento si estendono oltre le rispettive maschere, mentre i pixel visibili rimangono entro di esse. La didascalia della veranda e il titolo delle camere restano separati dalle foto. L’intestazione usa un fondo chiaro sfumato nei passaggi editoriali per mantenere leggibili i controlli quando passa su una fotografia.

Il secondo passaggio ha riguardato tutte le undici pagine: Il Pago, ospitalità, ristorante, esperienze, prodotti, territorio, ricette, soggiorni, contatti, privacy e homepage. Contenuti, informazioni pratiche e collegamenti del precedente [CONTENT_AUDIT.md](CONTENT_AUDIT.md) sono conservati.

## Ripristino della lettura

Il punto della scena viene salvato nella voce corrente della cronologia. Dopo un refresh vengono prima ricostruite le distanze dei quattro pin e aggiornati i limiti di Lenis, poi ripristinati capitolo e progresso. Questo elimina il salto al footer o alla prima schermata. Le pagine interne e la versione senza animazioni utilizzano il ripristino nativo del browser.

## Verifica e limiti

Risultati riproducibili e ambito dei test in [VALIDATION.md](VALIDATION.md). Gli screenshot completi restano in `artifacts/site-audit-final`, le sequenze in `artifacts/depth` e `artifacts/continuity`, le prove del movimento interno in `artifacts/refinement`.

Chrome e WebKit sono stati eseguiti su Windows con emulazione di viewport e DPR: non equivale a provare dispositivi Apple fisici. Il fullscreen 4K non può ottenere dettaglio nativo 4K da master pubblici di risoluzione inferiore; gli interventi ancora possibili sono descritti con trasparenza in [IMAGE_AI_TODO.md](IMAGE_AI_TODO.md).

## GitHub

Account ROS autenticato: `ros002x`. Nessun remote configurato nelle due copie del progetto. La verifica dell’account e delle configurazioni locali non ha identificato un repository Il Pago certo; il repository locale del dashboard ROS appartiene a un altro progetto. Non è stato creato un repository e non sono stati sovrascritti progetti estranei. Il push richiede la destinazione corretta indicata dall’utente.
