/* Exact token matching against the existing calculator catalogue; no remote search. */
(function(root){
  'use strict';
  const normalize=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function find(tools,categories,query,category='all'){
    const tokens=normalize(query).split(' ').filter(Boolean);
    return categories.filter(c=>category==='all'||c.k===category).flatMap(c=>c.tools.filter(key=>{
      if(!tools[key]) return false;
      const text=normalize(key+' '+tools[key].label+' '+c.label),compact=text.replace(/ /g,'');
      return tokens.every(token=>text.includes(token)||compact.includes(token));
    }).map(key=>({key,label:tools[key].label,category:c.label,categoryKey:c.k})));
  }
  const api={find};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.FinclarToolNavigation=api;
})(typeof globalThis!=='undefined'?globalThis:this);
