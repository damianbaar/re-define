var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(bundle, enc, next) {
    var folders = _(bundle.internal)
                  .groupBy('base')
                  .reduce(function(memo, files, key) {
                    _.each(files, function(f, i, arr) {
                      if(f.external) 
                        memo[f.path] = f.requiredAs
                      else {
                        var folder = key

                        if(key === '.' || key === config.base) {
                          folder = path.join(
                            path.basename(process.cwd().replace(config.base))
                          , path.basename(key))

                          //TODO what should happen when our index file is in nested folder
                          //should it be smarter?
                          if(arr.length - 1 == i && f.name.indexOf('index') > -1)
                            folder = path.basename(process.cwd().replace(config.base))
                        } else {
                          folder = path.basename(path.resolve(key))
                        }

                        memo[f.path] = folder
                      }
                    })
                    return memo
                  }, {})

    // var updated = []

    _.each(bundle.internal, function(f) {
      var name = folders[f.path] + '/' + f.name

      if(folders[f.path] === f.name) name = f.name
      if(f.name === 'index') name = folders[f.path]

      // if(updated.indexOf(f) === -1) updateReference(f, name)
      updateReference(f, name)

      // updated.push(f)

      _.each(f.references, function(r) {
        // if(updated.indexOf(r) === -1) {
          updateReference(r, name)
        //   return
        // }
        // updated.push(r)
      })
    })

    function updateReference(dep, name) {
      dep.name = name
      dep.update && dep.update(name)
    }

    this.push(bundle)
    next()
  })
}
