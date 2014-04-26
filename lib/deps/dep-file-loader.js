var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')

module.exports = function(module, base, callbacks, modules) {
  var loaded = {}

  loadDeps(module)

  function loadDeps(module) {
    async.map(module.deps,
      function(name, cb) {
        if(_.has(loaded, name)) cb(module)

        load(name, module.path, base, {
          onModule: function(module) {
            callbacks.onModule(module)
            cb(module)
            !!module.deps && loadDeps(module)
          }
          , done: callbacks.done
          })
      }
      , function() { callbacks.onDeps(module, modules) }
    )
  }

  function load(name, relativeTo, base, callbacks) {
    var resolvePath = path.resolve
      , join = path.join
      , dir = path.dirname
      , read = fs.readFile
      , exists = fs.exists

    var fileName = appendBase(appendJs( name ))
      , module = {}
      , baseDir

      if((baseDir = dir(relativeTo)) === '.') baseDir = resolvePath(base)

      module.path = resolvePath(join(baseDir, fileName))
      module.name = resolveName(base, module.path)

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
          if(data) module.content = data
          else _.extend(module, {external:true, path: ''})

          loaded[ name ] = true

          callbacks.onModule(module)

          var done = _.every(loaded, function(loaded){ return loaded })
          if(done) callbacks.done(modules)
      })
  }

  function resolveName(relativeTo, filePath) {
    var clean = filePath.replace(path.extname(filePath), '')
    return path.relative(relativeTo, clean)
  }

  function appendBase(value) {
    if(value.indexOf('.\/') > -1) return value
    return ".\/" +value
  }

  function appendJs(value) {
    if(!!path.extname(value)) return value
    return value + '.js'
  }
}
