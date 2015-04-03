//re-define version:1.14.6
//externals: a-a
(function (parent, factory){
  var __f

  if (typeof exports === 'object') {
    module.exports = __f = factory(require('a-a'))
  } 

  if (typeof window != 'undefined') {
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
    
    __f = __f || factory(a_a) 
    parent["amd-global"] = parent["amd-global"] || {};
    parent["amd-global"]["module"] = __f;

    if (hasAMD) define('amd-global/module', function() { return __f })
  }
  }(this, function (a_a) {
  var closure = {}
  closure['a-a'] = a_a
  
var __req = (function (modules, namespace, imports) {
  var __oldReq = typeof require == "function" && require

  function __req(name){

    if(!namespace[name]) {
      var f = modules[name]
        , m = { exports:{} }
        , args

      if(f) {

        args = [m.exports, function(x) {
          return __req(x)
        }, m].concat(f.slice(1))

        namespace[name] = m;
        f = f[0].apply(null, args);
        f && (m.exports = f);
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(__oldReq) return __oldReq.apply(null, arguments);
        throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name].exports;
  }

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
