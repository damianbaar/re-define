(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['b','async'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('b'),require('async'))
  } else {
    var b = b
    var async = parent.async
  
    parent['module_name'] = factory(b,async)
  }
  }(this, function (b,async) {

    this.b = b;   this.async = async; 
  
    
    (function(context) {
      context['jquery'] = (function(scope) { 
      
        scope['lib-2/dep1'] = (function(exports) { 
          exports = { name: 'dep' };
          return exports
        })({});
        
        scope['lib/dep1'] = (function(exports) { 
          var a = require('lib-2/dep1');
          exports = { name: 'dep' };
          return exports
        })({});
        
        scope['jquery'] = (function(exports) { 
          var a = require('lib/dep1');
          require('lib-2/dep1');
          var a = 'jquery';
          exports = { name: a };
          return exports
        })({});
        
        return scope['jquery']
        function require(name) { return scope[name] || context[name] }
      })({});
    })(this);
  
     
    (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
        define('d3', ['b'], factory);
      } else if (typeof exports === 'object') {
        exports = factory(require('b'));
      } else {
        root.d3 = factory(root.b);
      }
    }(this, function (b) {
      return { d3: 'd3' };
    }));;
    
    
    (function(context) {
      context['main'] = (function(scope) { 
      
        scope['model/helper'] = (function(exports) { 
          var async = require('async');
          exports = { getAsync: async };
          return exports
        })({});
        
        scope['model/model'] = (function(exports) { 
          var helper = require('model/helper');
          var async = helper.getAsync();
          exports = {
            getData: function () {
              return async ? 'async_data' : 'data';
            }
          };
          return exports
        })({});
        
        scope['view/template.html'] = '<li></li><li></li><li></li><li></li>'
    
        scope['view/helper'] = (function(exports) { 
          exports = {
            escape: function () {
            }
          };
          return exports
        })({});
        
        scope['view/type'] = (function(exports) { 
          exports.js = 'ast';
          exports.html = 'raw';
          return exports
        })({});
        
        scope['view/view'] = (function(exports) { 
          var model = require('model/model'), tmpl = require('view/template.html'), helper = require('view/helper'), type = require('view/type');
          exports = function () {
            return {
              model: model.getData(),
              view: tmpl,
              helper: helper
            };
          };
          return exports
        })({});
        
        scope['template.html'] = '<div id="module_name">test</div>'
    
        scope['main'] = (function(exports) { 
          var $ = require('jquery');
          var d3 = require('d3');
          var model = require('model/model');
          var view = require('view/view');
          var template = require('template.html');
          function getTemplate() {
            return template;
          }
          exports = {
            jquery: $,
            d3: d3,
            model: model,
            view: view,
            template: template
          };
          return exports
        })({});
        
        return scope['main']
        function require(name) { return scope[name] || context[name] }
      })({});
    })(this);
  

   return this['main']
  

}.bind({})))
