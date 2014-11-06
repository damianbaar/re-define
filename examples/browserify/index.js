var url = require('url')

console.log(url.resolve('/one/two/three', 'four'))
console.log(url.resolve('http://example.com/', '/one'))
console.log(url.resolve('http://example.com/one', '/two'))

module.exports = 'index'
