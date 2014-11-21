var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var cwd = (config.cwd && path.resolve(config.cwd)) || process.cwd()
      , internalBase = path.join(cwd, config.base)
      , folders = _(files)
                  .filter(function(d) { return !d.isNull() })
                  .each(function(d) {
                    if(d.base.indexOf(cwd) === -1) d.base = path.resolve(d.base)
                    d.external = internalBase !== d.base
                  })
                  .filter(function(d) { return !d.isNull() })
                  .each(function(f) {
                    var idx
                      , folders = config.alignToFolder

                    _.each(folders, function(d) { 
                      if((idx = f.path.lastIndexOf(d)) > -1) {
                        f.name = f.path
                                  .slice(idx, f.path.length)
                                  .replace(d + '/', '') 
                      }
                    })

                    //TODO refactor/rethink do something!
                    if(!f.external) {
                      f.name = config.project
                                ? f.name.indexOf('index') === -1 ? config.project + '/' + f.name : 
                                    (function() { 
                                      if(path.dirname(f.path) === internalBase) return config.project 
                                      else return config.project + '/' + path.relative(cwd, path.dirname(f.path))
                                    })()
                                : path.relative(cwd, f.path)

                      f.name = f.name.replace('/index', '')
                    }

                    //rewrite entry points
                    if(path.basename(path.dirname(f.path)) === f.requiredAs)
                      f.name = f.requiredAs

                    if(f.path.indexOf('index.') > -1 && f.external)
                      f.name = f.requiredAs

                    if(f.pkgName) f.name = f.pkgName
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
