/* Individual domestic residence only; no treaty or voyage-day determination. */
(function(root){
  'use strict';
  const DAY=86400000;
  const yearsDays=(start,count)=>(Date.UTC(start,3,1)-Date.UTC(start-count,3,1))/DAY;
  function calculate(input,year){
    const r=year.residence,start=Number(year.fy.slice(0,4));
    if(!r?.verifiedOn) throw Error('Verified residence rules are unavailable for this year.');
    const bounds={daysCY:yearsDays(start+1,1),days4PY:yearsDays(start,4),days7PY:yearsDays(start,7),nrInPY10:r.historyYears};
    for(const [k,max] of Object.entries(bounds)) {
      if(input[k]===''||input[k]===null||!Number.isInteger(Number(input[k]))||Number(input[k])<0||Number(input[k])>max) throw Error('Enter valid whole-day/year counts within the stated limits.');
    }
    if(input.income===''||input.income===null||!Number.isFinite(Number(input.income))||Number(input.income)<0) throw Error('Enter a valid non-negative income amount.');
    const {identity,visit,liable}=input,d=Number(input.daysCY),d4=Number(input.days4PY),d7=Number(input.days7PY),nr=Number(input.nrInPY10);
    if(d4>d7) throw Error('The preceding four-year day total cannot exceed the preceding seven-year total.');
    if(!['citizen','pio','other'].includes(identity)||!['ordinary','visit','employment','crew'].includes(visit)) return {status:'Review needed',reason:'Confirm citizenship/PIO status and the purpose of your stay.'};
    if(visit==='crew') return {status:'Review needed',reason:'Ship-crew voyage-day rules require a separate review. Do not use the ordinary trip counter as the statutory day count.'};
    if(visit==='employment'&&identity!=='citizen') return {status:'Review needed',reason:'The overseas-employment departure exception requires Indian citizenship. Select the ordinary rule or obtain a review.'};
    const high=Number(input.income)>r.incomeThreshold,visitor=visit==='visit'&&identity!=='other';
    const threshold=visit==='employment'||(visitor&&!high)?null:visitor?r.visitorDays:r.ordinaryDays;
    const annual=d>=r.annualDays,combined=threshold!==null&&d>=threshold&&d4>=r.priorFourDays;
    const resident=annual||combined;
    const deemedCandidate=!resident&&identity==='citizen'&&high;
    if(deemedCandidate&&!['yes','no'].includes(liable)) return {status:'Review needed',reason:'Confirm whether you are liable to tax elsewhere due to domicile, residence or similar criteria. Paying no tax alone does not answer this.',threshold,annual,combined};
    const deemed=deemedCandidate&&liable==='no';
    const visitorRNOR=resident&&visitor&&high&&d>=r.visitorDays&&d<r.annualDays;
    const historyRNOR=nr>=r.nrYears||d7<=r.priorSevenDays;
    const status=deemed||(resident&&(visitorRNOR||historyRNOR))?'RNOR':resident?'ROR':'NR';
    const reason=deemed?'Indian citizen, specified income above the threshold and not liable to tax elsewhere: deemed residence applies.':!resident?'Neither day-count test nor deemed residence applies to the supplied facts.':visitorRNOR?`Qualifying high-income visitor in the ${r.visitorDays}–${r.annualDays-1}-day range: RNOR applies.`:historyRNOR?'A resident day-count test and at least one RNOR history condition are met.':'A resident day-count test is met; none of the RNOR conditions is met.';
    return {status,reason,threshold,annual,combined,deemed,visitorRNOR,historyRNOR};
  }
  function countTrips(trips,year){
    const start=Number(year.fy.slice(0,4)),min=Date.UTC(start,3,1),max=Date.UTC(start+1,3,1),days=new Set();
    if(!trips.length) throw Error('Add a complete trip before counting days.');
    for(const trip of trips){
      const dates=[trip.from,trip.to].map(v=>{
        if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v) throw Error('Enter valid start and end dates for every trip.');
        return Date.parse(v+'T00:00:00Z');
      });
      if(dates[1]<dates[0]) throw Error('A trip end cannot precede its start.');
      if(dates[0]<min||dates[1]>=max) throw Error('Keep every trip within the selected year, splitting cross-year stays first.');
      for(let t=dates[0];t<=dates[1];t+=DAY)days.add(t);
    }
    return days.size;
  }
  const api={calculate,countTrips,yearsDays};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.FinclarNRI=api;
})(typeof window==='object'?window:globalThis);
