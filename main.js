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

  function build(response) {
    fs.writeFile(config.out, response)
  }

  function error(e) {
    console.log(e)
  }


  function parse( name, path, contents ) {
    var ast = esprima.parse(contents)
      , define
      , cast = estraverse.replace(ast, {enter: enter, leave:leave})

    debugger
    return escodegen.generate(cast)

    function enter(node, parent) {
      define = matcher.isDefine(node)
      if(define) {
        var name = define.arguments[0].value
          , deps = define.arguments[1]
          , fun = define.arguments[2]

        return factory.createProgram(
          factory.createVar(name, 
                            matcher.resolveFunction(fun)))
      }
      else
        this.break()
    }

    function leave(node, parent) {}
  }


