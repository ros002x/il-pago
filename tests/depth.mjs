import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium,webkit} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=(process.env.PAGO_TEST_URL||'http://127.0.0.1:4173/').replace(/\/?$/,'/');
const output=path.join(root,'artifacts/depth');await fs.mkdir(output,{recursive:true});
const report={checks:[],errors:[],views:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,data)};
for(const [engine,width,height,touch] of [['chrome',1440,900,false],['chrome',390,844,true],['webkit',820,1180,true],['webkit',844,390,true]]){
 const browser=await(engine==='webkit'?webkit.launch():chromium.launch({channel:'chrome'}));
 const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});
 const label=`${engine}-${width}`;page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 const move=async(id,p)=>{await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);window.scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});ScrollTrigger.update()},{id,p});await page.waitForTimeout(850)};
 const captured=[];
 for(const id of ['entrance-scene','experience-scene','coast-scene']){
  for(const p of [0,.25,.5,.75,1]){
   await move(id,p);await page.locator('.ambient-poster').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode()})));
   const view=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,canopyY:document.querySelector('.garden-canopy').getBoundingClientRect().top,canopyCount:document.querySelectorAll('.garden-canopy').length,visibleClouds:[...document.querySelectorAll('.coast-cloud')].filter(e=>getComputedStyle(e).display!=='none').length}));
   check(!view.overflow,`${label} ${id} ${p} no overflow`);
   if(id!=='coast-scene')check(Math.abs(view.canopyY)<2&&view.canopyCount===1,`${label} ${id} ${p} continuous foreground`,view);
   if(id==='coast-scene')check(view.visibleClouds===(touch?2:3),`${label} cloud depth planes`,view.visibleClouds);
   const file=`${label}-${id}-${Math.round(p*100)}.png`;await page.screenshot({path:path.join(output,file)});captured.push({file,id,p});
  }
 }
 await move('coast-scene',.45);
 // Natural film motion and dialog suspension are covered in tests/footage.mjs.
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(600);
 check(await page.evaluate(()=>getComputedStyle(document.querySelector('.garden-canopy')).display==='none'&&[...document.querySelectorAll('.ambient-film video')].every(e=>e.paused)),`${label} reduced motion clears layers`);
 report.views.push({label,captured});await browser.close();console.log('Captured',label);
}
report.failures=report.checks.filter(x=>!x.ok);await fs.writeFile(path.join(output,'results.json'),JSON.stringify(report,null,2));
// Browser-built contact sheets preserve screenshots as captured; no production asset editing.
const browser=await chromium.launch({channel:'chrome'});const page=await browser.newPage({viewport:{width:1200,height:2100}});
for(const {label,captured} of report.views){
 const images=await Promise.all(captured.map(async c=>({...c,uri:'data:image/png;base64,'+(await fs.readFile(path.join(output,c.file))).toString('base64')})));
 await page.setContent(`<style>body{margin:0;background:#222;color:white;font:12px sans-serif;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}figure{margin:0}img{width:100%;height:270px;object-fit:contain;background:#333}figcaption{padding:5px}</style>${images.map(i=>`<figure><img src="${i.uri}"><figcaption>${i.id} ${i.p}</figcaption></figure>`).join('')}`);
 await page.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));await page.screenshot({path:path.join(output,`${label}-sheet.png`),fullPage:true});
}
await browser.close();console.log('Depth checks',report.checks.length,'failures',report.failures.length,'errors',report.errors.length);if(report.failures.length||report.errors.length)process.exitCode=1;
