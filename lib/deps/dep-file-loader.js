var _ = require('underscore')
  , utils = require('../utils/file')
  , fs = require('fs')
  , async = require('async')

module.exports = function(module, deps, base, callbacks) {
  var loaded = {}
    , pending = {}

  loadDeps(module, deps)

  function loadDeps(module, deps) {
    var toLoad = _.filter(deps, isExternal)
      , external = _.difference(deps, toLoad)

    _.each(external, function(name) {
       callbacks.onModule({name: name, type: 'external'})
    })

    function isExternal(val) { return val.indexOf('.') === 0 }

    async.each(toLoad,
      function(name, cb) {
        load(name, module.path, base, {
          onModule: function(module) {
            cb()
            callbacks.onModule(module, _.partial(loadDeps, module, _))
          }
          , done: callbacks.done
          })
      }, function(err) {
          if(_.every(loaded, function(loaded){ return loaded }))
            callbacks.done()
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
      })
  }
}
