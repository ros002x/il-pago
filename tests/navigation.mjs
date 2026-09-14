import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4174/';
const checks=[],errors=[];
for(const [engine,width,height] of [['chrome',1440,900],['webkit',1440,900],['webkit',390,844]]){
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},hasTouch:width===390,isMobile:width===390});
 const label=engine+'-'+width;
 page.on('pageerror',e=>errors.push({label,error:e.message}));
 const settle=async()=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1100);};
 const position=()=>page.evaluate(()=>({y:scrollY,coast:ScrollTrigger.getById('coast-scene').progress,gallery:ScrollTrigger.getById('experience-scene').start}));
 const check=(ok,test,state)=>{checks.push({label,test,ok,state});};
 await page.goto(base);await settle();
 await page.evaluate(()=>{const s=ScrollTrigger.getById('coast-scene');scrollTo({top:s.start+(s.end-s.start)*.45,behavior:'instant'});});await page.waitForTimeout(600);
 await page.reload();await settle();let state=await position();check(Math.abs(state.coast-.45)<.02,'reload restores scene',state);
 await page.goto(base+'territorio.html');await settle();await page.goBack();await settle();state=await position();check(Math.abs(state.coast-.45)<.02,'back restores scene after pins settle',state);
 await page.goto(base+'index.html#esperienze');await settle();state=await position();check(Math.abs(state.y-state.gallery)<2,'new hash uses refreshed scroll extent',state);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await settle();check(await page.evaluate(()=>history.scrollRestoration==='auto'&&!document.body.classList.contains('premium-ready')),'reduced motion uses native history');
 await browser.close();
}
const result={checks,errors,failures:checks.filter(c=>!c.ok)};
await fs.mkdir(new URL('../artifacts/navigation/',import.meta.url),{recursive:true});await fs.writeFile(new URL('../artifacts/navigation/results.json',import.meta.url),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));if(result.failures.length||errors.length)process.exitCode=1;
