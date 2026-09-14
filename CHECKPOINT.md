# Checkpoint prima della pubblicazione

Stato salvato il 14 settembre 2026, prima dei nuovi interventi richiesti su storytelling, menu e variante notturna. È un checkpoint del lavoro recuperato, non la dichiarazione di completamento dell’ultimo brief.

## Verifiche disponibili

- Build e controllo sintassi, riferimenti locali e manifest responsive: superati.
- Funzioni e contenuti: 684 controlli, nessun errore.
- Apple/WebKit: 338 controlli, nessun errore.
- Profondità: 136 controlli, nessun errore.
- Continuità: 189 controlli, nessun errore.
- Chioma, refresh, foto camere e fallback GPU: 133 controlli, nessun errore.
- Audit fotografico e visivo: 44 combinazioni pagina/viewport; tutte le undici pagine esaminate.

Le cinque suite totalizzano 1480 controlli. Un controllo aggiuntivo della navigazione ha però segnalato il ritorno dalla pagina Territorio e il successivo link al capitolo Esperienze su WebKit: questa sequenza deve ancora essere stabilizzata e ricontrollata. Il refresh a metà della scena mare passa su Chrome e WebKit. Gli screenshot e i risultati locali sono in `artifacts`, esclusa da Git.

## Nuovo brief ancora da eseguire, dopo push/deploy

1. Identificare il repository ROS corretto, pubblicare questo checkpoint e verificare il deployment già esistente.
2. Rivedere direttamente ERA per storytelling orizzontale, composizione della vegetazione e menu.
3. Confinare la variante notte alla sola hero: questo nuovo requisito non è ancora implementato.
4. Alleggerire e rifinire il menu con trasparenza controllata e animazioni, preservando focus, Escape e scroll lock.
5. Proseguire la verifica di dettaglio fotografico 2K/4K e Retina senza inventare spazi; i limiti dei master disponibili sono documentati in `IMAGE_AI_TODO.md`.
6. Testare ogni fase, effettuare commit/push progressivi e verificare l’URL pubblico su cui l’utente potrà provare dispositivi Apple reali.

Entrambe le copie locali del progetto sono prive di remote. L’account GitHub verificato è `ros002x`; la ricerca nei repository e nelle configurazioni locali non ha individuato una destinazione Il Pago certa. Nessun push o deploy è stato eseguito. Occorre il repository indicato dall’utente prima di procedere con gli ulteriori interventi importanti, come richiesto nell’ultimo brief.
