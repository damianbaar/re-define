var _ = require('lodash')
  , depsTree = require('./deps/dep-order')
  , converters = require('./converter/converter')
  , resolvers = require('./resolver/resolver')
  , fs = require('fs')
  , path = require('path')
  , file = require('./utils/file')
  , through = require('through2')
  , utils = require('./utils/file')
  , finder = require('findit')
  , path = require('path')
  , combiner = require('stream-combiner')

module.exports = function(config) {
  var fromStream = _(function(data, cb) {
      _(chunk.toString().split(config.separator))
        .each(function(s, i) { 
          this.push({content:module})
        }.bind(this))
        this.push(null)
        cb()
    })

  //bower_components
  //node_modules -> remove to make structure flat
  var getPaths = through.obj(function(m, enc, cb) {
    finder(path.resolve(config.base))
      .on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        if (base === '.git' || base === 'node_modules') stop()
        else console.log(dir + '/')
      })
      .on("file", function (file, stat) {
        if(path.extname(file) === '.js') this.push(file);
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
      , dir: path.dirname(filePath)
      , name: utils.relativeName(config.base, filePath)
      })
      cb()
    }.bind(this)))
  })

  var convert = through.obj(function(module, enc, cb) {
    converters(config)(module, function(m) {
      _.merge(module, m)
      this.push(module)
      cb()
    }.bind(this))
  })

  var plugins = through.obj(function(module, enc, cb) {
  //   resolver(module, modules, function (d) {
  //     _.extend(modules, d)
  //
  //     // loader.write({parent: module
  //     //   , deps: _.difference(module.deps, _.keys(d))
  //     //   , base: config.base})
  //   })
    this.push(module)
    cb()
  })

  var depsRewrite = through.obj(function(module, end, callback) {
    module.deps = _.map(module.deps, function(d, i) {
      return path.relative(config.base, path.resolve(module.dir, d))
    })

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

  // return combiner(config.fileMode ? fromFile : fromStream, convert, plugins) 
  return combiner(getPaths, getFile, convert, depsRewrite, plugins, concat(), wrapper) 
}

