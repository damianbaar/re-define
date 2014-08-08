(function(parent, factory) {
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['async', 'jquery2', './does_not_exists', 'dep1', 'dep2'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('async'), require('jquery2'), require('./does_not_exists'), require('dep1'), require('dep2'))
  } else {
    var async = parent.async
    var jquery2 = jquery2
    var _does_not_exists = parent.test
    var dep1 = dep1
    var dep2 = dep2

    parent['module_name'] = factory(async, jquery2, _does_not_exists, dep1, dep2)
  }
}(this, function(async, jquery2, _does_not_exists, dep1, dep2) {
  var window = this
  this.async = async;
  this.jquery2 = jquery2;
  this._does_not_exists = _does_not_exists;
  this.dep1 = dep1;
  this.dep2 = dep2;



  (function(context) {
    context['jquery'] = (function(scope) {


      scope['lib-2/dep1'] = (function(exports) {
        exports = {
          name: 'dep'
        }; return exports
      })({});


      scope['lib/dep1'] = (function(exports) {
        var a = require('lib-2/dep1');
        exports = {
          name: 'dep'
        }; return exports
      })({});


      scope['jquery'] = (function(exports) {
        var a = require('lib/dep1');
        require('lib-2/dep1');
        var a = 'jquery';
        exports = {
          name: a
        }; return exports
      })({});

      return require('jquery')
      function require(name) {
        return scope[name] || context[name]
      }
    })({});
  })(this);


  (function(context) {
    context['d3'] = (function(scope) {


      scope['dep1'] = (function(exports) {
        exports = {
          test: 'test'
        }; return exports
      })({});



      (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
          define('d3', [
            'dep1',
            'dep2'
          ], factory);
        } else if (typeof exports === 'object') {
          exports = factory(require('dep1'), require('dep2'));
        } else {
          root.d3 = factory(root.dep1, root.dep2);
        }
      }(window, function(b) {
        return {
          d3: 'd3'
        };
      }));

      return require('d3')
      function require(name) {
        return scope[name] || context[name]
      }
    })({});
  })(this);


  (function(context) {
    context['lodash'] = (function(scope) {



      (function(parent) {
        var dne = require('./does_not_exists'),
          $ = require('jquery'),
          d3 = require('d3');
        parent.lodash = 'lodash here';
      }(window));

      return require('lodash')
      function require(name) {
        return scope[name] || context[name]
      }
    })({});
  })(this);


  (function(context) {
    context['main'] = (function(scope) {


      scope['model/helper'] = (function(exports) {
        var async = require('async') || function() {};
        exports = {
          getAsync: async
        }; return exports
      })({});


      scope['model/model'] = (function(exports) {
        var helper = require('model/helper');
        var async = helper.getAsync();
        exports = {
          getData: function() {
            return async ? 'async_data' : 'data';
          }
        }; return exports
      })({});

      scope['view/template.html'] = '<li></li><li></li><li></li><li></li>'


      scope['view/helper'] = (function(exports) {
        exports = {
          escape: function() {}
        }; return exports
      })({});


      scope['view/type'] = (function(exports) {
        exports.js = 'ast';
        exports.html = 'raw'; return exports
      })({});


      scope['view/view'] = (function(exports) {
        var tmpl = require('view/template.html'),
          model = require('model/model'),
          helper = require('view/helper'),
          type = require('view/type');
        exports = function() {
          return {
            model: model.getData(),
            view: tmpl,
            helper: helper
          };
        }; return exports
      })({});

      scope['template.html'] = '<div id="module_name">test</div>'


      scope['main'] = (function(exports) {
        var _ = require('lodash');
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
          template: template,
          lodash: _
        }; return exports
      })({});

      return require('main')
      function require(name) {
        return scope[name] || context[name]
      }
    })({});
  })(this);


  return this['main']


}.bind({})))
