(function(jquery){
var dotpath_inner = function () {
  console.log('inner');
  return 'inner';
}();
var dotpath_fi_ve = function (inner) {
  return inner;
}(dotpath_inner);
var one = function (five) {
  return function () {
    d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + five);
  };
}(dotpath_fi_ve);
var deps_four = function (inner) {
  return 'Yeah that\'s me, and I\'m in different folder' + inner;
}(dotpath_inner);
(function ($, one, four) {
  console.log($, one, four);
}(jquery, one, deps_four));;

})(jquery)