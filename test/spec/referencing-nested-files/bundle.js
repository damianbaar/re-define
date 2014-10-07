
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
'a': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'a';
}, {"__filename":"index.js","__dirname":"node_modules/a"}], 
'a/b': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'b';
}, {"__filename":"index.js","__dirname":"node_modules/a/b"}], 
'a/c': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'c';
}, {"__filename":"c.js","__dirname":"node_modules/a"}], 
'a/b/d': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'd';
}, {"__filename":"index.js","__dirname":"node_modules/a/b/d"}], 
'a/b/d/e': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'e';
}, {"__filename":"e.js","__dirname":"node_modules/a/b/d"}], 
'refs': [function(exports, require, module, __filename, __dirname) { 
    var a = require('a'), b = require('a/b'), c = require('a/c'), d = require('a/b/d'), e = require('a/b/d/e');
    module.exports = 'refs';
}, {"__filename":"index.js","__dirname":"."}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, []
)
