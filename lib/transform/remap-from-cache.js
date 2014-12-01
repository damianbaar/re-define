var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:remap')
  , fs = require('fs')
  , _ = require('lodash')
  , path = require('path')
  , async = require('async')
  , mkdirp = require('mkdirp')

module.exports = function(config) {
  var tempFolder = config.tempFolder
    , mappings = tempFolder && path.resolve(tempFolder, 'mapping.json')

  return through.obj(function(files, enc, next) {
    if(!config.development || !tempFolder) {
      debug('Skipping step')
      this.push(files)
      return next()
    }

    var self = this

    async.waterfall([
      function (cb) {
        mkdirp(path.resolve(tempFolder), function(err) { cb() })
      },
      function(cb) {
        fs.exists(mappings, function(e) {
          cb(null, e)
        })
      },
      function(exists, cb) {
         if(exists) {
            fs.readFile(mappings, 'utf8', function(err, map) {

              map = JSON.parse(map)

              _(files)
                .filter(function(d) { return !d.isNull() })
                _.each(files, function(f) {
                  var name = map[f.path]
                  if(name && f.name != name) {
                    debug('Remapping name from cache %s, %s', name, f.name)

                    f.name = name

                    updateReference(f, f.name)
                    _.each(f.references, function(r) { updateReference(r, f.name) }) 
                  }
                })
              cb()
            })
         } else cb()

        function updateReference(dep, name) { dep.update && dep.update(name) }
      },
      function(cb) {
        //TODO some optimization if revalidation is needed
        // _.anyOf(files,

        var mappings = _.reduce(files, function(memo, d) { 
          memo[d.path] = d.name
          return memo
        }, {})

        fs.writeFile( path.join(tempFolder, 'mapping.json')
                    , JSON.stringify(mappings)
                    , function(err) { cb() })
      }
    ], function(err) {
      self.push(files)
      next()
    }) 
  })
}
