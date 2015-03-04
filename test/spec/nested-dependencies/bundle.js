//re-define version:1.14.1
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
'common': [function(exports,require,module) { 
    module.exports = 'common/index';
}], 
'a/b': [function(exports,require,module) { 
    require('common');
    module.exports = 'b';
}], 
'd/d': [function(exports,require,module) { 
    module.exports = 'd';
}], 
'a/c': [function(exports,require,module) { 
    var d = require('d/d');
    module.exports = 'c';
}], 
'common/common': [function(exports,require,module) { 
    module.exports = 'common';
}], 
'test': [function(exports,require,module) { 
    require('a/b');
    require('a/c');
    require('common/common');
    module.exports = 'main';
}]
}
,  function() { this.spec = this.spec || {};this.spec.nested = this.spec.nested || {}; return this.spec.nested }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
