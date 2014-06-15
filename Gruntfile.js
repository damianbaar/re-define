
module.exports = function(grunt) {
  grunt.registerTask('default', ['nodeunit', 'watch'])
  grunt.registerTask('test', ['nodeunit'])

  grunt.initConfig({
    nodeunit: {
      all: ['test/**/*_test.js']
    },
    watch: {
      files: ['test/**/*.test.js', 'lib/**/*.*']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
