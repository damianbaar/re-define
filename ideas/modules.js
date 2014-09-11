this.ns = {};
this.ns.comp = {};

//file - 1
(function(require, register) {

  register('test', function() { return 'from common' });

}).apply({}, (function(global, common, internal) {
  return [ 
    function(module) { return internal[module] || common[module] || global[module]; }
  , function(name, factory) { global['common/' + name] = internal['common/' + name] = factory; }
  ]
})(this.ns.comp, {}));

//file - 2
(function(require, register) {

  register('mod-1', function(exports) { 
    return require('common/test'); 
  }.call({}));

}).apply({}, (function(global, internal) {
  return [ 
    function(module) { return internal[module] || global[module]; }
  , function(name, factory) { global[name] = internal[name] = factory; }
  ]
})(this.ns.comp, {}));

console.log(this.common)


// function component_namespace(parent) {
//   var a = a || {};
//   a.b = a.b || {};
//
//   //register external
//   //map externals
//   
//   a.b.expose = function(module, factory) {
//     a.b[module] = factory()
//
//     return factory
//   }
//
//   a.b.register = function(scope, module, facory) {
//   }
//
//   return a.b
// }
//
// (function(ns) {
//   ns['lib'] = ns['lib'] || {}
//   ns['lib']['common/a'] = function c() { console.log('common c') }
// })(component_namespace(this));
//
// (function(ns) {
//   ns.register('lib', 'entry-1', function(exports) {
//     var a = require('common/a');
//
//     exports = function () {
//       return [a];
//     };
//
//     return exports;
//   })({});
//
//   }
// })(component_namespace(this));
//
//
