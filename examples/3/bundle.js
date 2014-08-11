(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['d3'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'))
  } else {
    var d3 = parent.d3
  
    parent['module_name'] = factory(d3)
  }
  }(this, function (d3) {
    var context = this;

    this['d3'] = d3; 
   
    (function(context) {
      context['lib/main'] = (function(scope) { 
        
        scope['lib/a/d'] = (function(exports) { 
          
          var a = require('d3');
          a();
          exports = { name: 'dep2' }; 

          return exports; 
        })({});
    
        
        scope['lib/a/b/c'] = (function(exports) { 
          
          var d = require('lib/a/d');
          exports = { name: 'dep' }; 

          return exports; 
        })({});
    
        
        scope['lib/main'] = (function(exports) { 
          
          var b = require('lib/a/b/c');
          var d = require('lib/a/d');
          exports = [
            b,
            d
          ]; 

          return exports; 
        })({});
    

        return require('lib/main')

        function require(name) { return scope[name] || context[name] }

      }.bind(context))({});
    })(this);
  

   return this 

  function require(name) { return context[name] }
}.bind({})))
