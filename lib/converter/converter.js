var _ = require('underscore')
  , depTree = require('../deps/dep-order')
  , adapter = require('../ast/ast-adapter')

module.exports.convert = convert

function convert(config, content, done) {
  var depsTree = depTree.tree()
    , refs = []
    , ast

  if(_.isArray(content)) {
    ast = []
    _(content).each(function(i) {
      var es = adapter.parse(i.content, true)[0]

      if(adapter.is.amd('define', es)) {
        var args = es.expression.arguments
        args.unshift(adapter.create.literal(i.name))
      }
      ast.push(es)
    })
    ast = adapter.create.program(ast)
  }
  else
    ast = adapter.parse(content)

  var rast = adapter.replace(ast, {
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
        var result = converter.convert(node, config)

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
    , internal = order.internal
    , sortedBody = []

  config.external = order.external

  _(refs).each(function(e) {
    sortedBody[internal.indexOf(e.name)] = ast.body[e.index]
  })

  rast.body = sortedBody
  done(adapter.generate(rast, config.generator))
}


