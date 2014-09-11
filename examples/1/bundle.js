{}
(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('amd/name', ['d3/d3','dep1','dep2','does_not_exist','async'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3/d3'),require('dep1'),require('dep2'),require('does_not_exist'),require('async'))
  } else {
    var d3_d3 =  parent.d3_d3
    var dep1 =  parent.dep1
    var dep2 =  parent.dep2
    var does_not_exist =  parent.does_not_exist
    var async =  parent.async
  
    parent.global = parent.global || {};
parent.global.name = factory(d3_d3,dep1,dep2,does_not_exist,async);

  }
  }(this, function (d3_d3,dep1,dep2,does_not_exist,async) {
    var context = this;

    this['d3/d3'] = d3_d3; 
    this['dep1'] = dep1; 
    this['dep2'] = dep2; 
    this['does_not_exist'] = does_not_exist; 
    this['async'] = async; 
   
    (function(context) {
      context['jquery'] = (function(scope) { 
        
        scope['lib-2/dep1'] = (function(exports) { 
          
          exports = { name: 'dep' }; 

          return exports; 
        })({});
    
        
        scope['lib/dep1'] = (function(exports) { 
          
          var a = require('lib-2/dep1');
          exports = { name: 'dep' }; 

          return exports; 
        })({});
    
        
        scope['jquery'] = (function(exports) { 
          
          var a = require('lib/dep1');
          require('lib-2/dep1');
          require('d3/d3');
          var a = 'jquery';
          exports = { name: a }; 

          return exports; 
        })({});
    

        return require('jquery')

        function require(name) { return scope[name] || context[name] }

      }.bind(context))({});
    })(this);
  
    (function(context) {
      context['d3'] = (function(scope) { 
        
        scope['dep1'] = (function(exports) { 
          
          exports = { test: 'test' }; 

          return exports; 
        })({});
    
         
    (function (root, factory) {
      if (typeof define === 'function' && define.amd) {
        define('d3', [
          'dep1',
          'dep2'
        ], factory);
      } else if (typeof exports === 'object') {
        module.exports = factory(require('dep1'), require('dep2'));
      } else {
        root.d3 = factory(root.dep1, root.dep2);
      }
    }(this, function (b) {
      return { d3: 'd3' };
    }));;
        

        return require('d3')

        function require(name) { return scope[name] || context[name] }

      }.bind(context))({});
    })(this);
  
    (function (parent) {
      var dne = require('does_not_exist'), $ = require('jquery'), d3 = require('d3');
      parent.lodash = 'lodash here';
    }(this));; 
    
    (function(context) {
      context['main'] = (function(scope) { 
        
        scope['model/helper'] = (function(exports) { 
          
          var async = require('async') || function () {
            };
          exports = { getAsync: async }; 

          return exports; 
        })({});
    
        
        scope['model/model'] = (function(exports) { 
          
          var helper = require('model/helper');
          var async = helper.getAsync();
          exports = {
            getData: function () {
              return async ? 'async_data' : 'data';
            }
          }; 

          return exports; 
        })({});
    
        
        scope['view/template.html'] = '<li></li><li></li><li></li><li></li>'; 
        
        scope['view/helper'] = (function(exports) { 
          
          exports = {
            escape: function () {
            }
          }; 

          return exports; 
        })({});
    
        
        scope['view/type'] = (function(exports) { 
          
          exports.js = 'ast';
          exports.html = 'raw'; 

          return exports; 
        })({});
    
        
        scope['view/view'] = (function(exports) { 
          
          var tmpl = require('view/template.html'), model = require('model/model'), helper = require('view/helper'), type = require('view/type'), d3 = require('d3');
          exports = function () {
            return {
              model: model.getData(),
              view: tmpl,
              helper: helper
            };
          }; 

          return exports; 
        })({});
    
        
        scope['template.html'] = '<div id=\'module_name\' tabIndex=\'1\'>test</div>'; 
        
        scope['main'] = (function(exports) { 
          
          var _ = require('lodash');
          var $ = require('jquery');
          var d3 = require('d3');
          var model = require('model/model');
          var view = require('view/view');
          var template = require('template.html');
          require('d3/d3');
          function getTemplate() {
            return template;
          }
          exports = {
            jquery: $,
            d3: d3,
            model: model,
            view: view,
            template: template,
            lodash: _
          }; 

          return exports; 
        })({});
    

        return require('main')

        function require(name) { return scope[name] || context[name] }

      }.bind(context))({});
    })(this);
  

   return this['main']
  

  function require(name) { return context[name] }
}.bind({})))
