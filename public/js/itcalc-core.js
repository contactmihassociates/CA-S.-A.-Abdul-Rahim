/* Income tax computation for individuals and HUFs, old and new regime.
   Rates: FY 2025-26 (AY 2026-27) under the Income-tax Act, 1961 and tax year 2026-27 under the
   Income-tax Act, 2025, which kept the same slabs, rebate, surcharge and capital gains rates.
   Pure functions; used by /tools/income-tax-calculator/ and by scripts/test-itcalc.mjs. */
(function (root) {
  'use strict';
  var n = function (v) { v = Number(v); return isFinite(v) && v > 0 ? v : 0; };
  var round10 = function (v) { return Math.round(v / 10) * 10; };

  var SLABS = {
    new: [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]],
    old: [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]],
  };
  function exemptionLimit(regime, p) {
    if (regime === 'new') return 400000;
    if (p.status === 'individual' && p.residency === 'resident') {
      if (p.age === '80plus') return 500000;
      if (p.age === '60to80') return 300000;
    }
    return 250000;
  }
  function slabTax(income, regime, p) {
    var slabs = SLABS[regime].slice();
    if (regime === 'old') { var ex = exemptionLimit('old', p); slabs[0] = [ex, 0]; if (ex >= 500000) slabs.splice(1, 1); }
    var tax = 0, prev = 0;
    for (var i = 0; i < slabs.length; i++) {
      var top = slabs[i][0], rate = slabs[i][1];
      if (income > prev) tax += (Math.min(income, top) - prev) * rate;
      prev = top;
    }
    return tax;
  }
  function surchargeRate(ti, regime) {
    if (ti > 50000000) return regime === 'new' ? 0.25 : 0.37;
    if (ti > 20000000) return 0.25;
    if (ti > 10000000) return 0.15;
    if (ti > 5000000) return 0.10;
    return 0;
  }
  var THRESHOLDS = [5000000, 10000000, 20000000, 50000000];

  // Income under each head for one regime.
  function heads(p, regime) {
    var ind = p.status === 'individual';
    var gross = n(p.salary);
    var std = ind && gross > 0 ? Math.min(gross, regime === 'new' ? 75000 : 50000) : 0;
    var salary = Math.max(0, gross - (regime === 'old' ? n(p.salaryExempt) + n(p.profTax) : 0) - std);

    var nav = Math.max(0, n(p.hpRent) - n(p.hpMunicipalTax));
    var letOut = nav - 0.3 * nav - n(p.hpInterestLetOut);
    var hp;
    if (regime === 'old') hp = Math.max(-200000, letOut - Math.min(n(p.hpInterestSelf), 200000));
    else hp = Math.max(0, letOut); // new regime: no self-occupied interest, no set-off of house property loss
    var dividend = n(p.dividend), interest = n(p.interest);
    var other = interest + dividend + n(p.otherIncome) + n(p.familyPension) - Math.min(n(p.familyPension) / 3, regime === 'new' ? 25000 : 15000);
    return {
      salaryGross: gross, standardDeduction: std, salary: salary,
      houseProperty: hp, business: n(p.business), stcgSlab: n(p.stcgOther), otherSources: other,
      stcg111A: n(p.stcg111A), ltcg112A: n(p.ltcg112A), ltcg112: n(p.ltcg112), ltcg20: n(p.ltcg20), lottery: n(p.lottery),
    };
  }

  function deductions(p, regime, h) {
    var d = { list: [], total: 0 };
    var add = function (label, v) { v = Math.round(v); if (v > 0) { d.list.push([label, v]); d.total += v; } };
    if (regime === 'old') {
      add('80C, 80CCC, 80CCD(1) (limit Rs 1,50,000)', Math.min(n(p.d80C), 150000));
      add('80CCD(1B) NPS (limit Rs 50,000)', Math.min(n(p.d80CCD1B), 50000));
      add('80D health insurance', n(p.d80D));
      var senior = p.status === 'individual' && p.residency === 'resident' && p.age !== 'below60';
      if (senior) add('80TTB interest (limit Rs 50,000)', Math.min(n(p.interest), 50000));
      else add('80TTA savings interest (limit Rs 10,000)', Math.min(n(p.savingsInterest), n(p.interest), 10000));
      add('80G donations', n(p.d80G));
      add('80E education loan interest', n(p.d80E));
      add('Other Chapter VI-A deductions', n(p.dOther));
    }
    add('80CCD(2) employer NPS contribution', n(p.d80CCD2));
    return d;
  }

  // Tax on a given split of total income. special: { r20, r125, ltcg112A, lottery }
  function taxOn(normal, special, agri, regime, p) {
    var ex = exemptionLimit(regime, p);
    var resident = p.residency === 'resident';
    var s = { r20: special.r20, r125: special.r125, a112A: Math.max(0, special.ltcg112A - 125000), lottery: special.lottery };
    var exempt112A = Math.min(special.ltcg112A, 125000);
    // Unused basic exemption is set off against special-rate capital gains (residents only).
    var shortfall = resident ? Math.max(0, ex - normal) : 0;
    ['r20', 'r125', 'a112A'].forEach(function (k) { var u = Math.min(shortfall, s[k]); s[k] -= u; shortfall -= u; });
    var normalTax = slabTax(normal, regime, p);
    if (agri > 5000 && normal > ex) normalTax = slabTax(normal + agri, regime, p) - slabTax(agri + ex, regime, p);
    return {
      normalTax: Math.max(0, normalTax),
      tax111Aand20: (s.r20) * 0.20,
      tax125: s.r125 * 0.125,
      tax112A: s.a112A * 0.125,
      taxLottery: s.lottery * 0.30,
      exempt112A: exempt112A,
    };
  }

  function compute(p, regime) {
    var h = heads(p, regime);
    var normalGross = h.salary + h.houseProperty + h.business + h.stcgSlab + h.otherSources;
    var special = { r20: h.stcg111A + h.ltcg20, r125: h.ltcg112, ltcg112A: h.ltcg112A, lottery: h.lottery };
    // A loss in the normal pool (house property) is set off against capital gains.
    if (normalGross < 0) {
      var loss = -normalGross; normalGross = 0;
      ['r20', 'r125', 'ltcg112A'].forEach(function (k) { var u = Math.min(loss, special[k]); special[k] -= u; loss -= u; });
    }
    var gti = normalGross + special.r20 + special.r125 + special.ltcg112A + special.lottery;
    var ded = deductions(p, regime, h);
    var dedAllowed = Math.min(ded.total, normalGross); // Chapter VI-A is not allowed against special-rate income
    var ti = round10(gti - dedAllowed);
    var normal = Math.max(0, ti - (special.r20 + special.r125 + special.ltcg112A + special.lottery));
    var agri = n(p.agriculture);

    var t = taxOn(normal, special, agri, regime, p);
    var specialTax = t.tax111Aand20 + t.tax125 + t.tax112A;
    var baseTax = t.normalTax + specialTax + t.taxLottery;

    // Rebate u/s 87A (section 156 of the 2025 Act): resident individuals only.
    var rebate = 0, rebateRelief = 0;
    if (p.status === 'individual' && p.residency === 'resident') {
      if (regime === 'new') {
        if (ti <= 1200000) rebate = Math.min(60000, t.normalTax);
        else rebateRelief = Math.max(0, t.normalTax - (ti - 1200000)); // marginal relief just above Rs 12 lakh
      } else if (ti <= 500000) {
        rebate = Math.min(12500, baseTax - t.tax112A);
      }
    }
    var taxAfterRebate = Math.max(0, baseTax - rebate - rebateRelief);

    // Surcharge: capped at 15% on capital gains taxed at special rates; marginal relief at each threshold.
    var rate = surchargeRate(ti, regime);
    var surOn = function (r, normalPart, specialPart) { return normalPart * r + specialPart * Math.min(r, 0.15); };
    var surcharge = surOn(rate, Math.max(0, taxAfterRebate - specialTax), Math.min(specialTax, taxAfterRebate));
    var surchargeRelief = 0;
    if (rate > 0) {
      var threshold = 0;
      THRESHOLDS.forEach(function (x) { if (ti > x) threshold = x; });
      var excess = ti - threshold;
      var cut = Math.min(excess, normal);
      var sp2 = { r20: special.r20, r125: special.r125, ltcg112A: special.ltcg112A, lottery: special.lottery };
      var left = excess - cut;
      ['r20', 'r125', 'ltcg112A', 'lottery'].forEach(function (k) { var u = Math.min(left, sp2[k]); sp2[k] -= u; left -= u; });
      var tT = taxOn(normal - cut, sp2, agri, regime, p);
      var specialT = tT.tax111Aand20 + tT.tax125 + tT.tax112A;
      var baseT = tT.normalTax + specialT + tT.taxLottery;
      var rT = surchargeRate(threshold, regime);
      var atThreshold = baseT + surOn(rT, baseT - specialT, specialT);
      surchargeRelief = Math.max(0, Math.min(surcharge, taxAfterRebate + surcharge - (atThreshold + excess)));
    }
    var beforeCess = taxAfterRebate + surcharge - surchargeRelief;
    var cess = beforeCess * 0.04;
    var total = round10(beforeCess + cess);
    var paid = n(p.tds) + n(p.advanceTax);
    return {
      regime: regime, heads: h, grossTotalIncome: gti, deductions: ded, deductionsAllowed: dedAllowed, totalIncome: ti,
      normalIncome: normal, special: special, agriculture: agri, exemptionLimit: exemptionLimit(regime, p),
      normalTax: t.normalTax, tax111Aand20: t.tax111Aand20, tax112: t.tax125, tax112A: t.tax112A, exempt112A: t.exempt112A, taxLottery: t.taxLottery,
      baseTax: baseTax, rebate: rebate, rebateRelief: rebateRelief, surchargeRate: rate, surcharge: surcharge, surchargeRelief: surchargeRelief,
      cess: cess, totalTax: total, taxesPaid: paid, balance: total - paid,
    };
  }

  var api = { compute: compute, slabTax: slabTax, compare: function (p) { return { old: compute(p, 'old'), new: compute(p, 'new') }; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ITCalc = api;
})(this);
