//externals: components/lookup 
(function (modules, namespace, imports) {
  function require(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, require, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(!mod) throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name];
  }

  for(var name in modules) require(name);
  return require;
})
({ 
'my-site': [function(exports, require, module, __filename, __dirname) { 
    var lookup = require('components/lookup');
    lookup.create();
}, {"__filename":"index.js","__dirname":"."}]
}
,  function() { this.examples = this.examples || {};this.examples.imports = this.examples.imports || {};this.examples.imports.org = this.examples.imports.org || {};this.examples.imports.org.site = this.examples.imports.org.site || {}; return this.examples.imports.org.site }.call(this) 
, [examples.imports.component]
)
