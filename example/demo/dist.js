define('my-component', ['exports'], function(exports) {
var dotpath_inner = 'inner';
var dotpath_fi_ve = function (inner) {
  return inner;
}(dotpath_inner);
var file_deps_template = function() { return '<li></li><li></li><li></li><li></li>' };
var one = function (five, template, exports) {
  console.log(five, template, exports);
  return exports.one = function () {
    console.log(template());
  };
}(dotpath_fi_ve, file_deps_template, exports);
var deps_four = function (inner) {
  return 'Yeah that\'s me, and I\'m in different folder' + inner;
}(dotpath_inner);
var file_template = function() { return '<div>test</div><div></div><div></div><div></div>' };
(function (one, four, t1) {
  return [
    one,
    four,
    t1
  ];
}(one, deps_four, file_template));;

})