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

  

var __req = 
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
'umd/dep': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dep';
}, {"__filename":"dep.js","__dirname":"."}], 
'umd/data.json': [function(exports, require, module, __filename, __dirname) { 
module.exports = { "test": true }

}, {"__filename":"data.json","__dirname":"."}], 
'umd/umd': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('umd/dep');
    module.exports = {
      dep: dep,
      name: 'umd',
      data: require('umd/data.json')
    };
}, {"__filename":"umd.js","__dirname":"."}]
}
, {} 
, [closure]
)

return __req('umd/umd') 

}.bind({})))
