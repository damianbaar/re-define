var _ = require('underscore')


module.exports = {
  load: load
}

function load(stream, converter, callbacks) {
  var fromStream = stream.split(';')
    , modules = {}
    , module
    , con

  _(fromStream).each(function(stream) {
      module = {content: stream, maps: {}, params: {}, deps: {}, export:{}}

      con = converter(module).injectDeps()
                             .injectName()
                             .injectParams()

      _(module.deps).each(function( name ){
        var idx

        if((idx = module.deps.indexOf( name )) > -1)
          module.deps[idx] = module.maps[name] = name
       })

      con.injectAST()

      callbacks.onModule(module)
      modules[module.name] = module
  })

  callbacks.done(modules)
}

