var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../../utils/file')

module.exports = function (relativeTo, base, name, ref) {
  var module = {}

  module.path = utils.relativePath(relativeTo, name)
  module.name = 'text/' + utils.relativeName(base, module.path)
  module.type = 'text'
  module.ref = ref

  return { override: override
         , resolve: resolve }

  function override(deps) {
    return _.map(deps, function(d) { return d === ref ? module.name : d })
  }

  function resolve(done) {
    fs.readFile(module.path, 'utf-8', function(err,result) {
      module.content = result.replace(/\r?\n|\r/g,'')
      done(module)
    })
  }
}
