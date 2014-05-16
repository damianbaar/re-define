//skipped: css -> styles
//external: external -> jquery,exports

(function (exports, factory) {
    if (typeof define === 'function' && define.amd) {
      define('my-component', [dotpath/inner, dotpath/fi-ve, one, deps/four], factory)
    } else {
      factory(dotpath/inner, dotpath/fi-ve, one, deps/four)
    }
}}(this, function (dotpath/inner, dotpath/fi-ve, one, deps/four) {
  'inner';
function (inner) {
      return inner;
    }(dotpath_inner);
var text_deps_template = function() { return "<li></li><li></li><li></li><li></li>" };
function (five, template, exports) {
      console.log(five, template, exports);
      return exports.one = function () {
        console.log(template());
      };
    }(dotpath_fi_ve, text_deps_template, exports);
function (inner) {
      return 'Yeah that\'s me, and I\'m in different folder' + inner;
    }(dotpath_inner);
var text_template = function() { return "<div>test</div><div></div><div></div><div></div>" };
(function (one, jquery, four, t1) {
      return [
        one,
        four,
        t1
      ];
    }(one, jquery, deps_four, text_template));;

}));
