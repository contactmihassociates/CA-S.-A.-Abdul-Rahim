/* Calendar holding periods for ordinary acquisitions. No tax-rate arithmetic. */
(function(root){
  'use strict';
  const DAY=86400000;
  function parse(value,label){
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number(value.slice(0,4))<1000||Number(value.slice(0,4))>9998||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)
      throw new Error('Enter a valid '+label+'.');
    return new Date(value+'T00:00:00Z');
  }
  function calculate(input,year){
    const buy=parse(input.buyDate,'purchase date'),sell=parse(input.sellDate,'sale date');
    if(sell<buy) throw new Error('Sale date must be on or after the purchase date.');
    const start=Number(year?.fy?.slice(0,4));
    if(!Number.isInteger(start)) throw new Error('Select a supported financial year or tax year.');
    if(sell<Date.UTC(start,3,1)||sell>=Date.UTC(start+1,3,1))
      throw new Error('Sale date falls outside '+year.fy+'. Select the year containing the sale date or correct the date.');
    const rules=year.holdingPeriod;
    const months=rules?.months?.[input.asset];
    if(!rules?.verifiedOn||!Number.isInteger(months)||months<=0) throw new Error('Verified holding-period rules are unavailable for this asset/year.');
    const targetMonth=buy.getUTCMonth()+months;
    const lastDay=new Date(Date.UTC(buy.getUTCFullYear(),targetMonth+1,0)).getUTCDate();
    const anniversary=new Date(Date.UTC(buy.getUTCFullYear(),targetMonth,Math.min(buy.getUTCDate(),lastDay)));
    const firstLongTerm=new Date(anniversary.getTime()+DAY);
    const days=(sell-buy)/DAY,thresholdDays=(anniversary-buy)/DAY;
    return {isLT:sell>anniversary,days,months,buyDate:input.buyDate,sellDate:input.sellDate,anniversary:anniversary.toISOString().slice(0,10),firstLongTerm:firstLongTerm.toISOString().slice(0,10),thresholdDays,section:rules.section};
  }
  const api={calculate};
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.FinclarHolding=api;
})(typeof globalThis!=='undefined'?globalThis:this);
