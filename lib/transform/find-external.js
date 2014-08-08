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
        , descriptors = config.descriptors
        , externalLocation

      var external = config.external[ file.requiredAs ]

      if(_.isString(external)) externalLocation = external
      if(_.isObject(external)) {
        externalLocation = external.path
        file.deps = _.map(external.deps, function(d) {
          return Module({name: d, path: d, requiredAs: d})
        })
        file.stopProcessing = external.stopProcessing === undefined || external.stopProcessing? true : false
        file.wrap = false
      }

      if(config.skip && config.skip.indexOf(file.name) > -1) {
        this.push(file)
        next()
        return
      }

      if(!!externalLocation) {
        end(externalLocation)
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
