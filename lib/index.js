var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamSplitter = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , resolveConverter = require('./converter/converter')
  , resolveMixin = require('./converter/mixin')
  , through = require('through2')
  , utils = require('util')

module.exports = function(userConfig) {
  var config = require('./config')(userConfig)

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
      var converter = resolveConverter(config.converters)
        , mixins = resolveMixin(config.mixins, config.base, modules)

      converter(module.content, function(resolved) {
        _.defaults(module, resolved)
        module.transform = _.partial(module.transform, module)
      })

      mixins(module, modules, function (mixin) {
        _.extend(modules, mixin)
        next(_.difference(module.deps, _.keys(mixin)))
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
      return _.chain(depsTree)
              .map(function(m) { return modules[m] })
              .compact()
              .value()
    }

    function printModules() {
      if(config.verbose) {
        var m = _.map(modules, function(m) { return _.omit(m, 'converter') })
        utils.debug(JSON.stringify(m ,null, 2))
      }
    }
}

