(function (parent, factory){
  if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    
    var __f = factory() 
    parent["amd-global"] = parent["amd-global"] || {};
    parent["amd-global"]["module"] = __f;

    if (typeof define === 'function' && define.amd)
      define('amd-global/module', function() { return __f })
  }
  }(this, function () {
  var closure = {}
  
var __req = 
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
        , args

      if(f) {
        args = [m.exports, __req, m].concat(f.slice(1))
        f = f[0].apply(m, args)
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
'dep': [function(exports,require,module) { 
    module.exports = 'dep';
}], 
'amd-global': [function(exports,require,module) { 
    var dep = require('dep');
    module.exports = {
      dep: dep,
      name: 'amd-global'
    };
}]
}
, {} 
, window ? [closure] : []
)

return __req('amd-global')

}.bind({})))
