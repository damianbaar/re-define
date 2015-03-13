var acorn = require('acorn')
  , through = require('through2')

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.isNull() && !file.fromCache) {
      var f = file.contents.toString()
        , c 

      if(file.ext == '.html') { 
        c = f.replace(/\r?\n|\r/g,'')
             .replace(/["']/g,'\\\"')

        c = 'module.exports = "' + c + '"'
      } else if(file.ext == '.json') {
        c = 'module.exports = ' + f
      }

      if(!!c) {
        file.contents = new Buffer(c)
        file.stopProcessing = true
      }
    }

    this.push(file)
    next()
  })
}

