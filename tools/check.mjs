import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let failures=0;
for(const name of ['script.js','motion.js','atmosphere.js','editorial.js','tools/build.mjs','content/pages.mjs','content/discover.mjs']){
 const r=spawnSync(process.execPath,['--check',path.join(root,name)],{encoding:'utf8'});if(r.status){console.error(name,r.stderr);failures++;}
}
for(const file of (await fs.readdir(root)).filter(f=>f.endsWith('.html'))){
 const s=await fs.readFile(path.join(root,file),'utf8');
 for(const [,href]of s.matchAll(/(?:src|href)="([^"#]+)"/g)){
  if(/^(https?:|mailto:|tel:|data:)/.test(href))continue;
  try{await fs.access(path.join(root,href.split('#')[0]));}catch{console.error(file,'Missing',href);failures++;}
 }
}
console.log(failures?'Check failed':'Syntax and local asset references OK');process.exitCode=failures?1:0;
