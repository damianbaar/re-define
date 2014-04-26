var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamSplitter = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , converters = require('./converter/converter')
  , through = require('through')

module.exports = function (config) {
  var stream = through(write, function() {})
    , tree = depsTree.tree()
    , wrap = _.compose(transform, order)
    , modules = {}
    , splitter
    , loader

    function write (data) {
      splitter = streamSplitter({
        onModule: function (module) {
          onModule(module)

          if(!config.follow) {
            done()
            return
          }

          loader = fileLoader(module, config.base,
                    { onModule: onModule
                    , onDeps: onDeps
                    , done: done
                    }
                    , modules)

          function done() { stream.queue(wrap(tree.resolve())) }
        }
      })

      splitter.load(data.toString())
    }

    return stream

    function onModule(module) {
      var converter

      modules[ module.name ] = module

      if(module.content) converter = converters(config).attachTo(module)
      if(!converter || !converter.match(module)) return

      if(!module.name) module.name = module.converter.name()

      module.deps = converter.deps()
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
}
