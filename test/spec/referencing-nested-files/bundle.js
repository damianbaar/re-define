//re-define version:1.14.3
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
'a/b': [function(exports,require,module) { 
    module.exports = 'b';
}], 
'a/c': [function(exports,require,module) { 
    module.exports = 'c';
}], 
'a/b/d': [function(exports,require,module) { 
    module.exports = 'd';
}], 
'a/b/d/e': [function(exports,require,module) { 
    module.exports = 'e';
}], 
'a': [function(exports,require,module) { 
    var b = require('a/b');
    var c = require('a/c');
    var d = require('a/b/d');
    var e = require('a/b/d/e');
    module.exports = 'a';
}], 
'refs': [function(exports,require,module) { 
    var a = require('a');
    var b = require('a/b');
    var c = require('a/c');
    var d = require('a/b/d');
    var e = require('a/b/d/e');
    module.exports = 'refs';
}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
