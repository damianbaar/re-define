//re-define version:0.0.3-alpha
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
'globals': [function(exports,require,module,process,define,__filename,__dirname) { 
    if (typeof define === 'function' && define.amd)
      define('nanana');
    process.env.TEST = 'test';
    module.exports = {
      process: process,
      filename: __filename,
      dirname: __dirname
    };
},typeof window === 'undefined' ? process : {env: {}},null,"index.js","."]
}
,  function() { this.window = this.window || {};this.window.amd = this.window.amd || {};this.window.amd.global = this.window.amd.global || {}; return this.window.amd.global }.call(this) 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('globals')

}.bind({})))
