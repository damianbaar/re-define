//CIRCULAR DEPS
var a = require('./a')
  , b = require('./b')

console.log(a,b)
//just for tests
window.iife = a

module.exports = [a,b]
