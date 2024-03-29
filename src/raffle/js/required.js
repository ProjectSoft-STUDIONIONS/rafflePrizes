const sdk = (nw.process.versions["nw-flavor"] == "sdk");
sdk &&  nw.Window.get().showDevTools();
nw.Window.get().maximize();

var gui = require('nw.gui'),
	fs = require('fs'),
	os = require('os'),
	rimraf = require('rimraf'),
	mime = require("mime"),
	ID3 = require("jsmediatags"),
	//dateFormat = require('dateformat'),
	path = require('path'),
	ffmpeg = require('ffmpeg'),
	
	dlg = require('nw-dialog'),
	_ = require("underscore"),
	Emiter = require("component-emitter"),
	helper = require("./module/helper"),
	AudioPlaylist = require("./module/audioplaylist"),
	uniqid = require("./module/uniqid"),
	defaultOptions = require("./module/options"),
	devices = require("./module/devices"),
	DiskStorage = require("./module/DiskStorage"),
	{ promisify } = require('util'),
	readFile = promisify(fs.readFile),
	readdirAsync = promisify(fs.readdir),
	unlinkAsync = promisify(fs.unlink),
	rmdirAsync = promisify(fs.rmdir),
	lstatAsync = promisify(fs.lstat),
	FileSaver = require('file-saver');