import {fileURLToPath} from 'node:url';
import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4173/';
const output=fileURLToPath(new URL('../artifacts/apple/',import.meta.url));await fs.mkdir(output,{recursive:true});
const report={date:new Date().toISOString(),scope:'Browser engine and viewport emulation on Windows; no physical Apple devices',checks:[],errors:[],fps:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,...(data?{data}:{})});if(!ok)console.log('FAIL',label,data||'')};
for(const engine of ['webkit','chrome']){
 const browser=await (engine==='webkit'?webkit.launch():chromium.launch({channel:'chrome'}));
 const sizes=engine==='webkit'?[[375,667],[390,844],[430,932],[768,1024],[820,1180],[1024,768],[1180,820],[1024,1366],[1366,1024],[844,390],[1440,900]]:[[375,667],[430,932],[820,1180],[1180,820],[844,390]];
 for(const [width,height] of sizes){
  const touch=width!==1440;const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});const page=await context.newPage();const label=`${engine} ${width}x${height}`;
  page.on('pageerror',e=>report.errors.push({label,error:e.message}));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)report.errors.push({label,error:r.status()+' '+r.url()})});
  await page.goto(base+'index.html');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(800);
  check(await page.evaluate(()=>document.body.classList.contains('premium-ready')),label+' init');
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' no overflow');
  check(await page.locator('meta[name=viewport]').getAttribute('content').then(v=>v.includes('viewport-fit=cover')),label+' safe-area viewport');
  if(touch)check(await page.evaluate(()=>!document.documentElement.classList.contains('lenis')),label+' native touch scrolling');
  await page.locator('.menu-trigger')[touch?'tap':'click']();await page.waitForTimeout(800);
  const box=await page.locator('#menu-dialog').boundingBox();check(box.x>=0&&box.width<=width&&box.height<=height+1,label+' menu within visible viewport',box);
  const targets=await page.locator('#menu-dialog .menu-sub a').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));
  check(!touch||targets.every(h=>h>=43.9),label+' touch targets',targets);
  await page.locator('#menu-dialog [data-contact]')[touch?'tap':'click']();await page.waitForTimeout(750);
  check(await page.evaluate(()=>document.querySelector('#contact-dialog').open&&document.querySelectorAll('dialog[open]').length===1),label+' menu to contacts');
  await page.locator('#contact-dialog .close-button')[touch?'tap':'click']();await page.waitForTimeout(400);
  check(await page.evaluate(()=>!document.documentElement.classList.contains('dialog-open')),label+' touch unlock');
  const move=async(id,p)=>{await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);window.scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});ScrollTrigger.update()},{id,p});await page.waitForTimeout(650)};
  for(const id of ['entrance-scene','experience-scene','coast-scene']){
   await move(id,.45);
   const snapshot=()=>page.evaluate(id=>{const s=ScrollTrigger.getById(id);return {progress:s.animation.progress(),width:document.documentElement.scrollWidth,height:innerHeight}},id);
   const first=await snapshot();await move(id,.93);await move(id,.45);const back=await snapshot();
   check(Math.abs(first.progress-back.progress)<.01,label+' reverse '+id,{first:first.progress,back:back.progress});
   check(back.width<=width,label+' scene overflow '+id,back.width);
   if(id==='experience-scene'){
    const bottom=await page.locator('.experience-navigation').evaluate(e=>e.getBoundingClientRect().bottom);
    check(bottom<=height+2,label+' pinned navigation visible',bottom);
   }
   if(engine==='webkit'&&[375,820,1180,844].includes(width))await page.screenshot({path:`${output}/${engine}-${width}-${id}.png`});
  }
  if(width===390||width===820){
   for(const [id,selector]of [['entrance-scene','.leaf-near .atmosphere-skin'],['experience-scene','.journey-near .atmosphere-skin'],['coast-scene','.cloud-one .atmosphere-skin']]){
    await move(id,.42);const before=await page.locator(selector).evaluate(e=>e.style.transform);const p0=await page.evaluate(id=>ScrollTrigger.getById(id).progress,id);await page.waitForTimeout(2400);const after=await page.locator(selector).evaluate(e=>e.style.transform);const p1=await page.evaluate(id=>ScrollTrigger.getById(id).progress,id);
    check(before!==after&&p0===p1,label+' autonomous '+id,{before,after});
   }
   const timings=await page.evaluate(()=>new Promise(resolve=>{let previous=performance.now();const intervals=[];const frame=now=>{intervals.push(now-previous);previous=now;if(intervals.length<90)requestAnimationFrame(frame);else resolve(intervals.slice(1));};requestAnimationFrame(frame)}));
   report.fps.push({label,meanIntervalMs:timings.reduce((a,b)=>a+b)/timings.length,maxIntervalMs:Math.max(...timings),note:'Headless rAF timing, not physical-device GPU FPS'});
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(600);check(await page.evaluate(()=>!document.body.classList.contains('premium-ready')&&[...document.querySelectorAll('[data-atmosphere]')].every(e=>!e.style.transform)),label+' live reduced motion cleanup');
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(600);check(await page.evaluate(()=>ScrollTrigger.getAll().filter(s=>s.vars.id==='experience-scene').length===1),label+' live motion restart once');
  }
  for(const file of ['il-pago.html','ospitalita.html','prodotti.html','ristorante.html','territorio.html']){
   await page.goto(base+file);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(120);
   const text=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bad:[...document.querySelectorAll('main h1,main h2')].flatMap(e=>{const r=document.createRange();r.selectNodeContents(e);return [...r.getClientRects()].filter(b=>b.left<-4||b.right>innerWidth+4).map(b=>({text:e.textContent,right:b.right,left:b.left}))})}));
   check(!text.overflow&&!text.bad.length,label+' typography '+file,text);
  }
  if(width===820){
   await page.goto(base+'index.html');await page.waitForTimeout(900);for(const viewport of [{width:1180,height:820},{width:820,height:1180}]){await page.setViewportSize(viewport);await page.waitForTimeout(800);check(await page.evaluate(()=>ScrollTrigger.getAll().filter(t=>t.vars.id==='experience-scene').length===1&&document.querySelectorAll('.hero>#benvenuti').length===1),label+' orientation '+viewport.width);}
  }
  await context.close();console.log('Complete',label);await fs.writeFile(output+'/results.json',JSON.stringify(report,null,2));
 }
 await browser.close();
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(output+'/results.json',JSON.stringify(report,null,2));console.log('Total',report.checks.length,'failures',report.failures.length,'errors',report.errors.length);if(report.failures.length||report.errors.length)process.exitCode=1;
