(function (modules, namespace, imports) {
  function require(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
      if(f) {
        f = f[0].call(m, require, m, m.exports)
        namespace[name] = f || m.exports
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i][name];
          if(mod) return;
        }

        if(!mod) throw new Error('Module does not exists ' + name);
        else return mod;
      }
    }
    return namespace[name];
  }

  for(var name in modules) require(name);
  return require;
})({

'd3/dep1': [function(require, module, exports) { 
    module.exports = 'dep1';
}], 
'd3/lib/dep2': [function(require, module, exports) { 
    module.exports = { 'dep2': true };
}], 
'd3': [function(require, module, exports) { 
    (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
        define([
          'dep1',
          'dep2'
        ], factory);
      } else if (typeof exports === 'object') {
        module.exports = factory(require('d3/dep1'), require('d3/lib/dep2'), require('external-dep'));
      } else {
        root.returnExports = factory(root.dep1, root.dep2);
      }
    }(this, function (b) {
      return { d3: 'd3' };
    }));
}]
}
, function() { this.your = this.your || {};this.your.namespace = this.your.namespace || {}; return your.namespace }.call(this)
, [window]
)
