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
'components/profile': [function(exports,require,module) { 
    module.exports = 'profile';
}], 
'dropdown': [function(exports,require,module) { 
    module.exports = 'dropdown';
}], 
'components/lookup/ui/ui': [function(exports,require,module) { 
    var dd = require('dropdown');
}], 
'components/lookup/util': [function(exports,require,module) { 
    module.exports = 'utils';
}], 
'components/lookup': [function(exports,require,module) { 
    var dropdown = require('components/lookup/ui/ui');
    var util = require('components/lookup/util');
    module.exports = 'lookup';
}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.components = this.ns.org.components || {}; return this.ns.org.components }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
