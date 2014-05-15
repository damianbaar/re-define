var fs = require('fs')

module.exports = function (relativeTo, config, name, ref) {
  var module = null

  return { override: override
         , resolve: _.partial(done, module)}

  function override(deps) {
    return _.chain(deps)
            .map(function(d) { return d === ref ? null : d })
            .compact()
            .value()
  }

}
