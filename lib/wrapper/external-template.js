var _ = require('lodash') 
  , fs = require('fs')
  , path = require('path')

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
                              .pluck('reference')
                              .compact()
                              .last()

                    var d = { name: bundle
                            , code: code
                            , returns: returns
                            , wrap: true
                            }

                    if(code.length === 1) {
                      d.type = code[0].type
                      d.wrap = code[0].wrap
                      d.content = code[0].content
                    }

                    return d
                  })
                  .filter(function(m, b) { return m.code })
                  .value()

    var descriptor = 
        { config: config
        , bundles: bundles
        , external: modules.external }

    return _.template(template
                     , _.extend(descriptor, config.helpers),
                     { 'imports': { '_': _, 'util': config.helpers } })

    function concat(memo, m) {
      memo.push({name: m.reference
               , ext: m.ext
               , content: m.contents
               , type: m.type
               , hasChildren: !_.isEmpty(m.deps)
               , wrap: m.wrap === undefined || m.wrap ? true : false
               })

      return memo
    }
  }
}

