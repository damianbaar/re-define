var _ = require('underscore')
  , depTree = require('../deps/dep-order')
  , ast = require('../ast/ast-adapter')

module.exports.convert = convert

function convert(config, content, done) {
  var depsTree = depTree.tree()
    , refs = []
    , code

  if(_.isArray(content)) {
    code = []

    _(content).each(function(i) {
      var es = _(ast.parse(i.content, true)).first()
        , converter = getConverter(es)

      converter && converter.normalize
        ? code.push(converter.normalize(i.name, es))
        : code.push(es)
    })

    code = ast.create.program(code)
  }

  code = code || ast.parse(content)

  code = ast.replace(code, {
    enter: function (node, parent) {
      var converter = getConverter(node)
        , name
        , deps

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
    sortedBody[internal.indexOf(e.name)] = code.body[e.index]
  })

  code.body = sortedBody
  done(ast.generate(code, config.generator))

  function getConverter(node) {
    var converters = config.converters
      , converter

    for(var i = 0; i < converters.length; i++) {
      if(converters[i].match(node)) {
        converter = converters[i]
        break
      }
    }

    return converter
  }

}


