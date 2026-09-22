import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
import {recipes,recipeUrl,recipeIndex} from '../content/recipes.mjs';

// Targeted regression: recipe paths, browser history and photographic delivery.
const publicMode=process.argv.includes('--public');
const base=publicMode?'https://ros002x.github.io/il-pago/':'http://127.0.0.1:4173/';
const out=publicMode?'artifacts/recipes-retina-public':'artifacts/recipes-retina';
await fs.mkdir(out,{recursive:true});
const manifest=JSON.parse(await fs.readFile('assets/images.json','utf8'));
const variants={};
for(const [name,m] of Object.entries(manifest))for(const v of [...m.variants,...(m.avif||[])])
 variants[v.src]={name,native:[m.width,m.height],delivered:v.width,bytes:v.bytes};
const report={base,checks:[],photos:[],errors:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
const profiles=publicMode?[['chrome',1440,900,2],['webkit',390,844,3]]:[['chrome',1440,900,2],['webkit',390,844,3],['webkit',820,1180,2]];
for(const [engine,width,height,dpr] of profiles){
 const label=`${engine}-${width}@${dpr}`,browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,isMobile:engine==='webkit',hasTouch:engine==='webkit'});
 page.on('pageerror',e=>report.errors.push({label,message:e.message}));
 page.on('response',r=>{if(r.status()>=400)report.errors.push({label,status:r.status(),url:r.url()});});
 const ready=async()=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(400);};
 const shot=async name=>page.screenshot({path:`${out}/${label}-${name}.jpg`,type:'jpeg',quality:88,scale:'css'});
 const photoCheck=async selector=>{
  const photos=await page.locator(selector).evaluateAll(async imgs=>{
   await Promise.all(imgs.map(async i=>{i.loading='eager';await i.decode().catch(()=>{});}));
   return imgs.map(i=>{const r=i.getBoundingClientRect(),s=getComputedStyle(i);return {src:i.currentSrc,box:[r.width,r.height],fit:s.objectFit,loaded:i.complete&&i.naturalWidth>0};});
  });
  for(const p of photos){const m=variants['assets/'+p.src.split('/').at(-1)];if(!m||!p.box[0]||m.name.startsWith('cloud')||m.name.startsWith('bougainvillea'))continue;
   const need=Math.ceil((p.fit==='cover'?Math.max(p.box[0],p.box[1]*m.native[0]/m.native[1]):p.box[0])*dpr);
   const row={label,page:page.url().split('/').at(-1),...m,...p,need,nativeLimited:need>m.native[0]*1.1};report.photos.push(row);
   check(p.loaded&&m.delivered>=Math.min(need,m.native[0])*.9,`${label} ${m.name} delivery`,row);
  }
 };
 await page.goto(base+recipeIndex);await ready();
 check(await page.locator('#ricette .photo-story').count()===4,label+' one list / four recipes');
 await photoCheck('#ricette img');
 const first=page.locator(`#ricette a[href="${recipeUrl(recipes[0].id)}"]`);
 await first.scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 const listScroll=await page.evaluate(()=>scrollY);
 await first.click();await ready();
 check(await page.locator('#ingredienti').isVisible()&&await page.locator('#preparazione').isVisible(),label+' list → ingredients and preparation');
 check(await page.locator('main a[href="prodotti.html"]').count()===0,label+' no product loop in recipe');
 await photoCheck('.recipe-photo img');
 await shot('recipe-top');
 await page.locator('.recipe-navigation').scrollIntoViewIfNeeded();await shot('recipe-navigation');
 await page.goBack();await ready();
 const backScroll=await page.evaluate(()=>scrollY);
 check(page.url().endsWith(recipeIndex)&&Math.abs(backScroll-listScroll)<12,label+' browser Back restores list position',{listScroll,backScroll,url:page.url()});
 await first.click();await ready();
 await page.locator('.recipe-index-link').click();await ready();
 check(page.url().endsWith(recipeIndex)&&await page.locator('#ricette').isVisible(),label+' explicit return to recipe list');
 await first.click();await ready();
 for(let i=1;i<recipes.length;i++){
  const from=recipes[i-1],to=recipes[i];
  await page.locator('.recipe-navigation a[rel="next"]').click();await ready();
  check(page.url().endsWith(recipeUrl(to.id))&&await page.locator('h1').textContent()===to.title,label+` ${from.id} → ${to.id}`);
  check(await page.locator('.recipe-navigation a[rel="prev"]').getAttribute('href')===recipeUrl(from.id),label+` ${to.id} previous link`);
  await photoCheck('.recipe-photo img');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+` ${to.id} viewport fit`);
 }
 check(await page.locator('.recipe-navigation a[rel="next"]').count()===0&&await page.locator('.recipe-table-link').count()===1,label+' last recipe ends without wrapping');
 await page.locator('.recipe-navigation a[rel="prev"]').click();await ready();
 check(page.url().endsWith(recipeUrl(recipes[2].id)),label+' previous recipe works');
 // A legacy bookmark must replace itself, not add an intermediate history entry.
 await page.goto(base+'ristorante.html');await ready();
 await page.goto(base+'ricette.html#pan-brioche');await page.waitForURL('**/ricetta-pan-brioche.html');await ready();
 await page.goBack();await ready();
 check(page.url().endsWith('/ristorante.html'),label+' legacy fragment redirects without a history loop');
 check(await page.locator('.next-chapter').getAttribute('href')==='prodotti.html',label+' table retains product discovery');
 await page.goto(base+'prodotti.html');await ready();
 check(await page.locator('.next-chapter').getAttribute('href')==='contatti.html',label+' products lead to enquiries');
 await page.goto(base+'index.html');await ready();
 await photoCheck('.hero-day,.story-main img');
 await browser.close();
}
check(report.errors.length===0,'No browser / HTTP errors',report.errors);
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(`${report.checks.filter(c=>c.ok).length}/${report.checks.length} checks passed. Native-limited sources: ${[...new Set(report.photos.filter(p=>p.nativeLimited).map(p=>p.name))].join(', ')}`);
process.exitCode=report.checks.some(c=>!c.ok)?1:0;
