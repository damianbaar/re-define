var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var deps = sort()
      , order
      , internal
      , external

    internal = _(files)
                .filter(function(d) { return !d.isNull() })
                .each(function(m) { 
                  deps.register(m.name, _.pluck(m.dependencies, 'name')) 
                })
                .tap(function() { order = deps.resolve() })
                .compact()
                .sortBy(function(a) { return order.indexOf(a.name) })
                .value()

    external =  _(files)
                  .uniq(function(m) { return m.requiredAs })
                  .difference(internal)
                  .value()

    debug("Files order ", _.pluck(files, 'name'))
    this.push((external || []).concat(internal || []))
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
          console.log('//warning: circular dependency found in %s referenced by %s.', dep, _(nodes).keys().first())
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

