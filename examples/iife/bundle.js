(function (parent) {
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
, window ? [closure] : []
)

return __req('iife')

}.call({},this))
