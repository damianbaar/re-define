var _ = require('underscore')
  , path = require('path')

var join = path.join
  , dir = path.dirname
  , ext = path.extname

module.exports = {
  relativePath: function(base, name) {
    return join(!!ext(base) ? dir(base): base, name)
  }
, relativeName: function (relativeTo, file) {
    return path.relative(relativeTo, name(file)).split(path.sep).join('/')
  }
, name: name
, applyBase: function(file) {
  if(file.indexOf(path.sep) === -1)
    file = '/' + file
  if(file.indexOf(path.sep) !== 0)
    file = '.' + file

  return file
}
, appendJS: function (value) {
    if(!!ext(value)) return value
    return value + '.js'
  }
}

function name(file) {
  return file.replace(ext(file), '')
}
