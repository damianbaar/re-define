var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:stop-processing')
  , types = require("ast-types").namedTypes

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
        if(types.FunctionExpression.check(node.callee)) {

          st.iife = true
          st.params = _.pluck(node.callee.params, 'name')

          c(node.callee, st)
        }

        if(st.iife && !st.amd) {
          st.amd = node.callee.name === 'define'

          var deps = _.first(node.arguments, types.ArrayExpression.check)

          deps && (deps = deps[0].elements)
          deps && (deps = _.pluck(deps, 'value'))

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
          if(!st.global && global) st.global = true
        }

        c(node.right, st)
      }
    })


    if(state.iife) {
    console.log(state)
      file.ast = null
      debug('Removing ast, using original content for, ', file.name || file.require)
    }

    this.push(file)
    next()
  })
}
