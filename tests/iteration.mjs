import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
const publicMode=process.argv.includes('--public');
const base=process.env.PAGO_TEST_URL||(publicMode?'https://ros002x.github.io/il-pago/':'http://localhost:4173/');
const out=publicMode?'artifacts/completion-public':'artifacts/completion';await fs.mkdir(out,{recursive:true});
const report={url:base,checks:[],errors:[]};
const check=(ok,label,data)=>{report.checks.push({ok,label,data});if(!ok)console.log('FAIL',label,JSON.stringify(data));};
const sizes=publicMode?[['chrome',1440,900]]:[['chrome',1440,900],['webkit',390,844],['webkit',820,1180]];
for(const [engine,width,height] of sizes){
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},isMobile:engine==='webkit',hasTouch:engine==='webkit'});const label=engine+'-'+width;
 page.on('pageerror',e=>report.errors.push({label,message:e.message}));
 page.on('response',r=>{if(r.status()>=400)report.errors.push({label,status:r.status(),url:r.url()});});
 const ready=async()=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(400);};
 const shot=async name=>page.screenshot({path:`${out}/${label}-${name}.png`});
 const scene=async(id,p)=>{await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'});},{id,p});await page.waitForTimeout(700);};
 const section=async selector=>{await page.locator(selector).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(700);};
 await page.goto(base,{waitUntil:'load'});await ready();await page.waitForFunction(()=>window.ScrollTrigger?.getById('experience-scene'));
 await scene('experience-scene',.03);
 const x0=await page.locator('.experience-grid').evaluate(e=>e.getBoundingClientRect().x);await shot('plants');
 await scene('experience-scene',.96);
 const x1=await page.locator('.experience-grid').evaluate(e=>e.getBoundingClientRect().x);await shot('horizontal');
 await scene('experience-scene',.03);
 check(x1<x0-width&&Math.abs((await page.locator('.experience-grid').evaluate(e=>e.getBoundingClientRect().x))-x0)<4,label+' pinned horizontal forward and return',{x0,x1});
 const plants=await page.locator('.garden-plant img').evaluateAll(imgs=>imgs.map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})));
 check(plants.length===4&&plants.every(p=>/bougainvillea-(mound|hanging)/.test(p.src))&&plants[1].loaded&&await page.locator('video,.ambient-film,canvas.canopy-mesh').count()===0,label+' restored cutouts without footage',plants);
 await scene('coast-scene',.43);await shot('clouds');
 await scene('coast-scene',.98);await shot('ionio');
 const sea=await page.locator('.coast-sea>img').evaluate(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0}));
 check(sea.loaded&&sea.src.includes('beach-lido-')&&await page.locator('.cloud-one img').first().evaluate(i=>i.complete&&i.currentSrc.includes('cloud-shore-edge'))&&!/E poi,|verso il blu/.test(await page.locator('.territory').innerText()),label+' restored clouds and single Ionio copy',sea);
 await page.locator('.rooms-more').evaluate(e=>e.click());await page.waitForTimeout(1500);
 const initial=await page.locator('#showcase-ospitalita').innerHTML();const url=page.url();const categories=[];
 for(const id of ['cucina','fattoria','esperienze','territorio','ospitalita']){
  await page.locator(`[role="tab"][data-category="${id}"]`).evaluate(e=>e.click());await page.waitForFunction(id=>document.querySelector('.showcase').dataset.category===id,id);await page.waitForTimeout(1300);
  categories.push(await page.locator('.showcase .is-active img').evaluate(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})));
  if(id==='cucina'||id==='territorio')await shot('showcase-'+id);
 }
 check(categories.every(c=>c.loaded)&&categories[0].src.includes('table-glasses')&&categories[3].src.includes('craco')&&page.url()===url,label+' five categories inline',categories);
 check(initial===await page.locator('#showcase-ospitalita').innerHTML()&&categories[4].src.includes('veranda')&&await page.locator('.showcase').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<4),label+' hospitality photograph preserved and fullscreen');
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});await page.evaluate(()=>gsap.globalTimeline.pause());const day=await page.screenshot();
 await page.locator('#night-mode').evaluate(e=>{e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));});const night=await page.screenshot();check(day.equals(night),label+' night remains hero only');
 for(const file of ['ristorante.html','territorio.html','ricette.html']){
  await page.goto(base+file,{waitUntil:'load'});await ready();
  const allPhotos=await page.locator('main img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));return imgs.map(i=>({src:i.currentSrc,ok:i.complete&&i.naturalWidth>0}));});
  check(allPhotos.every(i=>i.ok)&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' '+file+' images and width',allPhotos.length);
  if(file==='ristorante.html'){
   const names=await page.locator('#ricette .photo-story h3').allTextContents();const photos=await page.locator('#ricette .photo-story img').evaluateAll(imgs=>imgs.map(i=>i.currentSrc));
   check(JSON.stringify(names)===JSON.stringify(["U' Pastizz R'tunnar",'Pan Brioche','Torta della Nonna',"Frizzul ca Middich'"])&&new Set(photos).size===4,label+' four exact recipe names and distinct photographs',names);
   await section('#ricette');await shot('recipes');if(engine==='chrome'&&!publicMode)await page.screenshot({path:`${out}/cucina-full.png`,fullPage:true});
  }else if(file==='territorio.html'){
   const text=await page.locator('main').innerText();check(['Rotondella','Matera','Craco','Policoro','Siritide','Metaponto','Tavole Palatine','Oasi WWF','Volo dell’Angelo'].every(t=>text.includes(t))&&allPhotos.length>=10,label+' photographed destinations',allPhotos.length);
   await section('#vicino');await shot('territory');if(engine==='chrome'&&!publicMode)await page.screenshot({path:`${out}/territorio-full.png`,fullPage:true});
  }else{check(await page.locator('.detail-section .detail-figure img').count()===4,label+' full recipe pages have four photographs');}
 }
 await browser.close();console.log('Verified',label);await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(report.checks.length,'checks,',report.failures.length,'failures,',report.errors.length,'errors');if(report.failures.length||report.errors.length)process.exitCode=1;
