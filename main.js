var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , _ = require('underscore')
  , matcher = require("./lib/matcher")
  , factory = require("./lib/factory")

module.exports.convert = convert
  
function convert(override, exclude, done) {
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
    if(done) done(content)
  }

  function error(e) { console.log(e) }

  function parse(name, path, contents) {
    if(excludeDependencies(name))
        return

    output.push(
      estraverse.replace(
        esprima.parse(contents)
      , {enter: enter, leave:leave}))

    function excludeDependencies(name) {
      if(exclude) return exclude(name)

      var exclude = name.indexOf("!") == -1 
                    && (config["exclude-libs"].indexOf(name) > -1
                    || name.indexOf(config["exclude-folder"]) > -1)

      console.log(exclude ? "excluding: " : "including: ", name)

      return exclude 
    }

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

