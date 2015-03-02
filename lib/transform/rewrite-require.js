var _ = require('lodash')
  , through = require('through2')
  , debug = require('debug')('re-define:transform:rewrite-require')
  , path = require('path')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var cwd = (config.cwd && path.resolve(config.cwd)) || process.cwd()
      , base= path.join(cwd, config.base)

    _(files)
      .filter(function(f) { return !f.isNull() })
      .each(function(f) {
        var folders = config.discoverable
          , safePath = f.path.replace(/\\/g,'/') 
          , name = f.name

        if(!_.has(f,'external')) {
          _.each(folders, function(folder) {
            if(safePath.lastIndexOf(folder) > -1) f.external = true
          })
        }

        if(!f.external) {
          var _rel = path.relative(config.base ? base : cwd, safePath)
            , folder = config.project || (config.autoInsertFolder ? path.basename(cwd) : '')

          f.name = folder ? folder + '/' + _rel : _rel
          f.group = f.base
        } else {
          var folders = _.sortBy(folders, function(d) { return safePath.lastIndexOf(d) * -1 })
            , folder = folders[0]
            , idx

          if((idx = safePath.lastIndexOf(folder)) > -1) {
            var modules = folder + '/'
              , _rel = safePath.slice(idx + modules.length, safePath.length)
              , moduleName = _rel.split('/')[0]
              , modulePath = safePath.slice(0, idx + modules.length) + moduleName

            f.name = _rel
            f.group = modulePath
          }
        }
      })
      //TODO align to external lib cwd, package.json.main points to /sth/main.js, sth should be a base path
      .groupBy('group')
      .each(function(group, base) {
        var fromDescriptor = _.find(group, function(d) { return d.pkgName })
          , isExternal = _.find(group, function(d) { return d.external })
        
        if(isExternal) {
          var pkg = fromDescriptor && fromDescriptor.pkgName

          _.each(group, function(f) {
            if(f === fromDescriptor && fromDescriptor.descriptor) {
              f.name = f.packageName = fromDescriptor.pkgName
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

    _(files)
      .groupBy('path')
      .each(function(files, path) {
        var notEmpty = _.find(files, function(f) { return f && (f.isNull || !f.isNull()) })
          , exists = !_.isEmpty(notEmpty)

        _.each(files, function(f) {
          if(!exists) return (f.revert && f.revert())

          updateReference(f, notEmpty.name)

          if(f.revert && f.requiredAs && f.requiredAs.indexOf('./') == -1)
            f.revert()

          _.each(f.references, function(d) {
            updateReference(d, f.name)
          })
        })
      })

    function updateReference(dep, name) { dep.update && dep.update(name) }

    this.push(files)
    next()
  })
}
