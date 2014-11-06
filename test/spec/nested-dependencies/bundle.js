
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
'common': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'common';
}, {"__filename":"common.js","__dirname":"node_modules/common"}], 
'a/b': [function(exports, require, module, __filename, __dirname) { 
    require('common');
    module.exports = 'b';
}, {"__filename":"b.js","__dirname":"node_modules/a"}], 
'd': [function(exports, require, module, __filename, __dirname) { 
    module.exports = 'd';
}, {"__filename":"d.js","__dirname":"node_modules/a/node_modules/d"}], 
'a/c': [function(exports, require, module, __filename, __dirname) { 
    var d = require('d');
    module.exports = 'c';
}, {"__filename":"c.js","__dirname":"node_modules/a"}], 
'test': [function(exports, require, module, __filename, __dirname) { 
    require('a/b');
    require('a/c');
    require('common');
    module.exports = 'main';
}, {"__filename":"index.js","__dirname":"."}]
}
,  function() { this.spec = this.spec || {};this.spec.nested = this.spec.nested || {}; return this.spec.nested }.call(this) 
, []
)
