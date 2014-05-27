var fs = require('fs')
  , path = require('path')

module.exports = function (relativeTo, config, descriptor) {
  var module = {}

  module.path = path.resolve(relativeTo, descriptor.args)
  module.type = 'include'
  module.name = module.ref = descriptor.ref

  module.variable = true

  return { override: function() {} 
         , resolve: resolve }

  function resolve(done) {
    fs.readFile(module.path, 'utf-8', function(err, result) {
      module.ast = module.content = result
      done(module)
    })
  }
}
