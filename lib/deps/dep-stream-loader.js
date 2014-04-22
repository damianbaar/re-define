var _ = require('underscore')

module.exports = function(callbacks) {
  var loader = {}
    , modules = {}

  loader.loadMore = loader.load = _.partial(load, _, callbacks, modules)

  return loader

  function load(stream, callbacks, modules) {
    var fromStream = stream.split(';')
      , module = {}

    _(fromStream).each(function(stream) {
      module = {content: stream}

      callbacks.onModule(module)

      modules[module.name] = module
    })

    callbacks.done(modules)
  }
}

