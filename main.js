var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , matcher = require("./lib/matcher")
  , factory = require("./lib/factory")

module.exports.convert = convert
module.exports.resolveConfig = resolveConfig

convert(JSON.parse(fs.readFileSync("build.config")))

function convert(override, done) {
  var config = _({resolve:[], export:[]}).extend(resolveConfig(override))
    , output = []

  _(config).extend({"onBuildWrite": parse})

  console.log(config)
  requirejs.optimize(config, build, error)

  function build(response, code, contents) {
    var name = config.out
      , ast = factory.wrap(output, config)
      , content = escodegen.generate(ast)

    fs.writeFileSync(name, content)
    if(done) done(content)
  }

  function error(e) { console.log(e) }

  function parse(name, filePath, contents) {
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
    , libs = _(config.resolve).keys()
    , libConf = _(config.resolve).values()
    , lib

  _(libConf).each(function(d, i) {
    if(!(d.path || _(d).has("external"))) return

    lib = libs[i]

    paths[lib] = d.external ? "empty:" : d.path;

    if(d.as)
      shims[lib] = {exports: d.as}
  })

  _(libConf).each(function(d, i) {
    if(!(d.inject || d.global)) return

    lib = { lib: libs[i]
          , attach: d.attach ? d.attach.join(";") : ""}

    globals.push(_(lib).extend(_.pick(d, ["as", "safe", "global"])))
  })

  return _(config).extend({paths: paths, shim: shims, globals: globals})
}
