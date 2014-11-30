(function (parent, factory){
  if (typeof exports === 'object') {
    module.exports = factory(require('components/profile'),require('components/lookup'),require('jquery'))
  } else {
    var jquery =  parent.$
    

    parent["ns"] = parent["ns"] || {};
    parent["ns"]["org"] = parent["ns"]["org"] || {};
    parent["ns"]["org"]["app"] = factory(jquery);

  }
  }(this, function (jquery) {

  var closure = {}

  closure['jquery'] = jquery
  

var __req = //externals: components/profile,components/lookup,jquery 
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
'app': [function(exports, require, module, __filename, __dirname) { 
    var profile = require('components/profile'), lookup = require('components/lookup'), $ = require('jquery');
    module.exports = {
      start: function () {
        console.log(profile);
        console.log(lookup);
        console.log($);
        console.log('start');
      }
    };
}, {"__filename":"","__dirname":""}]
}
,  function() { this.ns = this.ns || {};this.ns.org = this.ns.org || {};this.ns.org.app = this.ns.org.app || {}; return this.ns.org.app }.call(this) 
, [closure,ns.org.components]
)

return __req('app')

}.bind({})))
