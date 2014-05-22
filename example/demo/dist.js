//css   -> css!./styles.css  
//ext   -> jquery,dep/dep 
//skip  -> domReady! 
//namespace -> ns

(function (parent, exports, factory){
  if (typeof define === 'function' && define.amd) {
    define('my-component', ['jquery','dep/dep','css!./styles.css'], factory)
   } else {
     var jquery = parent.$
     var dep_dep = parent['ns'].dep
    
    factory(jquery,dep_dep,exports)
  }
}(this, parent['ns'], function (jquery,dep_dep) {
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
var deps_four = (function(r_0) { var inner = r_0;
return 'Yeah that\'s me, I like better CommonJS style' + inner; })(dotpath_inner);
var text_template = "<div>test</div><div></div><div></div><div></div>";
var m_0 = (function (one, jquery, four, t1) {
    return [
        one,
        four,
        t1
    ];
}(one, jquery, deps_four, text_template));;


  return one
}));
