var matcher = require('./matcher')
  , path = require('path')
  , esprima = require('esprima')
  , escodegen = require('escodegen').generate
  , _ = require('underscore')
  , nl = require("./utils").newLine
  , config
  , verbose

function wrap(body, config) {
  var wrapper = "(function (params) { scope }(args))"
    , params = []
    , args = []
    , init = []
    , globals = config.globals
    , initScope = _(body).find(function(d){return _(d).has("expression")})

  _(globals).each(function(d) {
    args.push(!!d.global
              ? d.global + squareBrackets(d.lib)
              : d.lib != "this" ? applyShim(d.lib) : d.lib)

    params.push(!!d.as ? d.as : d.lib)
  })

  wrapper = wrapper.replace("params", params.join(","))
                   .replace("args", args.join(","))
                   .replace("scope", initScope ? "var scope = {}" : "")

  wrapper = esprima.parse(wrapper)

  var wrapperBody = wrapper.body[0].expression.callee.body
    , block = wrapperBody.body

  _(globals).each(function(d) {
    if(d.init) {
      var variable = d.global || d.lib

      variable = "var " + variable + "=" + variable + "|| {}"
      init.push(esprima.parse(variable).body[0])
    }
  })
  block = block.concat(body)

  for(var lib in config.export) {
    if(!isAMD(lib)) continue

    var define = "if (typeof define === 'function' && define.amd)"
                 + "define('module-name', module-ref)"

    define = define.replace("module-name", config.export[lib].amd)
                   .replace("module-ref", applyShim(lib))

    define = esprima.parse(define).body[0]

    block.push(define)
  }

  wrapper.body = init.concat(wrapper.body)

  verbose && console.log(nl(), "Wrapper:", nl(), escodegen(wrapper), nl())

  wrapperBody.body = block

  return  wrapper
}

function isAMD(lib) {
  return config.export[lib] && !!config.export[lib].amd
}

function toGlobal(lib) {
  return !!config.export[lib] && !!config.export[lib].global
}

function escapeLib(lib) {
  return isComplexPath(lib) ? createScopeKey(lib) : lib
}

function squareBrackets(lib) {
  return "['" + lib + "']"
}

function isComplexPath(lib) { return /[\-\/|\\|\.]/.test(lib) }

function isPlugin(lib) { return lib.indexOf("!") > -1 }

function createScopeKey(lib) { return "scope['"+ lib +"']" }

function normalizePath(name, filePath) {

  if(!isComplexPath(name)) return name

  if(isPlugin(name))
    return normalize(normalizePluginName(name), filePath)

  return normalize(name, filePath)

normalizePath()
  function normalize(value, filePath) {
    return path
            .normalize(filePath.replace(/[^\/]*$/,'') + value)
            .replace(path.resolve(config.baseUrl),"")
            .replace(/\\/g,"/")
            .replace("\/","")
  }
}

function normalizePluginName(name) {
  return name.replace(/^(\w*[\///]?)*!/, "")
}

module.exports.wrap = wrap
module.exports.verbose = function(value) { verbose = value }

function overrideDeps(deps) {
  return _(deps).map(function(d) {
    return createIdentifier(applyShim(d.value))
  })
}
/////////////////////////////
/////////// AST ////////////
///////////////////////////

