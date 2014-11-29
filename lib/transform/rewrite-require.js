var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var cwd = (config.cwd && path.resolve(config.cwd)) || process.cwd()
      , base= path.join(cwd, config.base)

    _(files)
      .filter(function(d) { return !d.isNull() })
      .each(function(f) {
        var folders = config.discoverable
          , name = f.name

        if(!f.external) {
          var _path = path.resolve(path.dirname(f.path), f.name)
            , _rel = path.relative(config.base ? base : cwd, f.path)
            , folder = config.project || (config.autoInsertFolder ? path.basename(cwd) : '')

          f.name = folder ? folder + '/' + _rel : _rel
          f.group = f.base
        } else {
          var folders = _.sortBy(folders, function(d) { return f.path.lastIndexOf(d) * -1 })
            , folder = folders[0]
            , idx

          if((idx = f.path.lastIndexOf(folder)) > -1) {
            var modules = folder + '/'
              , _rel = f.path.slice(idx + modules.length, f.path.length)
              , moduleName = _rel.split('/')[0]
              , modulePath = f.path.slice(0, idx + modules.length) + moduleName

            f.name = _rel
            f.group = modulePath
          }
        }
      })
      .groupBy('group')
      .each(function(group, base) {
        var hasPKGName = _.find(group, function(d) { return d.pkgName })
          , isExternal = _.find(group, function(d) { return d.external })

        if(isExternal) {
          var pkg = hasPKGName ? hasPKGName.pkgName : path.basename(base)

          _.each(group, function(f) {
            if(f === hasPKGName) {
              f.name = hasPKGName.pkgName
              return
            }

            var moduleName = f.name.split('/')
              , folder = moduleName.shift()

            f.name = pkg ? pkg + '/' + moduleName.join('/') : f.name
            f.name = _.compact(f.name.split('/')).join('/')

            f.base = base
          })
        }
      })
      .values()
      .flatten()
      .each(function(f) {
        if(f.path.indexOf('index.') > -1) f.name = f.name.replace('/index', '')
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
