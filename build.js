var common = common || {};
var demo1 = demo1 || {};
(function (parent, d3, $, ddeemmoo, demo1) {
    var scope = {};
        var matcher = common['outside/comp1'] = 'I\'m from outside the project.';
        scope['deps/four'] = demo1['deps/four'] = function () {
        return 'Yeah that\'s me, and I\'m in different folder';
    }(scope['deps/d3/d3'], $);
        var one = function ($, d3, four) {
            return function () {
                d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
            };
        }($, d3, scope['deps/four']);
    (function (d3, $, comp1, comp2, one) {
        console.log(d3, $, comp1, comp2, one);
    }(d3, $, ddeemmoo, matcher, one));
    if (typeof define === 'function' && define.amd)
        define('namespace/demo1/comp1', matcher);
    if (typeof define === 'function' && define.amd)
        define('namespace/demo1/comp1', scope['deps/four']);
}(parent, d3, $, common['namespace/comp1'], demo1));