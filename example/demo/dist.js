//css   -> css!./styles.css  
//ext   -> jquery,exports 
//remap -> jquery,exports -> $,this 
//skip  -> domReady! 
//namespace -> ns

(function (jquery,exports,factory) {
  if (typeof define === 'function' && define.amd) {
    define('my-component', ['jquery','exports','css!./styles.css'], factory)
   } else {
    factory(jquery,exports)
  }
}($,this, function (jquery,exports) {
  var dotpath_inner = 'inner';
var dotpath_fi_ve = function (inner) {
    return inner;
}(dotpath_inner);
var text_deps_template = "<li></li><li></li><li></li><li></li>";
var one = function (five, template, exports) {
    console.log(five, two, template, exports);
    return exports.one = function () {
        console.log(template());
    };
}(dotpath_fi_ve, text_deps_template, exports);
var deps_four = (function(r_1400357481915) { var inner = r_1400357481915;
return 'Yeah that\'s me, and I\'m in different folder' + inner; })(dotpath_inner);
var text_template = "<div>test</div><div></div><div></div><div></div>";
(function (one, jquery, four, t1) {
    return [
        one,
        four,
        t1
    ];
}(one, jquery, deps_four, text_template));;

}));
