
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
    var dep = require('refs/dep'), common = require('refs/common'), inner = require('refs/dep2/inner');
    var dep2 = require('refs/dep2');
    var common2 = require('refs/common-2');
    module.exports = 'index';
}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, window ? [] : []
)
