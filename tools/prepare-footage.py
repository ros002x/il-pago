"""Create transparent web loops from the licensed originals in .research.
Requires imageio-ffmpeg and numpy (local .research/toolchain is also supported).
The original moving frames supply all wind/mist motion; no still-image deformation.
"""
from pathlib import Path
import sys, subprocess, hashlib, json

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '.research/toolchain'))
import imageio_ffmpeg
import numpy as np
from PIL import Image

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
OUT = ROOT / 'assets/motion'
OUT.mkdir(parents=True, exist_ok=True)

def ffmpeg(args, **kwargs):
    return subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', *args], check=True, **kwargs)

def encode(name, frames, width, height, fps=20):
    # Reverse at the ends to close the loop without a cut or double-exposed flowers.
    sequence = frames + frames[-2:0:-1]
    destination = OUT / (name + '.webm')
    command = [FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgba',
        '-video_size', f'{width}x{height}', '-framerate', str(fps), '-i', 'pipe:0', '-an', '-map_metadata', '-1',
        '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-b:v', '0', '-crf', '40',
        '-cpu-used', '4', '-row-mt', '1', '-threads', '4', str(destination)]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for frame in sequence:
            process.stdin.write(frame.tobytes())
    finally:
        process.stdin.close()
    if process.wait():
        raise RuntimeError('VP9 alpha encoding failed: ' + name)
    mobile_width = 384 if name.startswith('bougainvillea') else 480
    mobile_height = round(height * mobile_width / width)
    fallback = [Image.fromarray(frame).resize((mobile_width, mobile_height), Image.Resampling.LANCZOS) for frame in sequence[::2]]
    fallback[0].save(OUT / (name + '.webp'), save_all=True, append_images=fallback[1:], duration=round(2000/fps), loop=0, quality=70, method=5)
    Image.fromarray(frames[0]).save(OUT / (name + '-poster.webp'), quality=88, method=5)
    print(name, width, height, 'frames', len(sequence), 'webm bytes', destination.stat().st_size, 'webp bytes', (OUT / (name+'.webp')).stat().st_size, flush=True)
    return {'width':width,'height':height,'fps':fps,'duration':len(sequence)/fps,'webm':destination.name,'fallback':name+'.webp','poster':name+'-poster.webp'}

def plant(name, source, filters, width, height, start, duration=3):
    raw = ffmpeg(['-ss', str(start), '-i', str(ROOT / '.research' / source), '-t', str(duration), '-vf', filters + ',fps=20', '-f', 'rawvideo', '-pix_fmt', 'rgba', 'pipe:1'], stdout=subprocess.PIPE).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1,height,width,4).copy()
    for frame in frames:
        # Restrained blue despill only at the keyed silhouette, preserving magenta petals.
        edge = (frame[:,:,3] > 0) & (frame[:,:,3] < 250)
        ceiling = np.maximum(frame[:,:,0],frame[:,:,1]).astype(np.int16) + 5
        frame[:,:,2] = np.where(edge,np.minimum(frame[:,:,2],ceiling),frame[:,:,2]).astype(np.uint8)
        frame[frame[:,:,3]==0,:3] = 0
        if name.startswith('bougainvillea-garden') or name.startswith('bougainvillea-branch'):
            # The bare upper twig is outside the selected floral silhouette.
            # A fixed, narrow matte removes it without deforming any moving plant pixels.
            yy,xx=np.indices((height,width))
            open_sky=(xx>width*.32) if name=='bougainvillea-garden' else (xx<width*.68)
            edge_matte=np.where(open_sky,np.clip((yy-height*.23)/(height*.025),0,1),1)
            frame[:,:,3]=(frame[:,:,3]*edge_matte).astype(np.uint8)
    return encode(name, list(frames), width, height)

manifest = {}
manifest['bougainvillea-garden'] = plant('bougainvillea-garden','bougainvillea-10357745.mp4',
    'format=rgba,colorkey=0xE6E6E6:0.11:0.025,hflip,scale=900:474',900,474,7.5,4)
manifest['bougainvillea-branch'] = plant('bougainvillea-branch','bougainvillea-10357745.mp4',
    'format=rgba,colorkey=0xE6E6E6:0.11:0.025,scale=800:422',800,422,1)

raw=ffmpeg(['-ss','3','-i',str(ROOT / '.research/mist-9694227.mp4'),'-t','4','-vf','scale=960:540,vflip,fps=20','-f','rawvideo','-pix_fmt','rgb24','pipe:1'],stdout=subprocess.PIPE).stdout
rgb=np.frombuffer(raw,np.uint8).reshape(-1,540,960,3)
mist=[]
for image in rgb:
    luminance=image[:,:,0]*.2126+image[:,:,1]*.7152+image[:,:,2]*.0722
    alpha=np.clip((luminance-4)*1.25,0,255).astype(np.uint8)
    shade=np.where(alpha<240,245,np.clip(225+luminance*.095,0,250)).astype(np.uint8)
    frame=np.empty((540,960,4),np.uint8);frame[:,:,:3]=shade[:,:,None];frame[:,:,3]=alpha
    frame[alpha==0,:3]=0;mist.append(frame)
manifest['coastal-cloud']=encode('coastal-cloud',mist,960,540)

# Tiny capability probe: the browser must decode real alpha, not just accept the codec.
probe=np.zeros((8,8,4),np.uint8);probe[:,4:]=[240,30,40,255]
ffmpeg(['-y','-f','rawvideo','-pix_fmt','rgba','-s','8x8','-r','2','-i','pipe:0','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-b:v','0','-crf','10',str(OUT/'alpha-probe.webm')],input=probe.tobytes()*2)
for item in manifest.values():
    item['bytes']={key:(OUT/item[key]).stat().st_size for key in ['webm','fallback','poster']}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
