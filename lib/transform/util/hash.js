var crc = require('crc')
  , _ = require('lodash')
  , path = require('path')
  , relative = _.partial(path.relative, process.cwd())

module.exports = function hash(file) {
  var hash = crc.crc32(file.path + file.stat.mtime).toString(16)
  return escape(relative(file.path)) + '_' + hash + '.js'
}

function escape(val) {
  return val.replace(/\//g,'_')
}


