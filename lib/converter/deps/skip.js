module.exports = function (relativeTo, base, name, ref) {
  var module = {}

  module.name = name
  module.type = 'skip'
  module.ref = ref

  return { override: function (deps) { return deps }
         , resolve: function (done) { done(module) }) }
  }
}
