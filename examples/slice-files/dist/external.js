//externals: external-dep 
(function (modules, namespace, imports) {
  function require(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, require, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) require(name);
  return require;
})
({ 
'dep1': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dep1';
}, {"__filename":"dep1.js","__dirname":"node_modules/d3"}], 
'lib/dep2': [function(exports, require, module, __filename, __dirname) { 
    module.exports = { 'dep2': true };
}, {"__filename":"dep2.js","__dirname":"node_modules/d3/lib"}], 
'd3': [function(exports, require, module, __filename, __dirname) { 
    (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
        define([
          'dep1',
          'dep2'
        ], factory);
      } else if (typeof exports === 'object') {
        module.exports = factory(require('dep1'), require('lib/dep2'), require('external-dep'));
      } else {
        root.returnExports = factory(root.dep1, root.dep2);
      }
    }(this, function (b) {
      return { d3: 'd3' };
    }));
}, {"__filename":"d3.js","__dirname":"node_modules/d3"}]
}
,  function() { this.my = this.my || {};this.my.awesome = this.my.awesome || {};this.my.awesome.example = this.my.awesome.example || {}; return this.my.awesome.example }.call(this) 
, [window]
)
