(function(jquery, exports) {
  var dotpath_inner = 'inner';
var dotpath_fi_ve = function (inner) {
          return inner;
        }(dotpath_inner);
var one = function (five, template, exports) {
          console.log(five, template, exports);
          return exports.one = function () {
            console.log(template());
          };
        }(dotpath_fi_ve, exports);
var deps_four = function (inner) {
          return 'Yeah that\'s me, and I\'m in different folder' + inner;
        }(dotpath_inner);
(function (one, jquery, four, t1) {
          return [
            one,
            four,
            t1
          ];
        }(one, jquery, deps_four));;

})(external['jquery'], exports)
