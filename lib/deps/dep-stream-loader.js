var _ = require('underscore')

var modules = {}

module.exports = {
  load: load
}

function load(stream, callbacks) {
  var fromStream = stream.split(';')
    , module

  _(fromStream).each(function(m) {
      module = {content: m}
      callbacks.onModule(module)
      modules[module.name] = module

    _(module.deps).each(function( name ){ modules[ name ] = { name: name } })
  })

  callbacks.done(modules)
}

