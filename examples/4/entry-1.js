var a = require('./common/a')
  , b = require('./common/b')
  , d3 = require('d3')

console.log('dirname: ', __dirname, 'filename: ', __filename)
module.exports = function() {
  return {"entry-1": [a,b]}
}
