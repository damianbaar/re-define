//re-define version:1.14.4
;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('umd/module', [], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory()
  } else {
  
    parent["umd"] = parent["umd"] || {};
    parent["umd"]["module"] = factory();

  }
  })(this, function () {
  var closure = {}

  var __req = (function (modules, namespace, imports) {
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
'umd/dep': [function(exports,require,module,define) { 
    return 'hello-amd';
},null], 
'umd/util.object': [function(exports,require,module) { 
    var dep = require('umd/dep');
    module.exports = 'util object with dots in file';
}], 
'umd/view-1/template.html': [function(exports,require,module) { 
module.exports = "<h1>View 1</h1>"
}], 
'umd/view-1': [function(exports,require,module,define) { 
    var view = require('umd/view-1/template.html');
    return view;
},null], 
'umd/view-2/template.html': [function(exports,require,module) { 
module.exports = "<h1>View 2</h1>"
}], 
'umd/view-2': [function(exports,require,module,define) { 
    var view = require('umd/view-2/template.html');
    return view;
},null], 
'umd/data.json': [function(exports,require,module) { 
module.exports = { "test": true }

}], 
'umd/umd': [function(exports,require,module) { 
    var dep = require('umd/dep');
    var util = require('umd/util.object');
    var view1 = require('umd/view-1');
    var view2 = require('umd/view-2');
    module.exports = {
      dep: dep,
      name: 'umd',
      data: require('umd/data.json'),
      dots: util,
      view1: view1,
      view2: view2
    };
}]
}
,  function() { this.test = this.test || {};this.test.umd = this.test.umd || {}; return this.test.umd }.call(this) 
, typeof window === 'undefined' ? [] : [closure]
)

return __req('umd/umd')

})
