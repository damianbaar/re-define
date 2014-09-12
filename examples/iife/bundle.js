!function (parent,dep2,async_async) {

var closure = {}

closure['dep2'] = dep2
closure['async/async'] = async_async

var require = //externals: dep2,async/async 
(function (modules, namespace, imports) {
  function require(name){
    if(!namespace[name]) {
      var m = {exports:{}}
        , f = modules[name]

      if(f) {
        f = f[0].call(m, m.exports, require, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i][name];
          if(mod) return;
        }

        if(!mod) throw new Error('Module does not exists ' + name);
        else return mod;
      }
    }
    return namespace[name];
  }

  for(var name in modules) require(name);
  return require;
})
({ 
'jquery/lib-2/dep1': [function(exports, require, module, __filename, __dirname) { 
    return { name: 'dep' };
}, {"__filename":"node_modules/jquery/lib-2/dep1.js","__dirname":"node_modules/jquery/lib-2"}], 
'jquery/lib/dep1': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib-2/dep1');
    return { name: 'dep' };
}, {"__filename":"node_modules/jquery/lib/dep1.js","__dirname":"node_modules/jquery/lib"}], 
'd3/dep1': [function(exports, require, module, __filename, __dirname) { 
    module.exports = { test: 'test' };
}, {"__filename":"node_modules/d3/dep1.js","__dirname":"node_modules/d3"}], 
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
}, {"__filename":"node_modules/d3/d3.js","__dirname":"node_modules/d3"}], 
'jquery': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
}, {"__filename":"node_modules/jquery/jquery.js","__dirname":"node_modules/jquery"}], 
'lodash': [function(exports, require, module, __filename, __dirname) { 
    (function (parent) {
      var $ = require('jquery'), d3 = require('d3');
      parent.lodash = 'lodash here';
    }(this));
}, {"__filename":"vendor/lodash.js","__dirname":"vendor"}], 
'iife/lib/model/helper': [function(exports, require, module, __filename, __dirname) { 
    var async = require('async/async') || function () {
      };
    return { getAsync: async };
}, {"__filename":"lib/model/helper.js","__dirname":"lib/model"}], 
'iife/lib/model/model': [function(exports, require, module, __filename, __dirname) { 
    var helper = require('iife/lib/model/helper');
    var async = helper.getAsync();
    return {
      getData: function () {
        return async ? 'async_data' : 'data';
      }
    };
}, {"__filename":"lib/model/model.js","__dirname":"lib/model"}], 
'iife/lib/view/template.html': [function(exports, require, module, __filename, __dirname) { '<li></li><li></li><li></li><li></li>'
}, {"__filename":"lib/view/template.html","__dirname":"lib/view"}], 
'iife/lib/view/helper': [function(exports, require, module, __filename, __dirname) { 
    module.exports = {
      escape: function () {
      }
    };
}, {"__filename":"lib/view/helper.js","__dirname":"lib/view"}], 
'iife/lib/view/type': [function(exports, require, module, __filename, __dirname) { 
    exports.js = 'ast';
    exports.html = 'raw';
}, {"__filename":"lib/view/type.js","__dirname":"lib/view"}], 
'iife/lib/view/view': [function(exports, require, module, __filename, __dirname) { 
    var tmpl = require('iife/lib/view/template.html'), model = require('iife/lib/model/model'), helper = require('iife/lib/view/helper'), type = require('iife/lib/view/type'), d3 = require('d3');
    module.exports = function () {
      return {
        model: model.getData(),
        view: tmpl,
        helper: helper
      };
    };
}, {"__filename":"lib/view/view.js","__dirname":"lib/view"}], 
'iife/lib/template.html': [function(exports, require, module, __filename, __dirname) { '<div id=\'module_name\' tabIndex=\'1\'>test</div>'
}, {"__filename":"lib/template.html","__dirname":"lib"}], 
'iife': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash');
    var $ = require('jquery');
    var d3 = require('d3');
    var model = require('iife/lib/model/model');
    var view = require('iife/lib/view/view');
    var template = require('iife/lib/template.html');
    require('d3');
    function getTemplate() {
      return template;
    }
    return {
      jquery: $,
      d3: d3,
      model: model,
      view: view,
      template: template,
      lodash: _
    };
}, {"__filename":"lib/index.js","__dirname":"lib"}]
}
, function() { this.your = this.your || {};this.your.namespace = this.your.namespace || {}; return this.your.namespace }.call(this)
, [closure,parent.test]
)

 return require('iife') 

}.call({},this,dep2,this.async)
