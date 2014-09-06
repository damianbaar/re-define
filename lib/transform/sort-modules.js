var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')
  , minimatch = require('minimatch')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    files.internal = _.filter(files, function(d) { return !d.isNull() })
    files.external = _.pluck(_.difference(files, files.internal), 'name')

    var ext = []
      , entries = []

    //SORT bundles

  var externalDeps
    , commonDeps //scope deps ...
    , deps = _.difference(files.internal, entries)

  commonDeps = _.filter(deps, function(d) {
                 var ext = _.find(files.internal, function(p) {
                  return p.name === d.parent
                 })
                 return !(ext && ext.external)
               })

  // var cuttingPoints = _.filter(deps, function(d) {
  //                var ext = _.find(files.internal, function(p) {
  //                 return p.name === d.parent
  //                })
  //                return !(ext && ext.external)
  //              })
  files.internal = setOrder(files.internal)

  var byLocation = _.groupBy(files.internal, 'base')
    , cuttingPoints = config['cutting-points']
    , chunks = {}

  _.each(byLocation, function(deps, base) {
    _.each(deps, function(dep) {
      var match = _.find(cuttingPoints, function(file, pattern) {
        return minimatch(dep.path, process.cwd() + '/' + pattern)
      })
      if(match) {
        chunks[match] = chunks[match] || []
        chunks[match].push(dep)
      }
    })
  })

  console.log(chunks)

  function setOrder(arr) {
    var deps = sort()
      , order

    return _(arr)
            .each(function(m) { 
              deps.register(m.name, _.pluck(m.deps, 'name')) 
            })
            .tap(function() { order = deps.resolve() })
            .compact()
            .sortBy(function(a) { return order.indexOf(a.name) })
            .value()
  }

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

    debug('bundle order', bundleOrder)

    //SORT innter modules 
    bundles = _.map(bundles, function(modules, i) {
        var deps = sort()
          , order

        return _(modules)
                  .each(function(m) { 
                    deps.register(m.name, _.pluck(m.deps, 'name')) 
                  })
                  .tap(function() { 
                    order = deps.resolve() 
                    debug('modules order', bundleOrder[i], order)
                  })
                  .compact()
                  .sortBy(function(a) { return order.indexOf(a.name) })
                  .value()
      })

    debug('externals', _.uniq(files.external))

    this.push({internal: _.zipObject(bundleOrder, bundles), external: _.uniq(files.external)})
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

