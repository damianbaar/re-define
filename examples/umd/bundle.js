//re-define version:1.14.0
//externals: dep1,dep2,async/async,lodash/dep1
;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('amd/name', ['dep1','dep2','async/async','lodash/dep1'], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory(require('dep1'),require('dep2'),require('async/async'),require('lodash/dep1'))
  } else {
    var dep1 =  parent.dep1
    var dep2 =  parent.dep2
    var async_async =  parent.async
    var lodash_dep1 =  parent.lodash_dep1
  
    parent["examples"] = parent["examples"] || {};
    parent["examples"]["umd"] = factory(dep1,dep2,async_async,lodash_dep1);

  }
  }(this, function (dep1,dep2,async_async,lodash_dep1) {
  var closure = {}

  closure['dep1'] = dep1
  closure['dep2'] = dep2
  closure['async/async'] = async_async
  closure['lodash/dep1'] = lodash_dep1
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

        namespace[name] = m
        f = f[0].apply(null, args)
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
'jquery/lib-2/dep1': [function(exports,require,module,define) { 
    return { name: 'dep' };
},null], 
'jquery/lib/dep1': [function(exports,require,module,define) { 
    var a = require('jquery/lib-2/dep1');
    return { name: 'dep' };
},null], 
'd3': [function(exports,require,module,define) { 
    (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
        define([
          'dep1',
          'dep2'
        ], factory);
      } else if (typeof exports === 'object') {
        module.exports = factory(require('dep1'), require('dep2'));
      } else {
        root.returnExports = factory(root.dep1, root.dep2);
      }
    }(this, function (b) {
      return { d3: 'd3' };
    }));
},null], 
'jquery': [function(exports,require,module,define) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
},null], 
'lodash': [function(exports,require,module) { 
    var $ = require('jquery');
    var d3 = require('d3');
    module.exports = 'lodash here';
}], 
'jquery/jquery2': [function(exports,require,module,define) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
},null], 
'nananana/model/helper': [function(exports,require,module,define) { 
    var async = require('async/async') || function () {
      };
    return { getAsync: async };
},null], 
'nananana/model/model': [function(exports,require,module,define) { 
    var helper = require('nananana/model/helper');
    var async = helper.getAsync();
    return {
      getData: function () {
        return async ? 'async_data' : 'data';
      }
    };
},null], 
'nananana/view/template.html': [function(exports,require,module) { 
module.exports = "<li></li><li></li><li></li><li></li>"
}], 
'nananana/view/helper': [function(exports,require,module) { 
    module.exports = {
      escape: function () {
      }
    };
}], 
'nananana/view/type': [function(exports,require,module) { 
    exports.js = 'ast';
    exports.html = 'raw';
}], 
'nananana/view/view': [function(exports,require,module) { 
    var tmpl = require('nananana/view/template.html');
    var model = require('nananana/model/model');
    var helper = require('nananana/view/helper');
    var type = require('nananana/view/type');
    var d3 = require('d3');
    module.exports = function () {
      return {
        model: model.getData(),
        view: tmpl,
        helper: helper
      };
    };
}], 
'nananana/template.html': [function(exports,require,module) { 
module.exports = "<div id=\"module_name\" tabIndex=\"1\">test</div>"
}], 
'nananana': [function(exports,require,module) { 
    var _ = require('lodash');
    var $ = require('lodash/dep1');
    var $2 = require('jquery');
    var d3 = require('jquery/jquery2');
    var model = require('d3');
    var view = require('nananana/model/model');
    var template = require('nananana/view/view');
    require('nananana/template.html');
    require('d3');
    var module = {
        jquery: $,
        d3: d3,
        model: model,
        view: view,
        template: template,
        lodash: _
      };
    return {
      draw: function () {
        document.querySelector('body').innerHTML = module.template;
        document.querySelector('#module_name').innerHTML = 'modules: ' + JSON.stringify({
          d3: !!module.d3,
          jquery: !!module.jquery,
          model: !!module.model,
          view: !!module.view,
          lodash: module.lodash
        }, null, 2);
      }
    };
}]
}
,  function() { this.examples = this.examples || {};this.examples.umd = this.examples.umd || {}; return this.examples.umd }.call(this) 
, typeof window === 'undefined' ? [] : [closure,parent.test]
)

return __req('nananana')

}.bind({})))
