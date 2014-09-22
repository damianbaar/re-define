

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
'components/lookup': [function(exports, require, module, __filename, __dirname) { 
    return {
      create: function () {
        console.log('Creating lookup ...');
        return this;
      }
    };
}, {"__filename":"lookup.js","__dirname":"."}]
}
,  function() { this.org = this.org || {};this.org.component = this.org.component || {}; return this.org.component }.call(this) 
, []
)
