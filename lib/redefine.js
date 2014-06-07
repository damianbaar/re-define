var _ = require('lodash')
  , depsTree = require('./deps/dep-order')
  , converter = require('./converter/converter')
  , fs = require('fs')
  , path = require('path')
  , through = require('through2')
  , finder = require('findit')
  , combiner = require('stream-combiner')

module.exports = function(config) {
  //TODO fromstream path, content
  //
  var split = through.obj(function(chunk, enc, next) {
      _.each(chunk.split('\n'), function(p) {
        if(fs.statSync(path.resolve(p)).isFile()){
          this.push({path: path.resolve(p)})
        }
      }.bind(this))

      next()
    })

  //bower_components
  //node_modules -> remove to make structure flat
  var traverseDir = through.obj(function(chunk, enc, next) {
    var ignoredFolders = ['.git', 'node_modules']
      , includeFiles   = ['.js', '.html']

    finder(path.resolve(config.base))
      .on('directory', function (dir, stat, stop) {
        if (ignoredFolders.indexOf(path.basename(dir)) > -1) 
          stop()
      })
      .on("file", function (file, stat) {
        if(includeFiles.indexOf(path.extname(file)) > -1) {
          this.push({path: file})
        }
      }.bind(this))
      .on('end', function() {
        next()
      })
  })

  var file = through.obj(function(module, enc, next){
    fs.createReadStream(module.path)
      .pipe(through.obj(function(m,e,c) {
        this.push(_.extend(module, { content: m.toString() }))
        next()
      }.bind(this)))
  })

  var paths = through.obj(function(module, enc, next) {
    _.extend(module,
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
    var tree = depsTree.tree()
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
    !!config.fileMode ? traverseDir : split 
    , file
    , paths
    , converter(config.converters)
    , depsRewrite
    , concat()
    , wrapper
  ) 
}

