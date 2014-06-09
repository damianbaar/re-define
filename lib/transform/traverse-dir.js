var through = require('through2')

module.exports = function(config) {
  return through.obj(function(chunk, enc, next) {
    var ignoredFolders = config.skipFolders
      , includedFiles  = config.includeTypes

    finder(path.resolve(config.base))
      .on('directory', function (dir, stat, stop) {
        ignoreDir(dir) && stop()
      })
      .on("file", function (file, stat) {
        includeFile(file) && this.push({path: file})
      }.bind(this))
      .on('end', function() {
        next()
      })

    function ignoreDir(dir) { return ignoredFolders.indexOf(path.basename(dir)) > -1 }
    function includeFile(file) { return includedFiles.indexOf(path.extname(file)) > -1 }
  })
}
