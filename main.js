var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , _ = require('underscore')
  , matcher = require("./lib/matcher")
  , factory = require("./lib/factory")
  , codeGenConfig = {format: {indent: {style: '  ', base: 0}, space: ' '}}
  , nl = require('./lib/utils').newLine

module.exports.convert = convert
module.exports.resolveConfig = resolveConfig

function convert(override, done) {
  var config = _({baseUrl:".", resolve:{}, export:{}, verbose: false})
                .extend(resolveConfig(override))
    , output = []
    , verbose = config.verbose

  _(config).extend({"onBuildWrite": parse})

  if(verbose)
   console.log(nl(), "Gererated config: ", nl(), _(config).omit("resolve", "onBuildWrite", "export"))

  factory.verbose(verbose)

  requirejs.optimize(config, build, error)

  function build(response, code, contents) {
    var name = config.out
      , ast = factory.wrap(output, config)
      , content = escodegen.generate(ast, codeGenConfig)

    fs.writeFileSync(name, content)

    if(done) done(content)
  }

  function error(e) { console.log(e) }

  function parse(name, filePath, contents) {
    verbose && console.log(nl(), "MODULE:", name, nl(true))

    if(name.search(/^(text(\/)?)*$/) > -1 && name.indexOf("!") == -1) {
      verbose && console.log("Skipping text plugin ", name)
      return
    }

    var code = estraverse.replace(esprima.parse(contents)
                                 , {enter: enter, leave:leave})

    verbose && console.log(escodegen.generate(code))

    output.push(code)

    function enter(node, parent) {
      var main

      if(main = matcher.isDefine(node)) {
        return factory.introduceVar(main, config, filePath)
      }
      else if(main = matcher.isRequire(node)) {
        return factory.introduceClosure(main)
      }
      else if(main = matcher.isCommonJS(node)) {
        //TODO implementation will be soon
      }
      else
        this.break()
    }

    function leave(node, parent) {}
  }
}

function resolveConfig(config) {
  var paths = _({}).extend(config.paths)
    , shims = _({}).extend(config.shim)
    , globals = []
    , keys = _(config.resolve).keys()
    , values = _(config.resolve).values()
    , lib

  _(values).each(function(d, i) {
    if(!(d.path || _(d).has("external"))) return

    lib = keys[i]

    paths[lib] = d.external ? "empty:" : d.path;

    if(d.as) shims[lib] = {exports: d.as}
  })

  var textPlugin = _(keys).find(function(d){return d.indexOf("text") === 0})
  paths[textPlugin ? textPlugin : "text"] = __dirname + "/deps/text/text"

  _(values).each(function(d, i) {
    if(!(d.inject || d.global)) return
    lib = { lib: keys[i] }

    globals.push(_(lib).extend(_.pick(d, ["as", "init", "global"])))
  })

  keys = _(config.export).keys()
  values = _(config.export).values()

  _(values).each(function(d, i) {
    var glob = _({init: true, inject:true})
                .extend(_.isObject(d.global) ? d.global : {lib: d.global})

    glob.lib = glob.lib || glob.name

    if(!glob.lib) return
    if(!!_(globals).findWhere({lib: glob.lib})) return

    globals.push(_(glob).omit("as","name"))
  })

  _(values).each(function(d, i) {
    var ex = config.export[keys[i]]

    if(!!ex && _.isObject(ex.global))
      config.export[keys[i]].global = ex.global.name
  })

  return _(config).extend({paths: paths, shim: shims, globals: globals})
}

