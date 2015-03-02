//externals: components/lookup 
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

  return __req;
})
({ 
'my-site': [function(exports,require,module) { 
    var lookup = require('components/lookup');
    lookup.create();
}]
}
,  function() { this.examples = this.examples || {};this.examples.imports = this.examples.imports || {};this.examples.imports.org = this.examples.imports.org || {};this.examples.imports.org.site = this.examples.imports.org.site || {}; return this.examples.imports.org.site }.call(this) 
, typeof window === 'undefined' ? [] : [examples.imports.component]
)
