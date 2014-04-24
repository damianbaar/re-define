var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamLoader = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , converters = require('./converter/converter')

module.exports = {
  files: files
, stream: stream
}

function files (config, done) {
  var tree = depsTree.tree()
    , loader = fileLoader(config.base,
        { onModule: onFile
        , onBundle: onBundle
        , done: _.partial(onComplete, _, tree, config, done)})

  loader.load(config.main, config.base)

  function onFile(module) {
    var converter

    if(module.content) converter = converters(config).attachTo(module)
    if(!converter || !converter.match(module)) return

    module.deps = converter.deps()

    loader.loadMore(module)
  }

  function onBundle(module, modules) {
    module.deps = normalizeDeps()
    tree.add(module.name, module.deps)

    function normalizeDeps() {
     return _.map(module.deps, function(d) {
        var ref = _.find(modules, function(m) { return m.refs && m.refs.indexOf(d) > -1 })
        return ref ? ref.name : d
      })
    }
  }

}

function stream (config, input, done) {
  var tree = depsTree.tree()
    , loader = streamLoader(
                { onModule: onModule
                , done: _.partial(onComplete, _, tree, config, done)})

  loader.load(input)

  function onModule(module) {
    var converter = converters(config).attachTo(module)

    if(!converter.match(module)) return

    module.deps = converter.deps()
    module.name = converter.name()

    tree.add(module.name, module.deps)
  }
}

function onComplete(modules, tree, config, done) {
  done(getWrapper(setOrder(tree.resolve(), modules)))

  function getWrapper(modules) {
    return config.wrappers[ config.wrapper ](modules, config)
  }

  function setOrder(order, modules) {
    return _.chain(order)
            .map(function(m) { return modules[m] })
            .compact()
            .value()
  }
}


