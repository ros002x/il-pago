import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../artifacts/continuity/',import.meta.url));
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4173/';
await fs.mkdir(output,{recursive:true});
const report={date:new Date().toISOString(),checks:[],errors:[],views:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,data)};
for(const [engine,width,height,touch] of [['chrome',1440,900,false],['chrome',2560,1440,false],['webkit',375,667,true],['webkit',390,844,true],['webkit',430,932,true],['webkit',820,1180,true],['webkit',1180,820,true]]){
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});
 const label=`${engine}-${width}`;const captures=[];
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 const order=await page.evaluate(()=>({sections:[...document.querySelectorAll('main section')].map(e=>e.id||e.className),earth:document.querySelectorAll('.coast-land,.coast-land-copy').length,coast:document.querySelectorAll('.coast-sea>img').length}));
 check(order.sections.indexOf('storia')>=0&&order.sections.indexOf('storia')<order.sections.indexOf('territorio')&&order.sections.indexOf('territorio')<order.sections.indexOf('tavola')&&order.earth===0&&order.coast===1,label+' story, white/coast, restaurant; one coast photograph',order);
 const move=async(id,p,slow=false)=>{
  const target=await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);return s.start+(s.end-s.start)*p},{id,p});
  if(slow){const from=await page.evaluate(()=>scrollY);const steps=Math.ceil(Math.abs(target-from)/70);for(let n=1;n<=steps;n++){await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),from+(target-from)*n/steps);await page.waitForTimeout(20);}}
  else await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),target);
  await page.waitForTimeout(700);
 };
 const state=()=>page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,seaOpacity:getComputedStyle(document.querySelector('.coast-sea')).opacity,seaVisible:getComputedStyle(document.querySelector('.coast-sea')).visibility,white:getComputedStyle(document.querySelector('.coast-white')).opacity,clouds:[...document.querySelectorAll('.coast-cloud')].filter(e=>getComputedStyle(e).display!=='none').map(e=>({opacity:getComputedStyle(e).opacity,visible:getComputedStyle(e).visibility})),progress:ScrollTrigger.getById('coast-scene').animation.progress(),pin:document.querySelector('.coast-stage').getBoundingClientRect().top}));
 const cloudOpacity=(await state()).clouds.map(c=>c.opacity);
 for(const id of ['entrance-scene','experience-scene','coast-scene'])for(const p of [0,.25,.5,.75,1]){
  await move(id,p,id==='coast-scene'&&width===1440);
  const s=await state();check(!s.overflow,`${label} ${id} ${p} within viewport`);
  if(id==='experience-scene'&&p===1){
   const photo=await page.evaluate(()=>{const c=document.querySelector('.experience-card:nth-child(3)>a').getBoundingClientRect();const i=document.querySelector('.experience-card:nth-child(3) .experience-photo img').getBoundingClientRect();return {top:i.top-c.top,bottom:i.bottom-c.bottom}});
   check(photo.top<=1&&photo.bottom>=-1,label+' territory photograph fills its frame',photo);
  }
  if(id==='coast-scene'){
   // Atmospheric distance uses fixed translucency; scroll must never fade these layers out.
   check(s.seaOpacity==='1'&&s.seaVisible==='visible'&&s.white==='1'&&s.clouds.every((c,i)=>Number(c.opacity)>0&&c.opacity===cloudOpacity[i]&&c.visible==='visible'),`${label} ${p} sea, white and cloud layers coexist without scroll fades`,s);
   if(p===0)check(await page.evaluate(()=>!document.body.classList.contains('chrome-dark')),label+' dark ink header on initial white');
  }
  const file=`${label}-${id}-${Math.round(p*100)}.png`;await page.screenshot({path:output+file});captures.push({file,id,p});
 }
 await move('coast-scene',.5);const before=await state();
 const readCloud=()=>page.locator('.cloud-one .cloud-drift').evaluate(e=>({transform:getComputedStyle(e).transform,top:e.getBoundingClientRect().top,width:e.getBoundingClientRect().width}));
 const cloudA=await readCloud();await page.waitForTimeout(2400);const cloudB=await readCloud();
 check(cloudA.transform!==cloudB.transform&&(await state()).progress===before.progress,label+' cloud horizontal drift and scale continue at rest',{cloudA,cloudB});
 await page.screenshot({path:output+`${label}-coast-idle.png`});
 await move('coast-scene',1);await move('entrance-scene',0);await move('coast-scene',.5,true);const reversed=await state();
 check(Math.abs(before.progress-reversed.progress)<.002&&Math.abs(reversed.pin)<2,label+' fast jump then slow return restores coast',reversed);
 const viewport=width>760?{width:390,height:844}:{width:1180,height:820};
 await page.setViewportSize(viewport);await page.waitForTimeout(900);await move('coast-scene',.5);let resized=await state();
 check(!resized.overflow&&Math.abs(resized.pin)<2,label+' resize while inside atmosphere',resized);
 await page.setViewportSize({width,height});await page.waitForTimeout(900);await move('experience-scene',1);
 check(await page.evaluate(()=>document.querySelectorAll('.garden-canopy').length===1&&ScrollTrigger.getAll().filter(t=>t.vars.id==='canopy-travel').length===1&&Math.abs(document.querySelector('.garden-canopy').getBoundingClientRect().top)<2),label+' resize restores one attached foreground');
 report.views.push({label,captures});await browser.close();console.log('Complete',label);
 await fs.writeFile(output+'results.json',JSON.stringify(report,null,2));
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(output+'results.json',JSON.stringify(report,null,2));
const browser=await chromium.launch({channel:'chrome'});const page=await browser.newPage({viewport:{width:1500,height:1}});
for(const {label,captures} of report.views){
 const items=await Promise.all(captures.map(async c=>({...c,uri:'data:image/png;base64,'+(await fs.readFile(output+c.file)).toString('base64')})));
 await page.setContent(`<style>body{margin:0;background:#292c2b;color:white;font:12px sans-serif;display:grid;grid-template-columns:repeat(5,1fr);gap:8px}figure{margin:0}img{width:100%;height:340px;object-fit:contain}figcaption{padding:6px}</style>${items.map(i=>`<figure><img src="${i.uri}"><figcaption>${i.id} ${Math.round(i.p*100)}%</figcaption></figure>`).join('')}`);
 await page.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));await page.screenshot({path:output+`${label}-sheet.png`,fullPage:true});
}
await browser.close();console.log('Continuity checks',report.checks.length,'failures',report.failures.length,'errors',report.errors.length);if(report.failures.length||report.errors.length)process.exitCode=1;
