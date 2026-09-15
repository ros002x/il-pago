"""Encode the selected official photographs without enlarging their native pixels.
Masters are cached in .research/editorial-originals; provenance stays in Git.
"""
from pathlib import Path
import json
from PIL import Image, ImageOps
root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'assets/images.json').read_text(encoding='utf-8'))
sources=json.loads((root/'EDITORIAL_PHOTO_SOURCES.json').read_text(encoding='utf-8'))
for source in sources:
 name=source['asset'];master=root/'.research/editorial-originals'/(name+'.jpg')
 im=ImageOps.exif_transpose(Image.open(master)).convert('RGB')
 width,height=im.size;variants=[]
 for size in [w for w in [480,800,1200,1600] if w<width]+[width]:
  dest=root/'assets'/f'{name}-{size}.webp'
  im.resize((size,round(height*size/width)),Image.Resampling.LANCZOS).save(dest,'WEBP',quality=86,method=6)
  variants.append({'src':'assets/'+dest.name,'width':size,'bytes':dest.stat().st_size})
 manifest[name]={'width':width,'height':height,'variants':variants};source['native']=[width,height]
 print(name,width,height,sum(v['bytes'] for v in variants))
(root/'assets/images.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
(root/'EDITORIAL_PHOTO_SOURCES.json').write_text(json.dumps(sources,indent=2)+'\n',encoding='utf-8',newline='\n')
