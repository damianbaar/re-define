
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

'4/common/c': [function(require, module, exports) { 
    module.exports = { c: true };
}], 
'4/common/a': [function(require, module, exports) { 
    var c = require('4/common/c');
    return {
      a: true,
      c: c
    };
}], 
'4/common/b': [function(require, module, exports) { 
    var c = require('4/common/c');
    return {
      b: true,
      c: c
    };
}], 
'4/entry-1': [function(require, module, exports) { 
    var a = require('4/common/a'), b = require('4/common/b'), d3 = require('d3');
    module.exports = function () {
      return {
        'entry-1': [
          a,
          b
        ]
      };
    };
}], 
'4/entry-2': [function(require, module, exports) { 
    var a = require('4/common/a');
    module.exports = function () {
      return { 'entry-2': [a] };
    };
}]
}
, function() { this.my = this.my || {};this.my.awesome = this.my.awesome || {};this.my.awesome.example = this.my.awesome.example || {}; return my.awesome.example }.call(this)
, [window]
)
