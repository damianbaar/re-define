var demo2 = demo2 || {};
(function (parent, window, demo2) {
    var one = { name: 'one' };
    var three = demo2.three = { name: 'three' };
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
}(this, window, demo2));