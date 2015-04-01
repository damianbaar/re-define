//re-define version:1.14.4
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
'model/error.html': [function(exports,require,module) { 
module.exports = "<div>error</div>"
}], 
'model/model': [function(exports,require,module) { 
    var errorTmpl = require('model/error.html');
    module.exports = {
      name: 'model',
      error: errorTmpl
    };
}], 
'view/view.html': [function(exports,require,module) { 
module.exports = "<div>view</div>"
}], 
'view/view': [function(exports,require,module) { 
    var view = require('view/view.html');
    module.exports = {
      name: 'model',
      view: view
    };
}], 
'jquery/jquery.html': [function(exports,require,module) { 
module.exports = "<div>view</div>"
}], 
'jquery/jquery': [function(exports,require,module) { 
    var view = require('jquery/jquery.html');
    module.exports = {
      name: 'jquery',
      template: view
    };
}], 
'refs': [function(exports,require,module) { 
    var model = require('model/model');
    var view = require('view/view');
    var $ = require('jquery/jquery');
    module.exports = {
      model: model,
      view: view,
      jquery: $
    };
}]
}
,  function() { this.spec = this.spec || {};this.spec.refs = this.spec.refs || {}; return this.spec.refs }.call(this) 
, typeof window === 'undefined' ? [] : []
)
})()
