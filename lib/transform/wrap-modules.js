var _ = require('lodash')
  , fs = require('fs')
  , through = require('through2')
  , path = require('path')
  , debug = require('debug')('re-define:transform:wrap-modules')
  , File = require('vinyl')
  , minimatch = require('minimatch')

module.exports = function(config) {
  return through.obj(function(files, enc, next) {
    var cuttingPoints = config.slice
      , chunks = {}
      , map = {}
      , self = this

    var internal = _.filter(files, function(d) { return !d.isNull() })
      , external = _(files)
                    .pluck('name')
                    .uniq()
                    .difference(_.pluck(internal,'name'))
                    .filter(function(d) {
                      return !_.find(config.exclude, function(pattern) {
                        return pattern && minimatch(d, pattern)
                      })
                    })
                    .value()

    _.each(internal, function(dep) {
      var match = _.find(cuttingPoints, function(file, pattern) {
        return minimatch(dep.path, path.join((config.cwd && path.resolve(config.cwd)) || process.cwd(), pattern))
      })

      if(match) {
        chunks[match] = chunks[match] || []
        chunks[match].push(dep)
        map[dep.path] = match
      }
    })

    //TODO this needs to be smarter, there is a missing check if file exist
    if(config.development) {
      // var _chunks = {}
      // _.each(chunks, function(deps, path) {
      //   var fresh = _.any(deps, function(d) { return d.needsInvalidation })
      //   console.log(deps, path)
      //   if(fresh) _chunks[path] = deps
      //   else debug('File stays untouched, there is no change detected for', path)
      // })
      // chunks = _chunks
    }

    debug('Wrapping: %o', files)

    var combine = require('combine-source-map')
      , convert = require('convert-source-map')

    _.each(chunks, function(files, output) {
      var bundle = {internal: files, external: getBundleExternals(files, external)}
        , file = new File({ cwd: process.cwd()
                          , base: path.resolve(process.cwd(), config.base)
                          , path: output })
        , header = config.buildInfo ? getHeader() : []

      var fileHeader = _.map(header, function(d) { return '//' + d }).join('\n')
        , content = config.wrappers[ config.wrapper ](bundle, config)
        , sourceMap

      var base64 = combine.create(output + '.map')
        , top = 1 
        , bottom = 1
        //TODO each template needs to has it somehow defined 
        //-> template head + sourcemap + re-define header + enter
        , offset = 40 + 1 + header.length
        , template = 1

// console.log('asdsad', stringLineLength(content))

      _.each(files, function(f, i) {
        f.sourceMap = f._sourceMap && convert.fromObject(f._sourceMap).toComment()
        f.contents = combine.removeComments(f.contents)

        if(!f._sourceMap) {
          return offset += top + bottom + template
        }

        base64.addFile({
            source: f.contents + '\n' + f.sourceMap
          , sourceFile: f._sourceFile
        }, {line: offset})

          offset += stringLineLength(f.contents) + top + bottom
      })

      sourceMap = base64.comment()

      file.contents = new Buffer([sourceMap, fileHeader, content].join('\n'))

      self.push(file)

      function stringLineLength(line) { return line.toString().split('\n').length }

      function getHeader() {
        var header = []

        header.push('re-define version:' + config.version)

        if(fs.existsSync('./package.json')) {
          try { header.push('library version:' + require(process.cwd() + '/package.json').version) } 
          catch(e) { debug(e) }
        }

        if(!_.isEmpty(bundle.external)) header.push('externals: ' + bundle.external)

        return header
      }
    })


    function getBundleExternals(files, external) {
      var deps = _(files)
                  .pluck('dependencies')
                  .flatten()
                  .map('name')
                  .value()

      return _.intersection(deps, external)
    }

    next()
  })
}
