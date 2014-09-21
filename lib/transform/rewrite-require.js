var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var internalBase = path.resolve(path.join(config.base || process.cwd()))

    var cwd = process.cwd()
      , folders = _(files)
                  .filter(function(d) { return !d.isNull() })
                  .each(function(d) {
                    if(d.base.indexOf(cwd) === -1) d.base = path.resolve(d.base)

                    d.external = internalBase !== d.base
                  })
                  .filter(function(d) { return !d.isNull() })
                  .groupBy('base')
                  .each(function(folderFiles, base) {
                    //align paths folder names
                    _.each(folderFiles, function(f) { 
                      if(f.external) {
                        f.name = path.relative(path.join(base, '..'), f.path)
                      } else {
                        f.name = config.project
                                  ? config.project + '/' + f.name
                                  : path.relative(path.resolve(config.base || process.cwd())
                                                 , f.path)
                      }

                      //rewrite entry points
                      if(path.basename(path.dirname(f.path)) === f.requiredAs) {
                        f.name = f.requiredAs
                      } else if(f.path.indexOf('index.') > -1) {
                        if(f.external) {
                          f.name = path.basename(path.dirname(f.path))
                        } else {
                          f.name = config.project
                                    ? config.project
                                    : path.basename(path.resolve(config.base || process.cwd()))
                        }
                      }
                      if(f.pkgName) f.name = f.pkgName
                    })
                  })

    _.each(files, function(f) {
      if(f.isNull()) {

        f.revert && f.revert()
        _.each(f.references, function(r) { r.revert && r.revert() })

      } else {
        updateReference(f, f.name)
        _.each(f.references, function(r) { updateReference(r, f.name) }) }
    })

    function updateReference(dep, name) { dep.update && dep.update(name) }

    this.push(files)
    next()
  })
}
