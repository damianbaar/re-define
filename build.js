(function (parent, d3, $, ddeemmoo) {
    var scope = {};
        var matcher = 'I\'m from outside the project.';
        scope['deps/four'] = function () {
        return 'Yeah that\'s me, and I\'m in different folder';
    }(d3, $);
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
}(this, common['d3'], common['jquery'], common['namespace/comp1']));