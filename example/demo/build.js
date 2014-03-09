var global = global || {};
var demo1 = demo1 || {};
(function (parent, d3, $, ddeemmoo, global, demo1) {
  var scope = {};
  var matcher = global['outside/comp1'] = 'I\'m from outside the project.';
  scope['template.html'] = '<div>test</div>\n<div></div>\n<div></div>\n<div></div>\n';
  scope['deps/template.html'] = '<li></li>\n<li></li>\n<li></li>\n<li></li>\n';
  scope['deps/four'] = demo1['deps/four'] = function (d3, $, template1, template2) {
    return 'Yeah that\'s me, and I\'m in different folder' + template1 + template2;
  }(d3, $, scope['template.html'], scope['deps/template.html']);
  scope['dotpath/inner'] = function () {
    console.log('inner');
    return 'inner';
  }();
  scope['dotpath/fi-ve'] = function (four, inner) {
    return four;
  }(scope['deps/four'], scope['dotpath/inner']);
  var one = function ($, d3, four, template1, template2) {
      return function () {
        d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
      };
    }($, d3, scope['deps/four'], scope['dotpath/fi-ve'], scope['template.html'], scope['deps/template.html']);
  (function (d3, $, comp1, comp2, one) {
    console.log(comp1, comp2, one);
  }(d3, $, ddeemmoo, matcher, one));
  if (typeof define === 'function' && define.amd)
    define('namespace/demo1/comp1', matcher);
  if (typeof define === 'function' && define.amd)
    define('namespace/demo1/four', scope['deps/four']);
}(this, common['d3/d3'], $, common['namespace/comp1'], global, demo1));