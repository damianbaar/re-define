
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
'refs/common': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'COMMON';
}, {"__filename":"common.js","__dirname":"."}], 
'refs/dep': [function(exports, require, module, __filename, __dirname) { 
    var common = require('refs/common');
}, {"__filename":"index.js","__dirname":"dep"}], 
'refs/dep2': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'DEP2';
}, {"__filename":"index.js","__dirname":"dep2"}], 
'refs/dep2/inner': [function(exports, require, module, __filename, __dirname) { 
    var idx = require('refs/dep2');
    module.exports = 'INNER';
}, {"__filename":"inner.js","__dirname":"dep2"}], 
'refs/common-2': [function(exports, require, module, __filename, __dirname) { 
    var dep2 = require('refs/dep2');
    module.exports = 'COMMON-2';
}, {"__filename":"common-2.js","__dirname":"."}], 
'refs': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('refs/dep'), common = require('refs/common'), inner = require('refs/dep2/inner');
    var dep2 = require('refs/dep2');
    var common2 = require('refs/common-2');
    module.exports = 'index';
}, {"__filename":"index.js","__dirname":"."}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, []
)
