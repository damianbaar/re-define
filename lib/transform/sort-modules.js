var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:sort-modules')
  , minimatch = require('minimatch')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    files.internal = _.filter(files, function(d) { return !d.isNull() })
    files.external = _.pluck(_.difference(files, files.internal), 'name')

    var deps = sort()
      , self = this
      , order

    files.internal = _(files.internal)
                      .each(function(m) { 
                        deps.register(m.name, _.pluck(m.deps, 'name')) 
                      })
                      .tap(function() { order = deps.resolve() })
                      .compact()
                      .sortBy(function(a) { return order.indexOf(a.name) })
                      .value()

    var folders = _(files.internal)
                  .groupBy('base')
                  .reduce(function(memo, files, key) {
                    _.each(files, function(f) {
                      memo[f.path] = f.external 
                                       ? f.requiredAs 
                                       : path.basename(key)
                    })
                    return memo
                  }, {})

    var updated = []
    _.each(files.internal, function(f) {
      var name = folders[f.path] + '/' + f.name

      if(folders[f.path] === f.name) name = f.name
      if(f.name === 'index') name = folders[f.path]

      if(updated.indexOf(f) === -1) {
        f.name = name
        f.update && f.update(name)
      }

      updated.push(f)

      _.each(f.related, function(r) {
        if(updated.indexOf(r) === -1) {
          r.name = name
          r.update && r.update(name)
          return
        }
        updated.push(r)
      })
    })

    //SEPARATE STREAM
    var cuttingPoints = config['cutting-points']
      , chunks = {}
      , map = {}

    if(_.isEmpty(cuttingPoints)) cuttingPoints = {"**/**": "bundle.js"}

    _.each(files.internal, function(dep) {
      var match = _.find(cuttingPoints, function(file, pattern) {
        return minimatch(dep.path, process.cwd() + '/' + pattern)
      })

      if(match) {
        chunks[match] = chunks[match] || []
        chunks[match].push(dep)
        map[dep.path] = match
      }
    })

    //TODO init globals as require('module'), seems like good idea however there could be some gaps
    _.each(chunks, function(files, dest) {
      self.push({dest: dest, internal: files, external: _.uniq(files.external)})
      next()
    })
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

