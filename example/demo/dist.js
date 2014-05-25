(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('component', ['jquery','dep/dep','css!./styles.css'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'),require('dep/dep'))
  } else {
    var jquery = parent.$
    var dep_dep = parent.dep
    
    parent['components'] = factory(jquery,dep_dep)
  }
}(this, function (jquery,dep_dep) {
  var two = (function(r_1) { var $ = r_1;
return 'two'; })(jquery);
var dotpath_inner = function (two, jquery) {
    return 'inner' + two;
}(two, jquery);
var dotpath_fi_ve = function (inner) {
    return inner;
}(dotpath_inner);
var text_deps_template = "<li></li><li></li><li></li><li></li>";
var one = function (five, template, two, dep) {
    console.log(five, template);
    return function () {
        console.log(template);
    };
}(dotpath_fi_ve, text_deps_template, two, dep_dep);
var deps_four = (function(r_0) { var inner = r_0;
return 'Yeah that\'s me, I like better CommonJS style' + inner; })(dotpath_inner);
var text_template = "<div>test</div><div></div><div></div><div></div>";
var main = (function (one, jquery, four, t1) {
    return [
        one,
        four,
        t1
    ];
}(one, jquery, deps_four, text_template));;


  return one
}))
