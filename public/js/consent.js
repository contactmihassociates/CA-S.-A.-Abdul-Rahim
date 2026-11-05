// Cookie consent for Google Analytics 4. Nothing from Google loads until the visitor accepts.
(function () {
  var KEY = 'ca-analytics-consent';
  var id = document.documentElement.getAttribute('data-ga-id');
  if (!id) return;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }

  var bar = document.getElementById('consent');
  function show() { if (bar) bar.hidden = false; }
  function hide() { if (bar) bar.hidden = true; }

  var choice = get();
  if (choice === 'granted') loadGA();
  else if (choice !== 'denied') show();

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-consent]');
    if (!t) return;
    var v = t.getAttribute('data-consent');
    if (v === 'accept') { set('granted'); hide(); loadGA(); }
    else if (v === 'decline') { set('denied'); hide(); }
    else if (v === 'open') { e.preventDefault(); show(); }
  });
})();
