"""High-quality AVIF alternatives from the four verified official recipe originals.

The original JPEGs are cached in .research/editorial-originals. Source URLs are
recorded in EDITORIAL_PHOTO_SOURCES.json. Never enlarge the source pixels.
Existing WebP variants remain available to browsers without AVIF support.
"""
from pathlib import Path
import json
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
manifest_path = root / 'assets/images.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
for name in ['recipe-pastizz', 'recipe-brioche', 'recipe-torta-2', 'recipe-frizzul']:
    master = root / '.research/editorial-originals' / (name + '.jpg')
    image = ImageOps.exif_transpose(Image.open(master)).convert('RGB')
    width, height = image.size
    assert [width, height] == [manifest[name]['width'], manifest[name]['height']]
    variants = []
    for size in [w for w in [480, 800, 1200, 1600] if w < width] + [width]:
        destination = root / 'assets' / f'{name}-{size}.avif'
        image.resize((size, round(height * size / width)), Image.Resampling.LANCZOS).save(
            destination, 'AVIF', quality=85, speed=6, subsampling='4:4:4')
        variants.append({'src': 'assets/' + destination.name, 'width': size,
                         'bytes': destination.stat().st_size})
    manifest[name]['avif'] = variants
    print(name, image.size, sum(v['bytes'] for v in variants))
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8', newline='\n')
