(function (modules, namespace, imports) {
  function require(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]
      if(f) {
        f = f[0].call(m, require, m, m.exports)
        namespace[name] = f || m.exports
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i][name];
          if(mod) return;
        }

        if(!mod) throw new Error('Module does not exists ' + name);
        else return mod;
      }
    }
    return namespace[name];
  }

  for(var name in modules) require(name);
  return require;
})({

'./common/c': [function(require, module, exports) { 
    module.exports = { c: true };
}], 
'./common/a': [function(require, module, exports) { 
    var c = require('./common/c');
    return {
      a: true,
      c: c
    };
}], 
'./common/b': [function(require, module, exports) { 
    var c = require('./common/c');
    return {
      b: true,
      c: c
    };
}], 
'./entry-1': [function(require, module, exports) { 
    var a = require('./common/a'), b = require('./common/b'), d3 = require('d3');
    module.exports = function () {
      return {
        'entry-1': [
          a,
          b
        ]
      };
    };
}], 
'./entry-2': [function(require, module, exports) { 
    var a = require('./common/a');
    module.exports = function () {
      return { 'entry-2': [a] };
    };
}]
}
, function() { this.your = this.your || {};this.your.namespace = this.your.namespace || {}; return your.namespace }.call(this)
, []
)
