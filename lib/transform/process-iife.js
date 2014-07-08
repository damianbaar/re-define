var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:process-iife')
  , types = require("ast-types")
  , n = types.namedTypes
  , b = types.builders

module.exports = function(config) {
  return through.obj(function(file, enc, next) {
    if(!file.ast) {
      this.push(file)
      next()
      return
    }

    var state = { amd: false
                , global: false
                , cjs: false
                , deps: [] }
    
    walk.recursive(file.ast, state, {
      CallExpression: function(node, st, c) {
        if(n.FunctionExpression.check(node.callee)) {

          st.iife = true
          st.params = _.pluck(node.callee.params, 'name')

          c(node.callee, st)
        }

        if(st.iife && !st.amd) {
          st.amd = node.callee.name === 'define'

          var deps = _.first(node.arguments, n.ArrayExpression.check)

          //TODO adding name should be optional
          if(!n.Identifier.check(node.arguments[0])) {
            node.arguments.unshift(b.literal(file.require || file.name))
          }

          !_.isEmpty(deps) && (deps = deps[0].elements)
          !_.isEmpty(deps) && (deps = _.pluck(deps, 'value'))

          !_.isEmpty(deps) && (st.deps = deps)
        }
      },
      AssignmentExpression: function(node, st, c) {
        if(st.iife) {
          var left = node.left
            , right = node.right
            , callee = right.callee
            , to = left.object.name

          var cjs= st.params.indexOf(callee.name) > -1 && (left.object.name + '.' + left.property.name === 'module.exports')
            , global = st.params.indexOf(to) > -1 && st.params.indexOf(callee.name) > -1

          if(!st.cjs && cjs) st.cjs = true
          if(!st.global && global) {
            left.property.name = file.require || file.name
            st.global = true
          }
        }

        c(node.right, st)
      }
    })

    if(state.iife) {
      file.wrap = false
      debug('umd details', state)
    }

    this.push(file)
    next()
  })
}
