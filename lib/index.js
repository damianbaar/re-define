var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamSplitter = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , resolveConverter = require('./converter/converter')
  , resolveMixin = require('./converter/mixin')
  , through = require('through2')

module.exports = function (config) {
  var stream = through(write)
    , tree = depsTree.tree()
    , wrap = _.compose(transform, order)
    , modules = {}
    , splitter
    , loader

    function write(chunk, enc, next) {
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
            // console.log(_.keys(modules), tree.resolve())
            stream.push(wrap(tree.resolve()))
            next()
          }
        }
      })

      splitter.load(chunk.toString())
    }

    return stream

    function onModule(module, next) {
      var converter
        , mixins = resolveMixin(config.mixins, config.base, modules)

      if(module.content) converter = resolveConverter(config.converter).attachTo(module)

      if(converter && !module.name) module.name = module.converter.name()
      if(converter && !module.deps) module.deps = module.converter.deps()
      if(!module.path) module.path = config.base

      mixins(module, function (mixin) {
        _.extend(modules, mixin)

        tree.add(module.name, module.deps)

        next(_.difference(module.deps, module.mixin))
      })

      modules[ module.name ] = module
    }

    function onDeps(module) {
      module.deps = normalizeDeps()

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
}
