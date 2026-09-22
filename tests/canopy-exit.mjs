import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';

const publicMode=process.argv.includes('--public');
const base=publicMode?'https://ros002x.github.io/il-pago/':'http://127.0.0.1:4173/';
const out=`artifacts/canopy-exit${publicMode?'-public':''}`;
await fs.mkdir(out,{recursive:true});
const report={base,checks:[],frames:[],errors:[]};
const check=(ok,label)=>{report.checks.push({ok,label});if(!ok)console.log('FAIL',label);};
const profiles=publicMode?[['webkit',390,844]]:[['webkit',390,844],['webkit',820,1180],['webkit',1440,900],['chrome',1440,900]];
for(const [engine,width,height] of profiles){
 const label=`${engine}-${width}`,mobile=width<1000;
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 try{
  const page=await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
  page.on('pageerror',e=>report.errors.push({label,error:e.message}));
  page.on('response',r=>{if(r.status()>=400)report.errors.push({label,url:r.url(),status:r.status()});});
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>window.ScrollTrigger?.getById('canopy-travel'));
  await page.waitForTimeout(400);
  const state=()=>page.evaluate(()=>{
   const s=ScrollTrigger.getById('experience-scene');
   const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
   const canopy=rect(document.querySelector('.garden-canopy'));
   const plants=[...document.querySelectorAll('.garden-plant')].map(el=>{
    const r=rect(el.querySelector('img')),style=getComputedStyle(el);
    // After release the canopy itself scrolls away. Respect its existing clipping
    // rather than counting an off-canvas image box as a rendered floral fragment.
    const visible=style.display!=='none'&&Math.min(innerWidth,canopy.right,r.right)>Math.max(0,canopy.left,r.left)&&Math.min(innerHeight,canopy.bottom,r.bottom)>Math.max(0,canopy.top,r.top);
    return {name:el.classList[1],...r,visible,display:style.display,opacity:style.opacity};
   });
   return {progress:s.progress,plants,canopy,photo:rect(s.pin)};
  });
  const shot=name=>page.screenshot({path:`${out}/${label}-${name}.jpg`,type:'jpeg',quality:90,scale:'css'});
  const jump=async ratio=>{
   await page.evaluate(r=>{const s=ScrollTrigger.getById('experience-scene');scrollTo({top:s.start+(s.end-s.start)*r,behavior:'instant'});},ratio);
   await page.waitForTimeout(320);
  };
  // Native scrolling drives the existing ScrollTrigger; never seek its animation.
  const travel=async ratio=>{
   await page.evaluate(r=>new Promise(resolve=>{
    const s=ScrollTrigger.getById('experience-scene'),start=scrollY,end=s.start+(s.end-s.start)*r,t0=performance.now();
    const frame=now=>{const p=Math.min(1,(now-t0)/450);scrollTo({top:start+(end-start)*p,behavior:'instant'});if(p<1)requestAnimationFrame(frame);else resolve();};
    requestAnimationFrame(frame);
   }),ratio);
   await page.waitForTimeout(320);
  };
  const principal=s=>s.plants.filter(p=>['canopy-rise','canopy-hanging'].includes(p.name));
  const clean=s=>s.plants.every(p=>!p.visible);
  await jump(.5);await travel(.65);
  const middle=await state();report.frames.push({label,phase:'present',...middle});await shot('present');
  check(principal(middle).every(p=>p.visible&&p.display!=='none'&&p.opacity==='1'),label+' both corners present before exit');
  await travel(.72);await shot('leaving');
  await travel(.78);
  const halfway=await state();report.frames.push({label,phase:'halfway',...halfway});await shot('halfway');
  check(principal(halfway).every(p=>p.visible),label+' progressive exit still visible halfway');
  await page.waitForTimeout(400);
  const stopped=await state();
  check(principal(stopped).every((p,i)=>Math.abs(p.top-principal(halfway)[i].top)<1),label+' stopping scroll holds exit without jumping');
  for(const ratio of [.88,.96,1]){
   await travel(ratio);const s=await state();report.frames.push({label,phase:ratio,...s});await shot(`forward-${ratio}`);
   if(ratio>=.96)check(clean(s),label+` no floral fragment at ${ratio}`);
  }
  // Inspect the first viewport after release as well as the pinned endpoint.
  await page.evaluate(()=>{const s=ScrollTrigger.getById('experience-scene');scrollTo({top:s.end+innerHeight,behavior:'instant'});});
  await page.waitForTimeout(320);const next=await state();report.frames.push({label,phase:'next',...next});await shot('next');
  check(clean(next),label+' following scene has no floral fragments');
  await travel(.78);const reverse=await state();report.frames.push({label,phase:'reverse-halfway',...reverse});await shot('reverse-halfway');
  check(principal(reverse).every((p,i)=>Math.abs(p.top-principal(halfway)[i].top)<2&&Math.abs(p.left-principal(halfway)[i].left)<2),label+' reverse retraces exit');
  await travel(.65);const returned=await state();await shot('reverse-present');
  check(principal(returned).every((p,i)=>p.visible&&Math.abs(p.top-principal(middle)[i].top)<2),label+' both corners return without a jump');
  check([...report.frames.filter(f=>f.label===label&&typeof f.phase==='number'),halfway,reverse].every(s=>principal(s).every(p=>p.display!=='none'&&p.opacity==='1')),label+' exit uses movement without hiding flowers');
  console.log(label,'complete');
 }finally{await browser.close();}
}
check(report.errors.length===0,'No runtime or HTTP errors');
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
console.log(`${report.checks.filter(c=>c.ok).length}/${report.checks.length} targeted checks passed (emulated Apple viewports on Windows).`);
process.exitCode=report.checks.some(c=>!c.ok)?1:0;
