# Riprese animate e scena finale

> Archivio della revisione `7e8f324`. Il footage è stato successivamente rimosso su richiesta e sostituito dai precedenti ritagli con parallasse. Stato corrente: [COMPLETION_REVIEW.md](COMPLETION_REVIEW.md).

Ripresa dal commit pubblico `3eff4cd06a1e624fd7e3b37b09e8a900d52fad70`, senza reset. Conservati fotografie autentiche, varianti responsive, pagine interne, storia, pin orizzontali e night mode locale alla hero.

## Vegetazione

Due tratti della ripresa originale **4096 × 2160 di Engin Akyurt**: piccoli fiori e ramificazioni, al posto dei grandi grappoli fucsia. Il cielo neutro viene rimosso con colour key; una maschera fissa pulisce il ramo secco superiore. Il movimento è interamente nei fotogrammi. I loop percorrono i fotogrammi avanti e indietro; GSAP gestisce soltanto camera, scala e posizione.

Il livello distante, il primo piano e il dettaglio più vicino differiscono per inquadratura, scala, sfocatura e tempo di riproduzione. L’inquadratura principale resta bassa, lascia leggibili testi e volti, accompagna fattoria e prodotti e cede il campo al ramo alto nella scena della Basilicata. Su touch restano i due elementi necessari, visibili in momenti differenti.

`canopy.js` e il vecchio renderer della fotografia statica sono rimossi. I vecchi asset video scartati non vengono distribuiti.

## Dal bianco al mare

La ripresa di vapore compatto di **cottonbro studio** sostituisce i filamenti di fumo. Alpha da luminanza, bordi chiari senza contorno scuro, tre profondità e proporzioni più orizzontali formano un banco morbido. Il testo introduttivo esce prima del reveal, senza lasciare frammenti della linea decorativa. Le nuvole attraversano il fotogramma e lo liberano prima del titolo del mare; la fotografia è già sotto, senza sostituzioni improvvise.

La riproduzione prosegue a scroll fermo. Nessuna rotazione animata delle nuvole, nessun vento procedurale, nessun overlay di petali.

## Scena finale e menu

La scena fullscreen è l’ultima sezione prima del footer: **Ospitalità, Cucina, Fattoria, Esperienze, Territorio**. Fotografie autentiche, titoli bianchi, navigazione trasparente. La cucina mostra dolce e frutta sulla tavola in giardino. Il cambio categoria aspetta la decodifica della foto, poi esegue dissolvenza, lieve variazione di scala e transizione del testo nella stessa scena. Click rapidi conservano solo l’ultima scelta.

Le categorie sono tab accessibili da tastiera; su iPhone scorrono orizzontalmente. Le CTA di fattoria e ospitalità selezionano la categoria e allineano la scena alla finestra. Gli approfondimenti restano disponibili nei link dedicati.

Il menu principale usa un fondo verde semitrasparente, mantenendo struttura e contenuti. Escape, blocco dello scorrimento e focus sono conservati. Il ritorno del focus usa il vero pulsante di apertura anche in Safari, che non mette automaticamente a fuoco un pulsante toccato.

## Formati e caricamento

VP9 con alpha su Chrome; animated WebP su WebKit. Un piccolo video campione verifica i pixel alpha realmente decodificati, senza affidarsi solo a `canPlayType`. Il fallback viene usato anche se l’autoplay del video viene rifiutato. Poster locali, nessuna chiamata a Pexels durante la visita.

I filmati vengono caricati vicino alla scena e fermati fuori campo, con finestre di dialogo aperte, pagina nascosta o movimento ridotto. Il fallback animated WebP viene scaricato dalla decodifica rimuovendo `src` quando non serve. Le foto delle categorie successive vengono richieste alla selezione. Master, toolchain, registrazioni e screenshot restano nelle directory ignorate.

Fonti, autori e licenza: [assets/motion/sources.json](assets/motion/sources.json). Dimensioni, durate e byte: [assets/motion/manifest.json](assets/motion/manifest.json).

## Verifica mirata

48 controlli sulle nuove scene superati su Chrome 1440 × 900, WebKit 375 × 667 e WebKit 820 × 1180. Comprendono dieci secondi di vegetazione e nuvole a camera ferma, alpha effettivo, avanti/indietro, cinque cambi di categoria, click rapidi, tastiera, CTA, uguaglianza dei pixel giorno/notte fuori dalla hero, menu e movimento ridotto. Nessun errore JavaScript o risposta HTTP errata. Le acquisizioni visive hanno guidato la pulizia della silhouette e della composizione prima della pubblicazione.

Sono emulazioni WebKit su Windows; la verifica su iPhone/iPad fisici resta da eseguire sul sito pubblico. Non sono stati ripetuti i 1.595 controlli delle revisioni precedenti.

Evidenze locali: `artifacts/final-footage/`, `artifacts/art-final/`, `artifacts/showcase/`. Queste directory sono escluse da Git. Le vecchie suite conservano i controlli di layout e contenuto; le verifiche del vecchio mesh sono sostituite dal test mirato del footage.

GitHub Pages è configurato su `main`, radice `/`, e serve gli HTML generati dal build statico. CSS e JavaScript portano un’impronta del contenuto nell’URL per aggiornare la cache dei visitatori che tornano. La verifica successiva al push confronta il commit del deployment e i file pubblici con la copia locale.
