var _ = require('underscore')
  , depTree = require('./deps/dep-order')
  , adapter = require('./ast-adapter')

module.exports.convert = convert

function convert(config, contents, done) {
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

  var order = depsTree.resolve()
    , external = order.external
    , internal = order.internal
    , sortedBody = []

  if(external && external.length) console.log('considered as external:', external)

  _(refs).each(function(e, i) {
    sortedBody[internal.indexOf(e.name)] = ast.body[e.index]
  })

  ast.body = sortedBody
  done(adapter.generate(ast, config.generator))
}


