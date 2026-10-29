/* Indexed-cost arithmetic only. Eligibility and tax rates are separate. */
(function(root){
  'use strict';
  function fyStart(fy){
    if(typeof fy!=='string'||!/^\d{4}-\d{2}$/.test(fy)) throw new Error('Enter a valid financial year.');
    const y=Number(fy.slice(0,4));
    if(y<1000||fy.slice(-2)!==String(y+1).slice(-2)) throw new Error('Enter a valid financial year.');
    return y;
  }
  function calculate(cost,purchaseFY,year,table){
    if(!['number','string'].includes(typeof cost)||String(cost).trim()===''||!Number.isFinite(Number(cost))||Number(cost)<0||Number(cost)>1e10)
      throw new Error('Enter a non-negative purchase cost up to ₹10,00,00,00,000.');
    const purchaseStart=fyStart(purchaseFY),transferStart=fyStart(year?.fy);
    if(purchaseStart>transferStart) throw new Error('Purchase year must not follow the sale year.');
    if(!year.indexation?.verifiedOn) throw new Error('Verified indexation rules are unavailable for this year.');
    // Section 48 explanation (iii) / section 72(8)(b): later of first holding year and 2001-02.
    const baseFY=purchaseStart<2001?'2001-02':purchaseFY;
    const buyCII=table?.[baseFY],sellCII=table?.[year.fy];
    if(!Number.isFinite(buyCII)||buyCII<=0||!Number.isFinite(sellCII)||sellCII<=0)
      throw new Error('Verified CII is unavailable for '+baseFY+' or '+year.fy+'. No substitute index has been used.');
    const enteredCost=Number(cost),indexedCost=enteredCost*sellCII/buyCII;
    return {purchaseFY,baseFY,transferFY:year.fy,buyCII,sellCII,enteredCost,indexedCost,uplift:indexedCost-enteredCost,factor:sellCII/buyCII,pre2001:purchaseStart<2001};
  }
  const api={calculate};
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.FinclarIndexation=api;
})(typeof globalThis!=='undefined'?globalThis:this);
