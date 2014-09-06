var ns = (function(parent) {
  var a = a || {};
  a.b = a.b || {};

  a.b.expose = function(module, factory) {
    a.b[module] = factory()

    return factory
  }

  return a.b
})(this);

(function(parent) {
  //cutting-points
  parent['common/a'] = c;

  function c() { console.log('common c') }
})(ns);

(function(parent) {
  var context = this;

  (function(context) {
    context['entry-2'] = (function(scope) {
      scope['entry-2'] = (function(exports) {
        var a = require('common/a');

        exports = function () {
          return [a];
        };

        return exports;
      })({});

      return parent.expose('a', 'entry-2', scope['entry-2']);

      function require(name) { 
        return scope[name] || context[name] || parent[name];
      }

    }.bind(context))({});
  })(context);

}.bind({}))(ns);
