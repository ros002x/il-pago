import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let failures=0;
for(const name of ['script.js','motion.js','showcase.js','atmosphere.js','editorial.js','tools/build.mjs','content/pages.mjs','content/discover.mjs','content/scenes.mjs','content/showcase.mjs']){
 const r=spawnSync(process.execPath,['--check',path.join(root,name)],{encoding:'utf8'});if(r.status){console.error(name,r.stderr);failures++;}
}
for(const file of (await fs.readdir(root)).filter(f=>f.endsWith('.html'))){
 const s=await fs.readFile(path.join(root,file),'utf8');
 for(const [,href]of s.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^(https?:|mailto:|tel:|data:)/.test(href))continue;
  try{await fs.access(path.join(root,href.split(/[?#]/)[0]));}catch{console.error(file,'Missing',href);failures++;}
 }
}
const images=JSON.parse(await fs.readFile(path.join(root,'assets/images.json'),'utf8'));
for(const image of Object.values(images))for(const variant of image.variants){
 try{const stat=await fs.stat(path.join(root,variant.src));if(stat.size!==variant.bytes||variant.width>image.width){console.error('Invalid image manifest entry',variant.src);failures++;}}catch{console.error('Missing responsive variant',variant.src);failures++;}
}
const films=JSON.parse(await fs.readFile(path.join(root,'assets/motion/manifest.json'),'utf8'));
for(const film of Object.values(films))for(const key of ['webm','fallback','poster']){
 try{const stat=await fs.stat(path.join(root,'assets/motion',film[key]));if(stat.size!==film.bytes[key]||!stat.size){console.error('Invalid film manifest entry',film[key]);failures++;}}catch{console.error('Missing film',film[key]);failures++;}
}
console.log(failures?'Check failed':'Syntax, local references, image and footage manifests OK');process.exitCode=failures?1:0;
