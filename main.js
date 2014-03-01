var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , _ = require('underscore')
  , program = require('commander')
  , matcher = require("./lib/matcher")
  , factory = require("./lib/factory")
  , config = {
      baseUrl: ''
    , name: ''
    , out: ''
    , optimize: 'none'
    , onBuildWrite: parse
    , injectGlobals: ["this","window","document"]
    , customGlobals: ["scope1","scope2"]
    , initializeGlobals: ["scope1","scope2"] 
    , attachToGlobal: [{lib:"three", global:"scope1"}
                      ,{lib:"one", global:"scope2"}]
  }
  , output = []

  program
    .option('-r, --root [value]', 'project root')
    .option('-o, --out [value]', 'output')
    .option('-s, --src [value]', 'main requirejs file')
    .parse(process.argv);

  if(program.root) config.baseUrl = program.root
  if(program.out) config.out = program.out
  if(program.src) config.name = program.src
  if(!(program.root && program.out && program.src)) process.exit()
  
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


