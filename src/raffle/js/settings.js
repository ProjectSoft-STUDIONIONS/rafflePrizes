/* jshint esversion: 7 */
/* jslint expr: true */

var mediaRecorder;
var audioChunks = [];
var isRecording = false;

window.userInfo = os.userInfo();
window.aus = null;
window.isLoop = false;
window.defTitle = "Генератор розыгрыша призов";
window.win = nw.Window.get();

window.styleSheetWriter = (
	function () {
		var selectorMap = {},
			supportsInsertRule;	
		return {
			getSheet: (function () {
				var sheet = false;
				return function () {
					if (!sheet) {
						var style = document.createElement("style");
						style.appendChild(document.createTextNode(""));
						//style.title = "bodysettings";
						document.head.appendChild(style);
						sheet = style.sheet;
						supportsInsertRule = (sheet.insertRule == undefined) ? false : true;
					}
					return sheet;
				};
			})(),
			setRule: function (selector, property, value) {
				var sheet = this.getSheet(),
					rules = sheet.rules || sheet.cssRules;
				property = property.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
				if (!selectorMap.hasOwnProperty(selector)){
					var index = rules.length;
					sheet.insertRule([selector, " {", property, ": ", value, ";}"].join(""), index);
					selectorMap[selector] = index;
				} else {
					rules[selectorMap[selector]].style.setProperty(property, value);
				}
			},
			clear: function(){
				var sheet = this.getSheet();
				if(sheet.rules.length){
					while(sheet.rules.length){
						sheet.deleteRule(0);
					}
				}
				selectorMap = [];
			}
		};
	}
)();

var home = userInfo.homedir + '/AppData/Roaming/RafflePrizes',
	notificationId = 'rafleprizes_projectsoft',
	homedir = home.replace(/\\/g, '/'),
	styleJson = homedir + '/style.json',
	soundsDir = homedir + '/user/sound',
	bgDir = homedir + '/user/background',
	tempDir = homedir + '/user/temp',
	options = $.extend({}, defaultOptions),
	rafleing = false,
	load = false;

fs.mkdirSync(soundsDir, {recursive : true});
fs.mkdirSync(bgDir, {recursive : true});
fs.mkdirSync(tempDir, {recursive : true});

function hideNotify(done) {
	chrome.notifications.clear(notificationId, function() {
		done && done();
	});
}

function showNotify(content, delay){
	hideNotify(function() {
		chrome.notifications.create(notificationId, {
			iconUrl: 'favicon.png',
			title: 'Генератор розыгрыша призов',
			type: "progress",//'basic',//'image'
			message: content,
			isClickable: true,
			priority: 2,
			progress: 0
		},
		function() {
			var progress = 0;
			var interval = setInterval(function() {
				if (++progress <= 100) {
					chrome.notifications.update(notificationId, {progress: progress}, function(updated) {
						if (!updated) {
							// the notification was closed
							clearInterval(interval);
						}
					});
				} else {
					chrome.notifications.clear(notificationId);
					clearInterval(interval);
				}
			}, (delay || 5000) / 100);
		});
	});
}

async function readBackgroundList(){
	await new Promise(function(resolve, reject){
		var list = _.values(defaultOptions.background.dest),
			objs = [];
		list.forEach(function(obj){
			objs.push(obj);
		});
		resolve(objs);
	});
}

function buildOptionsSoundList(source) {
	source = parseInt(source);
	var list = options.sounds.dest[source],
		index = 0;
	isPlay = false;
	aus.stop();
	aus.playlist = _.values(list);
	$("#sound_sources").empty();
	for(var ind in list){
		var $li = $("<li></li>").attr({
			'data-dest': source,
			'data-index': parseInt(ind)
		}).append(
			$('<div></div>').addClass('progress')
		).append(
			$('<span></span>').addClass('webicon-sortable btnsortable')
		).append(
			$('<span></span>').addClass('webicon-play btnspan')
		).append(
			$('<span></span>').addClass('source-title').text(list[ind].title)
		);
		if(source){
			$li.append(
				$('<span></span>').addClass('webicon-circle-close bthclose')
			);
		}
		$("#sound_sources").append($li);
	}
	$( "#sound_sources" ).sortable("refresh");
}

function setStyleOptions(content){
	styleSheetWriter.clear();
	var dataOpt = helper.unpack(content);
	if(dataOpt){
		options = $.extend({}, defaultOptions, dataOpt);
	}
	for (var name in options ){
		switch(name){
			case 'glass':
				var glass = options.glass;
				for(var og in glass){
					switch(og){
						case 'backgroundColor':
							styleSheetWriter.setRule('.main .wrapper .block', 'background-color', glass[og]);
							var color = tinycolor(glass[og]),
								cielch = $.fn.ColorPickerSliders.rgb2lch(color.toRgb()),
								css = cielch.l < 60 ? '#ffffff' : '#333333';
							styleSheetWriter.setRule('.main .wrapper .block', 'color', css);
							if(!load)
								$('#bloorColor').trigger("colorpickersliders.updateColor", glass[og]);
							break;
						case 'blur':
							$('section.wrapper .block').forestedGlass({
								target: '.main',
								blur: glass[og]
							});
							if(!load)
								$('input#bloorBloor').val(glass[og]);
							$("#bloor-step").text(parseFloat(glass[og]).toFixed(2)); 
							break;
					}
				}
				break;
			case "hf":
				var hfo = options.hf;
				for(var hf in hfo){
					switch(hf){
						case "backgroundColor":
							styleSheetWriter.setRule('.main .header, .main .footer', 'background-color', hfo[hf]);
							if(!load)
								$('#hfBgColor').trigger("colorpickersliders.updateColor", hfo[hf]);
							break;
						case "color":
							styleSheetWriter.setRule('.main .header, .main .footer, .main .header a, .main .footer a, .main .header a:hover, .main .footer a:hover, .main .header a:focus, .main .footer a:focus', 'color', hfo[hf]);
							//styleSheetWriter.setRule('.main .header, .main .footer', 'color', hfo[hf]);
							//styleSheetWriter.setRule('.main .header, .main .footer', 'color', hfo[hf]);
							if(!load)
								$('#hfTextColor').trigger("colorpickersliders.updateColor", hfo[hf]);
							break;
					}
				}
				break;
			case 'sounds':
				var sn = options.sounds;
				for(var sno in sn){
					switch(sno){
						case "playing":
							if(!load)
								$('input#playingSound').prop('checked', options.sounds.playing);
							break;
						case "source":
							options.sounds.source = parseInt(sn[sno]);
							if(!load){
								$('input.soundsCheck[value=' + options.sounds.source + ']').prop('checked', true);
							}
							
							$('.sound__sources .controls')[options.sounds.source ? 'removeClass' : 'addClass']('hidden');
							
							buildOptionsSoundList(options.sounds.source);
							break;
						case "dest":
							
							break;
					}
				}
				break;
			case "background":
				var index_bg = options.background.index,
					dest = _.values(options.background.dest),
					$listBg = $("#imagesAssets");
					if(!load){
						$listBg.empty();
						dest.forEach(function(element, index, array){
							if(!load){
								element.index = index;
								var $liBg = $("<li></li>").append(
									$("<span></span>", {
										class: 'image' + (index == array.length - 1 ? ' user' : ' application')
									}).append(
										$("<img />").attr({
											src: element.src
										}).data(element)
									)
								).append(
									$("<span></span>", {
										class: 'title'
									}).html(element.title)
								);
								if(element.url){
									$liBg.append(
										$("<span></span>", {
											class: 'link'
										}).append(
											$("<span></span>", {
												class: 'webicon-link'
											}).data({
												href: element.url
											})
										)
									)
								}
								if(index == array.length - 1){
									$liBg.append(
										$("<span></span>").append(
											$("<button></button>", {
												class: "selectBackgroundFile",
												text: "ВЫБРАТЬ"
											}).data(element)
										)
									);
								}
								$listBg.append($liBg);
							}
						});
					}
					var $allbgli = $("li", $listBg),
						$liopts = $allbgli.eq(index_bg),
						$img = $('img', $liopts),
						opt = $img.data();
					//console.log(opt);
					$("li", $listBg).removeClass('active');
					$liopts.addClass('active');
					$("#optionImage").attr({src: opt.src});
					
					styleSheetWriter.setRule('.main', 'background-image', 'url("' + opt.src + '")');
					
					setSelectedVal($("#select-position"), options.background.position);
					setSelectedVal($("#select-repeat"), options.background.repeat);
					setSelectedVal($("#select-attachment"), options.background.attachment);
					setSelectedVal($("#select-size"), options.background.size);
					
					styleSheetWriter.setRule('.main', 'background-position', options.background.position);
					styleSheetWriter.setRule('.main', 'background-repeat', options.background.repeat);
					styleSheetWriter.setRule('.main', 'background-attachment', options.background.attachment);
					styleSheetWriter.setRule('.main', 'background-size', options.background.size);
					styleSheetWriter.setRule('.main', 'background-color', options.background.color);
					styleSheetWriter.setRule('.main', 'color', options.background.textcolor);
					
				break;
			case "video":
				if(!load){
					$("#isOptimized").prop("checked", options.video.isOptimized);
				}
			case "print":
				if(!load){
					$('input#printDate').prop('checked', options.print.showDate);
					options.print.header = $.trim(options.print.header);
					options.print.footer = $.trim(options.print.footer);
					$("#printHeader").val(options.print.header);
					$("#printFooter").val(options.print.footer);
				}
				break;
		}
	}
	saveStyleOptions();
	load = true;
}

function saveStyleOptions(){
	var saveOpt = $.extend({}, defaultOptions, options),
		data = new Uint8Array(Buffer.from(helper.pack(saveOpt)));
	fs.writeFile(styleJson, data, function(err){
		$('body').removeClass('wait');
		$('#waitsettings .message').empty();
	});
}

function base64_encode(file) {
	var bitmap = fs.readFileSync(file),
		buffer = (new Buffer(bitmap)).toString('base64');
	return buffer;
}

async function fileTadRead(file, dest){
	var source = parseInt(dest) ? 1 : 0;
	return new Promise(function(resolve, reject){
		ID3.read(file, {
			onSuccess: function(tag){
				win.setProgressBar(2);
				var title,
					artist,
					fileInfo = path.parse(file);
				win.title = defTitle + "   Чтение файла " + fileInfo.base;
				if(tag.tags.title && tag.tags.title != ""){
					title = tag.tags.title;
					if(tag.tags.artist && tag.tags.artist != ""){
						title = title + " - " + tag.tags.artist;
					}
				}else{
					title = fileInfo.name;
				}
				obj = {
					title : title,
					name: fileInfo.name,
					src: file
				};
				if(source){
					var src = uniqid() + fileInfo.ext,
						new_file = soundsDir + "/" + src;
					obj.src = new_file;
					fs.copyFileSync(file, new_file);
				}
				resolve(obj);
			},
			onError: function(){
				reject(false);
			}
		});
	});
}



function readAppSounds(files, dest){
	var promises = [],
		source = parseInt(dest) ? 1 : 0;
	if(files.length > 5){
		win.title = defTitle + "   Чтение файла " + path.parse(files[1]).base;
		win.setProgressBar(2);
	}
	files.forEach(function(file, index){
		promises.push(fileTadRead(file, source));
	});
	return Promise.all(promises).then(function(val){
		var arr = _.values(options.sounds.dest[source]);
		Array.prototype.push.apply(arr, val);
		if(!source){
			defaultOptions.sounds.dest[source] = arr;
		}
		options.sounds.dest[source] = arr;
		$('#waitsettings .message').empty();
		win.title = defTitle;
		win.setProgressBar(0);
		setStyleOptions(helper.unpack(options));
	});
};

function readBodySettings() {
	$('body').addClass('wait');
	fs.mkdirSync(soundsDir, {recursive : true});
	fs.mkdirSync(bgDir, {recursive : true});
	
	fs.access(styleJson, fs.constants.F_OK, function(err){
		if (err) {
			// Файл не существует
			defaultOptions.sounds.dest[0] = [];
			defaultOptions.sounds.dest[1] = [];
			options.sounds.dest[0] = [];
			options.sounds.dest[1] = [];
			var sndFiles = fs.readdirSync('assets/user/sounds'),
				i = -1,
				files = [];
			for(var index in sndFiles){
				var file = "assets/user/sounds/" + sndFiles[index],
					mtype = mime.getType(file);
				if(mtype=="audio/mpeg"){
					files.push(file);
				}
			}
			readAppSounds(files, 0);
		} else {
			// Читаем настройки
			fs.readFile(styleJson, "utf8", function(err, content){
				
				setStyleOptions(content);
			});
		}
	});
}

function setSelectedVal(selector, value){
	var opt = $('option', selector).removeAttr('selected').filter('[value="' + value + '"]').attr('selected', true);
}

function sortablePlayList(e, ui){
	isPlay = false;
	aus.stop();
	var list = $(e.target),
		arr = [];
		ds = 0;
	$('li', list).each(function(a, b, c, d){
		var data = $(this).data();
		ds = data.dest;
		index = data.index;
		arr.push(options.sounds.dest[ds][index]);
		$(this).data({
			dest: ds,
			index: a
		}).attr({
			'data-dest': ds,
			'data-index': a
		});
		$('.btnspan', this).removeClass('webicon-pause').addClass('webicon-play');
	});
	//
	options.sounds.dest[ds] = arr;
	aus.playlist = options.sounds.dest[ds];
	if(arr.length){
		aus.index = 0;
	}
	aus.index = -1;
	saveStyleOptions();
}

$(document).ready(function(){
	var G = nw.global.parent.frames.__nw_windows;
	aus = new AudioPlaylist();
	aus.stream = 'sounds/0001.mp3';
	aus.volume = 0.5;
	aus.addEventListener('statechange', function(e){
		var li = $("#sound_sources li").filter(function(i){
			var data = parseInt(e.index),
				index = $(this).data('index');
			return (index == data);
		});
		
		if(e.msg){
			//console.log(e);
		}
		switch(e.audioev){
			case 'play':
				win.setAlwaysOnTop(true);
				win.title = defTitle;
				win.setProgressBar(2);
				$("#sound_sources .progress").css({width: '0px'});
				$('.btnspan', li).removeClass('webicon-play').addClass('webicon-pause');
				$("#sound_sources li").removeClass('playing');
				li.addClass('playing');
				break;
			case 'stop':
				win.title = defTitle;
				
				setTimeout(function(){win.setAlwaysOnTop(false);win.setProgressBar(0);}, 1000);
				$("#sound_sources li").removeClass('playing');
				$('#sound_sources .btnspan').removeClass('webicon-pause').addClass('webicon-play');
				$("#sound_sources .progress").css({width: '0px'});
				if(isLoop && e.e.type == 'ended'){
					var i = aus.index,
						l = aus.playlist.length,
						tmp = i + 1;
					if(l == 0){
						isLoop = false;
						aus.index = -1;
						return;
					}
					if(tmp == l){
						tmp = 0;
					}
					aus.index = tmp;
					aus.index = tmp;
					setTimeout(function(){
						aus.play();
					}, 100);
				}
				setTimeout(function(){
					$("#sound_sources li").removeClass('playing');
					$("#sound_sources .progress").css({width: '0px'});
				}, 400);
				break;
			case 'progress':
				var wi = parseFloat(e.progress / 100);
				$('.progress', li).css({
					width: parseInt(e.progress) + '%'
				});
				
				(wi) ? (win.setProgressBar(wi)) : (win.setProgressBar(0));
				
				if(!li.hasClass('playing')) li.addClass('playing');
				var nn = isNaN(e.duration);
				var ttl = "";
				if(options.sounds.dest[options.sounds.source][aus.index]){
					ttl = options.sounds.dest[options.sounds.source][aus.index].title;
				}
				if(!nn){
					var nt = helper.secondsFormat(e.time),
						nd = helper.secondsFormat(e.duration);
					win.title = defTitle + ' - (' + ttl + ' --- ' + nt + ' / ' + nd + ')';
					win.setAlwaysOnTop(true);
				}else{
					win.title = defTitle;
					win.setAlwaysOnTop(false);
				}
				break;
		}
	});
	dlg.setContext(document);
	// Open / Close Panel Settings
	$('.header .webicon-settings').on('click', function(e){
		e.preventDefault();
		if(!rafleing){
			$('body').toggleClass('opensettings');
		}
		$('.panel__settings .tab-container').scrollTop(0);
		return !1;
	});
	$('.panel__settings .close').on('click', function(e){
		e.preventDefault();
		if(!rafleing){
			$('body').toggleClass('opensettings');
		}else{
			$('body').removeClass('opensettings');
		}
		return !1;
	});
	// Tabs panel UI
	$('.panel__settings .tab__panel li').on('click', function(e){
		e.preventDefault();
		$('.panel__settings .tab-container').scrollTop(0);
		$('.panel__settings .tab__panel li, .panel__settings .tab-container').removeClass('active');
		$(this).addClass('active');
		$($(this).data('trigger')).addClass('active');
		return !1;
	});
	
	// Background Setting
	$("#select-position").on('input change', function(e){
		e.preventDefault();
		options.background.position = $(this).val();
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$("#select-repeat").on('input change', function(e){
		e.preventDefault();
		options.background.repeat = $(this).val();
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$("#select-attachment").on('input change', function(e){
		e.preventDefault();
		options.background.attachment = $(this).val();
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$("#select-size").on('input change', function(e){
		e.preventDefault();
		options.background.size = $(this).val();
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$('#bloorColor').ColorPickerSliders({
		color: defaultOptions.glass.backgroundColor,
		swatches: false,
		sliders: false,
		hsvpanel: true,
		onchange: function(container, color) {
			options.glass.backgroundColor = color.tiny.toRgbString();
			setStyleOptions(helper.pack(options));
		}
	});
	$('#hfBgColor').ColorPickerSliders({
		color: defaultOptions.hf.backgroundColor,
		swatches: false,
		sliders: false,
		hsvpanel: true,
		onchange: function(container, color) {
			options.hf.backgroundColor = color.tiny.toRgbString();
			setStyleOptions(helper.pack(options));
		}
	});
	$('#hfTextColor').ColorPickerSliders({
		color: defaultOptions.hf.color,
		swatches: false,
		sliders: false,
		hsvpanel: true,
		onchange: function(container, color) {
			options.hf.color = color.tiny.toRgbString();
			setStyleOptions(helper.pack(options));
		}
	});
	$('input#bloorBloor').on('input change', function(e){
		e.preventDefault();
		options.glass.blur = parseFloat(this.value);
		$("#bloor-step").text(options.glass.blur.toFixed(2)); 
		setStyleOptions(helper.pack(options));
		return !1;
	});
	
	$("#imagesAssets").on('click', 'img', function(e){
		var data = $(this).data();
		options.background.index = data.index;
		setStyleOptions(helper.pack(options));
	}).on('click', '.selectBackgroundFile', function(e){
		var $this = $(this),
			data = $this.data(),
			index = data.index,
			$li = $("#imagesAssets li").eq(index),
			$image = $("img", $li);
		dlg.openFileDialog(['.png', '.jpg'], false, function(result) {
			var mtype = mime.getType(result);
			switch(mtype){
				case 'image/jpeg':
				case 'image/png':
					$('body').addClass('wait');
					rimraf(bgDir, function(){
						setTimeout(function(){
							var fileInfo = path.parse(result),
								exfile = fileInfo.ext,
								new_name = uniqid(),
							new_file = bgDir + "/" + new_name + exfile,
							src = 'file:///' + new_file;
							fs.mkdirSync(bgDir, {recursive : true});
							fs.copyFileSync(result, new_file);
							if(fs.existsSync(new_file)){
								//options.type = true;
								options.background.index = index;
								options.background.dest[index].src = src;
								$this.data('src', src);
								$image.data('src', src).attr('src', src);
								//console.log($this.data(), src);
								setStyleOptions(helper.pack(options));
							}
						}, 250);
					});
					break;
				default:
					win.setProgressBar(0);	
					//alert('Данный формат файла не поддерживается.');
					break;
			}
		});
	}).on('click', '.webicon-link', function(e){
		e.preventDefault();
		nw.Shell.openExternal($(this).data().href);
		return !1;
	});
	
	// Print
	$("#print").on('click', function(e){
		e.preventDefault();
		window.print();
		return !1;
	});
	
	// Sounds
	$( "#sound_sources" ).sortable({
		delay:0,
		tolerance: 'pointer', 
		containment: 'parent', 
		axis:'y',
		cursor: 'row-resize', 
		distance: 20, 
		stop: sortablePlayList
	});
	$('input#playingSound').on('input change', function(e){
		e.preventDefault();
		var val = $(this).val();
		options.sounds.playing = $(this).is(":checked");
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$('input.soundsCheck').on('input change', function(e){
		e.preventDefault();
		var val = $(this).val();
		options.sounds.source = val;
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$('#addSounds').on('click', function(e){
		e.preventDefault();
		dlg.openFileDialog(['.mp3'], true, function(result) {
			//console.log(result.split(";"));
			$('body').addClass('wait');
			var files = result.split(";");
			if(files.length){
				win.setProgressBar(2);
			}
			readAppSounds(files, 1);
		});
		return !1;
	});
	$("#removeSounds").on('click', function(e){
		e.preventDefault();
		isPlay = false;
		aus.stop();
		win.setAlwaysOnTop(false);
		$('body').addClass('wait');
		defaultOptions.sounds.dest[1] = [];
		options.sounds.dest[1] = [];
		rimraf(soundsDir, function(){
			aus.playlist = defaultOptions.sounds.dest[1];
			aus.index = -1;
			
			setTimeout(function(){
				fs.mkdirSync(soundsDir, {recursive : true});
				setStyleOptions(helper.pack(options));
				win.setAlwaysOnTop(false);
				$('body').removeClass('wait');
			}, 1000);
		});
		
		return !1;
	});
	$("#sound_sources").on('click', 'li .bthclose', function(e){
		//e.preventDefault();
		if(options.sounds.source){
			var $parent = $(e.target).parent(),
				index = $parent.data('index');
			var arr = _.values(options.sounds.dest[1]);
			var data = arr[index];
			isPlay = false;
			aus.stop();
			aus.index = -1;
			if(fs.existsSync(data.src)){
				fs.unlinkSync(data.src);
			}
			arr.splice(index, 1);
			options.sounds.dest[1] = Object.assign({}, arr);
			aus.playlist = arr;
			setStyleOptions(helper.pack(options));
		}
		//return !1;
	}).on('click', ".btnspan", function(e){
		//e.preventDefault();
		var $this = $(e.target),
			$parent = $this.parent(),
			data = $parent.data(),
			is_play = aus.isPlaying();
		isLoop = false;
		$("#sound_sources .btnspan").removeClass('webicon-pause').addClass('webicon-play');
		if(is_play){
			aus.stop();
		}
		win.title = defTitle;
		win.setProgressBar(0);
		win.setAlwaysOnTop(false);
		if(aus.index != data.index){
			aus.index = data.index;
			isLoop = true;
			aus.play();
			win.setAlwaysOnTop(true);
		}else{
			if(!is_play){
				isLoop = true;
				aus.play();
				win.setAlwaysOnTop(true);
			}
		}
		$("#sound_sources .progress").css({width: '0px'});
	});
	
	// Print
	$('input#printDate').on('input change', function(e){
		e.preventDefault();
		var val = $(this).val();
		options.print.showDate = $(this).is(":checked");
		setStyleOptions(helper.pack(options));
		return !1;
	});
	$("#printHeader").on("blur", function(e){
		var val = $.trim($(this).val());
		options.print.header = val;
		setStyleOptions(helper.pack(options));
	});
	$("#printFooter").on("blur", function(e){
		var val = $.trim($(this).val());
		options.print.footer = val;
		setStyleOptions(helper.pack(options));
	});
	
	// Reset Options;
	$('#resetDefault').on('click', function(e){
		showNotify('Все Настройки сброшены', 1200);
		$('body').addClass('wait');
		e.preventDefault();
		
		isPlay = false;
		aus.stop();
		win.setAlwaysOnTop(false);
		
		rimraf(homedir + '/user', function(){
			defaultOptions.sounds.dest[1] = [];
			defaultOptions.sounds.dest[0] = [];
			options = $.extend({}, defaultOptions);
			fs.unlinkSync(styleJson);
			aus.playlist = defaultOptions.sounds.dest[0];
			aus.index = -1;
			options = $.extend({}, defaultOptions);
			load = false;
			readBodySettings();
			setTimeout(function(){
				setStyleOptions(helper.pack(options));
				win.setAlwaysOnTop(false);
				$('body').removeClass('wait');
			}, 200);
		});
		return !1;
	});
	
	$('#recordBtn').on('click', function(e){
		e.preventDefault();
		if(mediaRecorder){
			stopRecordScreen();
			if(window.win.isKioskMode)
				window.win.leaveKioskMode();
		}else{
			if(!window.win.isKioskMode)
				window.win.enterKioskMode()
			startRecordScreen();
		}
		return !1;
	});
	$("#isOptimized").on('change', function(e){
		e.preventDefault();
		options.video.isOptimized = $(this).is(":checked");
		setStyleOptions(helper.pack(options));
		return !1;
	});
	setTimeout(readBodySettings, 2000);
	getVideoList();
	/*$("#video_files").on('click', 'li', function(e){
		var $this = $(e.target),
			item = $this.data();
		DiskStorage.Fetch(item.name, function(file) {
			onGettingFile(file, item);
		});
	});*/
	//gui.Window.get().showDevTools();
	
});

	// Video
function onGettingFile(file, item){
	//var fname = item.name;
	/*FileSaver.saveAs(file);*/
	$('#videoPlayer').prop('src', file.path);
}

function getVideoList(){
	DiskStorage.GetFilesList(function(list) {
		$("#video_files").empty();
		 if (!list.length) {
			 return;
		 }
		 list.forEach(function(item){
			 console.log(list);
			 var $li = $(document.createElement('li')),
				btnPlay = $('<button></button>', {
					class: 'btn webicon-download'
				}).data(item),
				btnRemove = $('<button></button>', {
					class: 'btn webicon-clear'
				}).data(item),
				spanText = $('<span></span>', {
					text: item.display
				});
			 $li.append(btnPlay).append(spanText).append(btnRemove);
			 btnRemove.on('click', function(e){
				 e.preventDefault();
				 removeDiskFile($(this).data());
				 return !1;
			 });
			 btnPlay.on('click', function(e){
				 e.preventDefault();
				 var data = $(this).data();
				 DiskStorage.Fetch(data.name, function(file) {
					 FileSaver.saveAs(file, data.name);
					$('#videoPlayer').prop('src');
				});
				 return !1;
			 });
			 $("#video_files").prepend($li.data(item));
		 });
	});
}

// Record
function startRecordScreen(){
	if(isRecording){
		return false;
	}else{
		chrome.desktopCapture.chooseDesktopMedia(['screen', 'audio'], onAccessApproved);
	}
}

function stopRecordScreen(){
	if(isRecording) {
		mediaRecorder.stop();
	}
}

function onAccessApproved(chromeMediaSourceId, opts){
	constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId,
				maxWidth: 1920,
				maxHeight: 1080,
				minWidth: 1920,
				minHeight: 1080,
				/*
				maxWidth: window.screen.availWidth,
				maxHeight: window.screen.availHeight,
				minWidth: window.screen.availWidth,
				minHeight: window.screen.availHeight,
				*/
				maxFrameRate: 30
            },
            optional: []
        }
    }
	if (opts.canRequestAudioTrack === true) {
		constraints.audio = {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: chromeMediaSourceId,
				echoCancellation: true
			},
            optional: []
		};
	}
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
		$('#recordBtn').removeClass('webicon-play').addClass('webicon-pause');
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.addEventListener("dataavailable",function(event) {
			audioChunks.push(event.data);
			mediaRecorder.addEventListener("stop", function() {
				$('#recordBtn').removeClass('webicon-pause').addClass('webicon-play');
				var type = MediaRecorder.isTypeSupported('video/webm\;codecs=h264') ? 'video/mp4' : 'video/webm',
					blob = new Blob(audioChunks, {
						type: type
					}),
					now = new Date(),
					fname = dateFormat(now, 'Розыгрыш призов от dd-mm-yyyy HH-MM-ss') + '.mp4',
					tempFname = tempDir + '/' + dateFormat(now, 'dd-mm-yyyy_HH-MM-ss') +  + '.mp4';
					
					if(options.video.isOptimized){
						var reader = new FileReader();
						reader.addEventListener('loadend', function(){
							var buffer = Buffer.from(reader.result);
							var tmp = fs.writeFile(tempFname, buffer, function(err){
								if (err) throw err;
								$('body').addClass('wait');
								win.setProgressBar(2);
								$('#waitsettings .message').html('Обработка и сохранение видео...<br>Пожалуйста подождите.<br>Заварите кофе, уделите время семье :-))<br><br>Это реально долгий прцесс...<br>Возможно подвисание системы!')
								var process = new ffmpeg(tempFname);
								process.then(function (video) {
									video
									.save(tempFname +'.mp4', function (error, file) {
										fs.unlinkSync(tempFname);
										if (!error){
											console.log('Video file: ' + file);
											saveDiskFIle(file, fname);
										}else {
											console.log(error);
											isRecording = false;
										}
										$('body').removeClass('wait');
										$('#waitsettings .message').empty();
										win.setProgressBar(0);
									});
								}).catch(function(error){
									console.log(error);
									$('body').removeClass('wait');
									$('#waitsettings .message').empty();
									fs.unlinkSync(tempFname);
									fs.unlinkSync(tempFname + '.mp4');
									win.setProgressBar(0);
									isRecording = false;
								});
							});
						}, false);
						reader.readAsArrayBuffer(blob);
					}else{
						var file = new File([blob], fname, {
							type: type
						});
						DiskStorage.StoreFile(file, function(){
							getVideoList();
							isRecording = false;
						});
					}
				audioChunks = [];
				mediaRecorder = null;
			});
		});
		mediaRecorder.start();
		isRecording = true;
	});
	return !1;
}

function saveDiskFIle(path, name){
	fs.readFile(path, function(err, data){
		if(err){
			fs.unlinkSync(path);
			console.log(err);
			getVideoList();
			isRecording = false;
			return;
		}
		var type = mime.getType(path),
			readBlob = new Blob([data], {
				type: type,
			}),
			file = new File([readBlob], name, {
				type: type,
			});
			DiskStorage.StoreFile(file, function(){
				getVideoList();
			});
		fs.unlinkSync(path);
		isRecording = false;
	});
}

function removeDiskFile(item){
	DiskStorage.RemoveFile(item.display, function(){
		getVideoList();
	});
}

var shortRecord = {
	key : "Ctrl+Shift+PrintScreen",
	active : function() {
		if(isRecording){
			stopRecordScreen();
		}else{
			startRecordScreen();
		}
	},
	failed : function(msg) {
		console.log(msg);
	}
};
nw.App.registerGlobalHotKey(new nw.Shortcut(shortRecord));
nw.App.clearCache();
//require('nw.gui').Window.get().showDevTools();