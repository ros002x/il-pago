import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../artifacts/hero-canopy/',import.meta.url));
await fs.mkdir(output,{recursive:true});
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4174/';
const report={checks:[],errors:[],views:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
const views=[['chrome',1440,900,1],['webkit',1440,900,1],['webkit',375,667,3],['webkit',390,844,3],['webkit',430,932,3],['webkit',820,1180,2],['webkit',1180,820,2],['chrome',2560,1440,1]];
for(const [engine,width,height,dpr] of views.filter(v=>!process.env.PAGO_VIEW||v[0]+'-'+v[1]===process.env.PAGO_VIEW)){
 const label=engine+'-'+width;
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const touch=engine==='webkit'&&width<1400;
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,hasTouch:touch,isMobile:touch});
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.ScrollTrigger?.getById('experience-scene'));
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}'});
 const move=async(id,p)=>{
  await page.evaluate(({id,p})=>{gsap.globalTimeline.resume();Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});},{id,p});
  await page.waitForTimeout(1000);
 };
 const time=night=>page.locator('#night-mode').evaluate((e,night)=>{e.checked=night;e.dispatchEvent(new Event('change',{bubbles:true}));},night);
 const freeze=()=>page.evaluate(()=>{gsap.globalTimeline.pause();Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 // Compare rendered pixels at the same scroll/animation time, not just CSS variables.
 for(const [id,p] of [['hero-scene',0],['hero-scene',1],['entrance-scene',.5],['experience-scene',0],['experience-scene',.25],['experience-scene',.5],['experience-scene',.75],['experience-scene',1],['story-scene',.5],['coast-scene',.5],['table-scene',.8],['rooms-photo',.8],['final-scene',1]]){
  await move(id,p);await page.locator('img').evaluateAll(es=>Promise.all(es.filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}).map(e=>{e.loading='eager';return e.decode().catch(()=>{});})));await freeze();
  await time(false);const day=await page.screenshot({scale:'css'});
  if(id==='hero-scene'&&p===0)await page.locator('.day-night').click();else await time(true);
  const night=await page.screenshot({scale:'css'});
  const identical=day.equals(night);
  check(id==='hero-scene'&&p===0?!identical:identical,label+' day/night pixels '+id+' '+p);
  check(await page.evaluate(()=>!document.body.classList.contains('night')&&!document.documentElement.classList.contains('dark')&&document.querySelector('meta[name="theme-color"]').content==='#223c2d'&&document.querySelector('.hero').dataset.time==='night'),label+' local hero state '+id+' '+p);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' viewport '+id+' '+p);
  if(id==='hero-scene'||id==='experience-scene'){
   await fs.writeFile(output+`${label}-${id}-${p}-day.png`,day);await fs.writeFile(output+`${label}-${id}-${p}-night.png`,night);
  }
 }
 // Footage idle and alpha coverage lives in tests/footage.mjs.
 await time(false);await move('experience-scene',.5);
 // Touch layouts retain native scrolling; Playwright's mobile WebKit has no wheel API.
 const middle=await page.evaluate(()=>ScrollTrigger.getById('experience-scene').progress);
 check(!touch||await page.evaluate(()=>!document.documentElement.classList.contains('lenis')),label+' native scrolling on touch layouts');
 if(touch)await page.evaluate(()=>scrollBy({top:240,behavior:'instant'}));else await page.mouse.wheel(0,240);await page.waitForTimeout(900);
 const forward=await page.evaluate(()=>ScrollTrigger.getById('experience-scene').progress);
 if(touch)await page.evaluate(()=>scrollBy({top:-240,behavior:'instant'}));else await page.mouse.wheel(0,-240);await page.waitForTimeout(900);
 const reverse=await page.evaluate(()=>ScrollTrigger.getById('experience-scene').progress);
 check(forward>middle&&reverse<forward,label+' forward/reverse vertical scroll drives horizontal scene',{middle,forward,reverse});
 if(width===1440&&engine==='chrome'||width===390){
  // On every internal page stored night preference must have no visual styling effect.
  const styles=()=>page.evaluate(()=>[...document.querySelectorAll('body,body *')].map(e=>{const s=getComputedStyle(e);return [e.tagName,s.color,s.backgroundColor,s.borderColor,s.fontFamily,s.fontSize,s.colorScheme,s.padding,s.margin].join('|');}));
  for(const file of ['il-pago.html','ospitalita.html','ristorante.html','esperienze.html','prodotti.html','territorio.html','ricette.html','soggiorni.html','contatti.html','privacy.html']){
   await page.evaluate(()=>localStorage.setItem('ilpago-atmosfera','day'));await page.goto(base+file);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);const day=await styles();
   await page.evaluate(()=>localStorage.setItem('ilpago-atmosfera','night'));await page.reload();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);const night=await styles();
   check(JSON.stringify(day)===JSON.stringify(night),label+' stored night leaves internal page identical '+file);
  }
 }
 // Shared dialogs compared at one frozen scene, including their backdrop.
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}'});
 await move('experience-scene',.5);await freeze();
 for(const id of ['menu-dialog','contact-dialog','booking-dialog']){
  await page.locator('#'+id).evaluate(e=>e.showModal());await time(false);const day=await page.screenshot({scale:'css'});await time(true);const night=await page.screenshot({scale:'css'});
  check(day.equals(night),label+' shared panel unchanged '+id);
  if(!day.equals(night)){await fs.writeFile(output+label+'-'+id+'-day.png',day);await fs.writeFile(output+label+'-'+id+'-night.png',night);}
  await page.locator('#'+id).evaluate(e=>e.close());
 }
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));gsap.globalTimeline.resume();});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(350);
 check(await page.locator('.ambient-film video').evaluateAll(v=>v.every(e=>e.paused)),label+' reduced motion pauses footage');
 report.views.push({label,width,height,dpr});await browser.close();
 await fs.writeFile(output+'results.json',JSON.stringify(report,null,2));console.log('Hero/canopy verified',label);
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(output+'results.json',JSON.stringify(report,null,2));
console.log('Hero/canopy checks',report.checks.length,'failures',report.failures.length,'errors',report.errors.length);
if(report.failures.length||report.errors.length)process.exitCode=1;
