var _ = require('underscore')
  , async = require('async')
  , fs = require('fs')
  , path = require('path')
  , resolve = path.resolve
  , read = fs.readFileSync
  , join = path.join
  , dir = path.dirname

module.exports = {
  load: load
}

function load(config, contents, resolver, done) {
  var internal = []
    , external = []
    , pathName = {}
    , pathContent = {}

  var file = read(resolve(config.base, appendJs(config.main)), 'utf-8')
    , deps = resolver.deps(file)
    , depsLoc = _(deps).map(function(d){
      var path = resolve(join(dir(config.base), appendBase(appendJs(d))))
      pathName[path] = d
      return path
    })

  function checkIfExists(done) {
    async.filter(depsLoc, fs.exists, function(result) {
      internal = result

      _(pathName).each(function(v,k) {
        if(internal.indexOf(v) === -1) {
          external.push(v)
          delete pathName[v]
        }})

      done()
    })
  }

  function readDep(done) {
    async.map(internal, readFile, function(err, result) {
      _(internal).each(function(d,i) {
        pathContent[internal[i]] = result[i]
      })
      done()
    })

    function readFile(path, callback) {
      fs.readFile(path, 'utf-8', callback)
    }
  }

  async.series([checkIfExists, readDep], function() {
    var content = [{name: 'r'+(+new Date()), content: file}]

    _(pathContent).each(function(c,p) {
      content.push({name: pathName[p], content: c})
    })

    done(content)
  })

  function appendBase(value) {
    if(value.indexOf('.\/') > -1) return value
    return ".\/"+value
  }

  function appendJs(value) {
    if(value.indexOf('.js') > -1) return value
    return value + '.js'
  }
}

