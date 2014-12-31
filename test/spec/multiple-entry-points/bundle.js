
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
, window ? [] : []
)
