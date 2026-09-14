# Limiti fotografici residui

Le sostituzioni di giardino, sala, veranda, camere, bagno, fattoria, cavalli e confetture sono completate: dettagli in [IMAGE_AUDIT.md](IMAGE_AUDIT.md). Non restano foto da 800 px nella galleria camere pubblicata.

Il solo limite qui descritto riguarda il dettaglio nativo dei master pubblici quando si richiede un fullscreen 4K o un ritaglio verticale su display DPR 3. Non è risolvibile con `srcset` o aumentando artificialmente i pixel. La priorità resta ottenere lo stesso file dalla fotocamera, senza modificare la struttura né la geografia.

| File / posizione | Limite | Lavorazione conservativa, solo se manca un master migliore |
| --- | --- | --- |
| `assets/courtyard.jpg` — hero | 1920×1000; crop alto e monitor wide | Enhance only the technical quality of this authentic Il Pago photograph. Preserve exact framing, buildings, trees, lawn, people and light. Reduce compression artifacts conservatively. Do not invent texture or change geometry. |
| `assets/farm.jpg` — fattoria e hero esperienze | 1920×1000; crop verticale | Conservatively improve this original photograph. Preserve the child’s exact face, hands, clothing, every animal, fence and background. No face reconstruction, added fur detail, changed anatomy or new objects. |
| `assets/coast.jpg`, `assets/matera.jpg` — territorio | 1920×1000; fullscreen / crop | Preserve the exact horizon, coastline, people, buildings and camera position. Reduce only compression artifacts. Do not invent geographic detail, remove people or change the landscape. |
| `assets/products.jpg` — raccolta | 1920×1000; crop alto | Preserve exactly the hands, gloves, fruit, branches, leaves and light. Apply restrained deblocking only. Do not add or reconstruct objects. |
| `assets/garden-evening.jpg` — ingresso | Nuovo originale 1440×1080; dettaglio finito su wide 4K | Preserve exactly the garden, tables, chairs, tree, lights and people. Recover only existing visible detail and reduce compression. No new lights, plants or invented furnishings. |

Non sono stati pubblicati enhancement generativi non verificati. Un eventuale risultato va conservato separatamente con suffisso `-enhanced`, confrontato con il master su desktop/mobile e scartato se altera dettagli reali. Aumentare semplicemente le dimensioni del file non completa queste lavorazioni.
