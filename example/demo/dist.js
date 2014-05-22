//css   -> css!./styles.css  
//ext   -> jquery,dep/dep,exports 
//remap -> jquery,dep/dep,exports -> $,dep/dep,this['ns'] 
//skip  -> domReady! 
//namespace -> ns

(function (jquery,dep_dep,exports,factory) {
  if (typeof define === 'function' && define.amd) {
    define('my-component', ['jquery','dep/dep','exports','css!./styles.css'], factory)
   } else {
    factory(jquery,dep_dep,exports)
  }
}($,dep_dep,this['ns'], function (jquery,dep_dep,exports) {
  var two = 'two';
var dotpath_inner = function (two, jquery) {
    return 'inner' + two;
}(two, jquery);
var dotpath_fi_ve = function (inner) {
    return inner;
}(dotpath_inner);
var text_deps_template = "<li></li><li></li><li></li><li></li>";
var one = function (five, template, two, dep, exports) {
    console.log(five, template, exports);
    return exports.one = function () {
        console.log(template);
    };
}(dotpath_fi_ve, text_deps_template, two, dep_dep, exports);
var deps_four = (function(r_1400717557912) { var inner = r_1400717557912;
return 'Yeah that\'s me, I like better CommonJS style' + inner; })(dotpath_inner);
var text_template = "<div>test</div><div></div><div></div><div></div>";
(function (one, jquery, four, t1) {
    return [
        one,
        four,
        t1
    ];
}(one, jquery, deps_four, text_template));;
(function () { 
                     var css = document.createElement("style");
                     css.type = "text/css";
                     css.innerHTML = ".a {  color: #FFFF00 !important;}";
                     document.body.appendChild(css);
                   })();

}));
