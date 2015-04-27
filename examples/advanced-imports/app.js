//re-define version:1.14.6
//externals: jquery
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
