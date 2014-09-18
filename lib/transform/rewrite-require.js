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
                  .filter(function(d) { return !d.isNull() })
                  .groupBy('base')
                  .each(function(folderFiles, base) {
                    var external = _.filter(folderFiles, function(d) { return d.external })

                    //mark external modules dependencies as external
                    if(!_.isEmpty(external)) {
                      _.each(folderFiles, function(f) { if(f !== external) f.external = true })
                    }

                    //align paths folder names
                    _.each(folderFiles, function(f) { 
                      var name = f.name
                      if(f.external) {
                        f.name = path.relative(path.join(base, '..'), f.path)
                      } else {
                        f.name = config.project
                                  ? config.project + '/' + f.name
                                  : path.relative(path.resolve(config.base || process.cwd())
                                                 , f.path)
                      }
                    })

                    _.each(external, function(f) {
                      f.name = f.requiredAs
                    })

                    //convert index to folder name
                    _.each(folderFiles, function(f) {
                      if(f.path.indexOf('index.') > -1) {
                        if(f.external) {
                          f.name = path.basename(path.dirname(f.path))
                        } else {
                          f.name = config.project
                                    ? config.project
                                    : path.basename(path.resolve(config.base || process.cwd()))
                        }
                      }
                    })

                  })

    _.each(files, function(f) {
      if(f.isNull()) {

        f.revert && f.revert()
        _.each(f.references, function(r) { r.revert && r.revert() })

      } else {
        updateReference(f, f.name)
        _.each(f.references, function(r) { updateReference(r, f.name) })
      }
    })

    function updateReference(dep, name) { dep.update && dep.update(name) }

    this.push(files)
    next()
  })
}
