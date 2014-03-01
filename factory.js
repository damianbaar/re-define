var matcher = require('./matcher')
  , _ = require('underscore')

function introduceVar(body, config) {
  var name = body.arguments[0].value
    , deps = body.arguments[1].elements
    , fun  = body.arguments[2]

  return createVar(escapeNestedDeps(name), deps, fun, config)
}

function introduceClosure(body) {
  var deps = body.arguments[0]
    , fun  = body.arguments[1]

  return createClosure(overrideDeps(deps.elements), fun)
}

function wrap(body, globals) {
  return createGlobalWrapper(body, globals)
}

module.exports.introduceVar = introduceVar
module.exports.introduceClosure = introduceClosure
module.exports.wrap = wrap

function createVar(name, deps, expression, config) {
  //TODO limitation: is able only to attach to one global
  var relation = _(config.attachToGlobal).where({lib:name})[0]
    , shouldAttach = !!relation
    , right = convertExpression(expression, deps)

  return {
    "type": "VariableDeclaration",
    "declarations": [
      {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": name
      },
      "init": shouldAttach
        ? assignmentGlobalExpression(relation.global, right) 
        : right
    }
    ],
    "kind": "var"
  }

  function convertExpression(block, deps) {
    var body = block.body.body
      , len = body.length

    return len == 1 && matcher.isReturn(body[0]) && deps.length == 0
      ? resolveInlineDeps(body)
      : createVarSelfInvokingFunction(deps, block)

      function resolveInlineDeps(body) { return body[0].argument }

      function createVarSelfInvokingFunction(deps, functionExpression) {

        return {
          "type": "CallExpression",
          "callee": functionExpression,
          "arguments": overrideDeps(deps)
        }
      }
  }

}

function createClosure(args, functionExpression) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": functionExpression,
      "arguments": args
    }
  }
}

function createGlobalWrapper(body, config) {
  var orgParams = []
    , escapedParams = []
    , initializeGlobals = []

  _(config.injectGlobals).each(function(d){
    orgParams.push({type:"Identifier", name: d})
    escapedParams.push({type:"Identifier", name: function(d){
      //TODO make that smarter, this = root, underscore = _
      //refresh inner references also
      //
      //TODO make safe custom globals function(g){if(g) return g }
      //noConflict
      if(d == "this")
        return "parent"

      return d
    }(d)})
  })

  _(config.customGlobals).each(function(d){
    orgParams.push({type:"Identifier", name: d})
    escapedParams.push({type:"Identifier", name: d})
  })

  ////initialize globals
  //
  _(config.initializeGlobals).each(function(d){
    initializeGlobals.push(function(){
      return {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": d 
                    },
                    "init": {
                        "type": "ObjectExpression",
                        "properties": []
                    }
                }
            ],
            "kind": "var"
        }
    }())
  })

  debugger

  return createProgram(
    initializeGlobals,
    createClosure(orgParams,
                  {
                    "type": "FunctionExpression",
                    "defaults": [],
                    "params": escapedParams,
                    "body": createBlockStatement(body)
                  }))
}

function assignmentGlobalExpression(left, right) {
  return {
    "type": "AssignmentExpression",
    "operator": "=",
    "left": {
      "type": "Identifier",
      "name": left 
    },
    "right": right
  }
}
function createProgram(vars, body) {
  return { "type": "Program", "body": vars.concat(body)}
}

function createBlockStatement(body) {
  return {"type": "BlockStatement", "body": body}
}

function escapeNestedDeps(name) {
  return name.replace(/^.\//,"")
             .replace(/[\/]([a-z])/g, function(v) {
               return v.toUpperCase().replace("/","")
             })

}

function overrideDeps(deps) {
  return _(deps).map(function(d) {
    d.name = escapeNestedDeps(d.value)
    d.type = "Identifier"

    return  d
  })
}
