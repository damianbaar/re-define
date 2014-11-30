
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
'components/profile': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'profile';
}, {"__filename":"","__dirname":""}], 
'dropdown': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'dropdown';
}, {"__filename":"","__dirname":""}], 
'components/lookup/ui/ui': [function(exports, require, module, __filename, __dirname) { 
    var dd = require('dropdown');
}, {"__filename":"","__dirname":""}], 
'components/lookup/util': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'utils';
}, {"__filename":"","__dirname":""}], 
'components/lookup': [function(exports, require, module, __filename, __dirname) { 
    var dropdown = require('components/lookup/ui/ui'), util = require('components/lookup/util');
    module.exports = 'lookup';
}, {"__filename":"","__dirname":""}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.components = this.ns.org.components || {}; return this.ns.org.components }.call(this) 
, []
)
