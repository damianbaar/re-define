//re-define version:1.14.3
//externals: a,b,c
(function (parent,a,b,c) {
var closure = {}

closure['a'] = a
closure['b'] = b
closure['c'] = c

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
'iife': [function(exports,require,module) { 
    var a = require('a');
    var b = require('b');
    var c = require('c');
    module.exports = [
      a,
      b,
      c
    ];
}]
}
,  function() { this.window = this.window || {};this.window.amd = this.window.amd || {};this.window.amd.global = this.window.amd.global || {}; return this.window.amd.global }.call(this) 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('iife')

}.call({},this,a,b,c))
