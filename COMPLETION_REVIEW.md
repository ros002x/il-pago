# Completamento mirato · 15 settembre 2026

Base: `7e8f324`, repository pulito all’inizio. Nessun reset o rollback globale.

## Scenografia e homepage

Ripristinati selettivamente i ritagli `bougainvillea-mound`, `bougainvillea-hanging` e `cloud-shore-edge` del commit `3eff4cd`, con le rispettive dimensioni e composizioni responsive. Il movimento rimane nella parallasse GSAP dei contenitori. Pinning e continuità dello storytelling orizzontale conservati. Rimossi filmati, poster, decoder alpha e pipeline video non più utilizzati.

La frase unica «Dalla nostra terra, fino al blu dello Ionio.» resta nella scena durante il passaggio dal bianco alle nuvole e alla fotografia. Cambia colore per mantenere la leggibilità. Eliminato «E poi il mare». Il reveal usa gli ombrelloni della fotografia ufficiale `offerte/estate-top.jpg`; la pagina Territorio usa la costa di `territorio/jonio-top.jpg`. Il vecchio scatto con i bagnanti non è più usato nelle pagine pubblicate. `sizes` della fotografia fullscreen tiene conto dell’altezza del ritaglio, anche in verticale.

La showcase conserva cinque categorie e il cambio nella stessa scena. Cucina usa la tavolata con i bicchieri; Territorio mostra Craco. Il markup della scena Ospitalità è identico byte per byte a `7e8f324`, compresa la fotografia con le sedie intrecciate. Fattoria, Esperienze, menu e logica della notte sono preservati.

## Cucina, ricette e territorio

La pagina Ristorante aggiunge brace, tavola, filiera corta, prodotti aziendali e quattro ricette con foto distinte. Nomi verificati nel [quaderno ufficiale](https://www.ilpago.eu/ristorante/): **U' Pastizz R'tunnar**, **Pan Brioche**, **Torta della Nonna**, **Frizzul ca Middich'**. Le pagine di approfondimento includono descrizione, dosi e preparazione, con collegamenti alle ricette originali. La Torta della Nonna mostrata è quella del Pago, con Pan di Spagna farcito.

Territorio presenta fotografie di Rotondella, costa ionica, Policoro/Museo Archeologico Nazionale della Siritide, Metaponto/Tavole Palatine, Oasi WWF Policoro Herakleia, Matera, Craco, Volo dell’Angelo e passeggiate a cavallo. Conservati i riferimenti ai castelli, al Pollino, alle Dolomiti Lucane e al cicloturismo.

Quindici nuovi master ufficiali selezionati; WebP responsive senza ingrandimenti. Provenienza e dimensioni native in [EDITORIAL_PHOTO_SOURCES.json](EDITORIAL_PHOTO_SOURCES.json). I master e le acquisizioni restano nella directory ignorata `.research/`.

## Verifica

36 controlli mirati superati su Chrome 1440 × 900, WebKit 390 × 844 e WebKit 820 × 1180: storytelling avanti/indietro, scenografia ripristinata, transizione, cinque categorie, Ospitalità, notte locale alla hero, fotografie e larghezze delle pagine, ricette e luoghi. Nessun errore JavaScript o risposta HTTP errata. Dopo il secondo passaggio, verificata nuovamente la sola transizione su tutti e tre i formati e l’apertura degli ingredienti.

Controllati visivamente piante, nuvole, bianco, mare, showcase, Cucina, quattro ricette e Territorio. Nessuna suite generale ripetuta. Evidenze locali: `artifacts/completion/`; verifica pubblica: `node tests/iteration.mjs --public` e `artifacts/completion-public/`.

WebKit su Windows è un’emulazione: iPhone/iPad fisici non testati. GitHub Pages pubblica `main` dalla radice; CSS/JS usano impronte del contenuto per aggiornare la cache.
