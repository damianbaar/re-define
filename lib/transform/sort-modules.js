var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(modules, enc, next) {
      , internal
      , external

    internal = _(modules)
      .each(function(module) { tree.add(module.name, module.deps) })
      .tap(function(d) { order = tree.resolve() })
      .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
      .value()

    external = _.difference(order, _.pluck(modules, 'name'))

    this.push(config.wrappers[ config.wrapper ](internal, external, config))
    next()
  })
}


var _ = require('lodash')
  , through = require('through2')

    internal = _(modules)
      .each(function(module) { tree.add(module.name, module.deps) })
      .tap(function(d) { order = tree.resolve() })
      .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
      .value()

module.exports = { tree: tree }

    var tree = require('./deps/dep-order').tree()
      , order

function tree() {
  var nodes = {}

  return {
    add: add,
    resolve: resolve
  }

  function add(node, dependants) {
    nodes[node] = dependants || []
  }

  function resolveNode (node, resolved, processing) {
    var deps = nodes[node] || []

    processing = processing || {}
    processing[node] = true;

    deps.forEach(function(dep) {
      if (resolved.indexOf(dep) !== -1) return

      if (processing[dep])
        throw new Error('Circular dependency: ' + dep)

      resolveNode(dep, resolved, processing);
    })

    if (resolved.indexOf(node) === -1) {
      processing[node] = false
      resolved.push(node)
    }
  }

  function resolve () {
    var resolved = []

    for (var node in nodes) {
      resolveNode(node, resolved)
    }

    return resolved
  }
}

