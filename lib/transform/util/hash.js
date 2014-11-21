var crc = require('crc')

module.exports = function hash(file) {
  var hash = crc.crc32(file.path + file.stat.mtime).toString(16)
  return escape(file.name) + hash + '.js'
}

function escape(val) {
  return val.replace(/\//g,'_')
}


