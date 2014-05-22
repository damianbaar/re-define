var _ = require('underscore')
  , counter = require('../utils/counter')()

module.exports = function(callbacks, separator) {
  var loader = {}

  loader.loadMore = loader.load = function (stream, modules) {
    var streams = stream.split(separator)

    callbacks.streams(streams)

    _(streams).each(function(stream) { callbacks.onModule({content: stream}) })
  }

  return loader

}

