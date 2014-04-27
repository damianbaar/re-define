var _ = require('underscore')
  , path = require('path')

var resolvePath = path.resolve
  , join = path.join
  , dir = path.dirname

module.exports = {

  relativePath: function(base, name) {
    var relativeTo
    if((relativeTo = dir(base)) === '.') relativeTo = resolvePath(base)

    return resolvePath(join(relativeTo, name))
  }
, relativeName: function (relativeTo, file) {
    var clean = file.replace(path.extname(file), '')
    return path.relative(relativeTo, clean)
  }
, appendJS: _.compose(appendBase, appendJs)
}

function appendBase(value) {
  if(value.indexOf('.\/') > -1) return value
  return ".\/" +value
}

function appendJs(value) {
  if(!!path.extname(value)) return value
  return value + '.js'
}