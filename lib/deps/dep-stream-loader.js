var _ = require('underscore')

module.exports = function(callbacks, separator) {
  var loader = {}
    , modules = {}

  loader.loadMore = loader.load = _.partial(load, _, callbacks, modules)

  return loader

  function load(stream, callbacks, modules) {
    var fromStream = stream.split(separator)
      , module = {}

    _(fromStream).each(function(stream) {
      module = {content: stream, name: "s_" + _.now()}

      callbacks.onModule(module)

      _.each(module.deps, function(d) {
        modules[d] = {name: d, external: true}
      })
    })

    callbacks.done && callbacks.done(modules)
  }
}

