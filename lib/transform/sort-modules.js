var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')

module.exports = function(config) {
  return through.obj(function(modules, enc, next) {
    var deps = tree()
      , order
      , internal
      , external

    internal = _(modules)
      .each(function(module) { deps.add(module.name, module.deps) })
      .tap(function(d) { order = deps.resolve() })
      .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
      .value()

    external = _.difference(order, _.pluck(modules, 'name'))

    this.push({internal: internal, external: external})
    next()
  })
}

function tree() {
  var nodes = {}
    , processing = []

  return {
    add: add,
    resolve: resolve
  }

  function add(node, dependants) {
    nodes[node] = dependants || []
  }

  function resolveNode (result, num, node) {
    var deps = nodes[node] || []

    processing = processing || {}
    processing[node] = true

    _.each(deps, function(dep) {
      if (result.indexOf(dep) !== -1) return

      if (processing[dep]) throw new Error('Circular dependency: ' + dep)

      resolveNode(dep, result, processing);
    })

    if (result.indexOf(node) === -1) {
      processing[node] = false
      result.push(node)
    }
  }

  function resolve () { return _.reduce(nodes, resolveNode, []) }
}

