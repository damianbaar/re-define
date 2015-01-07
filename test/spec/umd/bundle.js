;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('umd/module', [], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory()
  } else {
  
    parent["umd"] = parent["umd"] || {};
    parent["umd"]["module"] = factory();

  }
  }(this, function () {
  var closure = {}

  var __req = 
(function (modules, namespace, imports) {
  var __circular = []
  function __req(name, override){

    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
        , args

      if(f) {
        args = [m.exports, __req, m].concat(f.slice(1))
        m.done = false
        namespace[name] = m.exports
        f = f[0].apply(m, args)
        namespace[name] = f ? f : m.exports
        m.done = true
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
'umd/dep': [function(exports,require,module) { 
    module.exports = 'dep';
}], 
'umd/util.object': [function(exports,require,module) { 
    var dep = require('umd/dep');
    module.exports = 'util object with dots in file';
}], 
'umd/data.json': [function(exports,require,module) { 
module.exports = { "test": true }

}], 
'umd/umd': [function(exports,require,module) { 
    var dep = require('umd/dep');
    var util = require('umd/util.object');
    module.exports = {
      dep: dep,
      name: 'umd',
      data: require('umd/data.json'),
      dots: util
    };
}]
}
, {} 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('umd/umd')

}.bind({})))
