module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    watch: {
      server: {
        files: ['test/**/*_test.js','lib/**'],
        tasks: ['nodeunit']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-nodemon')

  grunt.registerTask('test', ['nodeunit'])
  grunt.registerTask('dev', ['watch'])
};
