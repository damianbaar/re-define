var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var cwd = process.cwd()
      , folders = _(files)
                  .each(function(d) {
                    if(d.base.indexOf(cwd) === -1) d.base = path.resolve(d.base)
                  })
                  .groupBy('base')
                  .reduce(function(memo, files, key) {
                    var external = _.find(files, function(d) { return d.external })
                      , common = []

                    if(external) {
                      _.each(files, function(f) { 
                        if(f !== external) {
                          f.external = true 
                          memo[f.path] = path.basename(key)
                        } 
                      })
                    } else {

                    _.each(files, function(f, i, arr) {
                      if(f.external) return

                      var folder = key

                      if(config.project) {
                        memo[f.path] = config.project
                        return
                      }

                      if(key === '.' || key === config.base) {
                        folder = path.join(
                          path.basename(process.cwd().replace(config.base))
                        , path.basename(key))

                        if(arr.length - 1 == i && f.name.indexOf('index') > -1) {
                          folder = path.basename(process.cwd().replace(config.base))
                        }
                      } else {
                        folder = path.basename(path.resolve(key))
                      }

                      memo[f.path] = folder
                    })
                    }
                    return memo
                  }, {})

    _.each(files, function(f) {
      if(f.isNull()) {

        f.revert && f.revert()
        _.each(f.references, function(r) { r.revert && r.revert() })

      } else {
        var name = _.compact([folders[f.path], f.name]).join('/')

        if(folders[f.path] === f.name) name = f.name
        if(f.name === 'index') name = folders[f.path]

        updateReference(f, name)
        _.each(f.references, function(r) { updateReference(r, name) })
      }
    })

    function updateReference(dep, name) {
      dep.name = name
      dep.update && dep.update(name)
    }

    this.push(files)
    next()
  })
}
