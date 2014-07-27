var _ = require('lodash')
  , through = require('through2')
  , fs = require('fs')
  , path = require('path')
  , async = require('async')
  , Module = require('../module')

module.exports = function(config) {
  return function(globalConfig, writer) {
    return through.obj(function(file, enc, next){
      if(!file.isNull()) {
        this.push(file)
        next()
        return
      }

      var self = this
        , discoverable = config.discoverable
        , externalLocation = config.external[ file.reference ]
        , descriptors = config.descriptors

      if(!!externalLocation) {
        _end(externalLocation)
        return
      }
      async.detect(likelyLocations(), fs.exists, function(p) {
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
          self.push(file)
          next()
          return
        }

        file.path = loc
        file.base = path.dirname(loc)
        file.parent = null
        file.external = false

        writer.write(file)

        next()
      }

      function likelyLocations() {
        return _(discoverable)
          .map(function(d) {
            var _descriptors 
              , _locations
              , _ref = file.reference

            _descriptors = _.map(descriptors, function(desc) {
              return path.resolve(d, _ref, desc)
            })

            _locations = [ path.resolve(d, appendJS(_ref))
                         , path.resolve(d, _ref, appendJS(_ref)) ]

            return (_descriptors || []).concat(_locations || [])

            function appendJS(name) { return name + '.js' }
          })
          .flatten()
          .value()
      }
    })
  }
}
