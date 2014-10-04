
module.exports = function(grunt) {
  grunt.registerTask('default', ['shell', 'watch'])
  grunt.registerTask('test', ['shell:tests', 'nodeunit'])
  grunt.registerTask('update', ['shell:examples'])

  grunt.initConfig({
    shell: {
      tests:    { command: '(cd test/spec/ && ./build.sh)' }
    , examples: { command: '(cd examples/ && ./build.sh)' }
    },
    nodeunit: {
      all: ['test/**/**/*_test.js']
    },
    watch: {
      files: ['test/**/**', 'lib/**/*.*', '*.*']
    , tasks: ['shell:tests', 'nodeunit']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
