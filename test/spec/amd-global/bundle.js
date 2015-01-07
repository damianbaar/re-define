(function (parent, factory){
  if (typeof exports === 'object') {
    module.exports = factory(require('a-a'))
  } else {
    var hasAMD = typeof define === 'function' && define.amd
    var __req = (hasAMD && require) || function(name) { throw new Error('Missing external dep: ' + name); }
    var __find = function(ns, names) {
      var _d, _p, i, k;
      for(i = 0;i < names.length; i++) {
        _p = (names[i] && names[i].split('.')) || []
        for(k = 0; k < _p.length; k++) { _d = ns[_p[k]]; if(!_d) break; ns = _d;}
        if(_d) return _d;
      }
    }

    var a_a = __find(parent, ['a-a','a.b.c']) || __find(window, ['a-a','a.b.c']) || __req('a-a')
    
    var __f = factory(a_a) 
    parent["amd-global"] = parent["amd-global"] || {};
    parent["amd-global"]["module"] = __f;

    if (hasAMD) define('amd-global/module', function() { return __f })
  }
  }(this, function (a_a) {
  var closure = {}
  closure['a-a'] = a_a
  
var __req = //externals: a-a 
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
'amd-global/dep': [function(exports,require,module) { 
    module.exports = 'dep';
}], 
'amd-global': [function(exports,require,module) { 
    var dep = require('amd-global/dep');
    var a = require('a-a');
    module.exports = {
      dep: dep,
      name: 'amd-global'
    };
}]
}
, {} 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('amd-global')

}.bind({})))
