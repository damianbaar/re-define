(function (parent, factory){
  if (typeof exports === 'object') {
    module.exports = factory(require('jquery'))
  } else {
    var jquery =  parent.$
    

    parent["ns"] = parent["ns"] || {};
    parent["ns"]["org"] = parent["ns"]["org"] || {};
    parent["ns"]["org"]["app"] = factory(jquery);

  }
  }(this, function (jquery) {
  var closure = {}

  closure['jquery'] = jquery
  

var __req = //externals: jquery 
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
'app': [function(exports,require,module) { 
    var profile = require('components/profile');
    var lookup = require('components/lookup');
    var $ = require('jquery');
    module.exports = {
      start: function () {
        console.log(profile);
        console.log(lookup);
        console.log($);
        console.log('start');
      }
    };
}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.app = this.ns.org.app || {}; return this.ns.org.app }.call(this) 
, typeof window === 'undefined' ? [] : [closure,ns.org.components]
)

return __req('app')

}.bind({})))
