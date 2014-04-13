var _ = require('underscore')

module.exports = { tree: tree }

function tree() {
  var nodes = {}
    , external = []

  return {
    add: add,
    resolve: resolve
  }

  function add(node, dependants) {
    nodes[node] = dependants || []

    external = external.concat(dependants)
    external = _.uniq(external)
  }

  function resolveNode (node, resolved, processing) {
    var deps = nodes[node] || []

    processing = processing || {}
    processing[node] = true;

    if(_(nodes).has(node)) {
      var idx = external.indexOf(node)

      if(idx > -1) external.splice(idx, 1)
    }

    deps.forEach(function(dep) {
      if (resolved.indexOf(dep) !== -1) return

      if (processing[dep])
        throw new Error('Circular dependency: ' + dep)

      resolveNode(dep, resolved, processing);
    })

    if (resolved.indexOf(node) === -1) {
      processing[node] = false
      resolved.push(node)
    }
  }

  function resolve () {
    var resolved = []

    for (var node in nodes) {
      resolveNode(node, resolved)
    }

    return {
      internal: _(resolved).difference(external)
    , external: external }
  }
}

