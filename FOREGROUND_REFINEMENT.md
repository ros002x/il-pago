# Foreground e atmosfera — 14 settembre 2026

Documento storico della prima revisione. La versione corrente è descritta in [CONTINUITY_REVIEW.md](CONTINUITY_REVIEW.md): nuovo arbusto compatto, chioma pendente riutilizzata, tre fasce atmosferiche desktop e due touch, bianco continuo sopra la fotografia già presente. Le descrizioni compositive seguenti riguardano la versione precedente.

## Asset originali

Modalità: imagegen integrato, quattro generazioni originali. Nessun asset di ERA Residence è stato copiato nel sito. Riferimento percettivo: [ERA Residence](https://www.era-residence.com/), studiato insieme ai fotogrammi del video fornito.

I PNG master hanno alpha reale, con pixel completamente trasparenti e bordi semitrasparenti. Controllo visivo su fondo carta e azzurro prima dell'integrazione. Le sole trasformazioni dei file sono ridimensionamento e compressione WebP; nessuna fotografia documentaria di Il Pago è stata modificata.

| Master | Dimensioni | WebP disponibili | Impiego |
| --- | --- | --- | --- |
| assets/bougainvillea-rise.png | 1024×1536 | 640, 1024 px | Arbusto dal basso, primo piano vicino |
| assets/bougainvillea-hanging.png | 1536×1024 | 640, 1024, 1536 px | Chioma dall'alto |
| assets/cloud-volume.png | 1536×1024 | 640, 1024, 1536 px | Cumuli medi e vicini alla camera |
| assets/cloud-ribbon.png | 1536×1024 | 640, 1024, 1536 px | Banco lontano e secondo piano di passaggio |

Percorsi, larghezze e pesi esatti: `assets/images.json`. I master PNG non vengono richiesti dalle pagine. Gli asset precedenti `olive-foreground` e `cloud-veil` sono conservati nell'archivio del progetto e non sono più inseriti nella homepage.

## Composizione e movimento

Una sola chioma persistente, con tre piani su desktop, attraversa ingresso, giardino e capitoli orizzontali. La cornice usa una finestra sticky senza aggiungere distanza di scorrimento. I contenitori rispondono allo scroll; le immagini interne hanno una brezza indipendente con deriva, rotazione minima, flessione e variazione di scala. Ogni ramo ha fase e punto di ancoraggio diversi.

La costa usa quattro piani atmosferici: banco lontano, cumulo medio, cumulo vicino e banco laterale. I primi piani crescono e superano i bordi, mentre la fotografia autentica emerge. Non ci sono rotazioni delle nuvole. Deriva lenta, scala e opacità continuano a variare quando lo scroll si ferma.

Un arbusto vicino alla camera riprende il colore del giardino all'inizio del passaggio campagna–costa su desktop, poi supera il bordo prima della rivelazione del mare. Riutilizza il master già caricato.

Su touch e viewport stretti restano due piani vegetali e due atmosferici. Il ciclo si sospende fuori scena, a pagina nascosta e durante l'apertura di un dialogo. Con movimento ridotto le composizioni decorative sono disattivate; tutte le informazioni restano accessibili.

## Secondo passaggio visivo

Dopo la prima sequenza di screenshot sono stati corretti posizione della chioma superiore, uscita del primo piano vicino, leggibilità della micro-navigazione, apertura del cielo e contrasto del titolo sul mare. La chioma superiore viene specchiata per mantenere il bordo tagliato del master fuori dal frame. La navigazione dei capitoli resta sopra gli arbusti e non cambia identità fra le scene.

Verifiche riproducibili: `tests/depth.mjs`. Screenshot e risultati sono in `artifacts/depth/` (esclusi da Git). Le verifiche Apple usano WebKit e viewport/touch emulati su Windows, non hardware Apple fisico.

## Prompt eseguiti

### bougainvillea-rise

> Use case: photorealistic-natural. Create an original photographic cutout asset of a large lush Mediterranean bougainvillea shrub, genuine transparent background, wide portrait 1024x1536. Composition for a foreground website scene: dense irregular mass of rich dark fuchsia, magenta and muted lilac papery flower bracts grows from bottom LEFT, gnarled slender branching stems arc upward and toward the RIGHT, graceful airy branch tips reaching across the upper right, plenty of natural gaps between branches. The thick base enters cropped through the lower left edge, never a pot. A substantial canopy with hundreds of tiny individual blooms, not a single flower or tiny twig. Deep burgundy shadows, dark forest-green leaves, warm natural sidelighting, photoreal botanical editorial photography. Distinct depth: a few nearer petals gently soft, fine distant tips sharp. Organic asymmetry, clean photographic alpha edges with no white fringe. Isolated real transparency everywhere around and between leaves. No garden, no wall, no landscape, no ground, no text, no frame, no watermark, no stylized illustration or fantasy. This is a generic theatrical foreground plant, not documentary evidence of a property.

### bougainvillea-hanging

> Use case: photorealistic-natural. Original photographic cutout, genuine transparent background, landscape canvas 1536x1024. A lush hanging Mediterranean bougainvillea canopy entering from the TOP RIGHT corner, dark woody interlaced stems curving left and downward, sprays of dusty raspberry pink, deep magenta and pale lilac papery flowers. Dense flower clusters nearest the upper right, long elegant branching sprays toward the lower left, irregular gaps with actual transparency. Significant volume and layered plant structure, not a bouquet and not a flat line of flowers. Rich yet natural color, deep olive green leaves, shaded underside, soft afternoon sidelighting; fine botanical texture, a few blurred nearest bracts. A composition designed to be enlarged and clipped by the top edge of a website, the viewer sees the scene through this foliage. No pot, no background, no sky, no building, no text, no border, no cartoon, no fluorescent colors. Perfect natural alpha cutout with no white halo. Generic decorative vegetation, not a real property photograph.

### cloud-volume

> Use case: photorealistic-natural. Original photographic atmospheric cutout on a genuinely transparent background, landscape 1536x1024. A substantial sunlit fair-weather cumulus cloud seen from close to its height, extremely wide asymmetric formation. Large luminous ivory and white rounded cotton volumes rise on the LEFT, a lower broken wispy shelf extends toward the RIGHT. Volumetric soft pale blue-grey interior shadow, three-dimensional depth and beautifully detailed irregular wispy edges; bright natural daylight, serene clear weather, not storm clouds. The cloud itself should occupy about 75 percent of the canvas width and 65 percent of height with generous TRANSPARENT margins on all sides, no cutoff cloud edge at the canvas border. Preserve semi-transparent wisps and true alpha between separated little puffs. No blue sky, no ground, no horizon, no mountains, no airplane, no fog sheet, no text, no frame. This will be a composited foreground cloud that grows past a camera, so give it substantial form rather than uniform haze. Absolutely photographic, not painterly.

### cloud-ribbon

> Use case: photorealistic-natural. Original photographic cloud cutout with true transparent background, wide landscape 1536x1024. An airy elongated fair-weather cloud bank with several unequal soft white cumulus tufts connected by fine vapor filaments, stretching horizontally and slightly diagonally from lower left to upper right. Natural three-dimensional daylight clouds with gentle cool shadows below, translucent fine wisps, irregular uneven silhouette. One larger billowing tuft on the RIGHT and smaller scattered puffs at left, distinctly different from a uniform fog band. Concentrate the cloud across the central third vertically, leaving fully transparent space above and below and margins at the sides; no straight edges, no background sky, no halo, no ground, no horizon, no landscape, no text, no illustration. Intended for a distant and middle atmospheric plane in an elegant Mediterranean website, believable photography and a clean alpha channel.
