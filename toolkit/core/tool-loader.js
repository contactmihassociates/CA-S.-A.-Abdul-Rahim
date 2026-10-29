/* Small, same-origin calculator loader. Failed loads can be retried. */
(function(root) {
  'use strict';
  let manifest = {}, shared;
  const factories = new Map(), components = new Map(), pending = new Map();
  function load(key) {
    if (components.has(key)) return Promise.resolve(components.get(key));
    if (pending.has(key)) return pending.get(key);
    if (!Object.prototype.hasOwnProperty.call(manifest,key)) return Promise.reject(Error('Unknown calculator.'));
    const task = new Promise((resolve,reject) => {
      let script, timer;
      const finish = error => {
        clearTimeout(timer);
        if (script) {script.onload = script.onerror = null; script.remove();}
        if (error) return reject(error);
        try {
          const factory = factories.get(key);
          if (!factory) throw Error('Calculator file was incomplete.');
          const component = factory(shared());
          if (typeof component !== 'function') throw Error('Calculator could not open.');
          components.set(key,component); resolve(component);
        } catch(e) { reject(e); }
      };
      if (factories.has(key)) {finish(); return;}
      script = document.createElement('script');
      script.src = manifest[key]; script.async = true;
      script.onload = () => finish();
      script.onerror = () => finish(Error('Calculator could not download.'));
      timer = setTimeout(() => finish(Error('Calculator download timed out.')),20000);
      document.head.appendChild(script);
    });
    pending.set(key,task);
    task.then(() => pending.delete(key),() => pending.delete(key));
    return task;
  }
  root.FinclarToolLoader = {
    configure(files,context) {manifest=files;shared=context;},
    register(key,factory) {factories.set(key,factory);},
    peek(key) {return components.get(key)||null;},
    load
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
