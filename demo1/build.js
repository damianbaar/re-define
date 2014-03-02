var demo1 = demo1 || {};
(function (parent, d3, demo1) {
    var depsFour = 'Yeah that\'s me, and I\'m in different folder';
    var one = function (four) {
            return function () {
                window.onload = function () {
                    d3.select('body').append('div').text('Hi there! I\'m talking to four, four?' + four);
                };
            };
        }(depsFour);
    var three = demo1.three = { hello: 'Yo!' };
    var two = function (three) {
            return three;
        }(three);
    (function (one, two, four) {
        one();
        console.log(two.hello, four);
    }(one, two, depsFour));
}(this, d3, demo1));