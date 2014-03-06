var demo1 = demo1 || {};
var $ = $ || {};
var d3 = d3 || {};
(function (parent, d3, $, demo1) {
    var jquery_plugins = function () {
            console.log('jquery-plugins');
        }();
    var depsfour = 'Yeah that\'s me, and I\'m in different folder';
    var one = demo1.one = function ($, d3, plugin, four) {
            return function () {
                d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
            };
        }($, d3, jquery_plugins, depsfour);
    var three = { hello: 'Yo!' };
    var two = function (three) {
            return three;
        }(three);
    var dotpathinner = function () {
            console.log('inner');
        }();
    var dotpathfi_ve = function (four, inner) {
            return four;
        }(depsfour, dotpathinner);
    (function (one, two, four, five) {
        console.log(one, two.hello, four, five);
    }(one, two, depsfour, dotpathfi_ve));
    if (typeof define === 'function' && define.amd) {
        define('namespace/demo1', main);
    }
}(this, d3, $, demo1));