
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

        if(typeof require == "function" && require) return require.apply(null, arguments);
        else if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) __req(name);
  return __req;
})
({ 
'module-a/b': [function(exports, require, module, __filename, __dirname) { 


    module.exports = 'b';
}, {}], 
'module-a/c': [function(exports, require, module, __filename, __dirname) { 


    module.exports = 'c';
}, {}], 
'module-a/b/d': [function(exports, require, module, __filename, __dirname) { 


    module.exports = 'd';
}, {}], 
'module-a/b/d/e': [function(exports, require, module, __filename, __dirname) { 


    module.exports = 'e';
}, {}], 
'module-a': [function(exports, require, module, __filename, __dirname) { 


    var b = require('module-a/b'), c = require('module-a/c'), d = require('module-a/b/d'), e = require('module-a/b/d/e');
    module.exports = 'a';
}, {}], 
'refs': [function(exports, require, module, __filename, __dirname) { 


    var a = require('module-a'), b = require('module-a/b'), c = require('module-a/c'), d = require('module-a/b/d'), e = require('module-a/b/d/e');
    module.exports = 'refs';
}, {}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, []
)
