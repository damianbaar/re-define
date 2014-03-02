module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      // lib: {
      //   src: ['lib/**/*.js']
      // },
      // test: {
      //   src: ['test/**/*.js']
      // },
    },
    'node-inspector': {
      debug: {
        'web-port': 1337,
        'web-host': 'localhost',
        'debug-port': 5857,
        'save-live-edit': true,
        'stack-trace-limit': 4
      }
    },
    nodemon: {
      debug: {
        script: 'main.js',
        options: {
          nodeArgs: ['--debug-brk'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            nodemon.on('config:update', function () {
              setTimeout(function() {
                require('open')('http://127.0.0.1:8080/debug?port=5858');
              }, 1000);
            });

            nodemon.on('restart', function () {
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          }
        }
      }
    },
    watch: {
      server: {
        files: ['.rebooted'],
        options: {
          livereload: true
        }
      }
    },
    concurrent: {
      debug: ['nodemon', 'node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-node-inspector')
  grunt.loadNpmTasks('grunt-concurrent')
  grunt.loadNpmTasks('grunt-nodemon')

  grunt.registerTask('test', ['jshint', 'nodeunit'])
  grunt.registerTask('debug', ['concurrent']);
};
