var _ = require('underscore')
  , counter = require('../utils/counter')()

module.exports = function(callbacks, separator) {
  var loader = {}

  loader.loadMore = loader.load = function (stream, modules) {
    var streams = stream.split(separator)

    callbacks.streams(streams)

    _(streams).each(function(stream, i) { 
      callbacks.onModule({content: stream, name: 's_' + counter.next()}, i === 0) 
    })
  }

  return loader

}

