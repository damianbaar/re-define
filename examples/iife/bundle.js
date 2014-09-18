(function (parent,dep2,async_async) {

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
        f = f[0].call(m, m, require, m, f[1].__filename, f[1].__dirname);
        namespace[name] = f || m.exports;
      } else {
        if(!imports) throw new Error('Module does not exists ' + name);

        var mod;
        for(var i=0; i < imports.length; i++) {
          mod = imports[i][name];
          if(mod) return mod;
        }

        if(!mod) throw new Error('Module does not exists ' + name);
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
}, {"__filename":"dep1.js","__dirname":"node_modules/jquery/lib-2"}], 
'jquery/lib/dep1': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib-2/dep1');
    return { name: 'dep' };
}, {"__filename":"dep1.js","__dirname":"node_modules/jquery/lib"}], 
'd3/dep1': [function(exports, require, module, __filename, __dirname) { 
    module.exports = { test: 'test' };
}, {"__filename":"dep1.js","__dirname":"node_modules/d3"}], 
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
}, {"__filename":"index.js","__dirname":"node_modules/d3"}], 
'jquery': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
}, {"__filename":"jquery.js","__dirname":"node_modules/jquery"}], 
'lodash': [function(exports, require, module, __filename, __dirname) { 
    var $ = require('jquery'), d3 = require('d3');
    console.log('from lodash', $, d3);
    module.exports = 'lodash here';
}, {"__filename":"lodash.js","__dirname":"vendor/lodash"}], 
'jquery2': [function(exports, require, module, __filename, __dirname) { 
    var a = require('jquery/lib/dep1');
    require('jquery/lib-2/dep1');
    require('d3');
    var a = 'jquery';
    module.exports = { name: a };
}, {"__filename":"jquery2.js","__dirname":"node_modules/jquery"}], 
'nananana/model/helper': [function(exports, require, module, __filename, __dirname) { 
    var async = require('async/async') || function () {
      };
    return { getAsync: async };
}, {"__filename":"helper.js","__dirname":"model"}], 
'nananana/model/model': [function(exports, require, module, __filename, __dirname) { 
    var helper = require('nananana/model/helper');
    var async = helper.getAsync();
    return {
      getData: function () {
        return async ? 'async_data' : 'data';
      }
    };
}, {"__filename":"model.js","__dirname":"model"}], 
'nananana/view/template.html': [function(exports, require, module, __filename, __dirname) { 
module.exports = '<li></li><li></li><li></li><li></li>'
}, {"__filename":"template.html","__dirname":"view"}], 
'nananana/view/helper': [function(exports, require, module, __filename, __dirname) { 
    module.exports = {
      escape: function () {
      }
    };
}, {"__filename":"helper.js","__dirname":"view"}], 
'nananana/view/type': [function(exports, require, module, __filename, __dirname) { 
    exports.js = 'ast';
    exports.html = 'raw';
}, {"__filename":"type.js","__dirname":"view"}], 
'nananana/view/view': [function(exports, require, module, __filename, __dirname) { 
    var tmpl = require('nananana/view/template.html'), model = require('nananana/model/model'), helper = require('nananana/view/helper'), type = require('nananana/view/type'), d3 = require('d3');
    module.exports = function () {
      return {
        model: model.getData(),
        view: tmpl,
        helper: helper
      };
    };
}, {"__filename":"view.js","__dirname":"view"}], 
'nananana/template.html': [function(exports, require, module, __filename, __dirname) { 
module.exports = '<div id=\'module_name\' tabIndex=\'1\'>test</div>'
}, {"__filename":"template.html","__dirname":"."}], 
'nananana': [function(exports, require, module, __filename, __dirname) { 
    var _ = require('lodash');
    var $ = require('jquery');
    var $2 = require('jquery2');
    var d3 = require('d3');
    var model = require('nananana/model/model');
    var view = require('nananana/view/view');
    var template = require('nananana/template.html');
    require('d3');
    var module = {
        jquery: $,
        d3: d3,
        model: model,
        view: view,
        template: template,
        lodash: _
      };
    document.querySelector('body').innerHTML = module.template;
    document.querySelector('#module_name').innerHTML = 'modules: ' + JSON.stringify({
      d3: !!module.d3,
      jquery: !!module.jquery,
      model: !!module.model,
      view: !!module.view,
      lodash: module.lodash
    }, null, 2);
    window.page = module;
    return { index: true };
}, {"__filename":"index.js","__dirname":"."}]
}
, {} 
, [closure,parent.test]
)

 return require('nananana') 

}.call({},this,dep2,this.async))
