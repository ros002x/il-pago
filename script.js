(() => {
  'use strict';
  const body = document.body;
  const mode = document.querySelector('#night-mode');
  const nightImage = document.querySelector('.hero-night');
  const themeStatus = document.querySelector('[data-theme-status]');
  const applyTheme = (isNight) => {
    body.classList.toggle('night', isNight);
    if (mode) mode.checked = isNight;
    if (themeStatus) themeStatus.textContent = isNight ? 'Atmosfera notturna.' : 'Atmosfera diurna.';
    document.querySelector('meta[name="theme-color"]').content = isNight ? '#25131e' : '#223c2d';
  };
  try { applyTheme(localStorage.getItem('ilpago-atmosfera') === 'night'); } catch { applyTheme(false); }
  mode?.addEventListener('change', () => {
    applyTheme(mode.checked);
    try { localStorage.setItem('ilpago-atmosfera', mode.checked ? 'night' : 'day'); } catch { /* La visita funziona anche senza storage. */ }
  });
  nightImage?.addEventListener('error', () => {
    nightImage.removeAttribute('srcset');
    nightImage.src = 'assets/courtyard.jpg';
    nightImage.style.filter = 'brightness(.35) saturate(.7)';
  }, { once: true });

  const dialogs = [...document.querySelectorAll('dialog')];
  const returnFocus = new WeakMap();
  const closeTimers = new WeakMap();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const syncDialogState = () => {
    const open = dialogs.some(item => item.open);
    body.classList.toggle('dialog-open', open);
    document.documentElement.classList.toggle('dialog-open', open);
    document.querySelector('.menu-trigger')?.setAttribute('aria-expanded', String(!!document.querySelector('#menu-dialog[open]')));
    document.dispatchEvent(new CustomEvent('ilpago:dialog', { detail: { open } }));
  };
  const openDialog = (dialog) => {
    if (!dialog) return;
    clearTimeout(closeTimers.get(dialog));
    dialog.classList.remove('is-closing');
    if (dialog.open) return;
    const previous = dialogs.find(item => item.open);
    const origin = previous ? returnFocus.get(previous) : document.activeElement;
    returnFocus.set(dialog, origin);
    if (previous) { clearTimeout(closeTimers.get(previous)); previous.close(); previous.classList.remove('is-closing'); }
    dialog.showModal();
    syncDialogState();
    dialog.scrollTop = 0;
  };
  const closeDialog = (dialog) => {
    if (!dialog?.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    const finish = () => {
      dialog.close(); dialog.classList.remove('is-closing'); syncDialogState();
      const origin = returnFocus.get(dialog);
      if (!dialogs.some(item => item.open) && origin?.isConnected) origin.focus({ preventScroll: true });
    };
    if (reduced.matches) finish();
    else closeTimers.set(dialog, setTimeout(finish, 320));
  };
  dialogs.forEach((dialog) => {
    dialog.addEventListener('close', syncDialogState);
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"],summary')].filter(el => !el.disabled && el.getClientRects().length && !el.closest('[hidden]'));
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
  });
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.close)));
  });
  const menu = document.querySelector('#menu-dialog');
  document.querySelector('.menu-trigger')?.addEventListener('click', () => openDialog(menu));
  menu?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => { menu.close(); syncDialogState(); });
  });
  document.querySelectorAll('[data-contact]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const panel = document.querySelector('#contact-dialog');
    if (panel) { event.preventDefault(); openDialog(panel); }
  }));
  // Preserve old inbound links after moving the long contact/farm sections off the homepage.
  if (location.hash === '#contatti') openDialog(document.querySelector('#contact-dialog'));
  if (document.querySelector('.hero') && location.hash === '#fattoria') location.replace('esperienze.html#fattoria');

  const gallery = [
    { src: 'assets/room-garden-1920.webp', srcset: 'assets/room-garden-640.webp 640w, assets/room-garden-1280.webp 1280w, assets/room-garden-1920.webp 1920w', alt: 'Camera di Il Pago con letto matrimoniale e finestra sul verde', caption: 'Il tuo rifugio in campagna' },
    { src: 'assets/room-2-800.webp', srcset: 'assets/room-2-640.webp 640w, assets/room-2-800.webp 800w', alt: 'Camera matrimoniale con letto in ferro battuto e soffitto in legno', caption: 'La semplicità del riposo' },
    { src: 'assets/room-1-800.webp', srcset: 'assets/room-1-640.webp 640w, assets/room-1-800.webp 800w', alt: 'Ingresso indipendente di una camera, con tavolino all’aperto', caption: 'Il giardino sulla soglia' }
  ];
  let currentPhoto = 0;
  const galleryImage = document.querySelector('[data-room-image]');
  const showPhoto = (direction) => {
    currentPhoto = (currentPhoto + direction + gallery.length) % gallery.length;
    const photo = gallery[currentPhoto];
    galleryImage.srcset = photo.srcset;
    galleryImage.src = photo.src;
    galleryImage.alt = photo.alt;
    document.querySelector('[data-room-caption]').textContent = photo.caption;
    document.querySelector('[data-room-counter]').textContent = `${String(currentPhoto + 1).padStart(2, '0')} / 03`;
  };
  document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => showPhoto(-1));
  document.querySelector('[data-gallery-next]')?.addEventListener('click', () => showPhoto(1));
  let touchStart = null;
  galleryImage?.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  galleryImage?.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });

  const booking = document.querySelector('#booking-dialog');
  const form = document.querySelector('[data-contact-form]');
  const interest = form.elements.interesse;
  const arrival = form.elements.arrivo;
  const departure = form.elements.partenza;
  const status = document.querySelector('[data-form-status]');
  const fallback = document.querySelector('[data-whatsapp-fallback]');
  const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const tomorrow = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return localDate(new Date(year, month - 1, day + 1, 12));
  };
  const resetStatus = () => { status.textContent = ''; fallback.hidden = true; fallback.removeAttribute('href'); };
  const updateDates = () => {
    arrival.min = localDate(new Date());
    departure.min = tomorrow(arrival.value || arrival.min);
    departure.setCustomValidity(interest.value === 'Soggiorno' && departure.value && departure.value < departure.min ? 'La partenza deve essere successiva all’arrivo.' : '');
  };
  const updateInterest = () => {
    const stay = interest.value === 'Soggiorno';
    const products = interest.value === 'Prodotti tipici';
    document.querySelector('[data-arrival-label]').hidden = products;
    document.querySelector('[data-departure-field]').hidden = !stay;
    document.querySelector('[data-guests-field]').hidden = products;
    document.querySelector('[data-date-label]').textContent = stay ? 'Arrivo' : 'Data';
    arrival.disabled = products;
    departure.disabled = !stay;
    form.elements.ospiti.disabled = products;
    updateDates();
    resetStatus();
  };
  interest.addEventListener('change', updateInterest);
  arrival.addEventListener('input', updateDates);
  departure.addEventListener('input', updateDates);
  form.addEventListener('input', resetStatus);
  document.querySelectorAll('[data-booking]').forEach((button) => {
    button.addEventListener('click', () => {
      interest.value = button.dataset.booking;
      if (!interest.value) interest.value = 'Soggiorno';
      const product = button.closest('[data-product-category]');
      if (product) form.elements.messaggio.value = `Vorrei informazioni su ${product.querySelector('.product-name').childNodes[0].textContent.trim()}. Quantità: `;
      updateInterest();
      openDialog(booking);
    });
  });
  const formatDate = (date) => date ? date.split('-').reverse().join('/') : 'Da concordare';
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateDates();
    if (!form.reportValidity()) return;
    if (!form.elements.nome.value.trim() || !form.elements.telefono.value.trim()) {
      status.textContent = 'Inserisci il tuo nome e un numero di telefono.';
      return;
    }
    const data = new FormData(form);
    const lines = [
      'Ciao Il Pago, vorrei informazioni.',
      `Nome: ${String(data.get('nome')).trim()}`,
      `Telefono: ${String(data.get('telefono')).trim()}`,
      `Interesse: ${data.get('interesse')}`
    ];
    if (!arrival.disabled) lines.push(`${interest.value === 'Soggiorno' ? 'Arrivo' : 'Data'}: ${formatDate(arrival.value)}`);
    if (!departure.disabled) lines.push(`Partenza: ${formatDate(departure.value)}`);
    if (!form.elements.ospiti.disabled) lines.push(`Ospiti: ${data.get('ospiti')}`);
    const message = String(data.get('messaggio') || '').trim();
    if (message) lines.push(`Messaggio: ${message}`);
    const url = `https://wa.me/393383222295?text=${encodeURIComponent(lines.join('\n'))}`;
    fallback.href = url;
    fallback.hidden = false;
    window.open(url, '_blank', 'noopener,noreferrer');
    status.textContent = 'La richiesta è pronta. Inviala da WhatsApp; se non si è aperto, usa il link qui sotto.';
  });
  updateInterest();
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
})();
