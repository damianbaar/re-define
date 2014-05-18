var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../utils/file')
  , template = require('handlebars').compile

module.exports = function (relativeTo, config, descriptor) {
  var module = {}

  module.path = utils.relativePath(relativeTo || config.base, descriptor.name)
  module.name = 'text/' + utils.relativeName(config.base, module.path)
  module.type = descriptor.alias || 'text'
  module.ref  = descriptor.ref

  module.variable = true

  return { override: override
         , resolve: resolve }

  function override(owner) {
    owner.deps = _.map(owner.deps, function(d) { return d === module.ref ? module.name : d })
  }

  function resolve(done) {
    fs.readFile(module.path, 'utf-8', function(err, result) {
      var render = template('"{{{content}}}"')
        , content = result.replace(/\r?\n|\r/g,'')
        
        module.content = result
        module.ast = render({name: module.name, content: content}) 
        done(module)
    })
  }
}
