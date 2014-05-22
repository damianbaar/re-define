var a = function (b, c) {
    return 'a';
}(b, c);
var main = (function (a, b, c) {
    console.log(a, b, c);
}(a, b, c));
