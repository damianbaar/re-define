var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , matcher = require("./lib/matcher")
  , factory = require("./lib/factory")
  , codeGenConfig = {format: {indent: {style: '  ', base: 0}, space: ' '}} 

module.exports.convert = convert
module.exports.resolveConfig = resolveConfig

function convert(override, done) {
  var config = _({baseUrl:".", resolve:{}, export:{}})
                .extend(resolveConfig(override))
    , output = []

  _(config).extend({"onBuildWrite": parse})

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
    if(name.indexOf("text") > -1 && name.indexOf("!") == -1)
      return

    output.push(
      estraverse.replace(
        esprima.parse(contents)
      , {enter: enter, leave:leave}))

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
  var paths = {}
    , shims = {}
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

  var textPlugin = _(keys).find(function(d){return d.indexOf("text") > -1})
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
    delete glob.as

    if(config.export[keys[i]]) config.export[keys[i]].global = glob.lib

    globals.push(glob)
  })

  return _(config).extend({paths: paths, shim: shims, globals: globals})
}
