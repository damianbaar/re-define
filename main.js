var requirejs = require('requirejs')
  , esprima = require('esprima')
  , estraverse = require('estraverse')
  , escodegen = require('escodegen')
  , fs = require('fs')
  , config = {
      baseUrl: 'demo'
    , optimize: 'none'
    , name: 'main'
    , out: 'scr/dist.js'
    , onBuildWrite: parse
  }

  requirejs.optimize(config, build, error)

  function build(response) {
    console.log(response)
  }

  function error(e) {
    console.log(e)
  }


  function parse( name, path, contents ) {
    var ast = esprima.parse(contents)

    estraverse.replace(ast, {enter: enter, leave:leave})

    return escodegen.generate(ast)

    function enter(node, parent) {
    }

    function leave(node, parent) {
    }

    function isDefine(node){
      //TODO if define convert to simple or complex function
    }

    function isRequire(node){
      //TODO if require convert to self invocking function
    }

    function isComplexFunction(node){
      //TODO if contains more than return statement, 
      //if yes wrap in self-invocking function
    }

    function isSimpleFunction(node){
      //TODO if return statement convert to var
    }
  }


