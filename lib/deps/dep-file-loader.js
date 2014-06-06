var _ = require('underscore')
  , utils = require('../utils/file')
  , fs = require('fs')
  , async = require('async')
  , through = require('through2')

module.exports = function() {
  var pending = {}
    , loaded = {}
  
  return through.obj(function(data, enc, cb) {
    var me = this
      , parent = data.parent

    async.each(data.deps ? data.deps : [],
      function(name, next) {
        load(name, data.parent.path, data.base, function(module) {
            me.push(module)
            next()
          })}
          ,function() {
            me.push(null) 
            cb()
          })
  })

  function load(name, relativeTo, base, cb) {
    var read = fs.readFile
      , exists = fs.exists
      , module = {}
      , onModule = _.partial(cb, module)

      module.refs = [name]
      module.path = utils.relativePath(relativeTo || base, utils.appendJS(name))
      module.name = utils.relativeName(base, module.path)

      if(pending[module.name] || loaded[module.name]) {
        onModule()
        return
      }

      pending[ module.name ] = true
      loaded[ module.name ] = false

      async.waterfall([
        function(cb) {
          !exists(module.path, _.partial(cb, null, _))
        },
        function(exists, cb) {
          if(exists) read(module.path, 'utf-8', cb)
          else cb()
        }
      ]
      , function(err, data) {
        module.content = data
        module.loaded = true

        if(!module.content) module.external = true

        pending[ module.name ] = false 
        loaded[ module.name ] = true

        onModule()
      })
  }
}
