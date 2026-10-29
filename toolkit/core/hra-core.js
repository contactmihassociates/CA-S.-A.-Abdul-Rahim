/* Shared deterministic HRA arithmetic. Rates and city lists live in tax-rules.json. */
(function (root) {
  'use strict';
  function calculate(input, rules) {
    if (!rules || !rules.verifiedOn) throw new Error('HRA rules have not been verified for this year.');
    const values = {};
    for (const key of ['basic', 'da', 'commission', 'hra', 'rent', 'months']) {
      const value = input[key];
      if (!['number', 'string'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1e10)
        throw new Error('Enter a valid non-negative amount for ' + key + '.');
      values[key] = Number(value);
    }
    if (!Number.isInteger(values.months) || values.months < 1 || values.months > 12)
      throw new Error('Months must be a whole number from 1 to 12.');
    if (!input.city || !rules.cities.includes(input.city)) throw new Error('Choose the city of the rented home.');
    const salary = (values.basic + values.da + values.commission) * values.months;
    const received = values.hra * values.months;
    const rent = values.rent * values.months;
    const rate = rules.metroCities.includes(input.city) ? rules.metroRate : rules.otherRate;
    const rentLimit = Math.max(0, rent - salary * rules.rentSalaryFraction);
    const salaryLimit = salary * rate;
    const exempt = input.rented === false ? 0 : Math.max(0, Math.min(received, rentLimit, salaryLimit));
    return { salary, received, rent, rate, rentLimit, salaryLimit, exempt,
      taxable: received - exempt, newExempt: 0, newTaxable: received };
  }
  // Hold the inputs constant so this compares rules, not a person's past returns.
  function compareYears(input, config) {
    return [...config.order].reverse().filter(key => config.years[key].hra).map(key => {
      const year = config.years[key];
      return {key, label: year.kind === 'AY' ? `FY ${year.fy} (${year.label})` : `Tax Year ${year.fy}`,
        ...calculate(input, year.hra)};
    });
  }
  if (typeof module === 'object' && module.exports) module.exports = { calculate, compareYears };
  else root.FinclarHRA = { calculate, compareYears };
})(typeof globalThis !== 'undefined' ? globalThis : this);
