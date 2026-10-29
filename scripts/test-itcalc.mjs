// Independent hand-computed tests for public/js/itcalc-core.js (FY 2025-26 / tax year 2026-27).
// Usage: node scripts/test-itcalc.mjs   (exit code 1 on any failure)
// Reference tables used for the hand working:
//   NEW slab tax cumulative: 8L = 20,000; 12L = 60,000; 16L = 1,20,000; 20L = 2,00,000; 24L = 3,00,000; then 30%.
//   OLD slab tax cumulative (below 60): 5L = 12,500; 10L = 1,12,500; then 30%.
//   Total tax = (tax + surcharge - relief) * 1.04, rounded to nearest 10.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(here, '..', 'public', 'js', 'itcalc-core.js');
const m = { exports: {} };
new Function('module', fs.readFileSync(file, 'utf8'))(m);
const C = m.exports;

const R = { individual: 'individual', resident: 'resident', below60: 'below60' };
const base = { status: 'individual', residency: 'resident', age: 'below60' };
const L = 100000, CR = 10000000;

// Each case: [name, regime, inputs, expected, working]
const cases = [
  ['zero income, new', 'new', {}, { totalTax: 0, totalIncome: 0 },
    'Nothing in, nothing out.'],
  ['zero income, old', 'old', {}, { totalTax: 0, totalIncome: 0 }, 'As above.'],

  ['new: salary 12.75L -> TI 12L, rebate wipes tax', 'new', { salary: 1275000 },
    { totalTax: 0, totalIncome: 1200000, rebate: 60000 },
    'TI = 12,75,000 - 75,000 = 12,00,000. Slab tax 60,000 <= rebate 60,000 -> nil.'],
  ['new: salary 12.76L -> marginal relief', 'new', { salary: 1276000 },
    { totalTax: 1040, totalIncome: 1201000, rebate: 0, rebateRelief: 59150 },
    'TI 12,01,000. Slab tax 60,000 + 15% x 1,000 = 60,150. Limited to TI-12L = 1,000. Cess 40 -> 1,040.'],
  ['new: salary 13L -> marginal relief still binds', 'new', { salary: 1300000 },
    { totalTax: 26000, totalIncome: 1225000, rebateRelief: 38750 },
    'TI 12,25,000. Slab tax 60,000 + 15% x 25,000 = 63,750 > 25,000 excess -> 25,000. Cess 1,000 -> 26,000.'],
  ['new: age 60-80 salary 13L same as individual (new regime ignores age)', 'new', { salary: 1300000, age: '60to80' },
    { totalTax: 26000, totalIncome: 1225000 },
    'New regime exemption is 4L for all ages; same as the previous case.'],
  ['new: salary 15L', 'new', { salary: 1500000 },
    { totalTax: 97500, totalIncome: 1425000, rebate: 0, rebateRelief: 0 },
    'TI 14,25,000. 60,000 + 15% x 2,25,000 = 93,750 (> 2,25,000 excess? no). Cess 3,750 -> 97,500.'],
  ['new: salary 15L + employer NPS 50k', 'new', { salary: 1500000, d80CCD2: 50000, d80C: 150000 },
    { totalTax: 89700, totalIncome: 1375000 },
    '80C ignored in new regime. TI = 15,00,000 - 75,000 - 50,000 = 13,75,000. 60,000 + 15% x 1,75,000 = 86,250. Cess 3,450 -> 89,700.'],
  ['new: salary 25L', 'new', { salary: 2500000 },
    { totalTax: 319800, totalIncome: 2425000 },
    'TI 24,25,000. 3,00,000 + 30% x 25,000 = 3,07,500. Cess 12,300 -> 3,19,800.'],

  ['old: salary 15L, 80C 1.5L, NPS 50k, 80D 25k', 'old',
    { salary: 1500000, d80C: 150000, d80CCD1B: 50000, d80D: 25000 },
    { totalTax: 187200, totalIncome: 1225000, rebate: 0 },
    'TI = 15,00,000 - 50,000 - 1,50,000 - 50,000 - 25,000 = 12,25,000. 1,12,500 + 30% x 2,25,000 = 1,80,000. Cess 7,200 -> 1,87,200.'],
  ['old: 80C capped at 1.5L, 80CCD(1B) capped at 50k', 'old',
    { salary: 1500000, d80C: 300000, d80CCD1B: 200000 },
    { totalTax: 195000, totalIncome: 1250000 },
    'Caps 1.5L + 50k. TI = 15,00,000 - 50,000 - 1,50,000 - 50,000 = 12,50,000. Tax 1,12,500 + 30% x 2,50,000 = 1,87,500; cess 7,500 -> 1,95,000.'],
  ['old: salary 25L with HRA, prof tax, 80C, 80D', 'old',
    { salary: 2500000, salaryExempt: 120000, profTax: 2400, d80C: 150000, d80D: 25000 },
    { totalTax: 476610, totalIncome: 2152600 },
    'TI = 25,00,000 - 1,20,000 - 2,400 - 50,000 - 1,50,000 - 25,000 = 21,52,600. 1,12,500 + 30% x 11,52,600 (=3,45,780) = 4,58,280. x1.04 = 4,76,611.2 -> 4,76,610.'],
  ['old: rounding of TI and tax', 'old', { business: 1234567 },
    { totalTax: 190190, totalIncome: 1234570 },
    'TI rounds to 12,34,570. 1,12,500 + 30% x 2,34,570 (=70,371) = 1,82,871. x1.04 = 1,90,185.84 -> 1,90,190.'],
  ['old: TI exactly 5L -> rebate', 'old', { salary: 550000 },
    { totalTax: 0, totalIncome: 500000, rebate: 12500 },
    'TI 5,00,000. Tax 12,500. Rebate 12,500 -> nil.'],
  ['old: TI 5,00,010 -> no rebate (cliff)', 'old', { business: 500014 },
    { totalTax: 13000, totalIncome: 500010, rebate: 0 },
    'TI rounds to 5,00,010. 12,500 + 20% x 10 = 12,502. x1.04 = 13,002.08 -> 13,000.'],

  ['old: senior 60-80 with pension, 80C and 80TTB', 'old',
    { age: '60to80', salary: 800000, interest: 60000, d80C: 100000 },
    { totalTax: 43680, totalIncome: 660000 },
    'Salary 8,00,000 - 50,000 = 7,50,000 + interest 60,000 = 8,10,000. 80C 1,00,000, 80TTB min(60,000, 50,000) = 50,000. TI 6,60,000. Exemption 3L: 5% x 2L = 10,000 + 20% x 1.6L = 32,000 = 42,000. Cess 1,680 -> 43,680.'],
  ['old: super senior 80+ salary 6.5L, 80C 50k', 'old',
    { age: '80plus', salary: 650000, d80C: 50000 },
    { totalTax: 10400, totalIncome: 550000 },
    'Salary 6,50,000 - 50,000 = 6,00,000 - 50,000 = 5,50,000. Exemption 5L: 20% x 50,000 = 10,000. Cess 400 -> 10,400.'],
  ['old: senior 60-80 TI exactly 5L -> rebate', 'old', { age: '60to80', salary: 550000 },
    { totalTax: 0, totalIncome: 500000, rebate: 10000 },
    'TI 5,00,000. Exemption 3L: 5% x 2L = 10,000. Rebate min(12,500, 10,000) = 10,000 -> nil.'],

  ['HUF new: business 15L, no rebate', 'new', { status: 'huf', business: 1500000 },
    { totalTax: 109200, totalIncome: 1500000, rebate: 0 },
    '60,000 (to 12L) + 15% x 3L = 45,000 -> 1,05,000. Cess 4,200 -> 1,09,200.'],
  ['HUF old: business 8L, 80C, age field ignored', 'old', { status: 'huf', age: '80plus', business: 800000, d80C: 150000 },
    { totalTax: 44200, totalIncome: 650000 },
    'TI 6,50,000. Exemption 2.5L for HUF. 12,500 + 20% x 1.5L = 42,500. Cess 1,700 -> 44,200.'],
  ['HUF old: business 4L, no rebate', 'old', { status: 'huf', business: 400000 },
    { totalTax: 7800, totalIncome: 400000, rebate: 0 },
    '5% x 1.5L = 7,500. Cess 300 -> 7,800. No 87A for HUF.'],

  ['non-resident new: salary 12.75L, no rebate', 'new', { residency: 'nonresident', salary: 1275000 },
    { totalTax: 62400, totalIncome: 1200000, rebate: 0 },
    'TI 12,00,000. Tax 60,000, no rebate. Cess 2,400 -> 62,400.'],
  ['non-resident new: salary 6L', 'new', { residency: 'nonresident', salary: 600000 },
    { totalTax: 6500, totalIncome: 525000, rebate: 0 },
    'TI 5,25,000. 5% x 1,25,000 = 6,250. Cess 250 -> 6,500.'],
  ['non-resident old age 60-80: only 2.5L exemption', 'old', { residency: 'nonresident', age: '60to80', salary: 550000 },
    { totalTax: 13000, totalIncome: 500000, rebate: 0 },
    'TI 5L. Tax 12,500 (2.5L exemption), no rebate. Cess 500 -> 13,000.'],
  ['non-resident old age 60-80: 80TTA not 80TTB', 'old',
    { residency: 'nonresident', age: '60to80', salary: 550000, interest: 60000, savingsInterest: 60000 },
    { totalTax: 23400, totalIncome: 550000 },
    'TI = 5,00,000 + 60,000 - 80TTA 10,000 = 5,50,000. 12,500 + 20% x 50,000 = 22,500. Cess 900 -> 23,400.'],
  ['non-resident: STCG 111A 2L, no basic exemption adjustment', 'new', { residency: 'nonresident', stcg111A: 200000 },
    { totalTax: 41600 },
    '20% x 2,00,000 = 40,000. Cess 1,600 -> 41,600.'],
  ['resident: same STCG 2L is absorbed by unused exemption', 'new', { stcg111A: 200000 },
    { totalTax: 0 }, 'Unused basic exemption 4L covers it entirely.'],
  ['non-resident: LTCG 112 + indexed 20% gains', 'new', { residency: 'nonresident', ltcg112: 400000, ltcg20: 600000 },
    { totalTax: 176800 },
    '12.5% x 4L = 50,000 + 20% x 6L = 1,20,000 = 1,70,000. Cess 6,800 -> 1,76,800.'],

  ['HP let-out loss, new: no set-off', 'new',
    { salary: 1500000, hpRent: 240000, hpInterestLetOut: 300000 },
    { totalTax: 97500, totalIncome: 1425000 },
    'NAV 2,40,000 - 30% = 1,68,000 - interest 3,00,000 = -1,32,000 -> ignored. Same as salary-only 15L: 97,500.'],
  ['HP let-out loss, old: set off', 'old',
    { salary: 1500000, hpRent: 240000, hpInterestLetOut: 300000 },
    { totalTax: 216220, totalIncome: 1318000 },
    'HP = -1,32,000. TI = 14,50,000 - 1,32,000 = 13,18,000. 1,12,500 + 30% x 3,18,000 (=95,400) = 2,07,900. x1.04 = 2,16,216 -> 2,16,220.'],
  ['HP let-out loss, old: capped at 2L', 'old',
    { salary: 1500000, hpRent: 240000, hpInterestLetOut: 500000 },
    { totalTax: 195000, totalIncome: 1250000 },
    'HP = 1,68,000 - 5,00,000 = -3,32,000, capped -2,00,000. TI = 14,50,000 - 2,00,000 = 12,50,000. 1,12,500 + 75,000 = 1,87,500. Cess 7,500 -> 1,95,000.'],
  ['HP self-occupied interest, old: 2L cap', 'old', { salary: 1200000, hpInterestSelf: 250000 },
    { totalTax: 106600, totalIncome: 950000 },
    'HP = -2,00,000. TI = 12,00,000 - 50,000 - 2,00,000 = 9,50,000. 12,500 + 20% x 4.5L = 1,02,500. Cess 4,100 -> 1,06,600.'],
  ['HP self-occupied interest, new: ignored', 'new', { salary: 1400000, hpInterestSelf: 200000 },
    { totalTax: 81900, totalIncome: 1325000 },
    'TI = 14,00,000 - 75,000 = 13,25,000. 60,000 + 15% x 1,25,000 = 78,750. Cess 3,150 -> 81,900.'],
  ['HP let-out income, new, below 12L: rebate covers', 'new', { salary: 1000000, hpRent: 360000, hpMunicipalTax: 10000, hpInterestLetOut: 100000 },
    { totalTax: 0, totalIncome: 1070000, rebate: 47000 },
    'NAV 3,50,000, less 30% (1,05,000), less interest 1,00,000 = 1,45,000. Salary 9,25,000. TI 10,70,000. Tax 20,000 + 10% x 2.7L = 47,000, rebated.'],

  ['family pension, new: 1/3 capped at 25k, marginal relief', 'new', { salary: 1275000, familyPension: 90000 },
    { totalTax: 67600, totalIncome: 1265000 },
    'Family pension 90,000 - 25,000 = 65,000. TI = 12,00,000 + 65,000 = 12,65,000. Tax 60,000 + 15% x 65,000 = 69,750 > excess 65,000 -> 65,000. Cess 2,600 -> 67,600.'],
  ['family pension, old: 1/3 capped at 15k', 'old', { salary: 800000, familyPension: 90000 },
    { totalTax: 80600, totalIncome: 825000 },
    'Family pension 90,000 - 15,000 = 75,000. TI = 7,50,000 + 75,000 = 8,25,000. 12,500 + 20% x 3.25L = 77,500. Cess 3,100 -> 80,600.'],

  ['STCG 111A only, resident new, 1L', 'new', { stcg111A: 100000 }, { totalTax: 0 }, 'Absorbed by 4L unused exemption.'],
  ['STCG 111A only, resident new, 6L', 'new', { stcg111A: 600000 }, { totalTax: 41600, rebate: 0 },
    '(6L - 4L unused exemption) x 20% = 40,000. Normal tax nil so rebate 0. Cess 1,600 -> 41,600.'],
  ['STCG 111A only, resident old, 6L', 'old', { stcg111A: 600000 }, { totalTax: 72800 },
    '(6L - 2.5L) x 20% = 70,000. TI 6L > 5L no rebate. Cess 2,800 -> 72,800.'],
  ['old: deductions not against STCG 111A', 'old', { salary: 100000, d80C: 150000, stcg111A: 800000 },
    { totalTax: 114400, totalIncome: 800000 },
    'Salary 1L - 50k = 50,000 normal, 80C absorbed only to 50,000 -> normal nil. STCG 8L stays. Exemption 2.5L absorbs 2.5L -> 5.5L x 20% = 1,10,000. Cess 4,400 -> 1,14,400.'],
  ['old: 80C against salary, STCG after shortfall', 'old', { salary: 400000, d80C: 150000, stcg111A: 500000 },
    { totalTax: 93600, totalIncome: 700000 },
    'Salary 3.5L - 80C 1.5L = 2L normal. TI = 2L + 5L = 7L. Unused exemption 50k -> STCG taxable 4.5L x 20% = 90,000. Cess 3,600 -> 93,600.'],

  ['LTCG 112A: non-resident 1.25L exactly -> nil', 'new', { residency: 'nonresident', ltcg112A: 125000 },
    { totalTax: 0 }, 'Exempt up to 1.25L.'],
  ['LTCG 112A: non-resident 2.25L', 'new', { residency: 'nonresident', ltcg112A: 225000 },
    { totalTax: 13000 }, '(2.25L - 1.25L) x 12.5% = 12,500. Cess 500 -> 13,000.'],
  ['LTCG 112A: resident new with salary 8.75L, gain 1.25L', 'new', { salary: 875000, ltcg112A: 125000 },
    { totalTax: 0 }, 'Normal 8L: tax 20,000 rebated. 112A nil.'],
  ['LTCG 112A: resident new with salary 8.75L, gain 2.25L', 'new', { salary: 875000, ltcg112A: 225000 },
    { totalTax: 13000, rebate: 20000 },
    'Normal tax 20,000 fully rebated; 112A tax 12,500 NOT rebated. Cess 500 -> 13,000.'],
  ['LTCG 112A: resident, no other income, 6L', 'new', { ltcg112A: 600000 },
    { totalTax: 9750 },
    'Taxable 6L - 1.25L = 4.75L; unused exemption 4L absorbs; 75,000 x 12.5% = 9,375. Cess 375 -> 9,750.'],
  ['LTCG 112A: old rebate does not cover 112A tax', 'old', { salary: 350000, ltcg112A: 175000 },
    { totalTax: 6500 },
    'Normal 3L: 5% x 50,000 = 2,500, rebated (TI <= 5L). 112A (1.75L - 1.25L) x 12.5% = 6,250 not rebated. Cess 250 -> 6,500.'],

  ['new: mixed salary 8.75L + STCG 3L, TI 11L', 'new', { salary: 875000, stcg111A: 300000 },
    { totalTax: 62400, rebate: 20000 },
    'Normal 8L tax 20,000 rebated; STCG 3L x 20% = 60,000 not rebated. Cess 2,400 -> 62,400.'],
  ['new: salary 12.75L + STCG 20k, marginal relief on slab tax', 'new', { salary: 1275000, stcg111A: 20000 },
    { totalTax: 24960, totalIncome: 1220000, rebateRelief: 40000 },
    'TI 12,20,000, excess 20,000. Slab tax 60,000 limited to 20,000 (relief 40,000). STCG 4,000. Total 24,000. Cess 960 -> 24,960.'],
  ['new: salary 12.75L + STCG 1L, TI 13L, no relief', 'new', { salary: 1275000, stcg111A: 100000 },
    { totalTax: 83200, totalIncome: 1300000, rebate: 0, rebateRelief: 0 },
    'Slab tax 60,000 < excess 1,00,000 so no relief. STCG 20,000. Cess 3,200 -> 83,200.'],

  ['lottery with salary, new', 'new', { salary: 500000, lottery: 100000 },
    { totalTax: 31200, totalIncome: 525000, rebate: 1250 },
    'Salary 4.25L: 1,250 rebated. Lottery 30% x 1L = 30,000, no exemption/rebate. Cess 1,200 -> 31,200.'],
  ['lottery alone, old: no basic exemption', 'old', { lottery: 600000 },
    { totalTax: 187200 }, '30% x 6L = 1,80,000 (no exemption, TI > 5L so no 87A). Cess 7,200 -> 1,87,200. (A 2L lottery, TI <= 5L, is deliberately avoided: whether old-regime 87A applies to lottery tax is ambiguous.)'],

  ['agri income > 5k, old', 'old', { business: 600000, agriculture: 200000 },
    { totalTax: 65000, totalIncome: 600000 },
    'Tax on 8L = 12,500 + 60,000 = 72,500; tax on (2L + 2.5L) = 5% x 2L = 10,000. Net 62,500. Cess 2,500 -> 65,000.'],
  ['agri income > 5k, new', 'new', { business: 1400000, agriculture: 200000 },
    { totalTax: 114400, totalIncome: 1400000 },
    'Tax on 16L = 1,20,000; tax on (2L + 4L) = 5% x 2L = 10,000. Net 1,10,000. Cess 4,400 -> 1,14,400.'],
  ['agri income <= 5k ignored, old', 'old', { business: 800000, agriculture: 5000 },
    { totalTax: 75400 }, 'Tax on 8L = 72,500. Cess 2,900 -> 75,400.'],

  ['surcharge: TI exactly 50L has none (new)', 'new', { business: 5000000 },
    { totalTax: 1123200, surchargeRelief: 0 },
    '3,00,000 + 30% x 26L = 10,80,000. Cess 43,200 -> 11,23,200.'],
  ['surcharge 50.5L new, marginal relief', 'new', { business: 5050000 },
    { totalTax: 1175200, surchargeRelief: 74500 },
    'Tax 10,95,000; surcharge 10% = 1,09,500. Tax at 50L = 10,80,000, excess 50,000 -> cap 11,30,000. Relief 12,04,500 - 11,30,000 = 74,500. Cess 45,200 -> 11,75,200.'],
  ['surcharge 50.5L old, marginal relief', 'old', { business: 5050000 },
    { totalTax: 1417000, surchargeRelief: 97750 },
    'Tax 1,12,500 + 12,15,000 = 13,27,500; surcharge 1,32,750 -> 14,60,250. Tax at 50L 13,12,500 + 50,000 = 13,62,500. Relief 97,750. Cess 54,500 -> 14,17,000.'],
  ['surcharge 1.01Cr new, marginal relief', 'new', { business: 10100000 },
    { totalTax: 3055520, surchargeRelief: 63500 },
    'Tax 3,00,000 + 30% x 77L = 26,10,000; 15% = 3,91,500 -> 30,01,500. At 1Cr: 25,80,000 x 1.10 = 28,38,000 + 1,00,000 = 29,38,000. Relief 63,500. Cess 1,17,520 -> 30,55,520.'],
  ['surcharge 1.01Cr old, marginal relief', 'old', { business: 10100000 },
    { totalTax: 3321500, surchargeRelief: 75125 },
    'Tax 1,12,500 + 27,30,000 = 28,42,500; 15% = 4,26,375 -> 32,68,875. At 1Cr: 28,12,500 x 1.10 = 30,93,750 + 1,00,000 = 31,93,750. Relief 75,125. Cess 1,27,750 -> 33,21,500.'],
  ['surcharge 2.02Cr new, marginal relief', 'new', { business: 20200000 },
    { totalTax: 6881680, surchargeRelief: 433000 },
    'Tax 3,00,000 + 30% x 1.78Cr = 56,40,000; 25% = 14,10,000 -> 70,50,000. At 2Cr: 55,80,000 x 1.15 = 64,17,000 + 2,00,000 = 66,17,000. Relief 4,33,000. Cess 2,64,680 -> 68,81,680.'],
  ['surcharge 2.02Cr old, marginal relief', 'old', { business: 20200000 },
    { totalTax: 7159750, surchargeRelief: 456250 },
    'Tax 1,12,500 + 57,60,000 = 58,72,500; 25% -> 73,40,625. At 2Cr: 58,12,500 x 1.15 = 66,84,375 + 2,00,000 = 68,84,375. Relief 4,56,250. Cess 2,75,375 -> 71,59,750.'],
  ['surcharge 5.1Cr new: capped at 25%, no relief needed', 'new', { business: 51000000 },
    { totalTax: 19344000, surchargeRelief: 0 },
    'Tax 3,00,000 + 30% x 4.86Cr = 1,48,80,000; 25% = 37,20,000 -> 1,86,00,000. At 5Cr: 1,45,80,000 x 1.25 = 1,82,25,000 + 10,00,000 = 1,92,25,000 > actual -> no relief. Cess 7,44,000 -> 1,93,44,000.'],
  ['surcharge 5.1Cr old: 37%, marginal relief', 'old', { business: 51000000 },
    { totalTax: 20296250, surchargeRelief: 1188500 },
    'Tax 1,12,500 + 30% x 5Cr = 1,50,00,000 -> 1,51,12,500; 37% = 55,91,625 -> 2,07,04,125. At 5Cr: 1,48,12,500 x 1.25 = 1,85,15,625 + 10,00,000 = 1,95,15,625. Relief 11,88,500. Cess 7,80,625 -> 2,02,96,250.'],

  ['capital gains > 2Cr: 15% cap on special-rate tax (new)', 'new', { business: 10000000, stcg111A: 15000000 },
    { totalTax: 6942000, surchargeRelief: 0 },
    'Normal 1Cr: 25,80,000. STCG 20% x 1.5Cr = 30,00,000. Surcharge 25% x 25,80,000 = 6,45,000 + 15% x 30,00,000 = 4,50,000 = 10,95,000. Sum 66,75,000; relief test: at 2Cr 40,80,000+30,00,000... = 46,92,000 + 50,00,000 > actual -> none. Cess 2,67,000 -> 69,42,000.'],
  ['capital gains just above 2Cr: relief with 15% cap (new)', 'new', { business: 5000000, ltcg112: 15100000 },
    { totalTax: 3617250, surchargeRelief: 42500 },
    'Normal 50L tax 10,80,000; LTCG 12.5% x 1.51Cr = 18,87,500. Surcharge 25% x 10,80,000 = 2,70,000 + 15% x 18,87,500 = 2,83,125. Total 35,20,625. At 2Cr (normal 49L): 10,50,000 + 18,87,500 = 29,37,500 x 1.15 = 33,78,125 + 1,00,000 = 34,78,125. Relief 42,500. Cess 1,39,125 -> 36,17,250.'],

  ['TDS and advance tax exceed liability -> refund', 'new', { salary: 1275000, tds: 85000 },
    { totalTax: 0, balance: -85000 }, 'Tax nil, TDS 85,000 -> balance -85,000 (refund).'],
  ['TDS + advance tax partly cover liability', 'new', { salary: 1500000, tds: 80000, advanceTax: 10000 },
    { totalTax: 97500, balance: 7500 }, 'Tax 97,500 - 90,000 paid = 7,500 payable.'],
];

let pass = 0, fail = 0;
const failures = [];
for (const [name, regime, inputs, exp, working] of cases) {
  const r = C.compute({ ...base, ...inputs }, regime);
  const bad = [];
  for (const k of Object.keys(exp)) {
    if (Math.abs((r[k] ?? NaN) - exp[k]) > 0.5) bad.push(k + ': expected ' + exp[k] + ' got ' + r[k]);
  }
  if (bad.length) {
    fail++; failures.push(name);
    console.log('FAIL  ' + name + '\n        ' + bad.join('\n        ') + '\n        working: ' + working);
  } else {
    pass++;
    console.log('PASS  ' + name + '  (totalTax ' + r.totalTax + ')');
  }
}
console.log('\n' + cases.length + ' cases, ' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('Failed: ' + failures.join('; ')); process.exit(1); }
