import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../artifacts/refinement/',import.meta.url));await fs.mkdir(output,{recursive:true});
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4174/';
const report={checks:[],errors:[],performance:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
for(const [engine,width,height,dpr]of [['chrome',1440,900,1],['webkit',375,667,3],['webkit',390,844,3],['webkit',430,932,3],['webkit',820,1180,2],['webkit',1180,820,2],['chrome',2560,1440,1]]){
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,hasTouch:engine==='webkit',isMobile:engine==='webkit'});const label=engine+'-'+width;
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 await page.addInitScript(()=>{window.__shifts=[];if(PerformanceObserver.supportedEntryTypes?.includes('layout-shift'))new PerformanceObserver(list=>list.getEntries().filter(e=>!e.hadRecentInput).forEach(e=>__shifts.push(e.value))).observe({type:'layout-shift',buffered:true});});
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(750);
 const move=async(id,p)=>{await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});},{id,p});await page.waitForTimeout(800);};
 await move('entrance-scene',.5);
 await page.waitForFunction(()=>document.querySelector('.canopy-rise .mesh-ready'),{timeout:10000});
 const mesh=page.locator('.canopy-rise canvas');
 const bbox=await mesh.boundingBox();check(bbox.width>50&&bbox.height>50,label+' internal canopy renderer active',bbox);
 await page.addStyleTag({content:'.canopy-rise .atmosphere-skin{transform:none!important}'});
 await page.evaluate(()=>gsap.globalTimeline.pause());
 const region={x:Math.max(0,bbox.x),y:Math.max(0,bbox.y),width:Math.min(width,bbox.x+bbox.width)-Math.max(0,bbox.x),height:Math.min(height,bbox.y+bbox.height)-Math.max(0,bbox.y)};
 const before=await page.screenshot({clip:region,scale:'css'});await page.waitForTimeout(2800);const after=await page.screenshot({clip:region,scale:'css'});
 await page.evaluate(()=>gsap.globalTimeline.resume());
 check(!before.equals(after),label+' foliage changes with rigid parent held stationary');
 await fs.writeFile(output+label+'-foliage-a.png',before);await fs.writeFile(output+label+'-foliage-b.png',after);
 const timings=await page.evaluate(()=>new Promise(resolve=>{let previous=performance.now();const values=[];function tick(t){values.push(t-previous);previous=t;if(values.length<91)requestAnimationFrame(tick);else resolve(values.slice(1));}requestAnimationFrame(tick);}));
 report.performance.push({label,meanRafMs:timings.reduce((a,b)=>a+b)/timings.length,note:'Headless engine timing; not physical-device FPS'});
 await move('coast-scene',.45);const original=await page.evaluate(()=>({y:scrollY,progress:ScrollTrigger.getById('coast-scene').progress}));
 await page.reload();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1100);
 const refreshed=await page.evaluate(()=>({y:scrollY,progress:ScrollTrigger.getById('coast-scene').progress,sea:getComputedStyle(document.querySelector('.coast-sea')).opacity}));
 check(Math.abs(original.y-refreshed.y)<height*.04&&Math.abs(original.progress-refreshed.progress)<.03&&refreshed.sea==='1',label+' refresh preserves middle of coast scene',{original,refreshed});
 await page.screenshot({path:output+label+'-refresh.png',scale:'css'});
 // Scroll past the canopy boundary: decorative flowers cannot extend onto the family heading.
 await page.locator('.story').scrollIntoViewIfNeeded();await page.waitForTimeout(750);await page.screenshot({path:output+label+'-story.png',scale:'css'});
 await page.locator('.room-gallery').scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 for(let n=0;n<3;n++){
  await page.locator('[data-gallery-next]').click();await page.locator('[data-room-image]').evaluate(e=>e.decode());
  const photo=await page.locator('[data-room-image]').evaluate(e=>({source:e.currentSrc,width:e.getAttribute('width'),alt:e.alt}));
  check(Number(photo.width)>=1600&&!photo.source.includes('-800.')&&photo.source.includes(['room-2','room-1','room-garden'][n]),label+' full-resolution room '+n,photo);
 }
 await page.screenshot({path:output+label+'-rooms.png',scale:'css'});
 for(const file of ['il-pago.html','ospitalita.html','ristorante.html','esperienze.html','prodotti.html','territorio.html','ricette.html','soggiorni.html','contatti.html','privacy.html']){
  await page.goto(base+file);await page.evaluate(()=>document.fonts.ready);
  const conflicts=await page.evaluate(()=>[...document.querySelectorAll('.detail-figure')].flatMap(e=>{const i=e.querySelector('img').getBoundingClientRect(),c=e.querySelector('figcaption').getBoundingClientRect();return c.top<i.bottom+8?[{image:e.className,bottom:i.bottom,caption:c.top}]:[]}));
  check(!conflicts.length,label+' captions separate from photographs '+file,conflicts);
 }
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await move('entrance-scene',.5);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);
 check(await page.locator('.canopy-mesh').count()===0,label+' reduced motion releases GPU resources');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(600);await move('entrance-scene',.5);
 check(await page.locator('.canopy-rise .mesh-ready').count()===1,label+' renderer restored after motion preference change');
 await page.evaluate(()=>document.querySelector('.canopy-rise canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext());await page.waitForTimeout(300);
 check(await page.locator('.canopy-rise img').evaluate(e=>getComputedStyle(e).opacity==='1'),label+' original photograph survives GPU context loss');
 await browser.close();console.log('Refinement verified',label);await fs.writeFile(output+'results.json',JSON.stringify(report,null,2));
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(output+'results.json',JSON.stringify(report,null,2));
console.log('Refinement checks',report.checks.length,'failures',report.failures.length,'errors',report.errors.length);
if(report.failures.length||report.errors.length)process.exitCode=1;
