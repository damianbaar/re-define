
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
'test/dep': [function(exports, require, module, __filename, __dirname) { 
    module.exports = {
      toUpperCase: function (val) {
        return val.toUpperCase();
      }
    };
}, {"__filename":"index.js","__dirname":"dep"}], 
'test': [function(exports, require, module, __filename, __dirname) { 
    var dep = require('test/dep'), usingExternalRequire = require(['using-external-require'], function () {
        console.log('method called from external require');
      });
    module.exports = {
      name: dep.toUpperCase('index'),
      ext: require(['external-require'], function (ext) {
        console.log(ext);
      })
    };
    setTimeout(function () {
      require(['using-external-require'], function (dep) {
        console.log('method called from external require', dep);
      });
    });
}, {"__filename":"index.js","__dirname":"."}]
}
,  function() { this.spec = this.spec || {};this.spec.external = this.spec.external || {}; return this.spec.external }.call(this) 
, []
)
