var _ = require('lodash')
  , combiner = require('stream-combiner')
  , through = require('through2')
  , path = require('path')
  , fs = require('fs')
  , File = require('vinyl')
  , async = require('async')
  , api

module.exports = api = {
  start       : start,
  config      : getConfig,
  template    : require('./wrapper/external-template'),
  split       : require('./util/split-stream'),

  transform: {
    includeFile   : require('./transform/include-file')
  , loadFile      : require('./transform/load-file')
  , setLocation   : require('./transform/set-location')
  , convert       : require('./converter')
  , excludeDeps   : require('./transform/exclude-deps')
  , rewriteDeps   : require('./transform/rewrite-deps')
  , concat        : require('./transform/concat-modules')
  , wrap          : require('./transform/wrap-modules')
  , sort          : require('./transform/sort-modules')
  , split         : require('./transform/split-modules')
  },

  converter: {
    common_js   : require('./converter/type/cjs')
  , amd_cjs     : require('./converter/type/amd-cjs')
  , amd_define  : require('./converter/type/amd-define')
  , amd_require : require('./converter/type/amd-require')
  , raw         : require('./converter/type/raw')
  }
}

function start(config, transform) {
  var converter
    , options = {objectMode: true}
    , stream
    , processing = []
    , external = []
    , pending = []
    , data = []

  converter = through(options, function(file, enc, next) {
      if(processing.indexOf(file.path) > -1) {
        next()
        return
      }

      processing.indexOf(file.path) === -1 && processing.push(file.path)
      pending.indexOf(file.path) === -1 && pending.push(file.path)

      this.push(file)
      next()
    })

  converter
    .pipe(through(options, function(file, enc, next) {
      fs.exists(file.path, function(exists) {
        file.exists = exists

        this.push(file)
        next()
      }.bind(this))
    }))
    .pipe(through(options, function(file, enc, next) {
      if(file.exists) { 
        this.push(file)
        end()
        next()
      }
      else {
        var discoverable = config.discoverable
          , exactLocation = config.external[file.orig]
          , descriptors = config.descriptors
          , likelyLocation

        //TODO READ bower / package .json

        if(!!exactLocation) {
          _end(exactLocation)
          return
        }

        likelyLocation = 
          _(discoverable)
            .map(function(d) {
              var _descriptors 
                , _locations

              _descriptors = _.map(descriptors, function(desc) {
                return path.resolve(d, file.orig, desc)
              })
              
              _locations = [ path.resolve(d, appendJS(file.orig))
                           , path.resolve(d, file.orig, appendJS(file.orig)) ]

              return (_descriptors || []).concat(_locations || [])

              function appendJS(name) { return name + '.js' }
            })
            .flatten()
            .value()

        async.detect(likelyLocation, fs.exists, function(p) {
          var usingDescriptor = _.some(descriptors, function(d) { return p.indexOf(d) > -1 })
          
          if(usingDescriptor) {
            fs.readFile(p, function(err, content) {
              _end(path.resolve(path.dirname(p), JSON.parse(content).main))
            })
          } else _end(p)
        })

        function _end(loc) {
          console.log('----->', loc)
          loc = _.isString(loc) ? {path: loc } : loc

          if(!!loc && !!loc.path) {
            stream.write(
              _.defaults(new File(
                {base: path.dirname(loc.path), path: loc.path })
              , {name: file.orig, parent: file.orig}
              , file))
          }
          else
            external.push(file.orig) 

          resolved(file.path)
          end()
          next()
        }
      }
    }))
    .pipe(through(options, function(file, enc, next) {
      if(!file.exists) {
        next()
        return
      }

      if (file.isNull()) file.contents = fs.createReadStream(file.path)

      if (file.isBuffer()) next()

      if (file.isStream()) {
        file.pipe(through(function(content) {
          file.contents = content
          this.push(file)
          next()
        }.bind(this)))
      }
    }))
    .pipe(defaultTransform(transform))
    .pipe(through(options, function(file, enc, next) {

      if(!file.parent) file.parent = file.name

      _.each(file.deps, function(d) {
        stream.write(
          _.merge(
            new File(
              { base: file.base })
            , d
            , {parent: file.parent}))
      })

      this.push(file)
      next()
    }))
    .pipe(through(options, function(file, enc, next) {
      data.push(file)
      resolved(file.path)
      
      end()
      next()
    }))

  stream = through(options, function(chunk, enc, next) {
    if(_.isString(chunk)) chunk = new File({cwd: config.base, path: chunk})

    converter.write(chunk)
    next()
  }, function(end) {
    console.log(external)
    this.push(_(data).groupBy('parent').map(function(modules, module) { 
      var intro = '\n---------'+module+'-----------\n'

      return intro + _.map(modules, function(m) { return m.name + '\n' + m.transform() + '\n' })
    }).join('\n'))
    end()
  })

  return stream

  function resolved(path) {
    var idx = pending.indexOf(path)
    if(idx > -1) pending.splice(idx, 1)
  }

  function end() {
    if(pending.length) return

    converter.end()
    stream.end()
  }

  function defaultTransform(config, custom) {
    var t = api.transform

    return prepareStreams(
            config,
            [ t.convert
            , t.excludeDeps
            , t.rewriteDeps
            ].concat(custom || []))
  }
}


function fromContent(config) { 
  var t = api.transform

  return prepareStreams(
          config,
          [ t.split
          , t.convert
          , t.excludeDeps
          , t.rewriteDeps
          , t.concat
          , t.sort
          , t.wrap
          ])
}

function fromPath(config) { 
  var t = api.transform

  return prepareStreams(
          config,
          [ t.includeFile
          , t.loadFile
          , t.setLocation
          , t.convert
          , t.excludeDeps
          , t.rewriteDeps
          , t.concat
          , t.sort
          // , t.wrap
          ])
}

function prepareStreams(config, streams) {
  config = config || getConfig()

  return _.compose(combine, applyConfig)(streams)

  function combine(streams) { return combiner.apply(null, streams) }
  function applyConfig(streams) { return _.map(streams, function(s) { return s(config) }) }
}

function getConfig(userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))
    , c = api.converter

  //ORDER matters
  _.extend(config, { converters: 
    { '\.js$': 
      { 'amd-cjs'     : c.amd_cjs
      , 'amd-define'  : c.amd_define
      , 'amd-require' : c.amd_require
      , 'common-js'   : c.common_js
    }

    , '\.html$': 
      { 'text': c.raw(function(d) { return '\'' + d.replace(/\r?\n|\r/g,'') + '\'' }) }

    , '.*':
      { 'raw': api.converter.raw(function(d) { return d }) } 
  }})

  var readFile = _.compose(
                    api.template
                  , _.partialRight(require('fs').readFileSync, 'utf-8')
                  , require('path').resolve)

  _.extend(config, { wrappers: 
          { 'iife'        : readFile(__dirname, 'templates/iife.hbs')
          , 'amd-define'  : readFile(__dirname, 'templates/amd-define.hbs')
          , 'umd/amd-web' : readFile(__dirname, 'templates/amd-web.hbs')
          , 'umd/4all'    : readFile(__dirname, 'templates/return-exports-global.hbs')
          , 'umd'         : readFile(__dirname, 'templates/umd.hbs')
          , 'empty'       : readFile(__dirname, 'templates/empty.hbs')
          , 'report'      : require('./wrapper/report')
          }})

  _.extend(config, { helpers: 
    { reduce: function() { return _.toArray(arguments).join(',') }
    , escape: function() { return _.map(arguments, function(d) { return config.escape(d) }) }
    , map: function(pattern) { 
        var args = _.flatten(_.rest(arguments))

        return _.map(args, function(d) { 
          return pattern.replace('|', d) 
        }) 
    }
    , toString: function(val) { return val.toString() }
    , global: function() { 
        var refs = _.chain(config.map)
        .map(function(d) { 
          var fileAlias = d.split('#')
          return {name: fileAlias[0], ref: fileAlias[1]}
        })
        .reduce(function(memo, d) {
          memo[d.name] = d.ref
          return memo
        }, {})
        .value()

        return _.map(arguments, function(e) { 
          return (refs && refs[e]) || e 
        })
    }
    }})

  return _.extend(config, userConfig, function(a,b) {
    if(_.isArray(a) && _.isArray(b)) return b.concat(a)
    if(_.isObject(a) && _.isObject(b)) return _.extend(a, b)

    return b ? b : a
  })
}

