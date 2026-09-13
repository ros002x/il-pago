import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),base=process.env.PAGO_TEST_URL||'http://127.0.0.1:4173/';
await fs.mkdir(path.join(root,'artifacts'),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={date:new Date().toISOString(),browser:'Installed Chrome / Chromium',checks:[],failures:[],errors:[],viewports:[]};
const check=(ok,label,details)=>{report.checks.push({label,ok,...(details?{details}:{})});if(!ok)report.failures.push(label);};
const delay=(page,ms=700)=>page.waitForTimeout(ms);
const files=(await fs.readdir(root)).filter(f=>f.endsWith('.html'));
const parser=await browser.newPage();
const documents={};
for(const file of files){await parser.setContent(await fs.readFile(path.join(root,file),'utf8'));documents[file]=await parser.evaluate(()=>({ids:[...document.querySelectorAll('[id]')].map(e=>e.id),links:[...document.querySelectorAll('a[href]')].map(e=>e.getAttribute('href')),title:document.title,h1:document.querySelectorAll('h1').length}));}
for(const [file,d]of Object.entries(documents)){
 check(new Set(d.ids).size===d.ids.length,`${file}: unique IDs`);
 check(d.h1===1,`${file}: one H1`,d.h1);
 for(const href of d.links){if(/^(https?:|tel:|mailto:)/.test(href))continue;const [target,fragment]=href.split('#');const dest=target||file;check(!!documents[dest]&&(!fragment||documents[dest].ids.includes(fragment)),`${file}: link ${href}`);}
}
await parser.close();
for(const [width,height]of [[1440,900],[1366,768],[1920,1080],[768,1024],[390,844],[360,800],[320,700]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(base+'index.html');await page.evaluate(()=>document.fonts.ready);await delay(page,700);
 check(await page.evaluate(()=>document.body.classList.contains('premium-ready')),`${width}: animated home initialized`);
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: home no overflow`);
 const hero=await page.locator('.hero-day').getAttribute('src');check(hero.includes('courtyard'),`${width}: approved hero preserved`);
 const toggled=await page.locator('#night-mode').isChecked();await page.locator('.day-night').click();check(await page.locator('#night-mode').isChecked()!==toggled,`${width}: day/night toggle`);
 await page.locator('.day-night').click();
 await page.locator('.menu-trigger').click();await delay(page,800);
 const drawer=await page.locator('#menu-dialog').boundingBox();check(width<=1100||drawer.width/width<=.41,`${width}: menu stays within 40% on desktop`);
 const scrollBefore=await page.evaluate(()=>scrollY);await page.mouse.move(3,300);await page.mouse.wheel(0,500);await delay(page,400);check(Math.abs(await page.evaluate(()=>scrollY)-scrollBefore)<2,`${width}: background scroll locked`);
 await page.locator('#menu-dialog .close-button').focus();await page.keyboard.press('Shift+Tab');check(await page.evaluate(()=>document.activeElement===document.querySelector('#menu-dialog .menu-bottom a')),`${width}: menu focus wraps backward`);
 await page.keyboard.press('Tab');check(await page.evaluate(()=>document.activeElement===document.querySelector('#menu-dialog .close-button')),`${width}: menu focus wraps forward`);
 await page.keyboard.press('Escape');await delay(page,400);check(await page.evaluate(()=>!document.querySelector('dialog[open]')&&!document.body.classList.contains('dialog-open')&&document.activeElement.matches('.menu-trigger')),`${width}: Escape unlock and focus restoration`);
 await page.locator('.header-small [data-contact]').click();await delay(page,800);check(await page.locator('#contact-dialog').isVisible(),`${width}: contact panel`);
 await page.locator('#contact-dialog [data-booking]').click();await delay(page,450);check(await page.evaluate(()=>document.querySelectorAll('dialog[open]').length===1&&document.querySelector('#booking-dialog').open),`${width}: contact to request without stacked dialogs`);
 await page.locator('[name=interesse]').selectOption('Prodotti tipici');check(await page.locator('[name=arrivo]').isDisabled(),`${width}: product inquiry hides dates`);
 await page.locator('[name=interesse]').selectOption('Soggiorno');await page.locator('[name=arrivo]').fill('2027-03-20');await page.locator('[name=partenza]').fill('2027-03-19');check(await page.locator('[name=partenza]').evaluate(e=>!e.checkValidity()),`${width}: invalid departure rejected`);
 await page.keyboard.press('Escape');await delay(page,400);
 for(const id of ['entrance-scene','experience-scene','coast-scene']){
  const move=async p=>{await page.evaluate(({id,p})=>{const s=ScrollTrigger.getById(id);scrollTo({top:s.start+(s.end-s.start)*p,behavior:'instant'})},{id,p});await delay(page,800)};
  await move(.25);const before=await page.evaluate(id=>{const s=ScrollTrigger.getById(id);return s.animation.progress()},id);await move(.9);await move(.25);const after=await page.evaluate(id=>ScrollTrigger.getById(id).animation.progress(),id);
  check(Math.abs(before-after)<.006,`${width}: ${id} reversible`,{before,after});
 }
 await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await delay(page);check(await page.locator('.footer-wordmark').isVisible(),`${width}: footer retained`);
 await page.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete));check(await page.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)),`${width}: all home images load`);
 for(const file of files.filter(f=>f!=='index.html')){
  await page.goto(base+file);await page.evaluate(()=>document.fonts.ready);await delay(page,70);
  const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,bad:[...document.querySelectorAll('main h1,main h2')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2||r.left < -2}).map(e=>e.textContent)}));
  check(!layout.overflow&&!layout.bad.length,`${width}: ${file} reading layout`,layout);
 }
 if(width===1440){
  await page.goto(base+'prodotti.html');await page.locator('[data-product-filter=passate]').click();check(await page.locator('[data-product-category]:visible').count()===2,'Product filter returns two passate');
  await page.locator('[data-product-filter=all]').click();await page.locator('#albicocche summary').click();await page.locator('#albicocche [data-booking]').click();
  check((await page.locator('[name=messaggio]').inputValue()).includes('albicocche'),'Product request retains product context');
  await page.locator('[name=nome]').fill('Verifica À & Co');await page.locator('[name=telefono]').fill('+39 000 0000000');await page.evaluate(()=>{window.__opened=[];window.open=(...args)=>{window.__opened.push(args);return null;}});await page.locator('.form-submit').click();
  const url=await page.evaluate(()=>window.__opened[0]?.[0]);check(url?.startsWith('https://wa.me/393383222295?text=')&&decodeURIComponent(url).includes('Verifica À & Co'),'WhatsApp request safely encoded; sending intercepted');
  await page.keyboard.press('Escape');await delay(page,400);await page.goto(base+'esperienze.html#fattoria');await page.locator('#fattoria summary').first().click();check(await page.locator('#fattoria details').first().getAttribute('open')!==null,'Farm educational detail expands');
 }
 report.errors.push(...errors.map(e=>({width,error:e})));report.viewports.push({width,height,errors:errors.length});await fs.writeFile(path.join(root,'artifacts/verification.json'),JSON.stringify(report,null,2));await page.close();console.log('Viewport complete',width,height,'errors',errors.length);
}
for(const mode of ['reduced','no-js']){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});const page=await context.newPage();
 await page.goto(base+'index.html');await delay(page,700);check(!(await page.locator('body').getAttribute('class')).includes('premium-ready'),`${mode}: static readable fallback`);
 check(await page.locator('main a[href="esperienze.html#fattoria"]').first().isVisible(),`${mode}: experiences remain reachable`);await context.close();
}
const resize=await browser.newPage({viewport:{width:1440,height:900}});await resize.goto(base+'index.html');await delay(resize,700);await resize.setViewportSize({width:390,height:844});await delay(resize,850);await resize.setViewportSize({width:1440,height:900});await delay(resize,850);check(await resize.evaluate(()=>ScrollTrigger.getAll().filter(s=>s.vars.id==='experience-scene').length===1&&document.querySelectorAll('.hero>#benvenuti').length===1),'Resize rebuilds pins once');await resize.close();
check(report.errors.length===0,'No JavaScript or local HTTP errors',report.errors);
await fs.mkdir(path.join(root,'artifacts'),{recursive:true});await fs.writeFile(path.join(root,'artifacts/verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:report.checks.length,failures:report.failures,errors:report.errors}));await browser.close();process.exitCode=report.failures.length?1:0;
