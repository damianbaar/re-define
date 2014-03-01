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
    , globals: ["d3","jquery"] //add shorthands for globals, such $, _
    , attachToNamespace: ["four"]
  }
  , output = []
  
  requirejs.optimize(config, build, error)
  
  function build(response, code, contents) {
    var name = config.out
      , content = escodegen.generate(factory.wrap(output, config.globals))

    fs.writeFileSync(name, content)
  }

  function error(e) { console.log(e) }

  function parse( name, path, contents ) {
    output.push(
      estraverse.replace(
        esprima.parse(contents)
        , {enter: enter, leave:leave}
      )
    )

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


