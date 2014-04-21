var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamLoader = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , defaults = require('./config')
  , converters = require('./converter/converter')

module.exports = {
  convert: {
    files: files
  , stream: stream
  }
}

function files (userConfig, cb) {
  var config = extendConfig(userConfig)
    , tree = depsTree.tree()

  var loader = fileLoader(config.base,
        { onModule: onFile
        , onBundle: onBundle
        , done: onComplete})

  loader.load(config.main, config.base)

  function onBundle(module, modules) {
    module.deps = normalizeDeps()
    tree.add(module.name, module.deps)

    function normalizeDeps() {
     return _.map(module.deps, function(d) {
        var found = _.find(modules, function(m) { return m.refs && m.refs.indexOf(d) > -1 })
        return found ? found.name : d
      })
    }
  }

  function onComplete(modules) {
    _.each(modules, function(m) { m.converter && (m.result = m.converter.transform())})
    console.log(modules)
    done(cb, tree)
  }

  function onFile(module) {
    if(!module.content) return

    var converter = converters(config.converters).attachTo(module)

    if(!converter.match(module)) return

    module.deps = converter.deps()
    module.name = converter.name() || module.name

    loader.loadMore(module)
  }
}

// function (){
//     var pluginPattern = /(^(?:(?:\w+)\/*)*\!)/
//     if(value.search(pluginPattern) > -1) {
//       return value.replace(pluginPattern, "/_")
//     }
//   }

function stream (userConfig, input, cb) {
  var config = extendConfig(userConfig)
    , tree = depsTree.tree()

  streamLoader.load(
    input
  , converter(config.converters)
  , { onModule: resolveModule(config, tree)
    , done: done(cb, tree)})
}

function resolveModule(config, tree) {
  return function (module) {
    tree.add(module.name, module.deps)
  }
}

function done(cb, tree) {
  return function(modules) {
    cb(setOrder(tree.resolve(), modules))
  }
}

function setOrder(order, modules) {
  return _.map(order, function(m) {
    return modules[m] || {name: m, external: true}
  })
}

function extendConfig (config) {
  return _(defaults()).extend(config)
}

