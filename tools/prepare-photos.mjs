// Rebuilds delivery files from the authentic masters in assets; provenance in PHOTO_SOURCES.json.
// No retouching, generative reconstruction or enlargement: only responsive encoding.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sources=JSON.parse(await fs.readFile(path.join(root,'PHOTO_SOURCES.json'),'utf8'));
const manifestPath=path.join(root,'assets/images.json');
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
const browser=await chromium.launch({channel:'chrome'});const page=await browser.newPage();
const report=[];
for(const source of sources){
 const name=source.asset;const bytes=await fs.readFile(path.join(root,`assets/${name}.jpg`));
 const before=manifest[name];
 const result=await page.evaluate(async data=>{
  const img=new Image();img.src='data:image/jpeg;base64,'+data;await img.decode();const variants=[];
  for(const width of [...[640,960,1280].filter(w=>w<img.naturalWidth),img.naturalWidth]){
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=Math.round(width*img.naturalHeight/img.naturalWidth);
   const context=canvas.getContext('2d');context.imageSmoothingQuality='high';context.drawImage(img,0,0,canvas.width,canvas.height);
   variants.push({width,data:canvas.toDataURL('image/webp',.9).split(',')[1]});
  }
  return {width:img.naturalWidth,height:img.naturalHeight,variants};
 },bytes.toString('base64'));
 manifest[name]={width:result.width,height:result.height,variants:[]};
 for(const variant of result.variants){const src=`assets/${name}-${variant.width}.webp`,data=Buffer.from(variant.data,'base64');if(variant.width===result.width&&bytes.length<data.length){manifest[name].variants.push({src:`assets/${name}.jpg`,width:result.width,bytes:bytes.length});}else{await fs.writeFile(path.join(root,src),data);manifest[name].variants.push({src,width:variant.width,bytes:data.length});}}
 report.push({...source,native:[result.width,result.height],masterBytes:bytes.length,variants:manifest[name].variants});
 console.log(name,`${before.width}x${before.height} -> ${result.width}x${result.height}`,Math.round(manifest[name].variants.at(-1).bytes/1024)+' KB');
}
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(root,'PHOTO_SOURCES.json'),JSON.stringify(report,null,2)+'\n');
await browser.close();
