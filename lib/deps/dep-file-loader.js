var _ = require('underscore')
  , utils = require('../utils/file')
  , fs = require('fs')
  , async = require('async')

module.exports = function(module, deps, base, callbacks) {
  var pending = {}

  loadDeps(module, deps)

  function loadDeps(module, deps) {
    async.each(deps,
      function(name, next) {
        load(name, module.path, base, {
          onModule: function(module) {
            next()
            callbacks.onModule(module, _.partial(loadDeps, module, _))
          }
      })
      })
  }

  function load(name, relativeTo, base, callbacks) {
    var read = fs.readFile
      , exists = fs.exists
      , module = {}
      , onModule = _.partial(callbacks.onModule, module)

      module.path = utils.relativePath(relativeTo || base, utils.appendJS(name))
      module.name = utils.relativeName(base, module.path)

      if(name !== module.name) (module.refs = []).push(name)

      if(!!pending[module.name]) {
        onModule()
        return
      }

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

        pending[ module.name ] = false 

        onModule()
      })
  }
}
