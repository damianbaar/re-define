var api = {
  convert: getRedefine,
  config: getConfig,
  wrapper: {
    fromString: require('./wrapper/external-template')
  },
  converter: {
    '*.js': {
      common_js: require('./converter/cjs')
    , amd_cjs: require('./converter/amd-cjs')
    , amd_define: require('./converter/amd-define')
    , amd_require: require('./converter/amd-require')
    },
    '*.*': {
      raw: require('./converter/raw.js')
    }
  }
}

module.exports = api

function getRedefine(userConfig) { 
  return require('./redefine')
                (userConfig || getConfig())
}

function getConfig(fileMode, userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))

  config.fileMode = fileMode
  _.extend(config, {converters: api.converter})

  _.extend(config, {resolvers: 
          { text: require('./resolver/file')
          , css: require('./resolver/css')
          , skip: require('./resolver/skip')
          , include: require('./resolver/include')
          }})

  var readFile = _.compose(
                    api.wrapper.fromString
                  ,  _.partialRight(require('fs').readFileSync, 'utf-8')
                  , require('path').resolve)

  _.extend(config, {wrappers: 
          { 'iife'        : readFile(__dirname, 'templates/iife.hbs')
          , 'amd-define'  : readFile(__dirname, 'templates/amd-define.hbs')
          , 'umd/amd-web' : readFile(__dirname, 'templates/amd-web.hbs')
          , 'umd/4all'    : readFile(__dirname, 'templates/return-exports-global.hbs')
          , 'empty'       : readFile(__dirname, 'templates/empty.hbs')
          , 'report'      : require('./wrapper/report')
          }})

  _.extend(config, { helpers: 
     { join: function() { return _.toArray(arguments).join(',') }
     , escape: function() { return _.map(arguments, function(d) { return config.escape(d) }) }
     , append: function(pattern) { 
        var args = _.flatten(_.rest(arguments))

        return _.map(args, function(d) { 
          return pattern.replace('|', d) 
        }) 
     }
     , ref: function() { 
         var refs = config.dependencies.references
         return _.map(arguments, function(e) { return (refs && refs[e]) || e })
     }
     }})

  return _.merge(config, userConfig)
}

