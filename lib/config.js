var template = require('./wrapper/external-template')

module.exports = function (userConfig) {
  var _         = require('lodash')
    , config    = _.clone(require('./defaults'))
 
  var readFile = _.compose(
                    template
                  , _.partialRight(require('fs').readFileSync, 'utf-8')
                  , require('path').resolve)

  _.extend(config, { wrappers: 
          { 'iife'        : readFile(__dirname, 'templates/iife.tmpl')
          , 'umd'         : readFile(__dirname, 'templates/umd.tmpl')
          , 'amd-global'  : readFile(__dirname, 'templates/amd-global.tmpl')
          , 'empty'       : readFile(__dirname, 'templates/empty.tmpl')
          , 'default'     : readFile(__dirname, 'templates/default.tmpl')
          // , 'report'      : require('./wrapper/report')
          }})

  _.extend(config, { helpers: 
    { escape: function(d) { return d.replace(/\.\/|\!|\.|\/|\\|-/g, '_') }
    , toGlobal: function(parent, dotPath, factory) {
          return _(dotPath.split('.'))
                  .reduce(function(memo, d, i) {
                    i > 0 ? memo.push(memo[i - 1] + "." + d)
                          : memo.push(d)

                    return memo
                  },[])
                  .map(function(d, i, p) { 
                    return p.length - 1 > i 
                           ? parent + '.' + d + ' = parent.' + d + ' || {};' 
                           : parent + '.' + d + ' = ' + factory + ';'
                  })
                  .reduce(function(memo, p) { return memo + p + '\n' }, '')
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
        var refs = _.chain(config.globals)
        .map(function(d) { 
          var fileAlias = d.split('#')
          return {name: fileAlias[0], ref: fileAlias[1]}
        })
        .reduce(function(memo, d) {
          memo[d.name] = d.ref
          return memo
        }, {})
        .value()

        return (refs && refs[d]) || config.helpers.escape(d)
    }
    }})

  return _.extend(config, userConfig, function(a,b) {
    if(_.isArray(a) && _.isArray(b)) return b.concat(a)
    if(_.isObject(a) && _.isObject(b)) return _.extend(a, b)

    return b ? b : a
  })
}

