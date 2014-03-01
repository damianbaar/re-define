var deps_four = 'I\'m in different folder';
var one = 'Hi there!';
var three = { hello: 'Yo!' };
var two = three;
(function (one, two, four) {
    console.log(one, two.hello, four);
}('one', 'two', 'deps/four'));
define("main", function(){});

