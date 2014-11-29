(function (parent, factory){
  if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    

    parent["amd_global"] = parent["amd_global"] || {};
    parent["amd_global"]["module"] = factory();


    if (typeof define === 'function' && define.amd)
      define('amd-global/module', [], parent.amd_global.module)
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
'amd-global/dep': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dep';
}, {"__filename":"","__dirname":""}], 
'amd-global': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('amd-global/dep');
    module.exports = {
      dep: dep,
      name: 'amd-global'
    };
}, {"__filename":"","__dirname":""}]
}
, {} 
, [closure]
)

return __req('amd-global')

}.bind({})))
