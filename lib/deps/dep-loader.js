var ast = require('../ast-adapter.js')
  , fs = require('fs')
  , path = require('path')

module.exports = function() {
  load: load
}

function load(config, contents, done) {
  var file = fs.readFileSync(path.resolve(config.base, config.main))

  // config.base
  // config.main
}

