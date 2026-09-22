import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
const publicMode=process.argv.includes('--public');
const base=publicMode?'https://ros002x.github.io/il-pago/':'http://127.0.0.1:4173/';
const out=`artifacts/canopy-band${publicMode?'-public':''}`;
await fs.mkdir(out,{recursive:true});
const report={base,host:process.platform,checks:[],errors:[],frames:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
const profiles=publicMode?[['webkit',390,844,84]]:
 [['webkit',390,844,84],['webkit',820,1180,64],['webkit',1440,900,0],['chrome',1440,900,0]];
for(const [engine,width,height,bars] of profiles){
 const label=`${engine}-${width}`,mobile=bars>0,small=height-bars;
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height:small},isMobile:mobile,hasTouch:mobile});
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 page.on('response',r=>{if(r.status()>=400)report.errors.push({label,url:r.url(),status:r.status()});});
 // Desktop automation has no Safari toolbar. Resolve svh and lvh independently
 // as Safari does, then retract the emulated bars while the pin remains active.
 await page.route('**/*.css*',async route=>{
  const response=await route.fetch();
  const body=(await response.text()).replace(/([\d.]+)svh\b/g,(_,n)=>`${Number(n)*small/100}px`).replace(/([\d.]+)lvh\b/g,(_,n)=>`${Number(n)*height/100}px`);
  await route.fulfill({response,body});
 });
 const ready=async()=>{await page.waitForLoadState('load');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);};
 const jump=async(id,ratio)=>{await page.evaluate(([id,r])=>{const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*r,behavior:'instant'});},[id,ratio]);await page.waitForTimeout(260);};
 const shot=async name=>page.screenshot({path:`${out}/${label}-${name}.jpg`,type:'jpeg',quality:90,scale:'css'});
 const state=id=>page.evaluate(id=>{const s=ScrollTrigger.getById(id),r=s.pin.getBoundingClientRect();return {y:scrollY,start:s.start,end:s.end,progress:s.progress,top:r.top,bottom:r.bottom,height:innerHeight,gap:Math.max(0,innerHeight-r.bottom),overflow:document.documentElement.scrollWidth-innerWidth};},id);
 await page.goto(base);await ready();await jump('entrance-scene',.86);
 const before=await state('entrance-scene');
 await page.evaluate(()=>{window.testRefreshes=0;ScrollTrigger.addEventListener('refresh',()=>window.testRefreshes++);});
 await page.setViewportSize({width,height});await page.waitForTimeout(300);
 const after=await state('entrance-scene');
 check(after.gap<1&&Math.abs(before.progress-after.progress)<.005,label+' toolbar retracts without exposing paper or changing chapter',{before,after});
 check(await page.evaluate(()=>window.testRefreshes===0),label+' no refresh during toolbar retraction');
 if(width===390||width===820)await shot('photo-coverage');
 let covered=true;
 for(const id of ['entrance-scene']){
  await jump(id,.8);
  for(const delta of [12,30,-18,-24]){
   if(!mobile){await page.mouse.move(width*.55,height*.65);await page.mouse.wheel(0,delta);}
   else await page.evaluate(d=>scrollBy({top:d,behavior:'instant'}),delta);
   await page.waitForTimeout(18);const frame=await state(id);report.frames.push({label,id,...frame});
   covered&&=frame.gap<2&&frame.overflow<2;
  }
 }
 check(covered,label+' photographic coverage during forward/reverse scroll');
 if(engine==='chrome'&&mobile){
  await jump('entrance-scene',.55);const start=await state('entrance-scene'),cdp=await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.55,y:height*.72}]});
  let touchCovered=true;
  for(let i=1;i<=10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*.55,y:height*.72-i*18}]});await page.waitForTimeout(20);const f=await state('entrance-scene');touchCovered&&=f.gap<2;}
  await shot('during-touch');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);
  check(touchCovered&&(await state('entrance-scene')).y>start.y+80,label+' trusted touch movement has no bottom gap');
 }
 let horizontalOK=true;
 for(const ratio of [.15,.5,.98,1.01,1.15,.98,.5,.15]){
  await jump('experience-scene',ratio);
  const s=await state('experience-scene');
  const layers=await page.evaluate(()=>{
   const canopy=document.querySelector('.garden-canopy').getBoundingClientRect();
   const pin=document.querySelector('#esperienze').getBoundingClientRect();
   const rise=document.querySelector('.canopy-rise').getBoundingClientRect();
   return {canopyTop:canopy.top,pinTop:pin.top,visibleRiseWidth:Math.max(0,Math.min(innerWidth,rise.right)-Math.max(0,rise.left)),riseBottom:rise.bottom};
  });
  horizontalOK&&=s.overflow<2&&(ratio>1?Math.abs(layers.canopyTop-layers.pinTop)<2:Math.abs(s.top)<2)&&layers.visibleRiseWidth>width*.2;
  report.frames.push({label,ratio,...s,...layers});
  if(engine==='webkit'&&width!==1180&&[.5,.98,1.15].includes(ratio))await shot('horizontal-'+ratio);
 }
 check(horizontalOK,label+' foreground stays with final photo and releases together / reverse');
 await jump('experience-scene',.9);
 for(const [i,delta] of [12,24,48,48,24,12,-12,-24,-48,-48,-24,-12].entries()){
  if(!mobile){await page.mouse.wheel(0,delta);}else await page.evaluate(d=>scrollBy({top:d,behavior:'instant'}),delta);
  await page.waitForTimeout(20);
  if(i===4||i===9)await shot('moving-'+i);
 }
 if(publicMode){
  await page.unroute('**/*.css*');await page.reload();await ready();
  await jump('entrance-scene',.86);await shot('native-css-coverage');
  check((await state('entrance-scene')).gap<1,label+' public CSS covers viewport without interception');
  await jump('experience-scene',.98);await shot('native-css-ending');
 }
 await browser.close();console.log(label,'complete');
}
check(report.errors.length===0,'No runtime or HTTP errors',report.errors);
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(`${report.checks.filter(c=>c.ok).length}/${report.checks.length} targeted checks passed. Apple hardware and macOS are not available on this Windows host.`);
process.exitCode=report.checks.some(c=>!c.ok)?1:0;
