var demo1 = demo1 || {};
(function (parent, d3, demo1) {
    var depsFour = 'Yeah that\'s me, and I\'m in different folder';
    var one = demo1.one = function (four) {
            return function () {
                d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
            };
        }(depsFour);
    var three = { hello: 'Yo!' };
    var two = function (three) {
            return three;
        }(three);
    var dotpathFi_ve = function (four) {
            return four;
        }(depsFour);
    (function (one, two, four, five) {
        console.log(one, two.hello, four, five);
    }(one, two, depsFour, dotpathFi_ve));
}(this, d3, demo1));