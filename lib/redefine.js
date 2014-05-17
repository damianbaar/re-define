var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamSplitter = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , converters = require('./converter/converter')
  , resolvers = require('./resolver/resolver')
  , through = require('through2')
  , utils = require('util')

module.exports = function(config) {
  var stream = through(write)
    , tree = depsTree.tree()
    , wrap = _.compose(transform, order)
    , modules = {}
    , splitter
    , loader

  function write(chunk) {
    splitter = streamSplitter({
      onModule: function (module) {
        onModule(module, load)

        if(!config.follow || module.deps.length === 0) {
          done()
          return
        }

        function load(deps) {
          loader = fileLoader(module, deps, config.base,
                    { onModule: onModule
                    , onDeps: onDeps
                    , done: done
                    }
                    , modules)
        }

        function done() {
          printModules()
          stream.push(wrap(tree.resolve()))
        }
      }
    })

    splitter.load(chunk.toString())
  }

  return stream

  function onModule(module, next) {
    var converter = converters(config)
      , resolver = resolvers(config, modules)

    converter(module, modules, function(m) {
      _.defaults(module, m)
    })

    resolver(module, modules, function (d) {
      _.extend(modules, d)
      next(_.difference(module.deps, _.keys(d)))
    })

    modules[ module.name ] = module
  }

  function onDeps(module) {
    module.deps = normalizeDeps()
    tree.add(module.name, module.deps)

    function normalizeDeps() {
     return _.map(module.deps, function(d) {
        var ref = _.find(modules, function(m) { return m.refs && m.refs.indexOf(d) > -1 })
        return ref ? ref.name : d
      })
    }
  }

  function transform(modules) { return config.wrappers[ config.wrapper ](modules, config) }

  function order(depsTree) {
    var o = _.chain(depsTree)
             .map(function(m) { return modules[m] })
             .compact()
             .value()
    

    var p = _.chain(modules)
             .map(function(i, k) { return depsTree.indexOf(k) === -1 ? i : null })
             .compact()

    return p.concat(o) 
  }

  function printModules() {
    if(config.verbose) {
      var m = _.map(modules, function(m) { return _.omit(m, 'converter') })
      utils.debug(JSON.stringify(m ,null, 2))
    }
  }
}

