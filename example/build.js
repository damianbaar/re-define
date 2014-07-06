(function(parent, factory) {
  if (typeof define === 'function' && define.amd) {
    define('module_name', ['async'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('async'))
  } else {
    var async = this.async

    parent['module_name'] = factory(async)
  }
}(this, function(async) {
  this.async = async



  (function() {
    var _scope_ = {}
    var lib_2_dep1 = _scope_['lib-2/dep1'] = (function() {
      return {
        name: 'dep'
      };
    })()
    var lib_dep1 = _scope_['lib/dep1'] = (function() {
      var a = require('lib-2/dep1');
      return {
        name: 'dep'
      };
    })()
    var jquery = _scope_['jquery'] = (function() {
      var a = require('lib/dep1');
      var a = 'jquery';
      return {
        name: a
      };
    })()

    function require(name) {
      return this[name] || _scope_[name]
    }
  }).call(this);

  (function(parent) {
      return parent.d3 = {
        name: 'd3'
      }
    })(this)



    (function() {
      var _scope_ = {}
      var model_helper = _scope_['model/helper'] = (function() {
        var async = require('async');
        return {
          getAsync: async
        };
      })()
      var model_model = _scope_['model/model'] = (function() {
        var helper = require('model/helper');
        var async = helper.getAsync();
        return {
          getData: function() {
            return async ? 'async_data' : 'data';
          }
        };
      })()
      var text__view_template_html = _scope_['text!./view/template.html'] = '<li></li><li></li><li></li><li></li>'
      var view_view = _scope_['view/view'] = (function() {
        var model = require('model/model'),
          tmpl = require('text!./view/template.html');
        return function() {
          return {
            model: model.getData(),
            view: tmpl
          };
        };
      })()
      var text__template_html = _scope_['text!./template.html'] = '<div>test</div><div></div><div></div><div></div>'
      var main = _scope_['main'] = (function() {
        var $ = require('jquery');
        var d3 = require('d3');
        var model = require('model/model');
        var view = require('view/view');
        var template = require('text!./template.html');
        return [
          $,
          d3,
          model,
          view,
          template
        ];
      })()

      function require(name) {
        return this[name] || _scope_[name]
      }
    }).call(this);


  return this.main
}))
