var ast = require('../ast/ast-adapter.js')
  , _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , resolve = path.resolve
  , read = fs.readFileSync
  , join = path.join
  , dir = path.dirname

module.exports = {
  load: load
}

function load(config, contents, resolver, done) {
  if(config.main.indexOf('.js') === -1) config.main += '.js'

  var external = []

  var file = read(resolve(config.base, config.main), 'utf-8')
    , deps = resolver.resolve(file)
    , depsLoc = _(deps).map(function(d){
      console.log(d, createFile(d))
      return resolve(join(dir(config.base), createFile(d)))
    })

  console.log(resolver.resolve(file))
  console.log(depsLoc)

  console.log(join(path.dirname('./dotpath/fi-ve.js'), 'inner.js'))
function createFile(value) {
  return ".\/"+value+".js"
}

  // config.base
  // config.main
}

