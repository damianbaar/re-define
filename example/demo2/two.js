//TODO resolving commonjs (r.js convert) and then require/exports/module
// define(function (require, exports, module) {
//     var three = require('three');
//     return {
//         name: 'two',
//         threeName: three.name
//     };
// });
//
define(['three'], function (three) {
    return {
        name: 'two',
        threeName: three.name
    };
});
