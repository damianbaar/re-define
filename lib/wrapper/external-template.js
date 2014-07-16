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

                    return  { name: bundle
                            , code: code
                            , returns: returns || ''
                            }
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
          indent: { style: '  ', base: 5, },
          space: ' ',
          safeConcatenation:true 
        }

      code = m.ast && generate(m.ast, {format: format })
      content = m.contents

      memo.push({name: m.require.replace(/\\\\|\\/g, '/')
               , type: m.type
               , content: code || content})

      return memo
    }
  }
}

