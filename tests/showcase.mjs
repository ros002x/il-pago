import {chromium,webkit} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4174/',out='artifacts/showcase';await fs.mkdir(out,{recursive:true});
const report={checks:[],errors:[]};
for(const [engine,width,height] of [['chrome',1440,900],['webkit',375,667],['webkit',820,1180],['webkit',390,844],['webkit',430,932],['webkit',1180,820]]){
 const browser=await(engine==='chrome'?chromium.launch({channel:'chrome'}):webkit.launch());
 const page=await browser.newPage({viewport:{width,height},hasTouch:engine==='webkit',isMobile:engine==='webkit'}),label=engine+'-'+width;
 const check=(ok,test,data)=>{report.checks.push({ok,label,test,data});if(!ok)console.log('FAIL',label,test,data);};
 page.on('pageerror',e=>report.errors.push({label,error:e.message}));
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);
 await page.locator('.rooms-more').evaluate(e=>e.click());await page.waitForTimeout(2200);
 await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}'});
 await page.evaluate(()=>gsap.globalTimeline.pause());
 const time=night=>page.locator('#night-mode').evaluate((e,night)=>{e.checked=night;e.dispatchEvent(new Event('change',{bubbles:true}));},night);
 const styles=()=>page.evaluate(()=>['body','.story','.showcase','.site-footer'].map(s=>{const e=document.querySelector(s),c=getComputedStyle(e);return [s,c.color,c.backgroundColor,c.backgroundImage]}));
 await time(false);await page.waitForTimeout(100);const day=await page.screenshot({path:`${out}/${label}-day.png`}),before=await styles();await time(true);const night=await page.screenshot({path:`${out}/${label}-night.png`});
 check(day.equals(night)&&JSON.stringify(before)===JSON.stringify(await styles()),'night isolation: exact showcase pixels and global styles',{pixels:day.equals(night)});
 await page.evaluate(()=>gsap.globalTimeline.resume());await page.locator('.menu-trigger').click();await page.waitForTimeout(700);
 const opened=await page.locator('#menu-dialog').evaluate(e=>({open:e.open,focus:e.contains(document.activeElement),lock:document.documentElement.classList.contains('dialog-open')}));
 await page.keyboard.press('Escape');await page.waitForTimeout(600);
 const closed=await page.evaluate(()=>({closed:!document.querySelector('#menu-dialog').open,focus:document.activeElement===document.querySelector('.menu-trigger'),unlocked:!document.documentElement.classList.contains('dialog-open')}));
 check(Object.values(opened).every(Boolean)&&Object.values(closed).every(Boolean),'menu focus returns to the actual opener',{opened,closed});
 await page.evaluate(()=>{const s=ScrollTrigger.getById('experience-scene');scrollTo({top:s.end,behavior:'instant'});});await page.waitForTimeout(1500);await page.screenshot({path:`${out}/${label}-crown.png`});
 await browser.close();
}
report.failures=report.checks.filter(c=>!c.ok);await fs.writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log('Panel recheck:',report.checks.length,'failures',report.failures.length,'errors',report.errors.length);if(report.failures.length||report.errors.length)process.exitCode=1;
