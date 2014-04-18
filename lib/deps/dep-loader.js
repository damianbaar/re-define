var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , resolvePath = path.resolve
  , join = path.join
  , dir = path.dirname
  , read = fs.readFileSync
  , exists = fs.existsSync
  , tree = require('../deps/dep-order').tree()

var modules = {}

module.exports = {
  load: load
}

function load(name, base, callbacks) {
  var pathResolver = path.resolve

  var module = {
      path: pathResolver(base, appendJs(name))
    }

  _(module).extend({
      name: resolveName(base, module.path)
    , loaded: true
    , content: read(module.path, 'utf-8')
    })

  callbacks.file(module)

  modules[module.name] = module

  _(module.deps).each(function( name ){
    var path = resolvePath(join(dir(module.path), appendBase(appendJs( name ))))
      , dep = modules[ name ] = { name: name }
      , idx

    dep.exists = exists(path)

    if(dep.exists && !dep.loaded) {
      if((idx = module.deps.indexOf( name )) > -1)
        module.deps[idx] = resolveName(base, path)

      load(path, base, {file: callbacks.file, done: function(){}})
    }

    tree.add(module.name, module.deps)
  })

  callbacks.done(setOrder(tree.resolve(), modules))
}

function setOrder(order, modules) {
  return _.map(order, function(m) {
    return modules[m]
  })
}

function resolveName(relativeTo, filePath) {
  var clean = filePath.replace(path.extname(filePath), '')
  return path.relative(relativeTo, clean)
}

function appendBase(value) {
  if(value.indexOf('.\/') > -1) return value
  return ".\/"+value
}

function appendJs(value) {
  var pluginPattern = /(^(?:(?:\w+)\/*)*\!)/
  if(value.search(pluginPattern) > -1) {
    // pathPlugin =
    return value.replace(pluginPattern, "/_")
  }
  if(!!path.extname(value)) return value
  return value + '.js'
}

