var _ = require('underscore')
  , utils = require('../utils/file')
  , fs = require('fs')
  , async = require('async')

module.exports = function(module, deps, base, callbacks, modules) {
  var loaded = {}
    , pending = {}

  loadDeps(module, deps)

  function loadDeps(module, deps) {
    async.each(deps,
      function(name, cb) {
        load(name, module.path, base, {
          onModule: function(module) {
            callbacks.onModule(module, _.partial(loadDeps, module, _))
            cb(module)
          }
          , done: callbacks.done
          })
      })
  }

  function load(name, relativeTo, base, callbacks) {
    var read = fs.readFile
      , exists = fs.exists
      , module = {}
      , onModule = _.partial(callbacks.onModule, module)

      if(name.indexOf('.') === -1) {
        module.name = name
        module.type = 'external'

        onModule()
        return
      }

      module.path = utils.relativePath(relativeTo || base, utils.appendJS(name))
      module.name = utils.relativeName(base, module.path)

      if(name !== module.name) (module.refs = []).push(name)

      if(!!pending[module.name]) {
        onModule()
        return
      }

      loaded[ module.name ] = false
      pending[ module.name ] = true

      async.waterfall([
        function(cb) {
          !exists(module.path, _.partial(cb, null, _))
        },
        function(exists, cb) {
          if(exists) read(module.path, 'utf-8', cb)
          else cb()
        }
      ]
      , function(err, data) {
        module.content = data

        loaded[ module.name ] = true
        pending[ module.name ] = false 

        onModule()

        if(_.every(loaded, function(loaded){ return loaded }))
          callbacks.done(modules)
      })
  }
}
