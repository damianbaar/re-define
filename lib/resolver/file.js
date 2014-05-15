var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../utils/file')

module.exports = function (relativeTo, config, name, ref) {
  var module = {}

  module.path = utils.relativePath(relativeTo || config.base, name)
  module.name = 'text/' + utils.relativeName(config.base, module.path)
  module.type = 'resolver'
  module.ref = ref

  module.name = config.escape(module.name)

  return { override: override
         , resolve: resolve }

  function override(deps) {
    return _.map(deps, function(d) { return d === ref ? module.name : d })
  }

  function resolve(done) {
    fs.readFile(module.path, 'utf-8', function(err, result) {
      var template = _.template('var {{name}} = function() { return {{content}} }')
        , content = result.replace(/\r?\n|\r/g,'')

        module.content = template({name: module.name, content: content}) 
        done(module)
    })
  }
}
