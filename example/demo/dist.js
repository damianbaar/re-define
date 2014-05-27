(function (parent, factory){
  if (typeof define === 'function' && define.amd) {
    define('component', [], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    
    parent['components'] = factory()
  }
}(this, function () {
  var jquery = function() {
  return {name: 'jquery'}
}
;
var two = (function(r_1) { var $ = r_1;
return 'two'; })(jquery);
var dotpath_inner = function (two, jquery) {
    return 'inner' + two;
}(two, jquery);
var dotpath_fi_ve = function (inner) {
    return inner;
}(dotpath_inner);
var text_deps_template = "<li></li><li></li><li></li><li></li>";
var dep_dep = function() {
  console.log('dep')
  return {name: 'dep'}
}
;
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
