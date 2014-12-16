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
  



var __req = 

//externals: dep2,async/async,lodash/dep1 
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
'jquery/lib-2/dep1': [function(exports, require, module, __filename, __dirname) { 
    return { name: 'dep' };
}, {"__filename":"","__dirname":""}], 
'jquery/lib/dep1': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib-2/dep1');
    return { name: 'dep' };
}, {"__filename":"","__dirname":""}], 
'd3/dep1': [function(exports, require, module, __filename, __dirname) { 
    module.exports = { test: 'test' };
}, {"__filename":"","__dirname":""}], 
'd3': [function(exports, require, module, __filename, __dirname) { 
    (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
        define([
          'dep1',
          'dep2'
        ], factory);
      } else if (typeof exports === 'object') {
        module.exports = factory(require('d3/dep1'), require('dep2'));
      } else {
        root.returnExports = factory(root.dep1, root.dep2);
      }
    }(this, function (b) {
      return { d3: 'd3' };
    }));
}, {"__filename":"","__dirname":""}], 
'jquery': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
}, {"__filename":"","__dirname":""}], 
'lodash': [function(exports, require, module, __filename, __dirname) { 
    var $ = require('jquery'), d3 = require('d3');
    module.exports = 'lodash here';
}, {"__filename":"","__dirname":""}], 
'jquery/jquery2': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
}, {"__filename":"","__dirname":""}], 
'nananana/model/helper': [function(exports, require, module, __filename, __dirname) { 
    var async = require('async/async') || function () {
      };
    return { getAsync: async };
}, {"__filename":"","__dirname":""}], 
'nananana/model/model': [function(exports, require, module, __filename, __dirname) { 
    var helper = require('nananana/model/helper');
    var async = helper.getAsync();
    return {
      getData: function () {
        return async ? 'async_data' : 'data';
      }
    };
}, {"__filename":"","__dirname":""}], 
'nananana/view/template.html': [function(exports, require, module, __filename, __dirname) { 
module.exports = "<li></li><li></li><li></li><li></li>"
}, {"__filename":"","__dirname":""}], 
'nananana/view/helper': [function(exports, require, module, __filename, __dirname) { 
    module.exports = {
      escape: function () {
      }
    };
}, {"__filename":"","__dirname":""}], 
'nananana/view/type': [function(exports, require, module, __filename, __dirname) { 
    exports.js = 'ast';
    exports.html = 'raw';
}, {"__filename":"","__dirname":""}], 
'nananana/view/view': [function(exports, require, module, __filename, __dirname) { 
    var tmpl = require('nananana/view/template.html'), model = require('nananana/model/model'), helper = require('nananana/view/helper'), type = require('nananana/view/type'), d3 = require('d3');
    module.exports = function () {
      return {
        model: model.getData(),
        view: tmpl,
        helper: helper
      };
    };
}, {"__filename":"","__dirname":""}], 
'nananana/template.html': [function(exports, require, module, __filename, __dirname) { 
module.exports = "<div id=\"module_name\" tabIndex=\"1\">test</div>"
}, {"__filename":"","__dirname":""}], 
'nananana': [function(exports, require, module, __filename, __dirname) { 
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
}, {"__filename":"","__dirname":""}]
}
,  function() { this.examples = this.examples || {};this.examples.umd = this.examples.umd || {}; return this.examples.umd }.call(this) 
, [closure,parent.test]
)

return __req('nananana')

}.bind({})))
