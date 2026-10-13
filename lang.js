(function () {
  var root = document.documentElement;
  var button = document.getElementById('langToggle');

  function read() {
    try { return localStorage.getItem('sternas-lang'); } catch (e) { return null; }
  }

  function save(lang) {
    try { localStorage.setItem('sternas-lang', lang); } catch (e) { /* ignore */ }
  }

  function apply(lang) {
    root.setAttribute('lang', lang);
    if (button) button.textContent = lang === 'tr' ? 'EN' : 'TR';
  }

  var stored = read();
  var browser = (navigator.language || 'tr').toLowerCase();
  apply(stored || (browser.indexOf('tr') === 0 ? 'tr' : 'en'));

  if (button) {
    button.addEventListener('click', function () {
      var next = root.getAttribute('lang') === 'tr' ? 'en' : 'tr';
      apply(next);
      save(next);
    });
  }
})();
