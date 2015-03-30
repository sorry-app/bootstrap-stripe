/*jshint multistr: true */
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Default package configuration.
    pkg: grunt.file.readJSON('package.json'),

    // Define a banner to added to the compiled assets.
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * (c) Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',

    // Javascript validation.
    jshint: {
      options: {
        jshintrc: 'src/.jshintrc'
      },
      all: ['Gruntfile.js', 'src/**/*.js']
    },

    // Minify Javascript Assets.
    uglify: {
      build: {
        src: ['src/<%= pkg.name %>.js', 'src/validator/stripeApproved.js'], // Take temporary pre-compiled asset.
        dest: 'dist/<%= pkg.name %>.min.js' // Plop it in the distribution folder.
      },
      options: {
        banner: '<%= banner %>'
      }
    },

    // Watch and instant rebuild.
    watch: {
      files: ['index.html', 'src/**/*'],
      tasks: ['default']
    },

    // Local demo / development site.
    connect: {
      server: {
        options: {
          port: 9001,
          keepalive: true
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load the plugin that validates the JS markup.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Load the plugin that allows us a local HTTP server.
  grunt.loadNpmTasks('grunt-contrib-connect');
  // Watcher for rebuilding when files changes.
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify']);

};