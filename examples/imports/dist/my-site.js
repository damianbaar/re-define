//externals: components/lookup 
(function (modules, namespace, imports) {
  function require(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m, require, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i][name];
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
'imports': [function(exports, require, module, __filename, __dirname) { 
    var lookup = require('components/lookup');
    lookup.create();
}, {"__filename":"index.js","__dirname":"my-site"}]
}
,  function() { this.org = this.org || {};this.org.site = this.org.site || {}; return this.org.site }.call(this) 
, [this.org.component]
)
