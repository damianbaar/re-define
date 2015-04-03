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
'refs/common': [function(exports,require,module) { 
    module.exports = 'COMMON';
}], 
'refs/dep': [function(exports,require,module) { 
    var common = require('refs/common');
}], 
'refs/dep2': [function(exports,require,module) { 
    module.exports = 'DEP2';
}], 
'refs/dep2/inner': [function(exports,require,module) { 
    var idx = require('refs/dep2');
    module.exports = 'INNER';
}], 
'refs/common-2': [function(exports,require,module) { 
    var dep2 = require('refs/dep2');
    module.exports = 'COMMON-2';
}], 
'refs': [function(exports,require,module) { 
    var dep = require('refs/dep');
    var common = require('refs/common');
    var inner = require('refs/dep2/inner');
    var dep2 = require('refs/dep2');
    var common2 = require('refs/common-2');
    module.exports = 'index';
}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
