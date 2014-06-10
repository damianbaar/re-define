var _ = require('lodash')
  , Readable = require('stream').Readable
  , util = require('util')
  , finder = require('findit')
  , path = require('path')

util.inherits(FindIt, Readable)

function FindIt(config, options) {
  if (!(this instanceof FindIt))
  return new FindIt(config, options)

  Readable.call(this, {objectMode: true})
  this.config = config
}

FindIt.prototype._read = function () {
  var config = this.config

  finder(path.resolve(config.base))
    .on('directory', function (dir, stat, stop) {
      ignoreDir(dir) && stop()
    })
    .on("file", function (file, stat) {
      includeType(file) && this.push({path: file})
    }.bind(this))
    .on('end', function() { 
      this.push(null)
    }.bind(this))

  function ignoreDir(dir) { return _.some(config.excludeFolders, _.partial(test, dir)) }

  function includeType(file) { return _.some(config.includeTypes, _.partial(test, file)) }

  function test(val, pattern) { return new RegExp(pattern).test(val) }
}

module.exports = FindIt
