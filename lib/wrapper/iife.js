var _ = require('underscore')
  , ast = require('../ast/ast-adapter')

module.exports = function(modules, config) {
  var external = _.map(modules, function(m) { return m.external && m.name })

  var intro = '(function(' + _.compact(external).join(',') + '){'
    , outro = '})(' + _.compact(external).join(',') + ')'

  var content = _.chain(modules)
                 .filter(function(m) { return !!m.content })
                 .reduce(reduce, '')
                 .value()

  return { code: intro + content + outro
         , details: modules }

  function reduce(result, m) {
    var code = ast.generate(m.converter.transform(), config.formatter)

    if(m.converter.type === 'amd-define')
      code = 'var ' + m.name + ' = ' + code

    return result + code + ';\n'
  }
}

// function wrap(modules, config) {
//   var wrapper = "(function (params) { scope }(args))"
//     , params = []
//     , args = []
//     , init = []
//     , globals = config.globals
//     , initScope = _(body).find(function(d){return _(d).has("expression")})

// //GLOBALS at the bottom
//   _(globals).each(function(d) {
//     args.push(!!d.global
//               ? d.global + squareBrackets(d.lib)
//               : d.lib != "this" ? applyShim(d.lib) : d.lib)

//     params.push(!!d.as ? d.as : d.lib)
//   })

//   wrapper = wrapper.replace("params", params.join(","))
//                    .replace("args", args.join(","))
//                    .replace("scope", initScope ? "var scope = {}" : "")

//   wrapper = esprima.parse(wrapper)

//   var wrapperBody = wrapper.body[0].expression.callee.body
//     , block = wrapperBody.body

//   _(globals).each(function(d) {
//     if(d.init) {
//       var variable = d.global || d.lib

//       variable = "var " + variable + "=" + variable + "|| {}"
//       init.push(esprima.parse(variable).body[0])
//     }
//   })
//   block = block.concat(body)

//   for(var lib in config.export) {
//     if(!isAMD(lib)) continue

//     var define = "if (typeof define === 'function' && define.amd)"
//                  + "define('module-name', module-ref)"

//     define = define.replace("module-name", config.export[lib].amd)
//                    .replace("module-ref", applyShim(lib))

//     define = esprima.parse(define).body[0]

//     block.push(define)
//   }

//   wrapper.body = init.concat(wrapper.body)

//   verbose && console.log(nl(), "Wrapper:", nl(), escodegen(wrapper), nl())

//   wrapperBody.body = block

//   return  wrapper
// }