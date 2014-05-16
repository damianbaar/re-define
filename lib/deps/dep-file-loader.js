var _ = require('underscore')
  , utils = require('../utils/file')
  , fs = require('fs')
  , async = require('async')

module.exports = function(module, deps, base, callbacks, modules) {
  var loaded = {}

  loadDeps(module, deps)

  function loadDeps(module, deps) {
    async.map(deps,
      function(name, cb) {
        if(_.has(loaded, name)) cb(module)

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

      loaded[ name ] = false

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
          if(data) _.extend(module, {content: data, type: 'internal'})
          else _.extend(module, {type:'external', path: ''})

          loaded[ name ] = true

          callbacks.onModule(module)

          var done = _.every(loaded, function(loaded){ return loaded })
          if(done) callbacks.done(modules)
      })
  }
}
