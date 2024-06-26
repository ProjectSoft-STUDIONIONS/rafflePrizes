module.exports = function(grunt) {
	const fs = require("fs");
	const path = require("path");
	
	

	grunt.registerMultiTask('version_edit', 'Version Update RafflePrizes', async function() {
		var done = this.async();
		const pkg = this.options().pkg;
		grunt.file.write("version.iss", `#define AppVersion "${pkg.version}"`);
		let versApp = grunt.file.readJSON('project/package.json');
		versApp.version = pkg.version;
		versApp.buildDate = grunt.template.date(new Date().getTime(), 'dd mmmm yyyy HH:ss:MM');
		versApp.comments = pkg.comments;
		versApp.description = pkg.description;
		let str = JSON.stringify(versApp, null, "\t");
		grunt.file.copy("LICENSE", "project/LICENSE");
		grunt.file.write("project/package.json", `${str}`);
		done();
	});
};