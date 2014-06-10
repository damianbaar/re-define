var _ = require('lodash')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(modules, enc, next) {
    var deps = sort()
      , order
      , internal
      , external

    internal = _(modules)
      .each(function(module) { deps.register(module.name, module.deps) })
      .tap(function(d) { order = deps.resolve() })
      .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
      .value()

    external = _.difference(order, _.pluck(modules, 'name'))

    this.push({internal: internal, external: external})
    next()
  })
}

function sort() {
  var nodes = {}

  return {
    register: register
  , resolve: resolve
  }

  function register(node, deps) { nodes[node] = deps || [] }

  function resolve () { 
    var processing = []
    return _.reduce(nodes, resolveNode, [])

    function resolveNode (result, num, node) {
      processing = processing || {}
      processing[node] = true

      _.each(nodes[node], function(dep, i) {
        if (result.indexOf(dep) !== -1) return
        if (processing[dep]) throw new Error('Circular dependency: ' + dep)

        resolveNode(result, i, dep)
      })

      if (result.indexOf(node) === -1) {
        processing[node] = false
        result.push(node)
      }

      return result
    }
  }
}

