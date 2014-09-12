var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')
  , minimatch = require('minimatch')
  , path = require('path')

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
                        deps.register(m.name, _.pluck(m.dependencies, 'name')) 
                      })
                      .tap(function() { order = deps.resolve() })
                      .compact()
                      .sortBy(function(a) { return order.indexOf(a.name) })
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

  function register(node, deps) { nodes[node] = deps }

  function resolve () { 
    var processing = []
    return _.reduce(nodes, resolveNode, [])

    function resolveNode (result, num, node) {
      processing = processing || {}
      processing[node] = true

      _.each(nodes[node], function(dep, i) {
        if (result.indexOf(dep) !== -1) return
        if (processing[dep]) {
          console.log('----> You can skip that dep using --skip', _(nodes).keys().first())
          throw new Error('Circular dependency: ', node, dep)
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

