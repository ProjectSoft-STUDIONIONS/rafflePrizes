module.exports = function(grunt){

	process.removeAllListeners('warning');
	require('dotenv').config();

	const target = process.env.NWJS_TARGET == "1" ? true : false,
		update = process.env.NWJS_UPDATE == "1" ? true : false,
		version = process.env.NWJS_VERSION == "0" ? "0.49.0" : process.env.NWJS_VERSION; // 0.87.0

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('innosetup-compiler');

	require('./modules/Downloader.js')(grunt);
	require('./modules/Build.js')(grunt);
	require('./modules/Versions.js')(grunt);

	require('time-grunt')(grunt);

	const pkg = grunt.file.readJSON('package.json');

	var gc = {
			imageNotyfy: __dirname + '\\src\\notify.png',
			minifyHtml: false,
			minifyCss: false,
			dist: 'docs/assets',
			fontVers: '1.0.1',
			sdk: target ? "normal" : "sdk",
			version: version
		},
		flv = target ? '' : '-sdk',
		tasks = {
			default: [
				'jshint',
				'clean:test',
				'webfont',
				'imagemin',
				'json_generator',
				'requirejs',
				'less',
				'concat',
				// 'autoprefixer',
				// 'group_css_media_queries',
				// 'replace',
				'cssmin',
				'uglify',
				'pug',
				'clean:lock',
				'downloader',
				'unzip',
				'version_edit',
				'copy',
				'zip',
				'clean:vk',
				'buildnw',
				'innosetup'
			]
		};
	grunt.initConfig({
		globalConfig : gc,
		pkg : pkg,
		version_edit: {
			main: {
				options: {
					pkg: pkg,
				}
			}
		},
		downloader: {
			main: {
				options: {
					version: gc.version,
					sdk: gc.sdk == 'normal' ? false : true
				}
			}
		},
		zip: {
			main: {
				router: function (filepath) {
					return filepath.split('/').slice(1).join('/');
				},
				src: ['project/**/*'],
				dest: 'build/package.nw'
			}
		},
		unzip: {
			unzip_001: {
				router: function (filepath) {
					return filepath.split('/').slice(1).join('/');
				},
				src: `.cache/${gc.sdk}.zip`,
				dest: `.cache/${gc.sdk}/`
			},
			unzip_002: {
				src: `.cache/ffmpeg.zip`,
				dest: `.cache/${gc.sdk}/`
			},
		},
		buildnw: {
			main: {}
		},
		innosetup: {
			main: {
				options: {
					gui: false,
					verbose: true,
				},
				script: __dirname + "/install.iss"
			}
		},
		jshint: {
			src: [
				'src/raffle/js/rafle.js'
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
				'install/',
				'prejscss/',
			],
			vk: [
				'build/vk_*',
				'build/vulkan*',
				'build/swiftshader',
				'build/locales/*.info'
			],
			lock: [
				'project/package-lock.json'
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
					"app_name": "<%= pkg.name %>",
					"main": "index.html",
					"name": "<%= pkg.name %>",
					"nodejs": true,
					"version": "<%= pkg.version %>",
					"winIco": "favicon.ico",
					"page-cache": false,
					"chromium-args": "--disk-cache-size=1 --media-cache-size=1",
					"webkit": {
						"plugin": true,
					},
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
					"zip": false,
					"devDependencies": {
						"component-emitter": "^1.3.0",
						"ffmpeg": "0.0.4",
						"file-saver": "^2.0.5",
						"jsmediatags": "^3.9.7",
						"mime": "^3.0.0",
						"nw-dialog": "^1.0.7",
						"rimraf": "^3.0.2",
						"underscore": "^1.13.2"
					}
				}
			}
		},
		webfont: {
			vars: {
				src: 'src/raffle/glyph/*.svg',
				dest: 'src/raffle/fonts',
				options: {
					engine: 'node',
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
					engine: 'node',
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
				dest: "project/assets/js/app.js"
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
		/*
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
		*/
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					//'tests/css/inc/app.css' : ['test/css/replace/app.css'],
					//'project/assets/css/app.css' : ['test/css/replace/app.css']
					'tests/css/inc/app.css' : ['prejscss/app.css'],
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
			},
			nwjs: {
				expand: true,
				cwd: `.cache/${gc.sdk}`,
				src: "**",
				dest: "build/"
			},
		},
	});
	grunt.registerTask('default',tasks.default);
};