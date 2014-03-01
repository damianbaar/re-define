var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , _ = require('underscore')
  , program = require('commander')
  , matcher = require("./matcher")
  , factory = require("./factory")
  , config = {
      baseUrl: 'demo2'
    , optimize: 'none'
    , name: 'main'
    , out: './demo2/dist.js'
    , onBuildWrite: parse
    , injectGlobals: ["this","window","document"]
    , customGlobals: ["scope1","scope2"]
    , initializeGlobals: ["scope1","scope2"] 
    , attachToGlobal: [{lib:"three", global:"scope1"}
                      ,{lib:"one", global:"scope2"}]
  }
  , output = []
  
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


