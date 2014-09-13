var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var bundle = {}

    bundle.internal = _.filter(files, function(d) { return !d.isNull() })
    bundle.external = _(files)
                      .pluck('name')
                      .uniq()
                      .difference(_.pluck(bundle.internal,'name'))
                      .value()

    var deps = sort()
      , order

    bundle.internal = _(bundle.internal)
                      .each(function(m) { 
                        deps.register(m.path, _.pluck(m.dependencies, 'path')) 
                      })
                      .tap(function() { order = deps.resolve() })
                      .compact()
                      .sortBy(function(a) { return order.indexOf(a.path || a.requiredAs) })
                      .value()

    debug("Bundle order ", bundle.internal)
    debug("Externals ", bundle.external)

    this.push(bundle)
    next()
  })
}

function sort() {
  var nodes = {}

  return {
    register: register
  , resolve: resolve
  }

  function register(name, deps) { nodes[name] = deps }

  function resolve () { 
    var processing = []
    return _.reduce(nodes, resolveNode, [])

    function resolveNode (result, num, node) {
      processing = processing || {}
      processing[node] = true

      _.each(nodes[node], function(dep, i) {
        if (result.indexOf(dep) !== -1) return
        if (processing[dep]) {
          console.log('//warning: circular dependency found in %s in %s.', dep, _(nodes).keys().first())
          return
        }

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

