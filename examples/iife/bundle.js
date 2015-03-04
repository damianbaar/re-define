//re-define version:0.0.3-alpha
//library version:
(function (parent) {
var closure = {}


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

        namespace[name] = m
        f = f[0].apply(null, args)
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
'iife/b': [function(exports,require,module) { 
    module.exports.name = 'module b';
    var a = require('iife/a');
    module.exports.result = 'from a:' + JSON.stringify(a.name);
}], 
'iife/a': [function(exports,require,module) { 
    module.exports.name = 'module a';
    var b = require('iife/b');
    module.exports.result = 'from b:' + JSON.stringify(b.name);
}], 
'iife': [function(exports,require,module) { 
    var a = require('iife/a');
    var b = require('iife/b');
    console.log(a, b);
    window.iife = a;
    module.exports = [
      a,
      b
    ];
}]
}
,  function() { this.examples = this.examples || {};this.examples.iife = this.examples.iife || {}; return this.examples.iife }.call(this) 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('iife')

}.call({},this))
