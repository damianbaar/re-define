module.exports = { tree: tree }

function tree() {
  var nodes = {}

  return {
    add: add,
    resolve: resolve
  }

  function add(node, dependants) {
    nodes[node] = dependants || [];
  }

  function resolveNode (node, resolved, processing) {
    var deps = nodes[node] || [];

    processing = processing || {};
    processing[node] = true;

    deps.forEach(function(dep) {
      if (resolved.indexOf(dep) !== -1) return

      if (processing[dep])
        throw new Error('Circular dependency: ' + dep);

      resolveNode(dep, resolved, processing);
    });

    if (resolved.indexOf(node) === -1) {
      processing[node] = false;
      resolved.push(node);
    }
  }

  function resolve () {
    var resolved = [];

    for (var node in nodes) {
      resolveNode(node, resolved);
    }

    return resolved;
  }
}

