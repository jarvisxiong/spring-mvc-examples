/* global module, require, __dirname */
'use strict';

module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	var requireJsConfig = require('./src/main/grunt/js/main/config.js');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Simple file banner
		banner: '/*!\n' +
				' * Exacode-webstrap v<%= pkg.version %>-<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
				' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
				' *\n' +
				' * Designed and built by @pmendelski.\n' +
				' */\n\n',
		// configurable paths
		app: {
			dir: {
				src: 'src/main/grunt',
				lib: 'src/main/grunt/lib',
				tmp: 'target/grunt/tmp',
				dist: 'src/main/webapp/assets',
				devdist: 'src/main/webapp/grunt',
			},
			path: {
				dev: '/spring-mvc-freemarker-gruntjs',
				prod: ''
			}
		},
		clean: {
			dist: ['<%= app.dir.dist %>'],
			tmp: ['<%= app.dir.tmp %>'],
			devdist: ['<%= app.dir.devdist %>']
		},
		jshint: {
			options: {
				jshintrc: '<%= app.dir.src %>/js/.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: ['<%= app.dir.src %>/js/**/*.js']
		},
		cssmin: {
			options: {
				report: 'min'
			},
			combine: {
				files: {
					'<%= app.dir.tmp %>/css/main.css': [
						'<%= app.dir.src %>/css/**/*.css'
					]
				}
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: false
			},
			js: {
				src: [
					'<%= app.dir.lib %>/modernizr/modernizr.js',
					'<%= app.dir.lib %>/jquery/jquery.js',
					'<%= app.dir.lib %>/sass-bootstrap/dist/js/bootstrap.js',
					'<%= app.dir.lib %>/angular/angular.js',
					'<%= app.dir.lib %>/purl/purl.js',
					'<%= app.dir.src %>/js/main.js'
					// Add other js files
				],
				dest: '<%= app.dir.dist %>/js/main.js'
			},
			'css-prod': {
				src: [
					'<%= app.dir.tmp %>/scss/main.css',		// css from compass compilation
					'<%= app.dir.tmp %>/css/main.css'		// minified additional css (see: cssmin)
				],
				dest: '<%= app.dir.dist %>/css/main.css'
			},
			'css-dev': {
				src: [
					'<%= app.dir.tmp %>/scss/main.css',	// css from compass compilation
					'<%= app.dir.src %>/css/**/*.css'	// additional css files (not processed)
				],
				dest: '<%= app.dir.dist %>/css/main.css'
			}
		},
		uglify: {
			libs: {
				src: ['<%= app.dir.lib %>/requirejs/require.js'],
				dest: '<%= app.dir.dist %>/lib/require.js'
			}
		},
		imagemin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= app.dir.src %>',
					src: 'img/**/*.{gif,jpeg,jpg,png}',
					dest: '<%= app.dir.dist %>'
				}]
			}
		},
		svgmin: {
			build: {
				files: [{
					expand: true,
					cwd: '<%= app.dir.src %>',
					src: 'img/**/*.svg',
					dest: '<%= app.dir.dist %>/img'
				}]
			}
		},
		copy: {
			'additional-images': {
				files: [{
					expand: true,
					flatten: true,
					dest: '<%= app.dir.dist %>/img',
					src: [
						// add some images to copy
					]
				}]
			},
			'images-dev': {
				files: [{
					expand: true,
					cwd: '<%= app.dir.src %>',
					dest: '<%= app.dir.dist %>',
					src: [
						'img/**/*.*'
					]
				}]
			},
			fonts: {
				files: [{
					expand: true,
					flatten: true,
					src: ['<%= app.dir.lib %>/font-awesome/fonts/*'],
					dest: '<%= app.dir.dist %>/fonts/font-awesome'
				}, {
					expand: true,
					cwd: '<%= app.dir.src %>/fonts',
					dest: '<%= app.dir.dist %>/fonts',
					src: [
						'**/*.*'
					]
				}]
			},
			'js-libs-dev': {
				files: [{
					expand: true,
					cwd: '<%= app.dir.lib %>',
					dest: '<%= app.dir.devdist %>/lib',
					src: ['**/*.js']
				}]
			}
		},
		sync: {
			js: {
				files: [{
					cwd: 'src/main/grunt/js',
					src: '**/*.js',
					dest: '<%= app.dir.devdist %>/js',
				}]
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 1 version'] // more codenames at https://github.com/ai/autoprefixer#browsers
			},
			build: {
				files: [{
					src: '<%= app.dir.dist %>/css/**/*.css'
				}]
			}
		},
		compass: {
			options: {
				// define input directories
				importPath: '<%= app.dir.lib %>',			// where to search when using '@import'
				sassDir: '<%= app.dir.src %>/scss',		// where are .scss fiels?
				imagesDir: '<%= app.dir.src %>/img',		// where are images? ...handy when generating sprites
				fontsDir: '<%= app.dir.src %>/fonts',		// where are all fonts
				// define outout directories
				generatedImagesDir: '<%= app.dir.dist %>/img/generated',	// where to put generated images? e.g. sprites
				generatedImagesPath: '<%= app.dir.dist %>/img/generated',	// where to put generated images? e.g. sprites
				cssDir: '<%= app.dir.tmp %>/scss',			// where to put generated css?
				// define build parameters
				trace: true,
				raw: "cache_path = '<%= app.dir.tmp %>/scss/cache'\n",	// because of this option we need to add "__dirname" prefixes
				basePath: __dirname.replace(/\\/gi, "/")
			},
			dev: {
				options: {
					environment: 'development',
					outputStyle: 'expanded',
					httpPath: '<%= app.path.dev %>',
					httpImagesPath: '<%= app.path.dev %>/img',
					httpGeneratedImagesPath: '<%= app.path.dev %>/assets/img/generated',
					httpFontsPath: '<%= app.path.dev %>/fonts',
					httpStylesheetsPath: '<%= app.path.dev %>/css'
				}
			},
			prod: {
				options: {
					environment: 'production',
					outputStyle: 'compressed',
					httpPath: '<%= app.path.prod %>/',
					httpImagesPath: '<%= app.path.prod %>/img',
					httpGeneratedImagesPath: '<%= app.path.prod %>/assets/img/generated',
					httpFontsPath: '<%= app.path.prod %>/fonts',
					httpStylesheetsPath: '<%= app.path.prod %>/css'
				}
			}
		},
		requirejs: {
			options: {
				baseUrl: './',
				appDir: '<%= app.dir.src %>/js/main',
				dir: '<%= app.dir.dist %>/js',
				shim: requireJsConfig.shim,
				paths: requireJsConfig.paths,
				uglify: {
					no_mangle: true
				},
				modules: [
					{
						name: 'basic'
					},
					{
						name: 'common'
					},
					{
						name: 'modules/home/loader',
						exclude: ['common']
					}
					//,{
					//	name: 'modules/other',
					//	exclude: ['../common']
					//}
				]
			},
			dev: {
				options: {
					optimize: 'none'
				}
			},
			prod: {
				options: {
					optimize: 'uglify'
				}
			}
		},
		karma: {
			options: {
				configFile: '<%= app.dir.src %>/js/test/karma.conf.js'
			},
			'phantom': {
				browsers  : ['PhantomJS'],
				singleRun : true
			},
			'phantom-watch': {
				browsers  : ['PhantomJS'],
				autoWatch : true,
				singleRun : false
			},
			'chrome': {
				browsers  : ['Chrome'],
				singleRun : true
			},
			'chrome-watch': {
				browsers  : ['Chrome'],
				autoWatch : true,
				singleRun : false
			}
		},
		watch: {
			resources: {
				files: [
					'<%= app.dir.src %>/img/**/*.*',
					'<%= app.dir.src %>/fonts/**/*.*'
				],
				tasks: ['resources-dev']
			},
			css: {
				files: [
					'<%= app.dir.src %>/scss/**/*.{scss,sass}',
					'<%= app.dir.src %>/css/**/*.css'
				],
				tasks: ['css-dev']
			},
			js: {
				files: [
					'<%= app.dir.src %>/js/main/**/*.js',
					'<%= app.dir.src %>/js/*.js'
				],
				tasks: ['sync:js']
			}
		}
	});
	// Log 'watch' events
	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

	// Distribution - JavaScript
	grunt.registerTask('js-test', ['jshint', 'karma:phantom']);
	grunt.registerTask('js-dev', ['sync:js', 'copy:js-libs-dev']);
	grunt.registerTask('js-prod', [
		'js-test',			// run tests
		'requirejs:prod',	// build optimized requirejs modules
		'uglify:libs',		// concatenate and uglify additiona libs
	]);


	// Distribution - CSS
	grunt.registerTask('css-dev', ['compass:dev', 'concat:css-dev', 'autoprefixer']);
	grunt.registerTask('css-prod', [
		'compass:prod',		// compile compass
		'cssmin',			// minify additional css
		'concat:css-prod',	// concatenate compass css with additional css
		'autoprefixer'		// add apropriate prefixes to css rules
	]);

	// Distribution - Additional resources (images, fonts etc.)
	grunt.registerTask('resources-dev', ['copy:images-dev', 'copy:additional-images', 'copy:fonts']);
	grunt.registerTask('resources-prod', [
		'imagemin',					// minimize images of type png, jpg, gif
		'svgmin',					// minimize svg images
		'copy:additional-images',	// copy additional images
		'copy:fonts'				// copy fonts
	]);

	// Build
	grunt.registerTask('build-prod', ['css-prod', 'resources-prod', 'js-prod']);
	grunt.registerTask('build-dev', ['css-dev', 'resources-dev', 'js-dev']);

	// Development
	grunt.registerTask('dev', ['build-dev', 'watch']);

	// Default task.
	grunt.registerTask('default', ['clean', 'build-prod']);

};
