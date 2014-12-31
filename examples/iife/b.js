var a = require('./a')
module.exports.test = 'b' + JSON.stringify(a.test)
