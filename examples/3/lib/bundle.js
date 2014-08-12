(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['d3/d3','d3'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3/d3'),require('d3'))
  } else {
    var d3_d3 = d3_d3
    var d3 = d3
  
    parent['module_name'] = factory(d3_d3,d3)
  }
  }(this, function (d3_d3,d3) {
    var context = this;

    this['d3/d3'] = d3_d3; 
    this['d3'] = d3; 
   
    (function(context) {
      context['main'] = (function(scope) { 
        
        scope['a/d'] = (function(exports) { 
          
          var a = require('d3');
          a();
          exports = { name: 'dep2' }; 

          return exports; 
        })({});
    
        
        scope['a/b/c'] = (function(exports) { 
          
          var d = require('a/d');
          var a = require('d3');
          exports = { name: 'dep' }; 

          return exports; 
        })({});
    
        
        scope['js/dep-amd'] = (function(exports) { 
          
          var d = require('d3/d3');
          exports = d; 

          return exports; 
        })({});
    
        
        scope['js/dep-cjs'] = (function(exports) { 
          
          var d3 = require('d3/d3'); 

          return exports; 
        })({});
    
        
        scope['main'] = (function(exports) { 
          
          var d3 = require('d3/d3');
          var b = require('a/b/c');
          var d = require('a/d');
          var a = require('js/dep-amd');
          var b = require('js/dep-cjs');
          exports = [
            b,
            d
          ]; 

          return exports; 
        })({});
    

        return require('main')

        function require(name) { return scope[name] || context[name] }

      }.bind(context))({});
    })(this);
  

   return this 

  function require(name) { return context[name] }
}.bind({})))
