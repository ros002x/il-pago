# Selezione delle immagini

Verifica del 13 settembre 2026. Le immagini della struttura e del territorio provengono dal sito ufficiale. Gli originali restano in `assets`; `assets/images.json` associa i nomi editoriali alle varianti servite. Le riprese principali compaiono una sola volta nella homepage. Un’immagine può tornare nella pagina dedicata al suo argomento.

| Asset | Provenienza ufficiale | Scelta e impiego |
| --- | --- | --- |
| `courtyard.jpg` | [home/slide4.jpg](https://www.ilpago.eu/images/home/slide4.jpg) | Hero approvata conservata; crop mobile centrato sul giardino. |
| `garden-evening.jpg` | [gallery/24.jpg](https://www.ilpago.eu/images/gallery/24.jpg) | Giardino con luci: sostituisce la vecchia porta, arco che si apre a fullscreen. Limite 1152×768 documentato. |
| `farm.jpg` | [home/slide5.jpg](https://www.ilpago.eu/images/home/slide5.jpg) | Bambino e asinelli conservati; primo momento del racconto orizzontale. |
| `products.jpg` | [prodotti-tipici/slide1.jpg](https://www.ilpago.eu/images/prodotti-tipici/slide1.jpg) | Raccolta delle arance; secondo momento, alternanza della composizione. |
| `matera.jpg` | [home/slide3.jpg](https://www.ilpago.eu/images/home/slide3.jpg) | Panorama dei Sassi nella terza scena, apertura verso il territorio senza ripetere il mare. |
| `exterior.jpg` | [gallery/1.jpg](https://www.ilpago.eu/images/gallery/1.jpg) | Foto della famiglia, non una generica veduta esterna; didascalia corretta. |
| `veranda.jpg` | [gallery/14.jpg](https://www.ilpago.eu/images/gallery/14.jpg) | Ospitalità e giardino, proporzioni dei mobili conservate. |
| `restaurant-table.jpg` | [gallery/29.jpg](https://www.ilpago.eu/images/gallery/29.jpg) | Tavola autentica in sala: sostituisce la foto del braccio/impasto. |
| `garden-table.jpg` | [gallery/22.jpg](https://www.ilpago.eu/images/gallery/22.jpg) | Tavola all’aperto negli approfondimenti di ristorante e ricette. |
| `room-garden.jpg` | [home/slide2.jpg](https://www.ilpago.eu/images/home/slide2.jpg) | Scatto più ampio e definito, prima immagine delle camere. |
| `room-1.jpg`, `room-2.jpg`, `room-3.jpg` | [nuova1](https://www.ilpago.eu/images/agriturismo/nuova1.jpg), [nuova2](https://www.ilpago.eu/images/agriturismo/nuova2.jpg), [nuova3](https://www.ilpago.eu/images/agriturismo/nuova3.jpg) | Ingresso, stanza e bagno autentici; uso secondario, limiti fotografici documentati. |
| `orchard.jpg` | [gallery/9.jpg](https://www.ilpago.eu/images/gallery/9.jpg) | Coltivazioni nell'approfondimento Il Pago / Azienda agricola; “Lascia vagare lo sguardo” accompagna la foto, senza interrompere il passaggio al mare. |
| `preserves.jpg` | [gallery/5.jpg](https://www.ilpago.eu/images/gallery/5.jpg) | Dispensa, etichette originali preservate. |
| `seedlings.jpg` | [gallery/27.jpg](https://www.ilpago.eu/images/gallery/27.jpg) | Piantine del laboratorio, approfondimento fattoria. |
| `horses.jpg` | [gallery/26.jpg](https://www.ilpago.eu/images/gallery/26.jpg) | Attività a cavallo dalla galleria della struttura. |
| `coast.jpg` | [home/slide6.jpg](https://www.ilpago.eu/images/home/slide6.jpg) | Un’unica rivelazione del mare nella homepage; distanza esplicita, nessuna falsa vista dalla masseria. |
| `olive-foreground.png`, `cloud-veil.png` | Prima generazione originale, archiviata | Sostituiti nella homepage dal 14 settembre; nessuna richiesta dalle nuove scene. |
| `bougainvillea-mound.png`, `bougainvillea-hanging.png` | Generazioni originali imagegen | Massa bassa compatta e chioma pendente, tre profondità desktop e due touch; ricomposizione tra giardino e capitoli. |
| `cloud-shore-edge.png` | Generazione originale imagegen | Bordo chiaro e trasparente, tre fasce desktop e due touch; deriva indipendente e nessuna rotazione. |
| `bougainvillea-rise.png`, `cloud-volume.png`, `cloud-ribbon.png` | Generazioni precedenti, archiviate | Conservate nei file; non più inserite nella homepage. |
| `courtyard-night.png` | Elaborazione già presente della hero | Conservata come atmosfera notturna, non spacciata per un nuovo scatto documentario. |

Le varianti WebP hanno larghezze 640, 1280 e, ove disponibile, larghezza originale. Quando il JPEG originale è più leggero del WebP massimo, il manifest usa il JPEG: questa selezione risparmia 546.550 byte sui relativi file massimi senza ulteriore compressione. Le immagini trasparenti pubblicate usano WebP alpha; i PNG master non vengono richiesti dalle scene.

I precaricamenti corrispondono al `sizes` dell’immagine effettiva. La hero e il mare tengono conto del crop alto su telefono; le immagini secondarie sono lazy. Dimensioni intrinseche dichiarate, `object-fit` senza deformazioni, nessuna catena di immagini 4K.

I due nuovi asset della revisione corrente hanno varianti 640/1024/1536 px. Alpha controllato numericamente e visivamente. Prompt, percorsi e note in [CONTINUITY_REVIEW.md](CONTINUITY_REVIEW.md); generazioni precedenti in [FOREGROUND_REFINEMENT.md](FOREGROUND_REFINEMENT.md).

Non selezionati per le nuove scene: `garden.jpg` (vecchia porta), `pasta.jpg` (preparazione non gradita), `bees.jpg` e `restaurant-room.jpg` (alternative meno adatte alla composizione). Rimangono disponibili come archivio locale, senza caricamenti inutili nella pagina.

Interventi tecnici ancora possibili e relativi prompt: [IMAGE_AI_TODO.md](IMAGE_AI_TODO.md). I limiti degli originali non sono stati mascherati inventando camere o panorami.
