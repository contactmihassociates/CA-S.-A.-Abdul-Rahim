/* Ordinary long-term land/building: pre-exemption tax comparison, not final liability. */
(function(root){
  'use strict';
  const holding=typeof module==='object'&&module.exports?require('./holding-period.js'):root.FinclarHolding;
  const index=typeof module==='object'&&module.exports?require('./indexation-core.js'):root.FinclarIndexation;
  function amount(value,label){
    if(!['number','string'].includes(typeof value)||String(value).trim()===''||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>1e10)
      throw new Error('Enter a non-negative '+label+' up to ₹10,00,00,00,000.');
    return Number(value);
  }
  function calculate(input,year,table){
    const rule=year.propertyTransfer;
    if(!rule?.verifiedOn) throw new Error('Verified property comparison rules are unavailable for this year.');
    const period=holding.calculate({...input,asset:'property'},year);
    if(!period.isLT) throw new Error('This comparison requires a long-term property transfer.');
    if(!['residentIndividualHuf','nonresidentIndividualHuf','other'].includes(input.taxpayer))
      throw new Error('Select the seller’s residence and taxpayer type to check property relief.');
    const cost=amount(input.buyPrice,'purchase cost'),sale=amount(input.sellPrice,'sale value'),fees=amount(input.expenses,'transfer expenses');
    const gain=sale-cost-fees,taxableGain=Math.max(0,gain),baseTax=taxableGain*rule.rate;
    const eligible=input.taxpayer==='residentIndividualHuf'&&input.buyDate<rule.acquiredBefore;
    let indexation=null,indexedTax=null;
    if(eligible){
      const y=Number(input.buyDate.slice(0,4))-(Number(input.buyDate.slice(5,7))<4?1:0);
      indexation=index.calculate(cost,`${y}-${String(y+1).slice(-2)}`,year,table);
      indexedTax=Math.max(0,sale-indexation.indexedCost-fees)*rule.comparisonRate;
    }
    const relief=eligible?Math.max(0,baseTax-indexedTax):0,tax=baseTax-relief,cess=tax*year.cess;
    return {holding:period,gain,taxableGain,baseTax,indexedTax,eligible,relief,tax,cess,subtotal:tax+cess,indexation,rate:rule.rate,comparisonRate:rule.comparisonRate,section:rule.section,
      reason:eligible?'Resident individual/HUF; acquired before 23 July 2024.':input.taxpayer!=='residentIndividualHuf'?'The indexed comparison relief is limited to resident individuals and HUFs.':'Property acquired on or after 23 July 2024 does not qualify for this relief.'};
  }
  const api={calculate};
  if(typeof module==='object'&&module.exports) module.exports=api;else root.FinclarProperty=api;
})(typeof globalThis!=='undefined'?globalThis:this);
