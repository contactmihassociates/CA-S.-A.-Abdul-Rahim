/* One-page income tax calculator: reads the form, runs ITCalc for both regimes and draws the statement. */
(function () {
  var form = document.getElementById('itc-form');
  if (!form || !window.ITCalc) return;
  var rows = document.getElementById('itc-rows');
  var KEY = 'itc-inputs';
  var fmt = function (v) { return (v < 0 ? '-' : '') + Math.round(Math.abs(v)).toLocaleString('en-IN'); };
  var num = function (s) { return Number(String(s).replace(/[^\d.]/g, '')) || 0; };

  function read() {
    var p = {};
    form.querySelectorAll('[data-k]').forEach(function (el) { p[el.getAttribute('data-k')] = el.tagName === 'SELECT' ? el.value : num(el.value); });
    return p;
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function render() {
    var p = read();
    var r = window.ITCalc.compare(p), o = r.old, w = r.new;
    var out = [];
    var line = function (label, a, b, cls) {
      if (a === null && b === null) return;
      out.push('<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + esc(label) + '</td><td>' + (a === null ? '' : fmt(a)) + '</td><td>' + (b === null ? '' : fmt(b)) + '</td></tr>');
    };
    var head = function (label) { out.push('<tr class="itc-head"><th colspan="3" scope="colgroup">' + esc(label) + '</th></tr>'); };
    var both = function (label, f, cls, always) { var a = f(o), b = f(w); if (always || a || b) line(label, a, b, cls); };

    head('Income');
    if (o.heads.salaryGross) {
      line('Gross salary', o.heads.salaryGross, w.heads.salaryGross);
      if (p.salaryExempt) line('Less: exempt allowances', -p.salaryExempt, 0);
      line('Less: standard deduction', -o.heads.standardDeduction, -w.heads.standardDeduction);
      if (p.profTax) line('Less: professional tax', -p.profTax, 0);
      line('Income from salary', o.heads.salary, w.heads.salary, 'itc-sub');
    }
    both('Income from house property', function (x) { return x.heads.houseProperty; });
    both('Profits and gains of business or profession', function (x) { return x.heads.business; });
    both('Short-term capital gains (slab rates)', function (x) { return x.heads.stcgSlab; });
    both('Short-term capital gains on listed equity (20%)', function (x) { return x.heads.stcg111A; });
    both('Long-term capital gains on listed equity (12.5%)', function (x) { return x.heads.ltcg112A; });
    both('Other long-term capital gains (12.5%)', function (x) { return x.heads.ltcg112; });
    both('Long-term capital gains with indexation (20%)', function (x) { return x.heads.ltcg20; });
    both('Income from other sources', function (x) { return x.heads.otherSources; });
    both('Winnings from lottery and games (30%)', function (x) { return x.heads.lottery; });
    line('Gross total income', o.grossTotalIncome, w.grossTotalIncome, 'itc-sub');

    head('Deductions under Chapter VI-A');
    var labels = {};
    o.deductions.list.concat(w.deductions.list).forEach(function (d) { labels[d[0]] = 1; });
    Object.keys(labels).forEach(function (l) {
      var f = function (x) { var d = x.deductions.list.filter(function (i) { return i[0] === l; })[0]; return d ? -d[1] : 0; };
      line(l, f(o), f(w));
    });
    if (o.deductionsAllowed !== o.deductions.total || w.deductionsAllowed !== w.deductions.total) line('Deductions allowed (not against special-rate income)', -o.deductionsAllowed, -w.deductionsAllowed);
    line('Total deductions', -o.deductionsAllowed, -w.deductionsAllowed, 'itc-sub');
    line('Total income (rounded to Rs 10)', o.totalIncome, w.totalIncome, 'itc-total');
    if (o.agriculture) line('Agricultural income (for rate purposes)', o.agriculture, w.agriculture);

    head('Tax');
    line('Tax at slab rates on Rs ' + fmt(o.normalIncome) + ' / Rs ' + fmt(w.normalIncome), o.normalTax, w.normalTax);
    both('Tax on short-term equity gains and indexed gains at 20%', function (x) { return x.tax111Aand20; });
    both('Tax on other long-term gains at 12.5%', function (x) { return x.tax112; });
    if (o.heads.ltcg112A) line('Tax on listed equity long-term gains at 12.5% (after Rs ' + fmt(o.exempt112A) + ' exemption)', o.tax112A, w.tax112A);
    both('Tax on winnings at 30%', function (x) { return x.taxLottery; });
    line('Tax before rebate', o.baseTax, w.baseTax, 'itc-sub');
    both('Less: rebate under section 87A', function (x) { return -x.rebate; });
    both('Less: marginal relief on rebate', function (x) { return -x.rebateRelief; });
    both('Add: surcharge', function (x) { return x.surcharge; });
    both('Less: marginal relief on surcharge', function (x) { return -x.surchargeRelief; });
    line('Add: health and education cess at 4%', o.cess, w.cess);
    line('Total tax liability (rounded to Rs 10)', o.totalTax, w.totalTax, 'itc-total');
    if (o.taxesPaid) {
      line('Less: TDS, TCS and taxes paid', -o.taxesPaid, -w.taxesPaid);
      line(o.balance >= 0 || w.balance >= 0 ? 'Tax payable / (refund)' : 'Refund due', o.balance, w.balance, 'itc-total');
    }
    rows.innerHTML = out.join('');

    document.getElementById('itc-old').textContent = 'Rs ' + fmt(o.totalTax);
    document.getElementById('itc-new').textContent = 'Rs ' + fmt(w.totalTax);
    var sub = function (x) { return 'Total income Rs ' + fmt(x.totalIncome) + (x.taxesPaid ? ' · ' + (x.balance >= 0 ? 'payable Rs ' + fmt(x.balance) : 'refund Rs ' + fmt(-x.balance)) : ''); };
    document.getElementById('itc-old-sub').textContent = sub(o);
    document.getElementById('itc-new-sub').textContent = sub(w);
    var v = document.getElementById('itc-verdict');
    document.querySelectorAll('[data-regime]').forEach(function (el) { el.classList.remove('lower'); });
    if (!o.grossTotalIncome && !w.grossTotalIncome) v.textContent = 'Enter your income to compare the two regimes.';
    else if (o.totalTax === w.totalTax) v.textContent = 'Both regimes give the same tax for these figures.';
    else {
      var low = o.totalTax < w.totalTax ? 'old' : 'new';
      document.querySelector('[data-regime="' + low + '"]').classList.add('lower');
      v.textContent = 'The ' + low + ' regime is lower by Rs ' + fmt(Math.abs(o.totalTax - w.totalTax)) + ' for these figures.';
    }
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) form.querySelectorAll('[data-k]').forEach(function (el) { var v = saved[el.getAttribute('data-k')]; if (v) el.value = el.tagName === 'SELECT' ? v : Number(v).toLocaleString('en-IN'); });
  } catch (e) {}

  form.addEventListener('input', function (e) {
    var el = e.target;
    if (el.tagName === 'INPUT') {
      var digits = el.value.replace(/[^\d]/g, '');
      el.value = digits ? Number(digits).toLocaleString('en-IN') : '';
    }
    render();
  });
  form.addEventListener('change', render);
  form.addEventListener('reset', function () { setTimeout(render, 0); });
  document.getElementById('itc-print').addEventListener('click', function () { window.print(); });
  render();
})();
