var demo3 = demo3 || {};
(function (parent, demo3) {
    var _vendortexttestjson = '{\n  "hello" : "I\'m json"\n}\n';
    var lib = demo3.lib = function (data) {
            function test() {
                return 'outside:' + data.toString();
            }
            return function (selection) {
                function test2() {
                    return 'inside';
                }
                return test() + test2();
            };
        }(_vendortexttestjson);
    if (typeof define === 'function' && define.amd) {
        define('ns/lib', lib);
    }
}(this, demo3));