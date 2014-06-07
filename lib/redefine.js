var _ = require('lodash')
  , depsTree = require('./deps/dep-order')
  , converter = require('./converter/converter')
  , resolver = require('./resolver/resolver')
  , fs = require('fs')
  , path = require('path')
  , file = require('./utils/file')
  , through = require('through2')
  , utils = require('./utils/file')
  , finder = require('findit')
  , path = require('path')
  , combiner = require('stream-combiner')

module.exports = function(config) {
  //TODO fromstream path, content
  //
  var customPath = through.obj(function(data, enc, cb) {
      _.each(data.toString().split('\n'), function(p) {
        if(fs.statSync(path.resolve(p)).isFile())
          this.push(path.resolve(p))
      }.bind(this))
      cb()
    })

  //bower_components
  //node_modules -> remove to make structure flat
  var traverseDir = through.obj(function(m, enc, cb) {
    finder(path.resolve(config.base))
      .on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        if (base === '.git' || base === 'node_modules') stop()
      })
      .on("file", function (file, stat) {
        var ext = path.extname(file) 
        if(ext === '.js' || ext === '.html') this.push(file);
      }.bind(this))
      .on('end', function() {
        cb()
      }.bind(this))
  })

  var getFile = through.obj(function(filePath, enc, cb){
    fs.createReadStream(filePath)
    .pipe(through.obj(function(m,e,c) {
      this.push({
        path: filePath
      , content: m.toString()
      , ext: path.extname(filePath)
      , dir: path.dirname(filePath)
      , name: utils.relativeName(config.base, filePath)
      })
      cb()
    }.bind(this)))
  })

  var depsRewrite = through.obj(function(module, end, callback) {
    module.deps = _.chain(module.deps)
      .map(function(d, i) {
        if(d.search(/(.*\/?)\!/) > -1) d = d.replace(/(.*\/?)\!/, '')

        return path.relative(config.base, path.resolve(module.dir, d))
      })
      .compact()
      .value()

    this.push(module)
    callback()
  })

  var concat = function() {
    var stream = through.obj(write, end)
      , files = []

    function write (buf,enc,next) {
      files.push(buf)
      next() 
    }
    function end (cb) {
      this.push(files)
      files = null
      cb()
    }

    return stream
  }

  var wrapper = through.obj(function(modules, end, callback) {
    var tree = depsTree.tree()
      , order

    _(modules)
      .each(function(module) { tree.add(module.name, module.deps) })
      .tap(function(d) { order = tree.resolve() })
      .sort(function(a, b) { return order.indexOf(a.name) > order.indexOf(b.name) })
      .tap(function(a) { modules = config.wrappers[ config.wrapper ](modules, config) })
      .value()

    this.push(modules)
    callback()
  })

  return combiner(
      config.fileMode ? traverseDir : customPath 
    , getFile
    , converter(config.converters)
    , depsRewrite
    , concat()
    , wrapper
  ) 
}

