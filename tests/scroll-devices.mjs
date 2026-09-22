import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';

// Windows browser engines + emulated viewports, not physical Apple hardware.
const publicMode=process.argv.includes('--public');
const base=publicMode?'https://ros002x.github.io/il-pago/':'http://127.0.0.1:4173/';
const out=`artifacts/scroll-devices${publicMode?'-public':''}`;
await fs.mkdir(out,{recursive:true});
const report={base,host:process.platform,checks:[],errors:[],samples:[]};
const profiles=publicMode?[['webkit',390,844],['chrome',1440,900]]:
 [['webkit',375,812],['webkit',390,844],['webkit',430,932],['webkit',820,1180],['webkit',1440,900],['chrome',1440,900],['chrome',390,844]];
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
for(const [engine,width,height] of profiles){
 const label=`${engine}-${width}`,mobile=width<1000;
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 page.on('response',r=>{if(r.status()>=400)report.errors.push({label,url:r.url(),status:r.status()});});
 const ready=async()=>{await page.waitForLoadState('load');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);};
 const gallery=()=>page.evaluate(()=>{const s=ScrollTrigger.getById('experience-scene');return {progress:s.progress,top:s.pin.getBoundingClientRect().top,y:scrollY,start:s.start,end:s.end,x:gsap.getProperty('.experience-grid','x')};});
 const jump=async(id,ratio)=>{await page.evaluate(([id,ratio])=>{const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*ratio,behavior:'instant'});},[id,ratio]);await page.waitForTimeout(400);};
 await page.goto(base);await ready();
 // Traverse all four pin boundaries in both directions, including their release.
 const pins=await page.evaluate(()=>ScrollTrigger.getAll().filter(s=>s.pin).map(s=>({id:s.vars.id,start:s.start,end:s.end})));
 let boundariesOK=true;
 for(const pin of pins)for(const ratio of [-.02,.15,.8,1.02,.8,.15,-.02]){
  await jump(pin.id,ratio);
  const state=await page.evaluate(id=>{const s=ScrollTrigger.getById(id);return {id,y:scrollY,start:s.start,end:s.end,top:s.pin.getBoundingClientRect().top,progress:s.progress,overflow:document.documentElement.scrollWidth-innerWidth};},pin.id);
  const inside=ratio>0&&ratio<1;
  boundariesOK&&=Math.abs(state.y-Math.max(0,pin.start+(pin.end-pin.start)*ratio))<3&&state.overflow<=1&&(!inside||Math.abs(state.top)<2);
  report.samples.push({label,...state});
 }
 check(boundariesOK,label+' four pins enter/release/reverse without overflow');
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(300);
 await page.evaluate(()=>scrollBy({top:innerHeight,behavior:'instant'}));await page.waitForTimeout(300);
 check(await page.evaluate(()=>Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<3),label+' whole home reaches footer');
 await jump('experience-scene',.5);const before=await gallery();
 await page.setViewportSize({width:height,height:width});await page.waitForTimeout(750);const rotated=await gallery();
 await page.setViewportSize({width,height});await page.waitForTimeout(750);const returned=await gallery();
 check(Math.abs(rotated.progress-before.progress)<.01&&Math.abs(returned.progress-before.progress)<.01&&Math.abs(rotated.top)<2&&Math.abs(returned.top)<2,label+' portrait ↔ landscape / resize preserves chapter',{before,rotated,returned});
 if(width===390||width===820){
  await page.setViewportSize({width,height:height-70});await page.waitForTimeout(650);const toolbar=await gallery();
  check(Math.abs(toolbar.progress-before.progress)<.01,label+' height-only viewport resize preserves chapter',toolbar);
  await page.setViewportSize({width,height});await page.waitForTimeout(650);
 }
 // A real link out of a modal exercises lock cleanup on history return.
 await page.locator('.menu-trigger').click();await page.locator('#menu-dialog .menu-primary[href="ristorante.html"]').click();await page.waitForURL('**/ristorante.html');await ready();
 await page.goBack();await ready();const back=await gallery();
 const unlocked=await page.evaluate(()=>!document.querySelector('dialog[open]')&&!document.body.classList.contains('dialog-open')&&!document.documentElement.classList.contains('dialog-open'));
 check(unlocked&&Math.abs(back.progress-before.progress)<.02,label+' menu → inner page → Back restores chapter and unlocks',{back,unlocked});
 for(const id of ['menu-dialog','contact-dialog','booking-dialog']){
  const open=id==='menu-dialog'?'.menu-trigger':id==='contact-dialog'?'.site-header [data-contact]':'[data-booking="Soggiorno"]';
  await page.locator(open).first().click();await page.locator(`#${id} [data-close]`).click();await page.waitForTimeout(380);
 }
 check(await page.evaluate(()=>!document.querySelector('dialog[open]')&&!document.documentElement.classList.contains('dialog-open')&&!document.body.classList.contains('dialog-open')),label+' menu / contacts / booking unlock');
 if(!mobile){
  await jump('experience-scene',.35);const start=await gallery();await page.mouse.move(width*.5,height*.6);
  for(const delta of [2,4,8,16,40,90,170,70,24,8,3]){await page.mouse.wheel(0,delta);await page.waitForTimeout(20);}
  await page.waitForTimeout(320);const forward=await gallery();
  for(const delta of [-3,-8,-24,-70,-170,-90,-40,-16,-8,-4,-2]){await page.mouse.wheel(0,delta);await page.waitForTimeout(20);}
  await page.waitForTimeout(320);const reverse=await gallery();
  check(forward.y>start.y+350&&reverse.y<forward.y-350&&Math.abs(reverse.y-start.y)<6&&Math.abs(forward.top)<2&&Math.abs(reverse.top)<2,label+' native wheel: small deltas / burst / reverse',{start,forward,reverse});
 }else if(engine==='chrome'){
  const cdp=await page.context().newCDPSession(page);await jump('experience-scene',.25);const start=await gallery();
  const swipe=async(from,to)=>{
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.55,y:from}]});
   for(let step=1;step<=14;step++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*.55,y:from+(to-from)*step/14}]});await page.waitForTimeout(25);}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(450);
  };
  await swipe(height*.7,height*.37);const forward=await gallery();
  await swipe(height*.37,height*.7);const reverse=await gallery();
  check(forward.y>start.y+100&&reverse.y<forward.y-100,label+' trusted touch gesture + native momentum / reverse',{start,forward,reverse});
 }
 if(width===390||width===820||width===1440){await jump('experience-scene',.5);await page.screenshot({path:`${out}/${label}-horizontal.jpg`,scale:'css',type:'jpeg',quality:85});}
 await browser.close();console.log(label,'complete');
}
check(report.errors.length===0,'No runtime / HTTP errors',report.errors);
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(`${report.checks.filter(c=>c.ok).length}/${report.checks.length} targeted scroll checks passed. Host: ${process.platform}; physical Safari/trackpad not tested.`);
process.exitCode=report.checks.some(c=>!c.ok)?1:0;
