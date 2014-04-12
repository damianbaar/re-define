var _ = require('underscore')
  , depTree = require('../dep-order')
  , adapter = require('../ast-adapter')

module.exports.convert = convert

function convert(config, contents) {
  var depsTree = depTree.tree()
    , refs = []
    , ast = adapter.replace(contents, {
      enter: function (node, parent) {
        var converters = config.converters
          , converter
          , name
          , deps

        for(var i = 0; i < converters.length; i++) {
          if(converters[i].match(node)) {
            converter = converters[i]
            break
          }
        }

        if(converter){
          var result = converter.convert(node, config, {
            ast: {generate: {}, parse: {}}
          })

          name = result.name || 'm_' + (+new Date())
          deps = _(result.deps).compact()

          refs.push({
            name: name
            , index: parent.body.indexOf(node)
          })

          depsTree.add(name, deps)

          return result.ast
        }
      }
    })

  var depsOrder = depsTree.resolve()
    , sortedBody = []

  for(var i = 0; i < refs.length; i++) {
    sortedBody[depsOrder.indexOf(refs[i].name)] = ast.body[refs[i].index]
  }

  ast.body = sortedBody

  return adapter.generate(ast, config.generator)
}


