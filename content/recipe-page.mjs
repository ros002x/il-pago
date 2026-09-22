import {recipes,recipeIngredients,recipeUrl,recipeIndex} from './recipes.mjs';
export const recipeMain=(recipe,index,picture,arrow)=>{
 const previous=recipes[index-1],next=recipes[index+1];
 return `<main id="main" tabindex="-1" class="recipe-main section-pad">
 <a class="recipe-back micro" href="${recipeIndex}">← Torna alle ricette</a>
 <header class="recipe-heading"><span class="micro">Il quaderno del Pago · ${index+1} / ${recipes.length}</span><h1>${recipe.title}</h1><p>${recipe.description}</p></header>
 <div class="recipe-layout"><figure class="recipe-photo">${picture(recipe.image,recipe.alt,'',true,'(max-width: 760px) calc(100vw - 48px), (min-width: 1440px) 600px, 43vw')}<figcaption>${recipe.title} · Dalla cucina del Pago.</figcaption></figure>
 <div class="recipe-instructions"><section id="ingredienti" aria-labelledby="ingredients-title"><span class="micro">01 / Prima di cominciare</span><h2 id="ingredients-title">Ingredienti</h2><p>${recipeIngredients[recipe.id]}</p></section><section id="preparazione" aria-labelledby="method-title"><span class="micro">02 / Le mani in pasta</span><h2 id="method-title">Preparazione</h2><p>${recipe.method}</p><a class="source-link" href="https://www.ilpago.eu/ristorante/ricette/${recipe.path}" target="_blank" rel="noopener">La ricetta originale del Pago ↗</a></section></div></div>
 <nav class="recipe-navigation" aria-label="Navigazione delle ricette">${previous?`<a rel="prev" href="${recipeUrl(previous.id)}"><span class="micro">← Ricetta precedente</span><span>${previous.title}</span></a>`:'<span class="recipe-nav-start" aria-hidden="true"></span>'}<a class="recipe-index-link" href="${recipeIndex}">Tutte le ricette</a>${next?`<a rel="next" href="${recipeUrl(next.id)}"><span class="micro">Ricetta successiva →</span><span>${next.title}</span></a>`:'<a class="recipe-table-link" href="ristorante.html">Torna a La Tavola →</a>'}</nav>
 </main>`;
};
