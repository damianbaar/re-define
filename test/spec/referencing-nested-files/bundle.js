
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
'a/b': [function(exports,require,module) { 
    module.exports = 'b';
}], 
'a/c': [function(exports,require,module) { 
    module.exports = 'c';
}], 
'a/b/d': [function(exports,require,module) { 
    module.exports = 'd';
}], 
'a/b/d/e': [function(exports,require,module) { 
    module.exports = 'e';
}], 
'a': [function(exports,require,module) { 
    var b = require('a/b'), c = require('a/c'), d = require('a/b/d'), e = require('a/b/d/e');
    module.exports = 'a';
}], 
'refs': [function(exports,require,module) { 
    var a = require('a'), b = require('a/b'), c = require('a/c'), d = require('a/b/d'), e = require('a/b/d/e');
    module.exports = 'refs';
}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, window ? [] : []
)
