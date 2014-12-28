(function (parent) {
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
'iife/a': [function(exports,require,module) { 
    module.exports = 'test123';
}], 
'iife': [function(exports,require,module) { 
    var a = require('iife/a');
    window.iife = a;
}]
}
,  function() { this.examples = this.examples || {};this.examples.iife = this.examples.iife || {}; return this.examples.iife }.call(this) 
, window ? [closure] : []
)

return __req('iife')

}.call({},this))
