//re-define version:1.14.5
require = (function() {
return (function (modules, namespace, imports) {
  var __oldReq = typeof require == "function" && require

  function __req(name){

    if(!namespace[name]) {
      var f = modules[name]
        , m = { exports:{} }
        , args

      if(f) {

        args = [m.exports, function(x) {
          return __req(x)
        }, m].concat(f.slice(1))

        namespace[name] = m;
        f = f[0].apply(null, args);
        f && (m.exports = f);
      } else {
        var mod
          , len = imports && imports.length;

        for(var i=0; i < len; i++) {
          mod = imports[i] && imports[i][name];
          if(mod) return mod;
        }

        if(__oldReq) return __oldReq.apply(null, arguments);
        throw new Error('Module does not exists ' + name);
      }
    }
    return namespace[name].exports;
  }

  return __req;
})
({ 
'test/empty.html': [function(exports,require,module) { 
module.exports = "[object Object]"
}], 
'test/empty': [function(exports,require,module) { 
    '<div>error: empty file, /Users/damianbaar/Documents/Workspaces/HTML:JS:Node/re-define/test/spec/empty/empty.js</div>';
}], 
'test': [function(exports,require,module) { 
    var emptyText = require('test/empty.html');
    var emptyJS = require('test/empty');
}]
}
,  function() { this.spec = this.spec || {};this.spec.external = this.spec.external || {}; return this.spec.external }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
