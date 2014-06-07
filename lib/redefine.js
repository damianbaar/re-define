var _ = require('lodash')
  , converter = require('./converter/converter')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , combiner = require('stream-combiner')

module.exports = function(config) {

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
      , name: path.relative(config.base, 
          function(p) { return p.replace(path.extname(p), '') }(module.path)
      )})

    this.push(module)
    next()
  })

  var depsRewrite = through.obj(function(module, end, callback) {
    module.deps = _.chain(module.deps)
      .map(function(d, i) {
        if(d.search(/(.*\/?)\!/) > -1) d = d.replace(/(.*\/?)\!/, '')
        //TODO reconsider: possible issue template.html/template.js
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
      modules = null
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

  return combiner(file, paths, converter(config.converters), depsRewrite, concat(), wrapper) 
}

