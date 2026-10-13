(function () {
  var root = document.documentElement;

  /* ---------- language ---------- */
  var toggle = document.getElementById('langToggle');

  function storedLang() {
    try { return localStorage.getItem('sternas-lang'); } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem('sternas-lang', lang); } catch (e) { /* ignore */ }
  }
  function lang() { return root.getAttribute('lang') === 'en' ? 'en' : 'tr'; }
  function setLang(next) {
    root.setAttribute('lang', next);
    if (toggle) toggle.textContent = next === 'tr' ? 'EN' : 'TR';
    renderExplorer(false);
  }

  /* ---------- explorer data ---------- */
  var categories = [
    {
      id: 'tarih', icon: 'tarih',
      name: { tr: 'Tarih ve Müzeler', en: 'History & Museums' },
      sub: { tr: 'Şehrin hafızasında bir gezinti.', en: 'A walk through the city\'s memory.' },
      places: [
        { name: 'Anıtkabir', meta: { tr: 'Çankaya · Anıt', en: 'Çankaya · Mausoleum' } },
        { name: 'Ankara Kalesi', meta: { tr: 'Altındağ · Tarihi yapı', en: 'Altındağ · Historic castle' } },
        { name: 'Anadolu Medeniyetleri Müzesi', meta: { tr: 'Altındağ · Müze', en: 'Altındağ · Museum' } }
      ]
    },
    {
      id: 'doga', icon: 'doga',
      name: { tr: 'Parklar ve Doğa', en: 'Parks & Nature' },
      sub: { tr: 'Şehrin ortasında nefes alacak yerler.', en: 'Places to breathe in the middle of the city.' },
      places: [
        { name: 'Gençlik Parkı', meta: { tr: 'Altındağ · Şehir parkı', en: 'Altındağ · City park' } },
        { name: 'Atatürk Orman Çiftliği', meta: { tr: 'Yenimahalle · Yeşil alan', en: 'Yenimahalle · Green space' } },
        { name: 'Eymir Gölü', meta: { tr: 'Gölbaşı · Göl kenarı', en: 'Gölbaşı · Lakeside' } }
      ]
    },
    {
      id: 'kafe', icon: 'kafe',
      name: { tr: 'Kafeler ve Tatlıcılar', en: 'Cafés & Desserts' },
      sub: { tr: 'Bir kahve molası için.', en: 'For a coffee break.' },
      places: [
        { name: 'Café des Cafés', meta: { tr: 'Çankaya · Tunalı Hilmi', en: 'Çankaya · Tunalı Hilmi' } },
        { name: 'Kocatepe Kahve Evi', meta: { tr: 'Çankaya · Kahve evi', en: 'Çankaya · Coffee house' } },
        { name: 'Hamamönü', meta: { tr: 'Altındağ · Tarihi sokakta kafeler', en: 'Altındağ · Cafés on a historic street' } }
      ]
    },
    {
      id: 'restoran', icon: 'restoran',
      name: { tr: 'Restoranlar', en: 'Restaurants' },
      sub: { tr: 'Şehrin sevilen sofraları.', en: 'The city\'s favourite tables.' },
      places: [
        { name: 'Uludağ Kebapçısı', meta: { tr: 'Altındağ · İskender', en: 'Altındağ · İskender kebab' } },
        { name: 'Kale Washington', meta: { tr: 'Altındağ · Kale içinde', en: 'Altındağ · Inside the castle' } },
        { name: 'Hacı Arif Bey', meta: { tr: 'Çankaya · Kebap', en: 'Çankaya · Kebab' } }
      ]
    },
    {
      id: 'kultur', icon: 'kultur',
      name: { tr: 'Kültür ve Sanat', en: 'Culture & Art' },
      sub: { tr: 'Sahneler, sergiler ve konserler.', en: 'Stages, exhibitions and concerts.' },
      places: [
        { name: 'CerModern', meta: { tr: 'Altındağ · Sanat merkezi', en: 'Altındağ · Art centre' } },
        { name: 'Ankara Opera Binası', meta: { tr: 'Altındağ · Opera ve bale', en: 'Altındağ · Opera & ballet' } },
        { name: 'CSO Ada Ankara', meta: { tr: 'Çankaya · Konser salonu', en: 'Çankaya · Concert hall' } }
      ]
    },
    {
      id: 'alisveris', icon: 'alisveris',
      name: { tr: 'Alışveriş', en: 'Shopping' },
      sub: { tr: 'Çarşılardan caddelere.', en: 'From bazaars to high streets.' },
      places: [
        { name: 'Samanpazarı', meta: { tr: 'Altındağ · El sanatları çarşısı', en: 'Altındağ · Crafts bazaar' } },
        { name: 'Tunalı Hilmi Caddesi', meta: { tr: 'Çankaya · Alışveriş caddesi', en: 'Çankaya · Shopping street' } },
        { name: 'Armada', meta: { tr: 'Çankaya · Alışveriş merkezi', en: 'Çankaya · Shopping mall' } }
      ]
    }
  ];

  var catsEl = document.getElementById('cats');
  var placesEl = document.getElementById('places');
  var titleEl = document.getElementById('panelTitle');
  var subEl = document.getElementById('panelSub');
  var active = 0;

  function mapsUrl(name) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(name + ', Ankara');
  }

  function buildTabs() {
    if (!catsEl) return;
    catsEl.innerHTML = '';
    categories.forEach(function (cat, i) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', 'panel');
      btn.dataset.index = i;
      btn.innerHTML = '<img src="assets/ikon/' + cat.icon + '.webp" alt="" width="56" height="56"><span class="label"></span>';
      btn.addEventListener('click', function () { select(i, true); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % categories.length, true, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + categories.length) % categories.length, true, true); }
      });
      li.appendChild(btn);
      catsEl.appendChild(li);
    });
  }

  function renderExplorer(animate) {
    if (!catsEl) return;
    var l = lang();
    var buttons = catsEl.querySelectorAll('.cat');
    buttons.forEach(function (btn, i) {
      btn.querySelector('.label').textContent = categories[i].name[l];
      btn.setAttribute('aria-selected', i === active ? 'true' : 'false');
      btn.tabIndex = i === active ? 0 : -1;
    });
    var cat = categories[active];
    titleEl.textContent = cat.name[l];
    subEl.textContent = cat.sub[l];
    var go = l === 'tr' ? 'Haritada aç ↗' : 'Open in Maps ↗';
    placesEl.innerHTML = cat.places.map(function (p, i) {
      return '<li class="place"><a href="' + mapsUrl(p.name) + '" target="_blank" rel="noopener">' +
        '<span class="n">0' + (i + 1) + '</span>' +
        '<span><span class="name">' + p.name + '</span><span class="meta">' + p.meta[l] + '</span></span>' +
        '<span class="go">' + go + '</span></a></li>';
    }).join('');
    if (animate) {
      placesEl.classList.remove('swap');
      void placesEl.offsetWidth;
      placesEl.classList.add('swap');
    }
  }

  function select(i, animate, focus) {
    active = i;
    renderExplorer(animate);
    if (focus) catsEl.querySelectorAll('.cat')[i].focus();
  }

  buildTabs();

  var browser = (navigator.language || 'tr').toLowerCase();
  setLang(storedLang() || (browser.indexOf('tr') === 0 ? 'tr' : 'en'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = lang() === 'tr' ? 'en' : 'tr';
      setLang(next);
      storeLang(next);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
