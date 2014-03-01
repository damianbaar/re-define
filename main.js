var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , matcher = require("./matcher")
  , factory = require("./factory")
  , config = {
      baseUrl: 'demo'
    , optimize: 'none'
    , name: 'main'
    , out: './demo/dist.js'
    , onBuildWrite: parse
  }

  requirejs.optimize(config, build, error)

  function build(response, code, contents) {}

  function error(e) { console.log(e) }

  function parse( name, path, contents ) {
    var ast = esprima.parse(contents)
      , cast = estraverse.replace(ast, {enter: enter, leave:leave})

    return escodegen.generate(cast)

    function enter(node, parent) {
      var main

      if(main = matcher.isDefine(node)) {
        //TODO make camelCase
        var name = main.arguments[0].value.replace("/","_")
          , deps = main.arguments[1]
          , fun  = main.arguments[2]

        return factory.createProgram(fun, name)
      }
      else if(main = matcher.isRequire(node)) {
        return factory.createProgram(main)
      }
      else if(main = matcher.isCommonJS(node)) {
        //TODO implementation will be soon
      }
      else
        this.break()
    }

    function leave(node, parent) {}
  }


