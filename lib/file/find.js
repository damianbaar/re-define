var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , File = require('vinyl')

module.exports = function(config) {
  return through.obj(function(file, enc, next){
      var self = this
        , discoverable = config.discoverable
        , externalLocation = config.external[file.orig]
        , descriptors = config.descriptors

      if(!!externalLocation) {
        _end(externalLocation)
        return
      }

      async.detect([file.path].concat(likelyLocations()), fs.exists, function(p) {
        if(_.some(descriptors, function(d) { return (p && p.indexOf(d) > -1) })) {
          fs.readFile(p, function(err, content) {
            var main = JSON.parse(content).main

            if(!path.extname(main) && main) main = main + '.js' 

            !!main ? end(path.resolve(path.dirname(p), main))
                   : end(p)
          })
        } else end(p)
      })

      function end(loc) {
        if(!loc) {
          self.emit('external', file)
          next()
          return
        }

        if(loc === file.path) {
          self.push(file)
          next()

          return
        }

        loc = _.isString(loc) ? {path: loc } : loc

        if(!loc.path) return

        self.push(
          _.defaults(new File(
            { base: path.dirname(loc.path), path: loc.path })
          , { parent: file.path, orgPath: file.path }
          , file
          ))

        next()
      }

      function likelyLocations() {
        return _(discoverable)
          .map(function(d) {
            var _descriptors 
              , _locations
              , _orig = file.path || ''

            _descriptors = _.map(descriptors, function(desc) {
              return path.resolve(d, _orig, desc)
            })

            _locations = [ path.resolve(d, appendJS(_orig))
                         , path.resolve(d, _orig, appendJS(_orig)) ]

            return (_descriptors || []).concat(_locations || [])

            function appendJS(name) { return name + '.js' }
          })
          .flatten()
          .value()
      }
    })
}
