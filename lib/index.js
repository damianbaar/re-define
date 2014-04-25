var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamSplitter = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , converters = require('./converter/converter')
  , through = require('through2')

module.exports = {
  files: file
, stream: stream
}

function file (config, done) {
  var tree = depsTree.tree()
    , modules = {}

    fileLoader(config.base, modules, {
        onModule: _.partial(onModule, _, _, _, config)
      , onDeps: _.partial(onDeps, _, _, tree)
      , done: function (modules) { done(wrap(modules, tree, config)) }
      })
    .load(config.main, config.base)
}

function stream (config) {
  var stream = through(write)
    , tree = depsTree.tree()
    , modules = {}
    , splitter
    , loader

    function write (chunk, enc, callback) {
      splitter = streamSplitter({
        onModule: function (module) {
          loader = fileLoader(config.base, modules,
                    { onModule: _.partial(onModule, _, _, _, config)
                    , onDeps: _.partial(onDeps, _, _, tree)
                    , done: done
                    })

          onModule(module, modules, loader, config)

          function done(modules) {
            if(config.verbose) console.log(modules)

            stream.push(wrap(modules, tree, config))
            callback()
          }
        }
      })

      splitter.load(chunk.toString())
    }

  return stream
}

function wrap(modules, tree, config) {
  return transform(setOrder(tree.resolve(), modules))

  function transform(modules) {
    return config.wrappers[ config.wrapper ](modules, config)
  }

  function setOrder(order, modules) {
    return _.chain(order)
            .map(function(m) { return modules[m] })
            .compact()
            .value()
  }
}

function onModule(module, modules, loader, config) {
  var converter

  if(module.content) converter = converters(config).attachTo(module)
  if(!converter || !converter.match(module)) return

  if(!module.name) module.name = module.converter.name()

  module.deps = converter.deps()
  modules[ module.name ] = module

  if(!!module.deps) loader.loadMore(module, config.follow === 'true')
}

function onDeps(module, modules, tree) {
  module.deps = normalizeDeps()
  tree.add(module.name, module.deps)

  function normalizeDeps() {
   return _.map(module.deps, function(d) {
      var ref = _.find(modules, function(m) { return m.refs && m.refs.indexOf(d) > -1 })
      return ref ? ref.name : d
    })
  }
}