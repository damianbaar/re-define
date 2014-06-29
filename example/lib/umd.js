(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('umd', ['b'], factory)
    } else {
        root.umd = factory(root.b);
    }
}(this, function (b) {
    return 'hello UMD';
}));
