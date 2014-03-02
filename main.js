var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , _ = require('underscore')
  , matcher = require("./lib/matcher")
  , factory = require("./lib/factory")

module.exports.convert = convert

function convert(override) {
  var config = _(
    { baseUrl: ''
      , name: ''
      , out: ''
      , optimize: 'none'
    }).extend(override)
  , output = []

  config.onBuildWrite = parse

  requirejs.optimize(config, build, error)

  function build(response, code, contents) {
    var name = config.out
      , ast = factory.wrap(output, config)
      , content = escodegen.generate(ast)

    fs.writeFileSync(name, content)
  }

  function error(e) { console.log(e) }

  function parse(name, path, contents) {
    output.push(
      estraverse.replace(
        esprima.parse(contents)
      , {enter: enter, leave:leave}
    )
    )

    function enter(node, parent) {
      var main

      if(main = matcher.isDefine(node)) {
        return factory.introduceVar(main, config)
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

