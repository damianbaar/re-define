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
    var clean = file.replace(ext(file), '')
    return path.relative(relativeTo, clean).split(path.sep).join('/')
  }
, appendJS: function (value) {
    if(!!ext(value)) return value
    return value + '.js'
  }
}
