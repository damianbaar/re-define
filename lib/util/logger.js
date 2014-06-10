var through = require('through2')
  , colors = require('colors')
  , fs = require('fs')
  , logFile = 're-define.log'
  , append = fs.appendFile

module.exports = function(action) {

  fs.unlink(logFile, function(err) {})

  return through.obj(function(chunk, enc, next) {
    var data

    data = ('------- ' + action + '---------\n').green
    data = data + JSON.stringify(chunk, null, 2)
    data = data + ('\n----------------------------\n\n').green

    append('re-define.log', data)

    this.push(chunk)
    return next()
  })
}
