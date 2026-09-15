import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4174/';
const output=process.env.PAGO_OUTPUT||'artifacts/footage';await fs.mkdir(output,{recursive:true});
const report={url:base,date:new Date().toISOString(),checks:[],errors:[],views:[],performance:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
const views=[['chrome',1440,900,1],['webkit',375,667,3],['webkit',820,1180,2],['webkit',390,844,3],['webkit',430,932,3],['webkit',1180,820,2]];
for(const [engine,width,height,dpr] of views.filter(v=>!process.env.PAGO_VIEW||process.env.PAGO_VIEW.split(',').includes(v[0]+'-'+v[1]))){
 const label=engine+'-'+width,full=[1440,375,820].includes(width);
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr,hasTouch:engine==='webkit',isMobile:engine==='webkit',...(full?{recordVideo:{dir:output+'/recordings',size:{width:engine==='chrome'?960:width,height:engine==='chrome'?600:height}}}:{})});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 page.on('response',r=>{if(r.status()>=400)report.errors.push({label,status:r.status(),url:r.url()});});
 await page.addInitScript(()=>{window.__shifts=[];if(PerformanceObserver.supportedEntryTypes?.includes('layout-shift'))new PerformanceObserver(list=>list.getEntries().filter(e=>!e.hadRecentInput).forEach(e=>__shifts.push(e.value))).observe({type:'layout-shift',buffered:true});});
 const move=async(id,p)=>{await page.evaluate(({id,p})=>{gsap.globalTimeline.resume();const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});},{id,p});await page.waitForTimeout(900);};
 const screenshot=name=>page.screenshot({path:`${output}/${label}-${name}.png`,scale:'css'});
 const filmState=selector=>page.locator(selector).evaluate(e=>{
   const v=e.querySelector('video'),fallback=e.querySelector('.ambient-fallback'),source=e.classList.contains('has-video')?v:fallback;
   let alpha=false;try{const c=document.createElement('canvas');c.width=72;c.height=48;const ctx=c.getContext('2d');ctx.drawImage(source,0,0,72,48);const data=ctx.getImageData(0,0,72,48).data;let clear=0,solid=0;for(let i=3;i<data.length;i+=4){if(data[i]<10)clear++;if(data[i]>100)solid++;}alpha=clear>15&&solid>15;}catch{}
   return {format:e.dataset.format,ready:e.matches('.has-video,.has-fallback'),playing:e.classList.contains('has-video')?!v.paused:!!fallback.getAttribute('src'),alpha,box:e.getBoundingClientRect().toJSON(),transform:getComputedStyle(e.parentElement).transform};
 });
 const idle=async(name,selector)=>{
   await page.waitForFunction(s=>document.querySelector(s)?.matches('.has-video,.has-fallback'),selector,{timeout:15000});
   await page.waitForTimeout(500);await page.evaluate(()=>gsap.globalTimeline.pause());
   const first=await filmState(selector),box=first.box;
   const clip={x:Math.max(0,box.left),y:Math.max(0,box.top),width:Math.min(width,box.right)-Math.max(0,box.left),height:Math.min(height,box.bottom)-Math.max(0,box.top)};
   const samples=[];
   for(let n=0;n<=4;n++){if(n)await page.waitForTimeout(2500);const bytes=await page.screenshot({clip,scale:'css'});samples.push(bytes);await fs.writeFile(`${output}/${label}-${name}-idle-${n*2.5}.png`,bytes);}
   const last=await filmState(selector);
   check(first.alpha&&last.alpha&&last.playing&&samples.slice(1).every(b=>!b.equals(samples[0]))&&first.transform===last.transform,label+' '+name+' idle 10s: natural frames, stationary camera, alpha',{first,last,clip});
   await page.evaluate(()=>gsap.globalTimeline.resume());
 };
 try{
   await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>window.ScrollTrigger?.getById('experience-scene'));await page.waitForTimeout(800);
   check(await page.evaluate(()=>!performance.getEntriesByType('resource').some(r=>/assets\/motion\/.*\.(webm|webp)$/.test(r.name)&&!r.name.includes('poster'))),label+' footage is not loaded in the initial hero');
   await move('experience-scene',.04);
   if(full)await idle('vegetation','.canopy-rise .ambient-film');
   else{await page.waitForTimeout(1200);const s=await filmState('.canopy-rise .ambient-film');check(s.ready&&s.playing&&s.alpha,label+' mobile moving foreground',s);}
   await screenshot('farm');
   if(full){
     const original=await page.locator('.experience-grid').evaluate(e=>getComputedStyle(e).transform);
     await move('experience-scene',.5);await screenshot('products');await move('experience-scene',1);await screenshot('matera');await move('experience-scene',.04);
     check(await page.locator('.experience-grid').evaluate((e,t)=>getComputedStyle(e).transform===t,original),label+' horizontal forward and reverse restores composition');
     await move('coast-scene',.4);await idle('clouds','.cloud-one .ambient-film');await screenshot('clouds');
     await move('coast-scene',1);await screenshot('sea');
     check(await page.locator('.garden-canopy video').evaluateAll(v=>v.every(e=>e.paused))&&await page.locator('.garden-canopy .ambient-fallback').evaluateAll(v=>v.every(e=>!e.getAttribute('src'))),label+' offscreen plants stop decoding');
   }
   // The existing hospitality CTA selects its chapter and lands at the full scene's top.
   await page.locator('.rooms-more').evaluate(e=>e.click());await page.waitForTimeout(1500);
   check(await page.locator('.showcase').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<3)&&await page.locator('.showcase').getAttribute('data-category')==='ospitalita',label+' contextual CTA aligns and selects showcase');
   const initialUrl=page.url(),initialBox=await page.locator('.showcase').boundingBox();
   for(const category of (full?['cucina','fattoria','esperienze','territorio','ospitalita']:['territorio'])){
     await page.locator(`[data-category="${category}"][role="tab"]`).evaluate(e=>e.click());
     await page.waitForFunction(c=>document.querySelector('.showcase').dataset.category===c,category,{timeout:12000});await page.waitForTimeout(1100);
     const state=await page.locator('.showcase').evaluate(e=>({top:e.getBoundingClientRect().top,height:e.getBoundingClientRect().height,active:e.querySelectorAll('.is-active').length,selected:e.querySelectorAll('[aria-selected="true"]').length,loaded:e.querySelector('.is-active img').naturalWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
     check(page.url()===initialUrl&&state.active===1&&state.selected===1&&state.loaded>=960&&!state.overflow&&Math.abs(state.top-initialBox.y)<2&&state.height===initialBox.height,label+' inline showcase '+category,state);
     await screenshot('showcase-'+category);
   }
   if(full){
     await page.evaluate(()=>{document.querySelector('[data-category="cucina"][role="tab"]').click();document.querySelector('[data-category="fattoria"][role="tab"]').click();document.querySelector('[data-category="territorio"][role="tab"]').click();});
     await page.waitForFunction(()=>document.querySelector('.showcase').dataset.category==='territorio');await page.waitForTimeout(1100);
     check(await page.locator('[role="tabpanel"]:not([inert])').count()===1,label+' rapid category changes leave one active panel');
     await page.locator('[data-category="territorio"][role="tab"]').focus();await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('.showcase').dataset.category==='ospitalita');await page.waitForTimeout(1100);
     check(await page.locator('[data-category="ospitalita"][role="tab"]').evaluate(e=>e===document.activeElement),label+' category keyboard navigation');
     // Exact rendered-pixel equality after the hero, including the new showcase and footer.
     await page.evaluate(()=>gsap.globalTimeline.pause());
     const noTransitions=await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}'});
     const switchTime=night=>page.locator('#night-mode').evaluate((e,night)=>{e.checked=night;e.dispatchEvent(new Event('change',{bubbles:true}));},night);
     const styles=()=>page.evaluate(()=>['body','.site-footer','.story','.showcase'].map(s=>{const e=document.querySelector(s),c=getComputedStyle(e);return [s,c.color,c.backgroundColor,c.backgroundImage];}));
     await switchTime(false);await page.waitForTimeout(100);const day=await page.screenshot({scale:'css'}),dayStyles=await styles();await switchTime(true);const night=await page.screenshot({scale:'css'});
     check(day.equals(night)&&JSON.stringify(dayStyles)===JSON.stringify(await styles())&&await page.locator('.hero').getAttribute('data-time')==='night',label+' night leaves showcase pixels and global styles identical',{pixels:day.equals(night),styles:JSON.stringify(dayStyles)===JSON.stringify(await styles())});
     await noTransitions.evaluate(e=>e.remove());await page.evaluate(()=>gsap.globalTimeline.resume());
   }
   await page.locator('.menu-trigger').click();await page.waitForTimeout(800);await screenshot('menu');
   const dialog=await page.locator('#menu-dialog').evaluate(e=>({open:e.open,focus:e.contains(document.activeElement),locked:document.documentElement.classList.contains('dialog-open'),color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundImage}));
   await page.keyboard.press('Escape');await page.waitForTimeout(400);
   check(dialog.open&&dialog.focus&&dialog.locked&&dialog.background.includes('rgba')&&await page.locator('.menu-trigger').evaluate(e=>e===document.activeElement)&&!await page.locator('#menu-dialog').evaluate(e=>e.open),label+' translucent menu, focus, scroll lock and Escape',dialog);
   if(full){
     await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(600);
     check(await page.locator('.ambient-film video').evaluateAll(v=>v.every(e=>e.paused))&&await page.locator('.ambient-fallback').evaluateAll(v=>v.every(e=>!e.getAttribute('src'))),label+' reduced motion stops all footage');
   }
   report.performance.push({label,...await page.evaluate(()=>({cls:__shifts.reduce((a,b)=>a+b,0),resources:performance.getEntriesByType('resource').filter(r=>/assets\/motion\//.test(r.name)).map(r=>({name:r.name.split('/').pop(),bytes:r.transferSize,duration:r.duration}))}))});
   report.views.push({label,width,height,dpr,full});
 }catch(error){report.errors.push({label,error:error.stack});console.log(label,error.message);}
 await context.close();await browser.close();await fs.writeFile(output+'/results.json',JSON.stringify(report,null,2));console.log('Checked',label);
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(output+'/results.json',JSON.stringify(report,null,2));
console.log('Targeted checks:',report.checks.length,'failures:',report.failures.length,'errors:',report.errors.length);
if(report.failures.length||report.errors.length)process.exitCode=1;
