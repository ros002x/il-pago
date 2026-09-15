import {chromium,webkit,request} from 'playwright';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=process.env.PAGO_TEST_URL||'https://ros002x.github.io/il-pago/';
const out='artifacts/public-footage';await fs.mkdir(out,{recursive:true});const report={url:base,checks:[],errors:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,data);};
const http=await request.newContext();
for(const file of ['index.html','script.js','motion.js','atmosphere.js','showcase.js','scenography.css','showcase.css','refinement.css','assets/motion/manifest.json']){
 const local=await fs.readFile(file),hash=createHash('sha256').update(local).digest('hex');
 const response=await http.get(base+file+'?verify='+hash.slice(0,12));
 check(response.status()===200&&createHash('sha256').update(await response.body()).digest('hex')===hash,'deployed file '+file,{status:response.status(),sha256:hash});
}
await http.dispose();
for(const [engine,width,height] of [['chrome',1440,900],['webkit',390,844],['webkit',820,1180]]){
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},hasTouch:engine==='webkit',isMobile:engine==='webkit'});const label=engine+'-'+width;
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));page.on('response',r=>{if(r.status()>=400)report.errors.push({label,status:r.status(),url:r.url()});});
 await page.goto(base,{waitUntil:'load',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.ScrollTrigger?.getById('experience-scene'));
 for(const [id,p,selector] of [['experience-scene',.04,'.canopy-rise .ambient-film'],['coast-scene',.4,'.cloud-one .ambient-film']]){
   await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});},{id,p});
   await page.waitForFunction(s=>document.querySelector(s).matches('.has-video,.has-fallback'),selector,{timeout:30000});await page.waitForTimeout(900);
   const state=await page.locator(selector).evaluate(e=>{
     const video=e.querySelector('video'),fallback=e.querySelector('.ambient-fallback'),source=e.classList.contains('has-video')?video:fallback;
     const c=document.createElement('canvas');c.width=72;c.height=48;const ctx=c.getContext('2d');ctx.drawImage(source,0,0,72,48);const pixels=ctx.getImageData(0,0,72,48).data;let empty=0,solid=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i]<10)empty++;if(pixels[i]>100)solid++;}
     return {format:e.dataset.format,playing:e.classList.contains('has-video')?!video.paused:!!fallback.getAttribute('src'),alpha:empty>15&&solid>15};
   });
   const before=await page.screenshot({path:`${out}/${label}-${id}.png`});await page.waitForTimeout(2200);const after=await page.screenshot();
   check(state.alpha&&state.playing&&!before.equals(after),label+' live footage '+id,state);
 }
 await page.locator('.rooms-more').evaluate(e=>e.click());await page.waitForTimeout(1600);const url=page.url();
 await page.locator('[role="tab"][data-category="cucina"]').evaluate(e=>e.click());await page.waitForFunction(()=>document.querySelector('.showcase').dataset.category==='cucina');await page.waitForTimeout(1900);
 check(page.url()===url&&await page.locator('.showcase .is-active img').evaluate(e=>e.complete&&e.naturalWidth>=1280)&&await page.locator('.showcase').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<3),label+' inline fullscreen showcase');
 await page.screenshot({path:`${out}/${label}-showcase.png`});
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});await page.evaluate(()=>gsap.globalTimeline.pause());
 const day=await page.screenshot();await page.locator('#night-mode').evaluate(e=>{e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));});const night=await page.screenshot();check(day.equals(night),label+' public night isolation');await page.evaluate(()=>gsap.globalTimeline.resume());
 await page.locator('.menu-trigger').click();await page.waitForTimeout(350);await page.keyboard.press('Escape');await page.waitForTimeout(500);check(await page.locator('.menu-trigger').evaluate(e=>e===document.activeElement)&&!await page.locator('#menu-dialog').evaluate(e=>e.open),label+' menu opens/closes with focus');
 await page.goto(base+'ospitalita.html');await page.evaluate(()=>document.fonts.ready);check(await page.locator('h1').count()===1&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&!document.body.classList.contains('night')),label+' inner page intact');
 await browser.close();console.log('Public site opened and verified',label);await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log('Public smoke:',report.checks.length,'failures:',report.failures.length,'errors:',report.errors.length);if(report.failures.length||report.errors.length)process.exitCode=1;
