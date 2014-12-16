
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
'test/dep': [function(exports,require,module) { 
    module.exports = {
      toUpperCase: function (val) {
        return val.toUpperCase();
      }
    };
}], 
'test': [function(exports,require,module) { 
    var dep = require('test/dep'), t = require('test' + 'test');
    module.exports = dep.toUpperCase('index');
}]
}
,  function() { this.spec = this.spec || {};this.spec.index = this.spec.index || {}; return this.spec.index }.call(this) 
, []
)
