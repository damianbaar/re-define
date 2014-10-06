;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('umd/module', [], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory()
  } else {
  
    parent.umd = parent.umd || {};
parent.umd.module = factory();

  }
  }(this, function () {

  var closure = {}

  

var require = 
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
'umd/dep': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dep';
}, {"__filename":"dep.js","__dirname":"."}], 
'umd/umd': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('umd/dep');
    module.exports = {
      dep: dep,
      name: 'umd'
    };
}, {"__filename":"umd.js","__dirname":"."}]
}
, {} 
, [closure]
)

return require('umd/umd') 

}.bind({})))
