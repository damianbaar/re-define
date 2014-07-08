(function(parent, factory) {
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['b', 'async'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('b'), require('async'))
  } else {
    var b = b
    var async = parent.async

    parent['module_name'] = factory(b, async)
  }
}(this, function(b, async) {
  this.b = b, this.async = async



  this['jquery'] = (function() {
    var __context = this
    var _scope_ = {}
    _scope_['lib-2/dep1'] = (function() {
      return {
        name: 'dep'
      };
    })();
    _scope_['lib/dep1'] = (function() {
      var a = require('lib-2/dep1');
      return {
        name: 'dep'
      };
    })();
    _scope_['jquery'] = (function() {
      var a = require('lib/dep1');
      require('lib-2/dep1');
      var a = 'jquery';
      return {
        name: a
      };
    })();

    return _scope_['jquery']

    function require(name) {
      return __context[name] || _scope_[name]
    }
  })
  .call(this);

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define('d3', ['b'], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory(require('b'));
    } else {
      root.d3 = factory(root.b);
    }
  }(this, function(b) {
    return {
      d3: 'd3'
    };
  }));;


  this['main'] = (function() {
    var __context = this
    var _scope_ = {}
    _scope_['model/helper'] = (function() {
      var async = require('async');
      return {
        getAsync: async
      };
    })();
    _scope_['model/model'] = (function() {
      var helper = require('model/helper');
      var async = helper.getAsync();
      return {
        getData: function() {
          return async ? 'async_data' : 'data';
        }
      };
    })();
    _scope_['text!./view/template.html'] = '<li></li><li></li><li></li><li></li>';
    _scope_['view/view'] = (function() {
      var model = require('model/model'),
        tmpl = require('text!./view/template.html');
      return function() {
        return {
          model: model.getData(),
          view: tmpl
        };
      };
    })();
    _scope_['text!./template.html'] = '<div id="module_name">test</div>';
    _scope_['main'] = (function() {
      var $ = require('jquery');
      var d3 = require('d3');
      var model = require('model/model');
      var view = require('view/view');
      var template = require('text!./template.html');
      return {
        jquery: $,
        d3: d3,
        model: model,
        view: view,
        template: template
      };
    })();

    return _scope_['main']

    function require(name) {
      return __context[name] || _scope_[name]
    }
  })
  .call(this);


  return this['main']
}.bind({})))
