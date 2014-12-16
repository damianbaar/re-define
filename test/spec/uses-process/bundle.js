;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('amd/name', [], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory()
  } else {
  
    parent["window"] = parent["window"] || {};
    parent["window"]["amd"] = parent["window"]["amd"] || {};
    parent["window"]["amd"]["global"] = factory();

  }
  }(this, function () {
  var closure = {}

  var __req = 
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
        , args

      if(f) {
        args = [m.exports, __req, m].concat(Array.prototype.slice.call(arguments, 1))
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
'uses-process': [function(exports,require,module,process,define) { 
    var test = {
        dep: dep,
        name: 'iife'
      };
    process.env.TEST = 'test';
    if (typeof define === 'function' && define.amd)
      define('nanana');
},{ env : {}},null]
}
,  function() { this.window = this.window || {};this.window.amd = this.window.amd || {};this.window.amd.global = this.window.amd.global || {}; return this.window.amd.global }.call(this) 
, [closure]
)

return __req('uses-process')

}.bind({})))
