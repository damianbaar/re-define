var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    files.internal = _.filter(files, function(d) { return !d.isNull() })
    files.external = _.pluck(_.difference(files, files.internal), 'name')

    var ext = []
    //SORT bundles
    var bundles = _.groupBy(files.internal, 'parent')
      , bundleNames = _.keys(bundles)
      , externals = _(bundles)
                    .map(function(modules) {
                      var paths = _.pluck(modules, 'path')

                      return _(modules)
                             .pluck('deps')
                             .flatten()
                             .each(function(d) {
                              var loaded = _.find(files, function(f) {return f.name === d.name} ) 
                              if((loaded && loaded.isNull()) || (!loaded && d.isNull()))
                                 ext.push(d.name)
                             })
                             .tap(function() {
                               files.external = ext
                             })
                             .filter(function(d) { 
                               return paths.indexOf(d.path) === -1
                             })
                             .map('name')
                             .compact()
                             .uniq()
                             .difference(files.external)
                             .value() 
                    })
                    .value()
      , toSort = _.zipObject(bundleNames, externals)
      , deps = sort()

    _.each(toSort, function(m, b) { deps.register(b, m) })

    var bundleOrder = deps.resolve()
    bundles = _.map(bundleOrder, function(d) { return bundles[d] })

    //SORT innter modules 
    bundles = _(bundles)
      .map(function(modules, i) {
        var deps = sort()
          , order

        internal = _(modules)
                    .each(function(m) { 
                      deps.register(m.name, _.pluck(m.deps, 'reference')) 
                    })
                    .tap(function(d) { 
                      order = deps.resolve() 
                    })
                    .compact()
                    .sort(function(a, b) { 
                      return order.indexOf(a.name) > order.indexOf(b.name) 
                    })
                    .value()

        var m = {}
        m[bundleOrder[i]] = internal

        return m
      })
      .reduce(function(memo, bundle) {
        return _.extend(memo, bundle)
      },{})

    this.push({internal: bundles, external: files.external})
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
          console.log('TODO thing about workaround', node, dep, nodes)
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

