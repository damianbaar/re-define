var _ = require('lodash')
  , converter = require('./converter/converter')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , combiner = require('stream-combiner')

module.exports = function(config) {

  var include = through.obj(
    function(chunk, enc, next) {
      this.push(chunk)
      next()
    }
  , function(end) {
    _.each(config.include, function(d) {
      var fileAlias = d.split('#')
      this.push({path: path.resolve(config.base, fileAlias[0]), alias: fileAlias[1]})
    }.bind(this))
    end()
  })

  var file = through.obj(function(module, enc, next){
    fs.createReadStream(module.path)
      .pipe(through.obj(function(m,e,c) {
        this.push(_.extend(module, { content: m.toString() }))
        next()
      }.bind(this)))
  })

  var paths = through.obj(function(module, enc, next) {
    _.merge(module,
      { ext: path.extname(module.path)
      , dir: path.dirname(module.path)
      , name: name() 
      })

    function name() {
      return !!module.alias 
                ? module.alias 
                : path.relative(config.base, function(p) { 
                  return p.replace(path.extname(p), '') 
                }(module.path))
    }

    this.push(module)
    next()
  })

  var ignore = through.obj(function(module, end, callback) {
    module.deps = _.chain(module.deps)
      .map(function(d) {
        var found = _.some(config.skipDeps, 
                      function(p) { 
                        var pattern = _.isString(p) ? new RegExp(p) : p
                        return d.search(pattern) > -1
                    })
        return found ? null : d
      })
      .compact()
      .value()

    this.push(module)
    callback()
  })

  var depsRewrite = through.obj(function(module, end, callback) {
    module.deps = _.chain(module.deps)
      .map(function(d, i) {
        if(d.search(/(.*\/?)\!/) > -1) d = d.replace(/(.*\/?)\!/, '')

        if(d.indexOf('.') === -1) return d

        if(!!path.extname(d)) d = d.replace(path.extname(d), '')

        return path.relative(config.base, path.resolve(module.dir, d))
      })
      .compact()
      .value()

    this.push(module)
    callback()
  })

  var concat = function() {
    var stream = through.obj(write, end)
      , modules = []

    function write (buf, enc, next) {
      modules.push(buf)
      next() 
    }
    function end (cb) {
      this.push(modules)
      cb()
    }

    return stream
  }

  var wrapper = through.obj(function(modules, end, callback) {
    var tree = require('./deps/dep-order').tree()
      , order
      , internal
      , external

    internal = _(modules)
      .each(function(module) { tree.add(module.name, module.deps) })
      .tap(function(d) { order = tree.resolve() })
      .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
      .value()

    external = _.difference(order, _.pluck(modules, 'name'))

    this.push(config.wrappers[ config.wrapper ](internal, external, config))
    callback()
  })

  return combiner(
          include
        , file
        , paths
        , converter(config.converters)
        , ignore
        , depsRewrite
        , concat()
        , wrapper
        ) 
}

