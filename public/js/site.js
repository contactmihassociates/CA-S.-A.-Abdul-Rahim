(function () {
  // Office status in Chennai time: Monday to Saturday, 8 am to 8 pm.
  var status = document.querySelector('[data-open-status]');
  if (status) {
    var now = new Date(Date.now() + (330 + new Date().getTimezoneOffset()) * 60000);
    var day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var open = day !== 0 && mins >= 480 && mins < 1200;
    status.textContent = open ? 'Open now' : 'Closed now';
    status.classList.add(open ? 'open' : 'closed');
  }

  // Calculator search on /tools/.
  var q = document.getElementById('tool-q');
  if (q) {
    var items = [].slice.call(document.querySelectorAll('[data-tool]'));
    var cats = [].slice.call(document.querySelectorAll('.tool-cat'));
    var count = document.getElementById('tool-count');
    var empty = document.getElementById('tool-empty');
    var filter = function () {
      var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      items.forEach(function (el) {
        var text = el.getAttribute('data-tool');
        var hit = words.every(function (w) { return text.indexOf(w) !== -1; });
        el.hidden = !hit; if (hit) shown++;
      });
      cats.forEach(function (c) { c.hidden = !c.querySelector('[data-tool]:not([hidden])'); });
      count.textContent = shown + (shown === 1 ? ' calculator' : ' calculators');
      empty.hidden = shown !== 0;
    };
    q.addEventListener('input', filter);
    if (q.value) filter();
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
