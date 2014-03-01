var depsFour = 'I\'m in different folder';
var one = function (four) {
        return 'Hi there!' + ' and I\'m talking to four:' + four;
    }(depsFour);
var three = { hello: 'Yo!' };
var two = function (three) {
        return three;
    }(three);
(function (one, two, four) {
    console.log(one, two.hello, four);
}(one, two, depsFour));
