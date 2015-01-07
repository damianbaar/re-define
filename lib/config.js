var template = require('./wrapper/external-template')

module.exports = function (userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))
 
  var readFile = _.compose(
                    template
                  , _.partialRight(require('fs').readFileSync, 'utf-8')
                  , require('path').resolve)

  if(!userConfig) userConfig = {}
  if(!userConfig.names) userConfig.names = config.names

  if((userConfig.names.global === config.names.global) && userConfig.namespace)
    userConfig.names.global = userConfig.namespace
  
  //TODO rethink: lazy loading for templates however stil too tricky
  var coreWrappers = {
      'empty'       : _.partial(readFile, __dirname, 'templates/empty.tmpl')
    , 'iife'        : _.partial(readFile, __dirname, 'templates/iife.tmpl')
    , 'umd'         : _.partial(readFile, __dirname, 'templates/umd.tmpl')
    , 'amd-global'  : _.partial(readFile, __dirname, 'templates/amd-global.tmpl')
    , 'browserify'  : _.partial(readFile, __dirname, 'templates/browserify.tmpl')
    , 'global'      : _.partial(readFile, __dirname, 'templates/global.tmpl')
  }

  _.extend(config, { wrappers: 
  { //PARTS
    'part/require': readFile(__dirname, 'templates/part/require.tmpl')
  , 'default'     : readFile(__dirname, 'templates/default.tmpl')
  }})

  var _wrapper = userConfig.wrapper
  if(_wrapper && !config.wrappers[_wrapper]) config.wrappers[_wrapper] = coreWrappers[_wrapper]()

  userConfig.wrappers = _.reduce(userConfig.wrappers, function(memo, content, name) {
    memo[name] = _.isFunction(content) ? content : template(content.toString())
    return memo
  }, {})

  _.extend(config, { helpers: 
    { escape: function(d) { return d.replace(/\.\/|\!|\.|\/|\\|-/g, '_') }
      /**
       * a.b.c
       * =>
       * var a = a || {}; a.b = a.b || {}; a.b.c = factory
       **/
    , toGlobal: function(dotPath, factory) {
          var parent = dotPath.shift()

          return _(dotPath)
                  .reduce(function(memo, d, i) {
                    i > 0 ? memo.push(memo[i - 1] + makeSafe(d))
                          : memo.push(makeSafe(d))

                    return memo
                  },[])
                  .map(function(d, i, p) { 
                    return p.length - 1 > i 
                           ? parent + d + ' = parent' + d + ' || {};' 
                           : parent + d + (factory ? ' = ' + factory : '') + ';'
                  })
                  .reduce(function(memo, p, i) { 
                    //a bit awkward formatting
                    var s = (i > 0 ? '    ' : '')
                    return memo + s + p + '\n'
                  }, '')

          function makeSafe(val) { return '["' + val + '"]' }
    }
    , namespace: function(ns, parent) {
        return _(ns.split('.'))
                .reduce(function(memo, d, i) {
                  i > 0 ? memo.push(memo[i - 1] + "." + d)
                        : memo.push(d)

                  return memo
                },[])
                .map(function(d, i, p) { 
                  return parent + '.' + d + ' = ' + parent + '.' + d + ' || {}' 
                })
                .reduce(function(memo, p) { return memo + p + ';' }, '')
    }
    , global: function(d) { 
        var refs = config.globals
        return (refs && refs[d]) || config.helpers.escape(d)
    }
    , toString: function(d) {
        if(_.isArray(d)) {
          var _arr = _(d).uniq()
                         .map(function(d) { return "'" + d + "'" })
                         .value()
          return '[' + _arr + ']'
        }
    }
    }})

  return _.merge(config, userConfig, function(a,b) {
    if(_.isArray(a) && _.isArray(b)) return b.concat(a)
    if(_.isObject(a) && _.isObject(b)) return _.extend(a, b)
    if(_.isBoolean(a) && _.isBoolean(b)) return b

    return b ? b : a
  })
}

