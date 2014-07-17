var _ = require('lodash') 
  , fs = require('fs')
  , path = require('path')
  , generate = require('escodegen').generate

module.exports = function(template) {
  return function(modules, config) {

    var bundles = _(modules.internal)
                  .map(function(modules, bundle) {
                    var code
                      , returns 

                    code = _.chain(modules)
                            .reduce(concat, [])
                            .value() 

                    returns = _(modules)
                              .pluck('require')
                              .compact()
                              .last()

                    var d = { name: bundle
                            , code: code
                            , returns: returns
                            }

                    //TODO so ugly ... 
                    if(code.length === 1 && code[0].type === 'iife') {
                      d.type = code[0].type
                      d.content = code[0].content
                      d.code = []
                    }

                    return d
                  })
                  .filter(function(m, b) { return m.code })
                  .value()

    var descriptor = 
        { config: config
        , bundles: bundles
        , external: modules.external }

    return _.template(
      fs.readFileSync(path.resolve('../lib/templates/umd.tmpl'))
      , _.extend(descriptor, config.helpers),
      { 'imports': { '_': _, 'util': config.helpers } })

    function concat(memo, m) {
      var format = {
          indent: { style: '  ', base: m.type === 'iife' ? 2 : 5 },
          space: ' ',
          safeConcatenation:true 
        }

      code = m.ast && generate(m.ast, {format: format })
      content = m.contents

      memo.push({name: m.require.replace(/\\\\|\\/g, '/')
               , ext: m.ext
               , content: code || content
               , type: m.type
               })

      return memo
    }
  }
}

