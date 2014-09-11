var a = {};
//globals/external
//{'external': function() { return window.external }}
(function (modules, namespace, global) {
  function require(name){
    if(!namespace[name]) {
      var m = namespace[name] = {exports:{}};
      modules[name][0].call(m.exports, require, m, m.exports)
    }
    return namespace[name].exports;
  }

  for(var name in modules) require(name);
  return require;
})({'d3': [
      function(require, module, exports) { 
        module.exports = 'd3'
    }]
  }
, a
, window
)

(function (modules, namespace, global) {
  function require(name){
    if(!namespace[name]) {
      var m = namespace[name] = {exports:{}};
      debugger
      modules[name][0].call(m.exports, function(x){
        //fallback to global
        var id = modules[name][0][x];
        return require(id ? id : x);
      }, m, m.exports)
    }
    return namespace[name].exports;
  }

  for(var name in modules) {
    // if(details && details.entry) require(name);
    // if(details && details.expose) global[details.expose] = require(name);

    require(name);
  }

  return require;
})({'folder/common': [
      function(require, module, exports) { 
        module.exports = 'test'
    }, { expose: 'folder_common' }]
  , 'folder/lib': [
    function(require, module, exports) { 
      var a = require('folder/common')
        , d3 = require('d3')
      console.log(a, d3)
    }, { entry: true }]
  }
, a
, window
)
