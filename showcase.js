(() => {
 'use strict';
 const scene=document.querySelector('.showcase');
 if(!scene)return;
 const tabs=[...scene.querySelectorAll('[role="tab"]')];
 const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
 const status=scene.querySelector('.showcase-status');
 const portrait=matchMedia('(max-width: 760px)');
 let selected=0,request=0;
 const orientation=()=>scene.querySelector('[role="tablist"]').setAttribute('aria-orientation',portrait.matches?'horizontal':'vertical');
 orientation();portrait.addEventListener('change',orientation);
 const load=async panel=>{
   const photo=panel.querySelector('img');
   if(!photo.getAttribute('src')){photo.loading='eager';photo.srcset=photo.dataset.srcset;photo.src=photo.dataset.src;}
   await photo.decode();
 };
 const select=async index=>{
   const ticket=++request;
   if(index===selected){scene.removeAttribute('aria-busy');return;}
   scene.setAttribute('aria-busy','true');status.textContent='';
   try{await load(panels[index]);}
   catch{if(ticket===request){scene.removeAttribute('aria-busy');status.textContent='La fotografia non è disponibile. Riprova tra poco.';}return;}
   if(ticket!==request)return;
   panels.forEach((panel,i)=>{
     panel.classList.toggle('is-active',i===index);
     panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index));
     tabs[i].setAttribute('aria-selected',String(i===index));tabs[i].tabIndex=i===index?0:-1;
   });
   selected=index;scene.dataset.category=tabs[index].dataset.category;
   scene.removeAttribute('aria-busy');
   if(portrait.matches){const tab=tabs[index],list=tab.parentElement;list.scrollTo({left:tab.offsetLeft-list.offsetLeft-(list.clientWidth-tab.clientWidth)/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 };
 tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>select(index));
   tab.addEventListener('keydown',event=>{
     const backward=portrait.matches?'ArrowLeft':'ArrowUp',forward=portrait.matches?'ArrowRight':'ArrowDown';
     let next;
     if(event.key===backward)next=(index+tabs.length-1)%tabs.length;
     if(event.key===forward)next=(index+1)%tabs.length;
     if(event.key==='Home')next=0;
     if(event.key==='End')next=tabs.length-1;
     if(next!==undefined){event.preventDefault();tabs[next].focus({preventScroll:true});select(next);}
   });
 });
 document.addEventListener('click',event=>{
   const link=event.target.closest('a[data-showcase]');
   if(!link||event.defaultPrevented&&link.getAttribute('href')!=='#scopri-il-pago'||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button)return;
   const index=tabs.findIndex(tab=>tab.dataset.category===link.dataset.showcase);
   if(index>=0)select(index); // Existing anchor handling supplies smooth scroll and history.
 });
 scene.dataset.category=tabs[selected].dataset.category;
})();
