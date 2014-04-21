var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')

module.exports = function(base, callbacks) {
  var loader = {}
    , modules = {}
    , loaded = {}

  loader.loadMore = _.partial(loadMore, _, callbacks, modules)
  loader.load = _.partial(load, _, _, base, callbacks, modules)

  return loader

  function loadMore(module, callbacks, modules) {
    async.map(module.deps, loadDeps, function() {
      callbacks.onBundle(module, modules)
    })

    function loadDeps(name, cb) {
      if(_.has(loaded, name)) cb(module)

      var onModule = function(module, external) {
        callbacks.onModule(module, external)
        cb(module)
      }

      load(name, module.path, base, {done: callbacks.done, onModule: onModule}, modules)
    }
  }

  function load(name, relativeTo, base, callbacks, modules) {
    var resolvePath = path.resolve
      , join = path.join
      , dir = path.dirname
      , read = fs.readFile
      , exists = fs.exists

    var baseDir = dir(relativeTo)
      , fileName = appendBase(appendJs( name ))
      , module = {}

    module.path = resolvePath(join(baseDir, fileName))
    module.name = resolveName(base, module.path)

    if(!_.has(modules, module.name)) modules[ module.name ] = module
    else module = modules[ module.name ]

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
        data && (module.content = data)
        loaded[ name ] = true

        callbacks.onModule(module, module.external)

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
