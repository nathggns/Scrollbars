/*global module*/
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                banner: '/*!\n' +
                    ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
                    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                    '<%= pkg.author.name %>; Licensed ' +
                    '<%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
                    ' * Built on <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                    ' */\n'
            },
            js: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.filename %>.js'
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'dist/<%= pkg.filename %>.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= concat.options.banner %>'
            },
            js: {
                files: {
                    'dist/<%= pkg.filename %>.min.js': [
                        '<%= concat.js.dest %>'
                    ]
                }
            }
        },
        cssmin: {
            css: {
                options: {
                    banner: '<%= concat.options.banner %>',
                    keepSpecialComments: 0
                },
                files: {
                    'dist/<%= pkg.filename %>.min.css': [
                        '<%= concat.css.dest %>'
                    ]
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['mochacli', 'jshint', 'concat', 'uglify']
        },
        mochacli: {
            options: {
                require: ['should'],
                bail: true
            },
            all: ['test/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('test', ['jshint', 'mochacli']);
    grunt.registerTask('default', [
        'mochacli', 'jshint', 'concat', 'uglify', 'cssmin'
    ]);
};