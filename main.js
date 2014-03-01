var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , _ = require('underscore')
  , matcher = require("./matcher")
  , factory = require("./factory")
  , config = {
      baseUrl: 'demo'
    , optimize: 'none'
    , name: 'main'
    , out: './demo/dist.js'
    , onBuildWrite: parse
    , insertGlobals: true
    , globals: []
  }
  , output = []
  
  requirejs.optimize(config, build, error)

  function build(response, code, contents) {
    var all = _(output).reduce(
                  function(memo, num){ 
                    return memo + num
                })

    fs.writeFileSync(config.out, all)
  }

  function error(e) { console.log(e) }

  function parse( name, path, contents ) {
    var ast = esprima.parse(contents)
      , cast = estraverse.replace(ast, {enter: enter, leave:leave})

    output.push(escodegen.generate(cast) + "\n")

    function enter(node, parent) {
      var main

      if(main = matcher.isDefine(node)) {
        return factory.introduceVar(main)
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


