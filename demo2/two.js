//TODO I do not want to resolve so akrward patterns
//latter one will be supported CommonJS
// define(function (require) {
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
