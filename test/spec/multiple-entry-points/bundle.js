
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, __req, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(!!require) return require.apply(null, arguments);
        else if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) __req(name);
  return __req;
})
({ 
'test/dep': [function(exports, require, module, __filename, __dirname) { 
    exports.toUpperCase = function (name) {
      return name.toUpperCase();
    };
    exports.name = 'dep';
}, {"__filename":"dep.js","__dirname":"."}], 
'test': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('test/dep');
    module.exports = dep.toUpperCase('index');
}, {"__filename":"index.js","__dirname":"."}], 
'test/entry1': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('test/dep');
    module.exports = dep.toUpperCase('entry1');
}, {"__filename":"entry1.js","__dirname":"."}], 
'test/entry2': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('test/dep');
    module.exports = dep.toUpperCase('entry2');
}, {"__filename":"entry2.js","__dirname":"."}]
}
,  function() { this.spec = this.spec || {};this.spec.multi = this.spec.multi || {}; return this.spec.multi }.call(this) 
, []
)
