//re-define version:0.0.3-alpha
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
    exports.toUpperCase = function (name) {
      return name.toUpperCase();
    };
    exports.name = 'dep';
}], 
'test': [function(exports,require,module) { 
    var dep = require('test/dep');
    module.exports = dep.toUpperCase('index');
}], 
'test/entry1': [function(exports,require,module) { 
    var dep = require('test/dep');
    module.exports = dep.toUpperCase('entry1');
}], 
'test/entry2': [function(exports,require,module) { 
    var dep = require('test/dep');
    module.exports = dep.toUpperCase('entry2');
}]
}
,  function() { this.spec = this.spec || {};this.spec.multi = this.spec.multi || {}; return this.spec.multi }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
