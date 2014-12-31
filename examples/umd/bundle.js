;(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('amd/name', ['dep2','async/async','lodash/dep1'], factory)
  } else if (typeof module === "object" && !!module.exports) {
    module.exports = factory(require('dep2'),require('async/async'),require('lodash/dep1'))
  } else {
    var dep2 =  parent.dep2
    var async_async =  parent.async
    var lodash_dep1 =  parent.lodash_dep1
  
    parent["examples"] = parent["examples"] || {};
    parent["examples"]["umd"] = factory(dep2,async_async,lodash_dep1);

  }
  }(this, function (dep2,async_async,lodash_dep1) {
  var closure = {}

  closure['dep2'] = dep2
  closure['async/async'] = async_async
  closure['lodash/dep1'] = lodash_dep1
  var __req = //externals: dep2,async/async,lodash/dep1 
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

  for(var name in modules) __req(name);

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
'dep1': [function(exports,require,module) { 
    module.exports = { test: 'test' };
}], 
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
    var $ = require('jquery'), d3 = require('d3');
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
    var tmpl = require('nananana/view/template.html'), model = require('nananana/model/model'), helper = require('nananana/view/helper'), type = require('nananana/view/type'), d3 = require('d3');
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
, window ? [closure,parent.test] : []
)

return __req('index.js')

}.bind({})))
