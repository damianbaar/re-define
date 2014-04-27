(function( jquery, exports ){ var dotpath_fi_ve = function (inner) {
  return inner;
}(dotpath_inner);
var file_deps_template = "<li></li><li></li><li></li><li></li>"
var one = function (five, template, exports) {
  return exports.one = function () {
    d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + five);
  };
}(dotpath_fi_ve, file_deps_template, exports);
var deps_four = function (inner) {
  return 'Yeah that\'s me, and I\'m in different folder' + inner;
}(dotpath_inner);
var file_template = "<div>test</div><div></div><div></div><div></div>"
(function ($, one, four, t1, t2) {
  console.log($, one, four, t1, t2);
}(jquery, one, deps_four, file_template, file_deps_template));;
var dotpath_inner = function () {
  console.log('inner');
  return 'inner';
}();
 })( jquery, exports )