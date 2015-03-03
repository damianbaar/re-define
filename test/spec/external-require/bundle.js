//re-define version:0.0.2-alpha
require = (function() {
return (function (modules, namespace, imports) {
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
'test/dep': [function(exports,require,module) { 
    module.exports = {
      toUpperCase: function (val) {
        return val.toUpperCase();
      }
    };
}], 
'test': [function(exports,require,module) { 
    var dep = require('test/dep');
    module.exports = function () {
      require(['using-external-require'], function (dep) {
        console.log('method called from external require', dep);
      });
      return { name: dep.toUpperCase('index') };
    };
}]
}
,  function() { this.spec = this.spec || {};this.spec.external = this.spec.external || {}; return this.spec.external }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
