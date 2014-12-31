module.exports.name = 'module b'

var a = require('./a')

module.exports.result = 'from a:' + JSON.stringify(a.name)
