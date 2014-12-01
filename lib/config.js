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

  _.extend(config, { wrappers: 
          { 'default'     : readFile(__dirname, 'templates/default.tmpl')
          , 'empty'       : readFile(__dirname, 'templates/empty.tmpl')
          , 'iife'        : readFile(__dirname, 'templates/iife.tmpl')
          , 'umd'         : readFile(__dirname, 'templates/umd.tmpl')
          , 'amd-global'  : readFile(__dirname, 'templates/amd-global.tmpl')
          , 'browserify'  : readFile(__dirname, 'templates/browserify.tmpl')
          , 'global'      : readFile(__dirname, 'templates/global.tmpl')

            //PARTS
          , 'part/require': readFile(__dirname, 'templates/part/require.tmpl')
          , 'part/globals': readFile(__dirname, 'templates/part/globals.tmpl')
          }})

  userConfig.wrappers = _.reduce(userConfig.wrappers, function(memo, content, name) {
    memo[name] = _.isFunction(content) ? content : template(content.toString())
    return memo
  }, {})

  _.extend(config, { helpers: 
    { escape: function(d) { return d.replace(/\.\/|\!|\.|\/|\\|-/g, '_') }
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
                           : parent + d + ' = ' + factory + ';'
                  })
                  .reduce(function(memo, p, i) { 
                    //a bit awkward
                    var s = (i > 0 ? '    ' : '')
                    return memo + s + p + '\n'
                  }, '')

          function makeSafe(val) { return '["' + val + '"]' }
    }
    , safeInit: function(obj) {
        return _(obj.split('.'))
                .reduce(function(memo, d, i) {
                  i > 0 ? memo.push(memo[i - 1] + "." + d)
                        : memo.push(d)

                  return memo
                },[])
                .map(function(d, i, p) { 
                  if(i == 0) return 'var ' + makeSafe(d)
                  return makeSafe(d)
                })
                .reduce(function(memo, p) { return memo + p + ';' }, '')

      function makeSafe(val) { return val + ' = ' + val + ' || {}' }
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
    }})

  return _.merge(config, userConfig, function(a,b) {
    if(_.isArray(a) && _.isArray(b)) return b.concat(a)
    if(_.isObject(a) && _.isObject(b)) return _.extend(a, b)
    if(_.isBoolean(a) && _.isBoolean(b)) return b

    return b ? b : a
  })
}

