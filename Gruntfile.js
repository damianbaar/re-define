
module.exports = function(grunt) {
  grunt.registerTask('default', ['nodeunit', 'watch'])
  grunt.registerTask('test', ['nodeunit'])

  grunt.initConfig({
    mocha: {
      test: {
        options: {
          run: true
        , log: true
        },
        src: ['test/browser/index.html']
      }
    },
    shell: {
      tests:    { command: '(cd test/browser/ && ./build.sh)' }
    , examples: { command: '(cd examples/ && ./build.sh)' }
    },
    nodeunit: {
      all: ['test/**/**/*_test.js']
    },
    watch: {
      files: ['test/**/**', 'lib/**/*.*', '*.*']
    , tasks: ['nodeunit', 'shell', 'mocha']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-mocha')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-contrib-watch')
}
