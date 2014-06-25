var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')

module.exports = function(config) {
  return through.obj(function(modules, enc, next) {
    var deps = sort()
      , order
      , internal
      , external
      , change
      , names = _.pluck(modules, 'name')
    
    //filename -> dependency name
    _.each(modules, function(module) { 
       _.each(module.deps, function(d) {
        var desc = _.find(config.plugins, function(p) { return new RegExp(p.pattern).test(d) })

        if(desc) {
          var ref = d.replace(new RegExp(desc.pattern), '')
          modules[names.indexOf(ref)].name = d
          change = true
        }
      })
      
      //attach internal require calls to module deps
      if(module.internal) module.deps = _.uniq(module.deps.concat(module.internal))
    })

    if(change) names = _.pluck(modules, 'name')

    var internal = _(modules)
                    .each(function(module) { deps.register(module.name, module.deps) })
                    .tap(function(d) { order = deps.resolve() })
                    .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
                    .value()

    external = _.difference(order, names)

    debug('internal: %o, external: %o', names, order)

    this.push({internal: internal, external: external})
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

