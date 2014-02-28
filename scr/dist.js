define('one', [], function () {
    return 'Hi there!';
});
define('two', [], function () {
    var test;
    return test;
});
require([
    'one',
    'two'
], function (one, two) {
    console.log(one.name, two.name);
});
define("main", function(){});

