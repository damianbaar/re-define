//re-define version:1.14.0
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
'dep': [function(exports,require,module) { 
    module.exports = 'dep';
}], 
'iife': [function(exports,require,module) { 
    var dep = require('dep');
    window.test = {
      dep: dep,
      name: 'iife'
    };
}]
}
,  function() { this.window = this.window || {};this.window.amd = this.window.amd || {};this.window.amd.global = this.window.amd.global || {}; return this.window.amd.global }.call(this) 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('iife')

}.call({},this))
