(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() { return root.getAttribute('lang') === 'en' ? 'en' : 'tr'; }
  function t(obj) { return typeof obj === 'string' ? obj : obj[lang()]; }
  function $(id) { return document.getElementById(id); }

  /* ---------- data ---------- */
  var categories = [
    { icon: 'tarih', name: { tr: 'Tarih ve Müzeler', en: 'History & Museums' }, places: [
      { name: 'Anıtkabir', meta: { tr: 'Çankaya · Anıt', en: 'Çankaya · Mausoleum' } },
      { name: 'Ankara Kalesi', meta: { tr: 'Altındağ · Tarihi yapı', en: 'Altındağ · Historic castle' } },
      { name: 'Anadolu Medeniyetleri Müzesi', meta: { tr: 'Altındağ · Müze', en: 'Altındağ · Museum' } } ] },
    { icon: 'doga', name: { tr: 'Parklar ve Doğa', en: 'Parks & Nature' }, places: [
      { name: 'Gençlik Parkı', meta: { tr: 'Altındağ · Şehir parkı', en: 'Altındağ · City park' } },
      { name: 'Atatürk Orman Çiftliği', meta: { tr: 'Yenimahalle · Yeşil alan', en: 'Yenimahalle · Green space' } },
      { name: 'Eymir Gölü', meta: { tr: 'Gölbaşı · Göl kenarı', en: 'Gölbaşı · Lakeside' } } ] },
    { icon: 'kafe', name: { tr: 'Kafeler ve Tatlıcılar', en: 'Cafés & Desserts' }, places: [
      { name: 'Café des Cafés', meta: { tr: 'Çankaya · Tunalı Hilmi', en: 'Çankaya · Tunalı Hilmi' } },
      { name: 'Kocatepe Kahve Evi', meta: { tr: 'Çankaya · Kahve evi', en: 'Çankaya · Coffee house' } },
      { name: 'Hamamönü', meta: { tr: 'Altındağ · Tarihi sokak', en: 'Altındağ · Historic street' } } ] },
    { icon: 'restoran', name: { tr: 'Restoranlar', en: 'Restaurants' }, places: [
      { name: 'Uludağ Kebapçısı', meta: { tr: 'Altındağ · İskender', en: 'Altındağ · İskender kebab' } },
      { name: 'Kale Washington', meta: { tr: 'Altındağ · Kale içinde', en: 'Altındağ · Inside the castle' } },
      { name: 'Hacı Arif Bey', meta: { tr: 'Çankaya · Kebap', en: 'Çankaya · Kebab' } } ] },
    { icon: 'kultur', name: { tr: 'Kültür ve Sanat', en: 'Culture & Art' }, places: [
      { name: 'CerModern', meta: { tr: 'Altındağ · Sanat merkezi', en: 'Altındağ · Art centre' } },
      { name: 'Ankara Opera Binası', meta: { tr: 'Altındağ · Opera ve bale', en: 'Altındağ · Opera & ballet' } },
      { name: 'CSO Ada Ankara', meta: { tr: 'Çankaya · Konser salonu', en: 'Çankaya · Concert hall' } } ] },
    { icon: 'alisveris', name: { tr: 'Alışveriş', en: 'Shopping' }, places: [
      { name: 'Samanpazarı', meta: { tr: 'Altındağ · El sanatları', en: 'Altındağ · Crafts bazaar' } },
      { name: 'Tunalı Hilmi Caddesi', meta: { tr: 'Çankaya · Cadde', en: 'Çankaya · High street' } },
      { name: 'Armada', meta: { tr: 'Çankaya · AVM', en: 'Çankaya · Shopping mall' } } ] }
  ];

  var mapPins = [
    { x: 392, y: 168, c: '#07565d', icon: 'tarih', name: 'Ankara Kalesi', meta: { tr: 'Altındağ · Tarih ve Müzeler', en: 'Altındağ · History & Museums' } },
    { x: 300, y: 212, c: '#3f8a5a', icon: 'doga', name: 'Gençlik Parkı', meta: { tr: 'Altındağ · Parklar ve Doğa', en: 'Altındağ · Parks & Nature' } },
    { x: 352, y: 196, c: '#c86a3a', icon: 'restoran', name: 'Uludağ Kebapçısı', meta: { tr: 'Altındağ · Restoranlar', en: 'Altındağ · Restaurants' } },
    { x: 250, y: 238, c: '#a9834a', icon: 'kultur', name: 'CerModern', meta: { tr: 'Altındağ · Kültür ve Sanat', en: 'Altındağ · Culture & Art' } },
    { x: 222, y: 316, c: '#07565d', icon: 'tarih', name: 'Anıtkabir', meta: { tr: 'Çankaya · Tarih ve Müzeler', en: 'Çankaya · History & Museums' } },
    { x: 344, y: 372, c: '#8a5a86', icon: 'kafe', name: 'Café des Cafés', meta: { tr: 'Çankaya · Kafeler', en: 'Çankaya · Cafés' } },
    { x: 100, y: 120, c: '#3f8a5a', icon: 'doga', name: 'Atatürk Orman Çiftliği', meta: { tr: 'Yenimahalle · Parklar ve Doğa', en: 'Yenimahalle · Parks & Nature' } }
  ];

  var dicePlaces = [
    { icon: 'kultur', name: 'CerModern', meta: { tr: 'Kültür ve Sanat · Altındağ', en: 'Culture & Art · Altındağ' } },
    { icon: 'kafe', name: 'Hamamönü', meta: { tr: 'Kafeler · Altındağ', en: 'Cafés · Altındağ' } },
    { icon: 'doga', name: 'Eymir Gölü', meta: { tr: 'Doğa · Gölbaşı', en: 'Nature · Gölbaşı' } },
    { icon: 'restoran', name: 'Kale Washington', meta: { tr: 'Restoran · Altındağ', en: 'Restaurant · Altındağ' } },
    { icon: 'tarih', name: 'Ankara Kalesi', meta: { tr: 'Tarih · Altındağ', en: 'History · Altındağ' } },
    { icon: 'alisveris', name: 'Samanpazarı', meta: { tr: 'Alışveriş · Altındağ', en: 'Shopping · Altındağ' } }
  ];
  var dieFaces = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];

  function mapsUrl(name) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ', Ankara');
  }

  /* ---------- explorer ---------- */
  var catsEl = $('cats'), placesEl = $('places'), active = 0;

  function buildTabs() {
    if (!catsEl) return;
    categories.forEach(function (cat, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', 'panel');
      btn.innerHTML = '<img src="assets/ikon/' + cat.icon + '.webp" alt="" width="56" height="56"><span class="label"></span>';
      btn.addEventListener('click', function () { select(i, true); });
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % categories.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + categories.length) % categories.length;
        if (next !== null) { e.preventDefault(); select(next, true); catsEl.querySelectorAll('.cat')[next].focus(); }
      });
      li.appendChild(btn);
      catsEl.appendChild(li);
    });
  }

  function renderExplorer(animate) {
    if (!catsEl) return;
    catsEl.querySelectorAll('.cat').forEach(function (btn, i) {
      btn.querySelector('.label').textContent = t(categories[i].name);
      btn.setAttribute('aria-selected', i === active ? 'true' : 'false');
      btn.tabIndex = i === active ? 0 : -1;
    });
    var cat = categories[active];
    $('panelTitle').textContent = t(cat.name);
    var go = lang() === 'tr' ? 'Haritada ↗' : 'Map ↗';
    placesEl.innerHTML = cat.places.map(function (p) {
      return '<a class="card pcard" href="' + mapsUrl(p.name) + '" target="_blank" rel="noopener">' +
        '<span class="thumb"><img src="assets/ikon/' + cat.icon + '.webp" alt=""></span>' +
        '<span><span class="title" style="display:block">' + p.name + '</span><span class="small">' + t(p.meta) + '</span></span>' +
        '<span class="foot"><span class="chip">' + t(cat.name) + '</span><span class="small" style="font-weight:700;color:var(--teal)">' + go + '</span></span></a>';
    }).join('');
    if (animate) { placesEl.classList.remove('swap'); void placesEl.offsetWidth; placesEl.classList.add('swap'); }
  }

  function select(i, animate) { active = i; renderExplorer(animate); }

  /* ---------- map ---------- */
  var pinsEl = $('pins'), mapIndex = 0;
  function buildPins() {
    if (!pinsEl) return;
    var ns = 'http://www.w3.org/2000/svg';
    mapPins.forEach(function (p) {
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
      g.innerHTML =
        '<circle class="pulse" r="14" fill="' + p.c + '" opacity="0"/>' +
        '<g class="pin"><path d="M0 0 C -11 -14 -14 -20 -14 -27 a14 14 0 0 1 28 0 c0 7 -3 13 -14 27z" fill="' + p.c + '" stroke="#fff" stroke-width="2.5"/>' +
        '<circle cy="-27" r="5" fill="#fff"/></g>';
      pinsEl.appendChild(g);
    });
  }
  function renderMap() {
    if (!pinsEl) return;
    pinsEl.querySelectorAll(':scope > g').forEach(function (g, i) {
      g.querySelector('.pin').classList.toggle('on', i === mapIndex);
      g.querySelector('.pulse').style.display = i === mapIndex ? '' : 'none';
    });
    var p = mapPins[mapIndex];
    $('mapIco').src = 'assets/ikon/' + p.icon + '.webp';
    $('mapName').textContent = p.name;
    $('mapMeta').textContent = t(p.meta);
  }
  function cycleMap() {
    var card = $('mapCard');
    card.classList.add('fade');
    setTimeout(function () {
      mapIndex = (mapIndex + 1) % mapPins.length;
      renderMap();
      card.classList.remove('fade');
    }, 400);
  }

  /* ---------- dice ---------- */
  var diceIndex = 0;
  function renderDice() {
    var face = dieFaces[diceIndex % 6];
    document.querySelectorAll('#die i').forEach(function (dot, i) { dot.classList.toggle('on', face.indexOf(i) !== -1); });
    var p = dicePlaces[diceIndex % dicePlaces.length];
    $('diceIco').src = 'assets/ikon/' + p.icon + '.webp';
    $('diceName').textContent = p.name;
    $('diceMeta').textContent = t(p.meta);
  }
  function cycleDice() {
    var card = $('diceResult');
    card.classList.add('fade');
    setTimeout(function () {
      diceIndex = (diceIndex + 1) % dicePlaces.length;
      renderDice();
      card.classList.remove('fade');
    }, 350);
  }

  /* ---------- language ---------- */
  var toggle = $('langToggle');
  function storedLang() { try { return localStorage.getItem('sternas-lang'); } catch (e) { return null; } }
  function storeLang(l) { try { localStorage.setItem('sternas-lang', l); } catch (e) { /* ignore */ } }
  function setLang(l) {
    root.setAttribute('lang', l);
    if (toggle) toggle.textContent = l === 'tr' ? 'EN' : 'TR';
    renderExplorer(false);
    if (pinsEl) renderMap();
    if ($('die')) renderDice();
  }

  buildTabs();
  buildPins();
  var browser = (navigator.language || 'tr').toLowerCase();
  setLang(storedLang() || (browser.indexOf('tr') === 0 ? 'tr' : 'en'));
  if (toggle) toggle.addEventListener('click', function () {
    var next = lang() === 'tr' ? 'en' : 'tr';
    setLang(next);
    storeLang(next);
  });

  if (!reduceMotion) {
    if (pinsEl) setInterval(cycleMap, 3200);
    if ($('die')) setInterval(cycleDice, 4500);
  }

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- business form ---------- */
  var form = $('bizForm');
  if (form) {
    var msg = $('formMsg');
    var text = {
      missing: { tr: 'Lütfen zorunlu alanları doldurup onay kutusunu işaretle.', en: 'Please fill in the required fields and tick the consent box.' },
      sending: { tr: 'Gönderiliyor…', en: 'Sending…' },
      ok: { tr: 'Teşekkürler! Başvurun bize ulaştı, en kısa sürede dönüş yapacağız.', en: 'Thank you! We received your application and will be in touch soon.' },
      err: { tr: 'Gönderilemedi. Lütfen info@sternas.com.tr adresine yaz.', en: 'Could not send. Please write to info@sternas.com.tr.' }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity() || !$('f-consent').checked) {
        msg.className = 'form-msg err'; msg.textContent = t(text.missing);
        var firstInvalid = form.querySelector(':invalid'); if (firstInvalid) firstInvalid.focus();
        return;
      }
      var data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return;
      data._subject = 'Sterna\'s işletme başvurusu: ' + data.isletme;
      data._template = 'table';
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      msg.className = 'form-msg'; msg.textContent = t(text.sending);
      fetch('https://formsubmit.co/ajax/info@sternas.com.tr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status);
        msg.className = 'form-msg ok'; msg.textContent = t(text.ok);
        form.reset();
      }).catch(function () {
        msg.className = 'form-msg err'; msg.textContent = t(text.err);
      }).finally(function () { button.disabled = false; });
    });
  }

  /* ---------- reveal ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
