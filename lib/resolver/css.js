var fs = require('fs')
  , _ = require('underscore')
  , utils = require('../utils/file')
  , template = require('handlebars').compile

module.exports = function (relativeTo, config, descriptor) {
  var module = {}

  module.path = utils.relativePath(relativeTo || config.base, descriptor.name)
  module.name = descriptor.ref
  module.type = 'css'
  module.resolved = true

  return { override: override
         , resolve: resolve }

  function override(owner) {
    owner.deps = _.chain(owner.deps)
                  .map(function(d) { return d === module.name ? null : d })
                  .compact()
                  .value()
  }

  function resolve(done) {
    fs.readFile(module.path, 'utf-8', function(err,result) {
      var tmpl = '(' + function() { 
                     var css = document.createElement("style");
                     css.type = "text/css";
                     css.innerHTML = "{{content}}";
                     document.body.appendChild(css);
                   } + ')()'

      var render  = template(tmpl)
        , content = result.replace(/\r?\n|\r/g,'')

      module.content = render({content: content})
      done(module)
    })
  }
}
