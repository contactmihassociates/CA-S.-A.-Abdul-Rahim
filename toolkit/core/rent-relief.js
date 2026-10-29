/* Deterministic rent deduction for individuals; amounts are period totals. */
(function (root) {
  'use strict';
  function calculate(input, rules) {
    if (!rules || !rules.verifiedOn) throw Error('Verified rent rules are required.');
    const values = {};
    for (const name of ['income', 'rent', 'months']) {
      const value = input[name];
      if (!['number', 'string'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1e10)
        throw Error('Enter a valid non-negative value for ' + name + '.');
      values[name] = Number(value);
    }
    if (!Number.isInteger(values.months) || values.months < 1 || values.months > 12) throw Error('Enter whole rental months from 1 to 12.');
    const checks = ['rented', 'noHra', 'noLocalProperty', 'noOtherSelfOccupied'];
    for (const key of checks) if (!['yes', 'no', ''].includes(input[key])) throw Error('Choose a valid eligibility answer.');
    const limits = [rules.monthlyCap * values.months, values.income * rules.incomeFraction,
      Math.max(0, values.rent - values.income * rules.rentIncomeFraction)];
    const failed = checks.filter(key => input[key] === 'no');
    const unanswered = checks.filter(key => input[key] === '');
    const status = failed.length ? 'ineligible' : unanswered.length ? 'incomplete' : 'estimate';
    return {status, failed, unanswered, limits, deduction: status === 'estimate' ? Math.min(...limits) : status === 'ineligible' ? 0 : null,
      newDeduction: 0, months: values.months};
  }
  if (typeof module === 'object' && module.exports) module.exports = {calculate};
  else root.FinclarRent = {calculate};
})(typeof globalThis !== 'undefined' ? globalThis : this);
