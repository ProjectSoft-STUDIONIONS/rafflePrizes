module.exports = function(grunt){
	var gc = {
		imageNotyfy: __dirname+'\\src\\notify.png',
		minifyHtml: false,
		minifyCss: false,
		dist: 'docs/assets',
		fontVers: '1.0.1',
		sdk: "sdk",//"normal" "sdk"
		version: "0.44.3"
	};
	var tasks = {
		default: [
			'notify:start',
			'jshint',
			'clean',
			'webfont',
			'imagemin',
			'json_generator',
			'requirejs',
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
			'exec:install_win32',
			'exec:install_win64',
			'notify:cancel'
		],
		build: [
			'notify:start',
			'jshint',
			'clean',
			'webfont',
			'imagemin',
			'json_generator',
			'requirejs',
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
			//'exec:win32dll',
			//'exec:win64dll',
			//'exec:win32del',
			//'exec:win64del',
			'notify:cancel'
		],
		test: [
			'notify:start',
			'jshint',
			'clean',
			'webfont',
			'imagemin',
			'json_generator',
			'requirejs',
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
			'notify:cancel'
		],
		dev: [
			'watch'
		]
	};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		jshint: {
			src: [
				/*'src/raffle/js/bg.js',
				'src/raffle/js/app.js',
				'src/raffle/js/settings.js',
				'src/raffle/js/main.js',
				'project/module/helper.js',
				'project/module/audioplaylist.js',
				'project/module/uniqid.js'*/
				'src/raffle/js/rafle.js',
				//'src/raffle/js/.js'
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
				'.nwjs/',
				'.temp/'
			],
			temp: [
				'.nwjs/raffleprizes/win32/temp/',
				'.nwjs/raffleprizes/win64/temp/',
				'.temp/'
			]
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
			media: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/raffle/images/media/*.{png,jpg,gif,svg}'
						],
						dest: 'test/images/media/',
						filter: 'isFile'
					}
				]
			},
			user: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/raffle/user/bg/*.{png,jpg}'
						],
						dest: 'project/assets/user/bg/',
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
					"app_name": "<%= pkg.name %>-projectsoft",
					"dependencies": {
						"blob-to-buffer": "^1.2.8",
						"component-emitter": "^1.2.1",
						"dateformat": "^3.0.3",
						"ffmpeg": "0.0.4",
						"file-saver": "^2.0.0",
						"fluent-ffmpeg": "^2.1.2",
						"jsmediatags": "^3.8.1",
						"mime": "^2.4.0",
						"nw-dialog": "^1.0.7",
						"rimraf": "^2.6.3",
						"underscore": "^1.9.1"
					},
					"main": "index.html",
					"name": "<%= pkg.name %>",
					"nodejs": true,
					"version": "<%= pkg.version %>",
					"winIco": "favicon.ico",
					"page-cache": false,
					"chromium-args": "--user-data-dir='temp/' --disk-cache-size=1 --media-cache-size=1",
					"webkit": {
						"plugin": true,
					},
					"window": {
						"exe_icon": "favicon.png",
						"frame": true,
						"height": 400,
						"icon": "favicon.png",
						"id": "<%= pkg.name %>-projectsoft",
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
					"zip": false
				}
			}
		},
		webfont: {
			vars: {
				src: 'src/raffle/glyph/*.svg',
				dest: 'src/raffle/fonts',
				options: {
					hashes: false,
					autoHint: false,
					relativeFontPath: '/assets/fonts/',
					destLess: 'src/raffle/less',
					font: 'variables',
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
					template: 'src/raffle/variables.template'
				}
			},
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
					'src/raffle/js/required.js',
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
					//'src/raffle/js/devices.js',
					'src/raffle/js/audiosettings.js',
					'src/raffle/js/settings.js',
					'src/raffle/js/app.js',
					'src/raffle/js/number.jquery.js',
					'src/raffle/js/rafle.js',
					'src/raffle/js/main.js'
				],
				dest: "project/assets/js/app.js"//'prejscss/app.js'
			}
		},
		less: {
			roboto: {
				options : {
					compress: false,
					ieCompat: false,
					modifyVars: {
						fontpath: '"/assets/fonts"'
					}
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
					'tests/css/inc/app.css' : ['test/css/replace/app.css'],
					'project/assets/css/app.css' : ['test/css/replace/app.css']
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
					/*'project/assets/js/app.js': [
						'prejscss/app.js'
					],*/
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
					'**.ttf',
					'**.otf',
					'**.eot',
					'**.svg',
					'**.woff',
					'**.woff2'
				],
				dest: 'project/assets/fonts/',
			},
			icon: {
				expand: true,
				cwd: 'src/embed',
				src: [
					'favicon.ico',
					'dll.ico',
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
			},
			images_m: {
				expand: true,
				cwd: 'test/images/media',
				src: [
					'**.*',
				],
				dest: 'project/assets/images/media/',
			},
			assets: {
				expand: true,
				cwd: 'src/raffle/user/sounds',
				src: "**",
				dest: 'project/assets/user/sounds/',
			},
			module: {
				expand: true,
				cwd: 'src/raffle/module',
				src: [
					'**',
				],
				dest: 'project/module/',
			},
			record: {
				expand: true,
				cwd: 'src/RecordRTC',
				src: [
					'**',
				],
				dest: 'project/RecordRTC/',
			}
		},
		nwjs: {
			options: {
				platforms: ['win'],
				buildDir: __dirname+'/.nwjs',
				flavor: gc.sdk,
				version: gc.version,
				cacheDir: __dirname+'/.cache',
				zip: false,
				
			},
			src: [__dirname+'/project/**/*']
		},
		exec: {
			win32: {
				cmd: 'start "" /wait ResourceHacker -open .nwjs/<%= pkg.name %>/win32/<%= pkg.name %>.exe -save .nwjs/<%= pkg.name %>/win32/<%= pkg.name %>.exe -action addoverwrite -res project/favicon.ico -mask ICONGROUP,IDR_MAINFRAME,'
			},
			win64: {
				cmd: 'start "" /wait ResourceHacker -open .nwjs/<%= pkg.name %>/win64/<%= pkg.name %>.exe -save .nwjs/<%= pkg.name %>/win64/<%= pkg.name %>.exe -action addoverwrite -res project/favicon.ico -mask ICONGROUP,IDR_MAINFRAME,'
			},
			test: {
				cmd: 'start "" /wait  .cache/' + gc.version + '-' + gc.sdk + '/win64/nw project/'
			},
			install_win32: {
				cmd: 'iscc install_win32.iss'
			},
			install_win64: {
				cmd: 'iscc install_win64.iss'
			}
		},
		// Изменения файлов
		watch: {
			dev : {
				files: [
					'src/raffle/**/*',
				],
				tasks: tasks.test
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
	grunt.registerTask('default',tasks.default);
	grunt.registerTask('build', tasks.build);
	grunt.registerTask('test', tasks.test);
	grunt.registerTask('dev', tasks.dev);
};