//re-define version:1.14.6
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
'test/dep': [function(exports,require,module) { 
    module.exports = {
      toUpperCase: function (val) {
        return val.toUpperCase();
      }
    };
}], 
'test': [function(exports,require,module) { 
    var dep = require('test/dep');
    var t = require('test' + 'test');
    module.exports = dep.toUpperCase('index');
}]
}
,  function() { this.spec = this.spec || {};this.spec.index = this.spec.index || {}; return this.spec.index }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
