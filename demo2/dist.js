var scope1 = {};
var scope2 = {};
(function (parent, window, document, scope1, scope2) {
    var one = scope2.one = { name: 'one' };
    var three = scope1.three = { name: 'three' };
    var two = function (three) {
            return {
                name: 'two',
                threeName: three.name
            };
        }(three);
    (function (one, two) {
        var html = '<b>Success!</b> One\'s name is: ' + one.name + ', two\'s name is: ' + two.name + ', three\'s name is: ' + two.threeName, node = document.createElement('div');
        node.innerHTML = html;
        document.getElementsByTagName('body')[0].appendChild(node);
    }(one, two));
}(this, window, document, scope1, scope2));