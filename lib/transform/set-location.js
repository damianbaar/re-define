var _ = require('lodash')
  , through = require('through2')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(module, enc, next) {
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
}
