# Fotografie e delivery — revisione del 14 settembre 2026

Ricerca ripresa dai risultati già raccolti: sito ufficiale, file originali delle gallerie e **47 immagini pubbliche del motore di prenotazione ufficiale Il Pago**. La ricerca non ha effettuato prenotazioni. Nessuna fotografia stock o generativa è stata usata per rappresentare la struttura.

## Undici immagini aggiornate

| Asset | Prima | Originale integrato | Scelta |
| --- | --- | --- | --- |
| [restaurant-table.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/ee19cf66-082d-4e81-accd-e0d162d3ea97.jpeg) | 1152×768 | 1600×1200 | Stesso scatto, campo più ampio; sala e homepage. |
| [room-garden.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/a9f9ea5f-53db-4285-ade7-179f6d35401b.jpg) | 1920×1000 | 2000×1333 | Stesso scatto, originale più ampio; hero ospitalità e prima camera. |
| [veranda.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/cda8128d-b744-45ef-9bbe-b2e6b19bcc9d.jpg) | 1366×911 | 2000×1333 | Stesso scatto, originale 2000 px; storia e servizi. |
| [garden-evening.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/fbf1bf8e-f119-4b88-b841-c739c45fcc67.jpeg) | 1152×768 | 1440×1080 | Alternativa autentica del giardino serale; ingresso e proposte. |
| [room-2.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/4ee310ce-35e2-47f3-b7a3-25065ac682fc.jpeg) | 800×600 | 1600×1200 | Alternativa autentica della camera con soffitto in legno. |
| [room-1.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/50d5addd-bf41-4e36-b94c-0cff5767e70a.jpeg) | 800×600 | 1600×1200 | Seconda vista autentica della camera; alt e didascalia aggiornati. |
| [room-3.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/bf9430eb-acec-43a1-8761-80804c9b131c.jpeg) | 800×600 | 1600×1200 | Altro punto di vista autentico del bagno, senza ampliare lo spazio. |
| [seedlings.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/12ef1332-2ef8-49bd-859f-d6a5a553f53a.jpeg) | 1152×768 | 1866×1400 | Attività reale nell’orto; didascalia aggiornata alla nuova fotografia. |
| [horses.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/faf92b21-862f-44b3-bd42-c178d5eceaab.jpeg) | 1152×768 | 1600×1200 | Scatto autentico più ampio della passeggiata in campagna. |
| [preserves.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/c1865a4e-14ed-4319-b2b7-709f2f355c72.jpg) | 1366×911 | 1920×1000 | Stesso allestimento di confetture, campo più ampio. |
| [garden-table.jpg](https://hospitality-storage.teamsystem.cloud/public/669a6cefbc4fbece7ffaa4de/0a3cb20f-bcf3-4ffc-9475-fccaa9af4b91.jpg) | 1152×768 | 1440×1080 | Alternativa autentica: torta e frutta sul tavolo in giardino. |

I link puntano ai file della proprietà pubblicati dal [motore ufficiale](https://hospitality-guest.teamsystem.cloud/booking-engine/azienda-agrituristica-il-pago). URL, dimensioni e pesi verificabili in [PHOTO_SOURCES.json](PHOTO_SOURCES.json). Gli originali precedenti sono recuperabili dalla cronologia Git; le vecchie varianti ormai inutilizzate sono state rimosse.

## Consegna delle immagini

- Varianti 640, 960, 1280 e larghezza originale; nessuna variante supera il master.
- WebP qualità 90 per le dimensioni intermedie. Alla massima dimensione viene servito il JPEG originale se pesa meno del WebP: nessuna seconda compressione inutile.
- Il build usa un solo manifest anche per tutte e tre le immagini del carosello camere. I pulsanti non richiamano più i vecchi file da 800 px.
- `sizes` considera l’altezza del ritaglio nelle hero interne, nella veranda e nella sala. Le figure editoriali occupano al massimo 1600 px e non superano la larghezza del rispettivo originale.
- Un solo preload fotografico per pagina, abbinato al `sizes` della sua hero. Fotografie successive lazy; larghezza e altezza dichiarate.
- Le figure degli approfondimenti hanno didascalie esterne e nessun ingrandimento parallax nascosto. La famiglia mantiene l’inquadratura di gruppo; le immagini non vengono deformate.

## Fotografie conservate e limiti reali

Hero `courtyard`, bambino e asinelli `farm`, raccolta `products`, Matera e costa restano gli scatti autentici approvati da 1920×1000. Le fonti principali sono [homepage ufficiale](https://www.ilpago.eu/) e [azienda/agriturismo](https://www.ilpago.eu/agriturismo/). Non sono emersi master più grandi degli stessi scatti tra le fonti esaminate. Famiglia e frutteto restano nelle dimensioni originali, con presentazione editoriale contenuta.

La selezione responsive evita miniature insufficienti quando esistono originali migliori; non crea dettaglio fotografico assente. Il fullscreen su monitor 4K o un crop alto a DPR 3 può ancora superare il dettaglio nativo disponibile. Non viene promessa nitidezza 4K a partire da questi file: richieste fotografiche residue e prompt conservativi sono in [IMAGE_AI_TODO.md](IMAGE_AI_TODO.md).

## Elementi atmosferici

Bougainvillea e nuvole sono asset decorativi originali già presenti, separati dalle fotografie documentarie. `canopy.js` deforma localmente una mesh leggera con tre gruppi di rami e radici ferme; il bitmap sorgente non viene riscritto. La variante notturna già approvata resta un’elaborazione atmosferica. Asset proprietari di ERA non sono distribuiti.
