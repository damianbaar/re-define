
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
    var dropdown = require('components/lookup/ui/ui'), util = require('components/lookup/util');
    module.exports = 'lookup';
}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.components = this.ns.org.components || {}; return this.ns.org.components }.call(this) 
, window ? [] : []
)
