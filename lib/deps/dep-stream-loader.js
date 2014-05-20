var _ = require('underscore')

module.exports = function(callbacks, separator) {
  var loader = {}

  loader.loadMore = loader.load = _.partial(load, _, callbacks)

  return loader

  function load(stream, callbacks, modules) {
    var fromStream = stream.split(separator)

    _(fromStream).each(function(stream) {
      callbacks.onModule({content: stream, name: "s_" + _.now()})
    })

    callbacks.done && callbacks.done(modules)
  }
}

