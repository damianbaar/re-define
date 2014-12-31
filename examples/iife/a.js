module.exports.name = 'module a'

var b = require('./b')

module.exports.result = 'from b:' + JSON.stringify(b.name)
