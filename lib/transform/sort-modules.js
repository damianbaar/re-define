var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    files = _(files)
      .map(function(modules, bundle) {
        var deps = sort()
          , order

        internal = _(modules)
                    .each(function(m) { deps.register(m.name, _.pluck(m.deps, 'name')) })
                    .tap(function(d) { order = deps.resolve() })
                    .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
                    .value()

        var m = {}
        m[bundle] = internal

        return m
      })
      .reduce(function(memo, bundle) {
        return _.extend(memo, bundle)
      },{})

    this.push(files)
    next()
  }, function(cb) {
    this.push(null)
    cb()
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

