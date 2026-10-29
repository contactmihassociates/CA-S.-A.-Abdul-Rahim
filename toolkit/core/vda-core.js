/* VDA transfer arithmetic. This subtotal is before surcharge, rebate and other income tax. */
(function (root) {
  'use strict';
  function amount(value, label) {
    if (!['number','string'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1e10)
      throw new Error('Enter a non-negative amount up to ₹10,00,00,00,000 for ' + label + '.');
    return Number(value);
  }
  function date(value, label) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value)
      throw new Error('Enter a valid ' + label + '.');
    return value;
  }
  function verified(year) {
    if (!year || !year.vda || !year.vda.verifiedOn || !Number.isFinite(year.cess)) throw new Error('Verified VDA rules are unavailable for this year.');
  }
  function transfer(input, year) {
    verified(year);
    var cost = amount(input.buyValue,'acquisition cost'), sale = amount(input.sellValue,'sale consideration');
    var fees = amount(input.fees == null ? 0 : input.fees,'transfer fees');
    var gain = sale - cost, taxableGain = Math.max(0,gain);
    var tax = taxableGain * year.vda.rate, cess = tax * year.cess;
    return {cost:cost,sale:sale,fees:fees,gain:gain,taxableGain:taxableGain,loss:Math.max(0,-gain),tax:tax,cess:cess,subtotal:tax+cess,cashAfterSubtotal:sale-fees-tax-cess};
  }
  function calculate(trades, year) {
    verified(year);
    if (!Array.isArray(trades)) throw new Error('Enter a trade ledger.');
    var start = Number(year.fy.slice(0,4)), from = start+'-04-01', to = (start+1)+'-03-31';
    var total = {perTrade:[],excluded:0,selected:0,gains:0,losses:0,tax:0,cess:0,subtotal:0,tds:0};
    trades.forEach(function (input, i) {
      var sellDate = date(input.sellDate,'sale date for trade '+(i+1));
      if (input.buyDate) {
        var buyDate = date(input.buyDate,'purchase date for trade '+(i+1));
        if (buyDate > sellDate) throw new Error('Trade '+(i+1)+': purchase date must not follow sale date.');
      }
      var r = transfer(input,year), tds = amount(input.tdsDeducted == null ? 0 : input.tdsDeducted,'TDS for trade '+(i+1));
      r.inYear = sellDate >= from && sellDate <= to;
      total.perTrade.push(r);
      if (!r.inYear) { total.excluded++; return; }
      total.selected++; total.gains += r.taxableGain; total.losses += r.loss; total.tds += tds;
    });
    // Sum positive income before tax: never round or net profit against losing trades.
    total.tax = total.gains * year.vda.rate;
    total.cess = total.tax * year.cess;
    total.subtotal = total.tax + total.cess;
    total.balance = total.subtotal - total.tds;
    return total;
  }
  var api = {transfer:transfer,calculate:calculate,amount:amount};
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.FinclarVDA = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
