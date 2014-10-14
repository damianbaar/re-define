
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
'test': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('test'), t = require('test' + 'test');
    module.exports = dep.toUpperCase('index');
}, {"__filename":"index.js","__dirname":"."}], 
'test': [function(exports, require, module, __filename, __dirname) { 
    module.exports = {
      toUpperCase: function (val) {
        return val.toUpperCase();
      }
    };
}, {"__filename":"index.js","__dirname":"dep"}]
}
,  function() { this.spec = this.spec || {};this.spec.index = this.spec.index || {}; return this.spec.index }.call(this) 
, []
)
