module.exports = function(grunt){
	process.removeAllListeners('warning');
	require('dotenv').config();
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var gc = {},
		pkg = grunt.file.readJSON('package.json'),
		path = require('path'),
		uniqid = function () {
			let result = URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, '');
			return result;
		};
	function getTasks() {
		switch(process.env.GRUNT_TASK){
			default:
				return [
					'imagemin',
					'less',
					'cssmin',
					'pug'
				];
		}
	}
	grunt.initConfig({
		globalConfig : gc,
		pkg : pkg,
		imagemin: {
			base: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'page/images/*.{png,jpg,gif}'
						],
						dest: 'docs/images/',
						filter: 'isFile'
					}
				],
			}
		},
		less: {
			main: {
				options : {
					compress: false,
					ieCompat: false
				},
				files: {
					'test/css/main.css': [
						
						'page/less/main.less'
					],
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'docs/css/main.css' : [
						'test/css/main.css'
					],
				}
			}
		},
		pug: {
			files: {
				options: {
					pretty: '\t',
					separator:  '\n',
					// https://projectsoft-studionions.github.io/FontMassivePackInstaller/
					data: function(dest, src) {
						return {
							"hash": uniqid(),
							"repo": "projectsoft-studionions.github.io",
							"userName": "ProjectSoft-STUDIONIONS",
							"page": "rafflePrizes",
							"download": "RafflePrizesSetup.exe",
							"title": "Генератор розыгрыша призов | ProjectSoft GitHub Pages",
							"h1title": "Генератор розыгрыша призов",
							"description": "Приложение «Генератор розыгрыша призов» на Node Webkit JavaScript (nwjs).",
							"keywords": "ProjectSoft, STUDIONIONS, ProjectSoft-STUDIONIONS, Генератор розыгрыша призов",
							"nickname": "ProjectSoft",
							"logotype": "projectsoft.png",
							"copyright": "2008 - all right reserved",
							"open_graph": {
								"image_16x9": "rafflrprizes.png",
								"image_16x9_width": "1920",
								"image_16x9_height": "1050",
								"image_1x1": "rafflrprizes-400.png",
								"image_1x1_width": "400",
								"image_1x1_height": "219",
							}
						}
					}
				},
				files: {
					"docs/index.html": ['page/pug/index.pug'],
				}
			}
		},
	});
	grunt.registerTask('default', getTasks());
}