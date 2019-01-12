module.exports = function(grunt){
	var gc = {
		imageNotyfy: __dirname+'\\src\\notify.png',
		minifyHtml: false,
		minifyCss: false,
		dist: 'docs/assets',
		fontVers: '1.0.1'
	};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		jshint: {
			src: [
				'src/raffle/js/*.js'
			],
		},
		clean: {
			options: {
				force: true
			},
			test: [
				'test/',
				'tests/',
				'src/raffle/css/bin/',
				'project/assets',
				'installer/',
				'prejscss/',
				'.nwjs/'
			],
			
		},
		imagemin: {
			options: {
				optimizationLevel: 3,
				svgoPlugins: [
					{
						removeViewBox: false
					}
				]
			},
			base: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/raffle/images/*.{png,jpg,gif,svg}'
						],
						dest: 'test/images/',
						filter: 'isFile'
					}
				]
			},
			bin: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/raffle/images/bin/*.{png,jpg,gif,svg}'
						],
						dest: 'src/raffle/css/bin/',
						filter: 'isFile'
					}
				],
			},
			icon: {
				files: {
					'project/favicon.png': 'src/embed/favicon.png'
				}
			}
		},
		json_generator: {
			nwjs: {
				dest: "project/package.json",
				options: {
					"app_name": "<%= pkg.name %>",
					"dependencies": {
						"mime": "^2.4.0",
						"nw-dialog": "^1.0.7",
						"underscore": "^1.9.1"
					},
					"main": "index.html",
					"name": "<%= pkg.name %>",
					"bg-script": 'assets/js/bg.js',
					"nodejs": true,
					"version": "<%= pkg.version %>",
					"webkit": {
						"plugin": true,
					},
					"winIco": "favicon.ico",
					"window": {
						"exe_icon": "favicon.png",
						"frame": true,
						"height": 400,
						"icon": "favicon.png",
						"id": "<%= pkg.name %>",
						"kiosk_emulation": true,
						"mac_icon": "favicon.png",
						"min_height": 400,
						"min_width": 800,
						"position": "center",
						"resizable": true,
						"show_in_taskbar": true,
						"title": "<%= pkg.description %>",
						"toolbar": true,
						"visible": true,
						"visible_on_all_workspaces": true,
						"width": 800
					},
					"zip": true
				}
			}
		},
		webfont: {
			icons: {
				src: 'src/raffle/glyph/*.svg',
				dest: 'src/raffle/fonts',
				options: {
					hashes: false,
					autoHint: false,
					relativeFontPath: '/assets/fonts/',
					destLess: 'src/raffle/less/fonts',
					font: 'raffle',
					types: 'woff,ttf',
					fontFamilyName: 'Raffle Prizes',
					stylesheets: ['less'],
					syntax: 'bootstrap',
					execMaxBuffer: 1024 * 400,
					htmlDemo: false,
					version: gc.fontVers,
					normalize: true,
					startCodepoint: 0xE900,
					iconsStyles: false,
					templateOptions: {
						baseClass: '',
						classPrefix: 'webicon-'
					},
					embed: false,
					template: 'src/raffle/font-build.template'
				}
			},
		},
		requirejs: {
			ui: {
				options: {
					baseUrl: __dirname+"/bower_components/jquery-ui/ui/widgets/",//"./",
					paths: {
						jquery: __dirname+'/bower_components/jquery/dist/jquery'
					},
					preserveLicenseComments: false,
					optimize: "uglify",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					exclude: ["jquery"],
					include: [ 
						"../disable-selection.js",
						"sortable.js",
					],
					out: "prejscss/jquery.ui.js",
					done: function(done, output) {
						grunt.log.writeln(output.magenta);
						grunt.log.writeln("jQueryUI Custom Build ".cyan + "done!\n");
						done();
					},
					error: function(done, err) {
						grunt.log.warn(err);
						done();
					}
				}
			}
		},
		concat: {
			options: {
				separator: "\n",
			},
			appcss: {
				src: [
					'prejscss/raffle.css',
					'prejscss/roboto.css',
					'bower_components/Croppie/croppie.css',
					'bower_components/arcticModal/arcticmodal/jquery.arcticmodal.css',
					'bower_components/arcticModal/arcticmodal/themes/dark.css',
					'bower_components/fancybox/dist/jquery.fancybox.css',
					'src/raffle/colorpicker/css/bootstrap.colorpickersliders.min.css',
					'src/raffle/colorpicker/css/main.css',
					'prejscss/main.css'
				],
				dest: 'prejscss/app.css'
			},
			appjs: {
				src: [
					'bower_components/jquery/dist/jquery.js',
					'prejscss/jquery.ui.js',
					'bower_components/jquery.cookie/jquery.cookie.js',
					'bower_components/fancybox/dist/jquery.fancybox.js',
					'bower_components/exif-js/exif.js',
					'bower_components/Croppie/croppie.min.js',
					'bower_components/arcticModal/arcticmodal/jquery.arcticmodal.js',
					'bower_components/jquery.forestedglass/dist/jquery.forestedglass.js',
					'src/raffle/colorpicker/tinycolor.js',
					'src/raffle/colorpicker/bootstrap.colorpickersliders.js',
					'src/tooltip/tooltip.js',
					'src/raffle/js/settings.js',
					'src/raffle/js/app.js',
					'src/raffle/js/main.js'
				],
				dest: 'prejscss/app.js'
			}
		},
		less: {
			roboto: {
				options : {
					compress: false,
					ieCompat: false,
					modifyVars: {
						fontpath: '"/assets/fonts"'
					},
					plugins: [
						new (require('less-plugin-lists'))
					],
				},
				files: {
					'prejscss/roboto.css': 'src/raffle/roboto/fontface.less'
				}
			},
			main: {
				options : {
					compress: false,
					ieCompat: false
				},
				files: {
					'prejscss/main.css': 'src/raffle/less/main.less',
					'prejscss/raffle.css': 'src/raffle/less/fonts/raffle.less',
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: ['last 2 versions'],
				cascade: true
			},
			css: {
				files: {
					'test/css/app.css' : ['prejscss/app.css'],
				}
			},
		},
		group_css_media_queries: {
			group: {
				files: {
					'test/css/media/app.css': ['test/css/app.css']
				}
			}
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /\/\* *(.*?) *\*\//g,
							replacement: ' '
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'test/css/media/*.css'
						],
						dest: 'test/css/replace/',
						filter: 'isFile'
					}
				]
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'tests/css/inc/app.css' : ['test/css/replace/app.css']
				}
			}
		},
		uglify : {
			options: {
				ASCIIOnly: true,
				//beautify: true
			},
			main: {
				files: {
					'project/assets/js/app.js': [
						'prejscss/app.js'
					],
					'project/assets/js/bg.js': [
						'src/raffle/js/bg.js'
					],
				}
			}
		},
		pug: {
			files: {
				options: {
					pretty: '\t',
					separator:  '\n'
				},
				files: {
					"project/index.html": ['src/raffle/pug/index.pug']
				}
			}
		},
		copy: {
			fonts: {
				expand: true,
				cwd: 'src/raffle/fonts',
				src: [
					'**.*'
				],
				dest: 'project/assets/fonts/',
			},
			icon: {
				expand: true,
				cwd: 'src/embed',
				src: [
					'favicon.ico'
				],
				dest: 'project',
			},
			images: {
				expand: true,
				cwd: 'test/images',
				src: [
					'**.*',
				],
				dest: 'project/assets/images/',
			}
		},
		nwjs: {
			options: {
				platforms: ['win'],
				buildDir: __dirname+'/.nwjs',
				//flavor: 'normal',
				//version: '0.35.2',
				cacheDir: __dirname+'/.cache'
			},
			src: [__dirname+'/project/**/*']
		},
		exec: {
			win32: {
				cmd: "win32.bat"
			},
			win64: {
				cmd: "win64.bat"
			},
			test: {
				cmd: "test.bat"
			},
			install: {
				cmd: "install.bat"
			}
		},
		notify: {
			start: {
				options: {
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: 'Запуск',
					image: __dirname+'\\src\\embed\\favicon.png'
				}
			},
			cancel: {
				options: { 
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: "Успешно Завершено",
					image: __dirname+'\\src\\embed\\favicon.png'
				}
			}
		},
	});
	var tasks = {
		default: [
			'notify:start',
			'jshint',
			'clean',
			'imagemin',
			'json_generator',
			'requirejs',
			'webfont',
			'less',
			'concat',
			'autoprefixer',
			'group_css_media_queries',
			'replace',
			'cssmin',
			'uglify',
			'pug',
			'copy',
			'nwjs',
			'exec',
			'notify:cancel'
		],
		build: [
			'notify:start',
			'jshint',
			'clean',
			'imagemin',
			'json_generator',
			'requirejs',
			'webfont',
			'less',
			'concat',
			'autoprefixer',
			'group_css_media_queries',
			'replace',
			'cssmin',
			'uglify',
			'pug',
			'copy',
			'nwjs',
			'exec:win32',
			'exec:win64',
			//'exec:test',
			'notify:cancel'
		],
		test: [
			'jshint',
			'json_generator',
			'less',
			'concat',
			'autoprefixer',
			'group_css_media_queries',
			'replace',
			'cssmin',
			'uglify',
			'pug',
			'copy',
			'exec:test',
		]
	};
	grunt.registerTask('default',tasks.default);
	grunt.registerTask('build', tasks.build);
	grunt.registerTask('dev', tasks.test);
};