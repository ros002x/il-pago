# Asset atmosferici generati

Aggiornamento 14 settembre 2026: gli asset di questa prima versione sono conservati come archivio. La homepage ora usa le bougainvillee e i cumuli descritti in [FOREGROUND_REFINEMENT.md](FOREGROUND_REFINEMENT.md), con i relativi prompt completi.

Strumento usato: imagegen integrato. Nessuna fotografia di camere, giardino o geografia è stata generata per sostituire la documentazione reale.

## Ulivo

Master: `assets/olive-foreground.png` (1254×1254, alpha). Varianti web: `assets/olive-foreground-640.webp`, `assets/olive-foreground-1254.webp`.

Prompt eseguito:

> Use case: photorealistic-natural. Asset type: transparent photographic foreground layer for an elegant Mediterranean agriturismo website. Generate a single natural olive branch, fine crooked woody twigs, slender matte sage and deep olive-green leaves with silvery undersides, a few small green olives. Real macro editorial photography, absolutely not illustration, not CGI. Composition: foliage sweeps diagonally upward from bottom left toward upper right, loose airy organic spacing, branch mostly occupies left and lower portions, fine tips toward right. Soft late afternoon sidelight, realistic veins, slightly out of focus nearest leaves, understated Mediterranean countryside. Isolated on genuinely TRANSPARENT background with clean natural alpha edges, no ground, no cast background shadow, no pot, no frame, no text, no logo. Canvas approximately 1024 square. This is a generic decorative plant cutout, not a photograph purporting to document any property.

## Nuvole

Master: `assets/cloud-veil.png` (1536×1024, alpha). Varianti web: `assets/cloud-veil-640.webp`, `assets/cloud-veil-1280.webp`, `assets/cloud-veil-1536.webp`.

Prompt eseguito:

> Use case: photorealistic-natural. Asset type: transparent photographic cloud veil, a decorative transition layer for a Mediterranean countryside website. Create a wide soft bank of thin white and warm ivory fair-weather clouds, very airy semi-transparent mist with a few natural cottony sunlit edges. Realistic atmospheric photography, never vector or painted. Composition horizontal approximately 1536x1024, wisps concentrated across the lower half and left edge, becoming completely transparent toward the top and right. Genuine transparent background and semi-transparent feathered cloud edges, preserve actual alpha. No sky color, no landscape, no buildings, no sea, no sun, no text, no frame. Quiet midday-to-late-afternoon neutral lighting. This asset overlays authentic landscape photography only during a short scroll transition; it is not documentary property photography.

I due risultati sono stati ispezionati visivamente prima dell’integrazione. Compressione e ridimensionamento producono le versioni web; le animazioni e le maschere di bordo sono nel codice. `courtyard-night.png` proviene dal progetto precedente ed è stata preservata, senza rigenerarla.
