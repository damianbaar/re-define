var _ = require('underscore')
  , utils = require('../utils/file')
  , fs = require('fs')
  , async = require('async')

module.exports = function(module, deps, base, callbacks, modules) {
  var loaded = {}
    , pending = {}

  loadDeps(module, deps)

  function loadDeps(module, deps) {
    async.map(deps,
      function(name, cb) {
        load(name, module.path, base, {
          onModule: function(module) {
            callbacks.onModule(module, _.partial(loadDeps, module, _))
            cb(module)
          }
          , done: callbacks.done
          })
      }
      , function() { callbacks.onDeps(module, modules) }
    )
  }

  function load(name, relativeTo, base, callbacks) {
    var read = fs.readFile
      , exists = fs.exists
      , module = {}

      module.path = utils.relativePath(relativeTo || base, utils.appendJS(name))
      module.name = utils.relativeName(base, module.path)

      if(name !== module.name) {
        var ref = module.refs = module.refs || []
        ref.push( name )
      }

      if(pending[module.name]) {
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
        if(data) _.extend(module, {content: data})
        else _.extend(module, {type:'external', path: ''})

        loaded[ module.name ] = true
        pending[ module.name ] = false 

        onModule()
      })

      function onModule() {
        callbacks.onModule(module)

        var done = _.every(loaded, function(loaded){ return loaded })
        if(done) callbacks.done(modules)
      }
  }
}
