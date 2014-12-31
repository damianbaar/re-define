require = (function (parent) {
var __oldReq = typeof require == "function" && require
  , closure = {}


var _p = []
return (function (modules, namespace, imports) {
  function __req(name, override){
    if(namespace[name] && !namespace[name].done) {
      if(_p.indexOf(name) === -1) { 
        _p[name] = (_p[name] || 1) + 1
      }
    }

    if(override) {
      delete namespace[name]
      console.log('re require', name)
      return __req(name)
    }

    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
        , args

      if(f) {

        args = [m.exports, function(x) {
          return __req(x)
        }, m].concat(f.slice(1))

        namespace[name] = m
        m.done = false
        f = f[0].apply(m, args)
        m.done = true
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

  for(var name in modules) __req(name);
  for(var name in _p) __req(name, true);

  return __req;
})({ 
'iife/b': [function(exports,require,module) { 
    var a = require('iife/a');
    module.exports.test = 'b' + JSON.stringify(a.test);
}], 
'iife/a': [function(exports,require,module) { 
    var b = require('iife/b');
    module.exports.test = 'test123' + JSON.stringify(b.test);
}], 
'iife': [function(exports,require,module) { 
    var a = require('iife/a'), b = require('iife/b');
    window.iife = a;
    module.exports = [
      a,
      b
    ];
}]
}
,  function() { this.examples = this.examples || {};this.examples.iife = this.examples.iife || {}; return this.examples.iife }.call(this) 
, []
)
}.call({},this))
