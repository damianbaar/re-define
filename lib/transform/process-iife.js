var through = require('through2')
  , _ = require('lodash')
  , walk = require('acorn/util/walk')
  , debug = require('debug')('re-define:process-iife')
  , types = require("ast-types")
  , n = types.namedTypes
  , b = types.builders

module.exports = function(config, writer) {
  return through.obj(function(file, enc, next) {
    if(!file.isAST()) {
      this.push(file)
      next()
      return
    }

    var state = { amd: false
                , global: false
                , cjs: false
                , deps: [] }

    walk.recursive(file.contents, state, {
      CallExpression: function(node, st, c) {
        if(n.FunctionExpression.check(node.callee)) {

          st.iife = true
          st.params = _.pluck(node.callee.params, 'name')

          c(node.callee, st)
        }

        if(st.iife && !st.amd) {
          st.amd = node.callee.name === 'define'

          var deps = _.first(node.arguments, n.ArrayExpression.check)

          //TODO making named module should be optional
          if(!n.Identifier.check(node.arguments[0])) {
            node.arguments.unshift(b.literal(file.require || file.name))
          }

          if(!_.isEmpty(st.deps)) return
          deps = deps[0].elements
          deps = _.pluck(deps, 'value')
          st.deps = deps
        }
      },
      AssignmentExpression: function(node, st, c) {
        if(st.iife) {
          var left = node.left
            , right = node.right
            , callee = right.callee
            , to = left.object && left.object.name
            , deps = []

          var global = st.params.indexOf(to) > -1 && st.params.indexOf(callee.name) > -1
            , cjs = (callee && st.params.indexOf(callee.name) > -1) 
                  && (left.object.name + '.' + left.property.name === 'module.exports')

          if(!st.cjs && cjs) {
            st.cjs = true
          }
          if(!st.global && global) {
            left.property.name = file.require || file.name
            st.global = true

            if(!_.isEmpty(deps)) return

            var factoryArgs = node.right.arguments
              , globals = _.each(factoryArgs, function(d) {
                if(n.MemberExpression.check(d) 
                  && st.params.indexOf(d.object.name) > -1)
                  deps.push(d.property.name)
              })

            st.deps = deps
          }
        }

        c(node.right, st)
      }
    })

    if(state.iife) {
      file.type = 'iife'

      file.externals = _.map(state.deps, function(d) {
        var dep = {}
        dep.path = dep.name = dep.reference = d

        writer.write(dep)

        return dep
      })

      file.deps = file.externals

      debug('umd details', state)
    }

    this.push(file)
    next()
  })
}
