
(function (modules, namespace, imports) {
  function __req(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
        , args

      if(f) {
        args = [m.exports, __req, m].concat(f.slice(1))
        f = f[0].apply(m, args)
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
, window ? [] : []
)
