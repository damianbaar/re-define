var _ = require('underscore')
  , fileLoader = require('./deps/dep-file-loader')
  , streamSplitter = require('./deps/dep-stream-loader')
  , depsTree = require('./deps/dep-order')
  , converters = require('./converter/converter')
  , resolvers = require('./resolver/resolver')
  , file = require('./utils/file')
  , through = require('through2')
  , utils = require('util')

module.exports = function(config) {
  var stream = through(write)
    , tree = depsTree.tree()
    , wrap = _.compose(transform, order)
    , modules = {}
    , parallelStreams 
    , splitter
    , loader

  function write(chunk) {
    splitter = streamSplitter({
      streams: function(streams) {
        parallelStreams = streams.length
      }
    , onModule: function (module, first) {
        if(first) module.name = file.name(config.main) || 'main'


        onModule(module, !config.follow ? done : load)

        function load(deps) {
          loader = fileLoader(module, deps, config.base,
                    { onModule: onModule
                    , done: done
                    }
                    , modules)
        }
      }
    }, config.separator)

    splitter.load(chunk.toString())
  }

  return stream

  function onModule(module, next, until) {
    var m = modules[module.name]

    if(m) m.refs = module.refs = (m.refs).concat(module.refs)

    if(!module.content && !m) registerModule(module)
    if(!module.content) return

    var converter = converters(config)
      , resolver = resolvers(config, modules)

    converter(module, modules, function(m) {
      _.defaults(module, m)

      if(m.name) module.name = m.name
      registerModule(module)
    })

    resolver(module, modules, function (d) {
      _.extend(modules, d)

      var toResolve  = _.difference(module.deps, _.keys(d))
        , toLoad     = _.filter(toResolve, function(val) { return val.indexOf('.') === 0 })
        , external   = _.difference(toResolve, toLoad)

      _.each(external, function(name) { !modules[name] && registerModule({name: name, loaded: true, type: 'external'}) })
      _.each(toLoad, function(name) { registerModule({name: name, base: module.base}) })

      if(parallelStreams <= 1 && checkIfDone()) done()

      next(_.difference(toLoad, _.keys(d)))
    })

    parallelStreams-- 
  }

  function registerModule(module) { 
    modules[ module.name ] = module
        if(!module.base) module.base = config.base
  }

  function checkIfDone() {
    return _.every(modules, function(module){ 
      var ref = findRef(module.name)

      return (!!module.content)
             || module.loaded
             || (ref && !!ref.content) 
    })
  }

  function done() {
    _.each(modules, function(module, name) {
      module.deps = normalizeDeps(module.deps)
      tree.add(module.name, module.deps)
    })

    stream.push(wrap(tree.resolve()))
  }

  function findRef(name) {
    return _.find(modules, function(m) { return m.refs && m.refs.indexOf(name) > -1 })
  }

  function normalizeDeps(deps) {
   return _.map(deps, function(d) {
      var ref = findRef(d)
      return ref ? ref.name : d
    })
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
}

