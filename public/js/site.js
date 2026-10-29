// ICAI disclaimer: shown once per browser, content stays in the HTML.
(function () {
  var KEY = 'icai-disclaimer-accepted';
  var dlg = document.getElementById('disclaimer');
  var accepted = false;
  try { accepted = localStorage.getItem(KEY) === 'yes'; } catch (e) {}
  if (dlg && !accepted && typeof dlg.showModal === 'function') {
    dlg.showModal();
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); });
    document.getElementById('disclaimer-agree').addEventListener('click', function () {
      try { localStorage.setItem(KEY, 'yes'); } catch (e) {}
      dlg.close();
    });
    document.getElementById('disclaimer-exit').addEventListener('click', function () {
      if (history.length > 1 && document.referrer) { history.back(); }
      else { location.href = 'https://www.google.com/'; }
    });
  }

  // Click events for GA4, sent only if a GA4 tag is installed later.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || typeof window.gtag !== 'function') return;
    var h = a.getAttribute('href');
    if (h.indexOf('tel:') === 0) window.gtag('event', 'click_call', { link_url: h });
    else if (h.indexOf('https://wa.me/') === 0) window.gtag('event', 'click_whatsapp');
    else if (a.hasAttribute('data-directions')) window.gtag('event', 'click_directions');
  });
})();
