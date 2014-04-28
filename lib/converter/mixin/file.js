var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../../utils/file')

module.exports = function (pattern, parent, dep, base, done) {
  var module = {}

  module.path = utils.relativePath(parent.path || base, dep.replace(pattern, ''))
  module.name = 'file/' + utils.relativeName(base, module.path)
  module.type = 'mixin'

  parent.mixin = parent.mixin || []

  parent.deps = _.map(parent.deps, function(d) {
    if(d === dep) { parent.mixin.push(module.name); return module.name }
    return d
  })

  fs.readFile(module.path, 'utf-8', function(err,result) {
    module.content = result.replace(/\r?\n|\r/g,'')
    done(module)
  })
}