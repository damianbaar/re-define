var scope1 = {};
var scope2 = {};
(function (parent, window, document, scope1, scope2) {
    var depsFour = 'I\'m in different folder';
    var one = scope2 = function (four) {
            return 'Hi there!' + ' and I\'m talking to four:' + four;
        }(depsFour);
    var three = scope1 = { hello: 'Yo!' };
    var two = function (three) {
            return three;
        }(three);
    (function (one, two, four) {
        console.log(one, two.hello, four);
    }(one, two, depsFour));
}(this, window, document, scope1, scope2));