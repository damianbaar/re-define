
module.exports = function(grunt) {
  grunt.registerTask('default', ['nodeunit', 'watch'])
  grunt.registerTask('test', ['nodeunit'])

  grunt.initConfig({
    nodeunit: {
      all: ['test/**/**/*_test.js']
    },
    watch: {
      files: ['test/**/*_test.js', 'lib/**/*.*']
    , tasks: ['nodeunit']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
