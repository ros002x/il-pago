# Continuità floreale e bianco → nuvole → mare

Revisione del 14 settembre 2026, successiva al commit `4c34502`. Questo documento descrive la versione corrente e sostituisce le indicazioni compositive del precedente FOREGROUND_REFINEMENT.md.

## Confronto diretto

[ERA Residence](https://www.era-residence.com/) è stato aperto e studiato nel browser prima delle modifiche alla struttura. Esame della sequenza floreale e della transizione chiara in avanti, all'indietro e a scroll fermo, su desktop 1440×900 e telefono 390×844. La reference è rimasta aperta durante il lavoro, affiancata al progetto locale. Screenshot e dati della ricerca rimangono privati nel workspace, fuori dagli asset pubblicati.

La reference usa una massa floreale bassa e compatta, spazi centrali liberi e una chioma diversa nel capitolo successivo. Il paesaggio si vede sotto un bordo bianco atmosferico già presente; non entra dopo una sezione marrone. La deriva orizzontale delle nuvole continua a pagina ferma. Questi sono i principi applicati, con composizioni, fotografie, testi e asset originali del progetto.

Il secondo confronto diretto ha riguardato soprattutto la continuità del bordo chiaro, l'apertura del paesaggio e l'uscita delle masse floreali. Non si dichiara una replica pixel per pixel: proporzioni e tempi sono adattati ai contenuti di Il Pago.

## Ordine del racconto

Giardino e arbusti → fattoria, raccolto e Basilicata → “L'ospitalità si coltiva” → spazio chiaro con luoghi da raggiungere → nuvole e mare → cucina → camere → firma finale.

La scena marrone non interrompe più il passaggio verso il mare. La fotografia delle coltivazioni e “Lascia vagare lo sguardo” sono raccolte nell'approfondimento [Il Pago / Azienda agricola](il-pago.html#azienda). La fotografia della costa selezionata è conservata e compare una sola volta nella homepage. Le distanze e i collegamenti agli approfondimenti restano disponibili.

## Arbusti

Nuovo asset originale: `bougainvillea-mound`, una massa compatta bassa, con fiori rosa, lilla e fucsia, foglie ombreggiate e bordo trasparente. Sostituisce il precedente arbusto alto e ramificato come foreground principale. La chioma `bougainvillea-hanging` viene riutilizzata nel capitolo finale.

Il primo piano basso esce durante il passaggio tra fattoria e raccolto; il ramo destro entra con la Basilicata. Il livello vicino è più sfocato ed esce prima. Testi, volti e punti focali restano nella parte libera della composizione. La micro-navigazione mantiene una superficie leggibile; i brevi testi introduttivi di destra lasciano spazio al nuovo capitolo.

Composizioni specifiche per telefono 375 px, telefoni 390–430 px, tablet portrait, tablet landscape e schermi ampi. Sul telefono il ramo finale entra dal lato destro sopra la foto e non dal basso sopra il testo. Su touch si elimina il terzo livello più vicino.

La brezza lavora sui contenitori interni: traslazioni, rotazione e flessione minime, piccola variazione di scala, frequenze e origini differenti. Lo scroll agisce sui genitori. Il movimento autonomo continua a scroll fermo e si sospende fuori scena, con pagina nascosta o dialogo aperto.

## Bianco, atmosfera e mare

Il nuovo modulo `content/scenes.mjs` genera un unico palcoscenico. La fotografia è visibile e opaca dall'inizio, sotto la superficie chiara e sotto le nuvole. La superficie chiara termina con una maschera graduale sovrapposta a un asset atmosferico originale con un bordo inferiore irregolare.

Tre livelli desktop — lontano, intermedio e vicino — sono già presenti sotto il bianco. Due su touch. Le fasce sovrapposte hanno dimensioni, fase, velocità e direzione diverse. Il ciclo attraversa una distanza di ripetizione, con bordi laterali mascherati e sovrapposti per evitare giunture verticali. Nessuna rotazione delle nuvole.

Deriva orizzontale continua, lieve deriva verticale e variazione minima della scala verticale restano indipendenti dallo scroll. Il passaggio della camera sposta e ingrandisce i livelli in misura diversa; i più vicini superano i bordi. La foto sottostante varia soltanto inquadratura e scala: non ha una dissolvenza d'ingresso. Il testo finale compare dopo che l'atmosfera ha aperto la vista.

## Rifiniture dopo la prima implementazione

- Giunture verticali delle nuvole eliminate mediante sovrapposizione e maschere laterali.
- Saturazione dei fiori leggermente ridotta; massa iniziale mantenuta bassa.
- Ramo finale riposizionato su telefono per liberare titolo e descrizione della Basilicata.
- Nei formati telefonici bassi, il primo arbusto scende durante l'arrivo alla fattoria per lasciare libera anche l'ultima riga della descrizione.
- Protezione graduale dei comandi superiori, senza il precedente rettangolo dietro la prenotazione.
- Contrasto del menu corretto anche al punto iniziale esatto della scena chiara.
- Rimosso il limite d'altezza che in WebKit lasciava scoperto il fondo della fotografia della Basilicata sui telefoni alti.
- Controllati cinque momenti di ciascuna scena e il ritorno ai medesimi punti dopo scroll rapido, inverso e resize.

## Asset e prompt

Generazioni originali imagegen, PNG 1536×1024 con alpha reale. Varianti WebP 640, 1024 e 1536 px. I master PNG restano nell'archivio e non vengono caricati dalle pagine. Le fotografie documentarie non sono state rigenerate.

| Asset | WebP 640 / 1024 / 1536, byte |
| --- | --- |
| bougainvillea-mound | 88542 / 203072 / 411284 |
| cloud-shore-edge | 50108 / 118156 / 247744 |

### bougainvillea-mound

> Use case: photorealistic-natural. Original photographic cutout asset, genuinely transparent background, landscape canvas 1536x1024. A dense low broad mound of lush Mediterranean bougainvillea flowers, as if a flowering garden hedge is immediately in front of the camera. Natural raspberry pink, fuchsia, magenta and subtle lilac bracts, deep green leaves mostly under the flowers. Composition is absolutely essential: canopy rises in an irregular rounded mound from the lower LEFT, highest point at 28 percent from the left and 35 percent from the top; slopes gently downward toward the right, ending in a few SHORT leafy flower sprays around 80 percent canvas width. The base enters and is cropped through the BOTTOM and LEFT borders. Top 25 percent is fully transparent; rightmost 10 percent is transparent. No tall isolated stems, no long bare branching twigs, no flowers floating separately. Very full compact flowering canopy with convincing volume and small uneven tufts, beautiful softly sunlit papery petals, shaded green depth, sharp natural detail through most of the canopy and only the very nearest lower flowers softly out of focus. Photo realism, clean natural alpha edge, no white halo, no ground, no pot, no garden or background. Designed to appear as an enlarged low foreground mass that leaves the center of an editorial website clear. Generic original floral scenery, not a documentary property photograph.

### cloud-shore-edge

> Use case: photorealistic-natural. Original photographic atmospheric transition texture, landscape 1536x1024, RGBA with genuine transparency below. We are looking through a very luminous white cloud ceiling as it opens onto clear space BELOW the image. The TOP HALF and entire TOP EDGE are filled with dense, nearly uniform warm neutral WHITE mist, opaque, no sky, flat light with very subtle real cloud texture. This upper mist must form a continuous solid white field suitable for extending upward into a white webpage. Across the MIDDLE and LOWER HALF, the white mass breaks into beautiful large soft irregular billows and fine translucent curling wisps pointing DOWNWARDS, like the underside of a soft sunlit cloud bank. The left has a deeper rounded soft lobe reaching 85 percent down, the center has an opening reaching up to 50 percent, the right has several unequal puffs and wisps to 70 percent down. The BOTTOM edge and all space beneath the irregular cloud edge are truly TRANSPARENT. Subtle cool pearly shading gives depth, but shadows are pale and restrained, no dark blue storm shadows. Natural delicate wisps and photographic vapor detail, not an illustration, not a uniform linear gradient and not a cotton cutout floating in the middle. No ground, no landscape, no blue sky, no horizon, no text, no border. This is specifically a cloud-edged white curtain that blends into a white field above and reveals a photograph below, with a natural complex transparent lower silhouette.

## Verifica riproducibile

`npm run test:continuity` controlla ordine delle sezioni, fotografia unica, coesistenza dei livelli senza fade del mare, riempimento della foto della Basilicata, movimento autonomo, scroll avanti/indietro, salti rapidi e resize dentro la scena. Produce screenshot allo 0/25/50/75/100% su Chrome 1440 e 2560 px e WebKit 375/390/430/820/1180 px.

Si aggiungono le suite funzionali, Apple e profondità. Risultati finali in [VALIDATION.md](VALIDATION.md). Le prove WebKit sono eseguite su Windows: non sono test su iPhone/iPad fisici. Nessun messaggio WhatsApp, prenotazione o altra comunicazione è stata inviata durante i test.
