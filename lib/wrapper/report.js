var _ = require('underscore')
  , ast = require('../ast/ast-adapter')
  , fs = require('fs')
  , path = require('path')
  , colors = require('colors')

module.exports = function(modules, config) {
  var escape = config.escape
    , format = _.partial(JSON.stringify, _, null, 2)
    , plugins = {}
    , code

  var internal = _.chain(modules)
                 .filter(function(m) { return !!m.content })
                 .map(function(m) { return _.pick(m, 'name', 'deps', 'refs') })
                 .each(function(m) { 
                   m.name = colorize(m.name, 'green')
                   m.deps = colorize(len(m.deps) > 0 ? m.deps : 'none', 'red') 
                   m.refs = colorize(len(m.refs) > 0 ? m.refs : 'none', 'grey') 

                   return m 
                 })
                 .value()

  var external = _.chain(modules)
                  .map(function(m) { return m.type === 'external' ? m.name : null})
                  .filter(function(m) { return m !== 'exports' })
                  .compact()
                  .value()

  var exports = _.chain(modules)
                 .filter(function(m) { return m.name === config.exports })
                 .map(function(m) { return m.name && escape(m.name) })
                 .first()
                 .value()

  var report  = format({ internal: internal
                       , external: external
                       , exports: exports })

  return report.replace(/\"|\[|\]|\{|\}/g, '')
               .replace(/\(.*\)\.[a-z]*/g, function(d) { return eval(d) })
               .replace('internal', function(d) { return d.cyan })
               .replace('external', function(d) { return d.blue })
               .replace('exports',  function(d) { return d.magenta })
               .replace(/\,/g, '\ ')
}

function colorize(name, color) { return '(\'' + name + '\').' + color }
function len(arr) { return arr && arr.length }
