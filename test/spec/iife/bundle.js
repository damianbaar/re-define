(function (parent) {

var closure = {}


var __req = 
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, __req, m, f[1].__filename, f[1].__dirname);
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
'iife/dep': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dep';
}, {"__filename":"","__dirname":""}], 
'iife': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('iife/dep');
    window.test = {
      dep: dep,
      name: 'iife'
    };
}, {"__filename":"","__dirname":""}]
}
,  function() { this.window = this.window || {};this.window.amd = this.window.amd || {};this.window.amd.global = this.window.amd.global || {}; return this.window.amd.global }.call(this) 
, [closure]
)

return __req('iife')

}.call({},this))
