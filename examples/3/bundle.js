(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('test', ['d3/d3','d3'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3/d3'),require('d3'))
  } else {
    var d3_d3 =  parent.d3_d3
    var d3 =  parent.d3
  
    parent.a = parent.a || {};
parent.a.b = parent.a.b || {};
parent.a.b.c = parent.a.b.c || {};
parent.a.b.c.d = factory(d3_d3,d3);

  }
  }(this, function (d3_d3,d3) {
    var context = this;

    this['d3/d3'] = d3_d3; 
    this['d3'] = d3; 
   
    (function(context) {
      context['.'] = (function(scope) { 
        
        scope['z/dep'] = (function(exports) { 
          
          var d3 = require('d3/d3');
          d3(); 

          return exports; 
        })({});
    
        
        scope['a/d'] = (function(exports) { 
          
          var a = require('d3');
          var z = require('z/dep');
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
          
          var d3 = require('js/d3/d3'); 

          return exports; 
        })({});
    
        
        scope['main'] = (function(exports) { 
          
          var z = require('z/dep');
          var d3 = require('d3/d3');
          var b = require('a/b/c');
          var d = require('a/d');
          var a = require('js/dep-amd')();
          var b = require('js/dep-cjs');
          var z = require('test.json');
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
  

   return this['main']
  

  function require(name) { return context[name] }
}.bind({})))
