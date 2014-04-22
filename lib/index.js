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

function files (userConfig, done) {
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
    done(setOrder(tree.resolve(), modules))
  }

  function onFile(module) {
    if(!module.content) return

    var converter = converters(config).attachTo(module)

    if(!converter.match(module)) return

    module.deps = converter.deps()

    loader.loadMore(module)
  }
}

// function (){
//     var pluginPattern = /(^(?:(?:\w+)\/*)*\!)/
//     if(value.search(pluginPattern) > -1) {
//       return value.replace(pluginPattern, "/_")
//     }
//   }

function stream (userConfig, input, done) {
  var config = extendConfig(userConfig)
    , tree = depsTree.tree()

  var loader = streamLoader({ onModule: onModule, done: onComplete})

  loader.load(input)

  function onComplete(modules) {
    _.each(modules, function(m) { m.converter && (m.result = m.converter.transform())})
    done(setOrder(tree.resolve(), modules))
  }

  function onModule(module) {
    var converter = converters(config).attachTo(module)

    if(!converter.match(module)) return

    module.deps = converter.deps()
    module.name = converter.name()

    tree.add(module.name, module.deps)
  }
}

function setOrder(order, modules) {
  return _.chain(order)
          .map(function(m) { return modules[m] })
          .compact()
          .value()
}

function extendConfig (config) {
  return _(defaults()).extend(config)
}

