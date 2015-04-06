// var errorTmpl = require('text!model/error.html')
var errorTmpl = require('text!model/error.html')
  , a = 10

module.exports = { name: 'model', error: errorTmpl }

test()

function test() {
  console.log('test')
}
