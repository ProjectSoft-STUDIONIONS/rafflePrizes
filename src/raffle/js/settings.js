var gui = require('nw.gui');
var fs = require('fs');
var os = require('os');
var dlg = require('nw-dialog');
var mime = require("mime");
var underscore = require("underscore");
var userInfo = os.userInfo();

// styleSheetWriter
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

var defaultOptions = {
	type: false,
	backgroundImage: "assets/images/bg.jpg",
	backgroundPosition: 'center top',
	backgroundRepeat: 'no-repeat',
	backgroundAttachment: 'scroll',
	backgroundColor: "white",
	backgroundSize: "cover",
	color: "black",
	glass: {
		backgroundColor: "rgba(255,255,255,0.7)",
		blur: 20
	},
	hf: {
		backgroundColor: "#f50294",
		color: "#ffffff"
	}
};

var homedir = userInfo.homedir + '\\AppData\\Roaming\\RafflePrize',
	styleJson = homedir + '\\style.json',
	options = $.extend({}, defaultOptions),
	rafleing = false,
	load = false;

function setStyleOptions(content){
	styleSheetWriter.clear();
	var dataOpt = JSON.parse(content);
	if(dataOpt){
		options = $.extend({}, defaultOptions, dataOpt);
	}
	for (var name in options ){
		switch(name){
			case 'backgroundImage':
				var type = options.type != false ? "data:" + options.type + ";base64," : "";
				var url = "url('" + type + options[name] + "')";
				var $imgWrapper = $('.panel__wrapper .backgroundImage .img-wrapper');
				$('img#optionImage').attr({
					src: type + options[name]
				});
				styleSheetWriter.setRule('.main', 'background-image', url);
				var method = options.type ? 'addClass' : 'removeClass';
				$imgWrapper[method]('custom');
				break;
			case 'backgroundPosition':
				setSelectedVal($("#select-position"), options.backgroundPosition);
				styleSheetWriter.setRule('.main', 'background-position', options[name]);
				break;
			case 'backgroundRepeat':
				setSelectedVal($("#select-repeat"), options.backgroundRepeat);
				styleSheetWriter.setRule('.main', 'background-repeat', options[name]);
				break;
			case 'backgroundAttachment':
				setSelectedVal($("#select-attachment"), options.backgroundAttachment);
				styleSheetWriter.setRule('.main', 'background-attachment', options[name]);
				break;
			case 'backgroundSize':
				setSelectedVal($("#select-size"), options.backgroundSize);
				styleSheetWriter.setRule('.main', 'background-size', options[name]);
				break;
			case 'backgroundColor':
				styleSheetWriter.setRule('.main', 'background-color', options[name]);
				break;
			case 'color':
				styleSheetWriter.setRule('.main', 'color', options[name]);
				break;
			case 'glass':
				var glass = options.glass;
				for(var og in glass){
					switch(og){
						case 'backgroundColor':
							styleSheetWriter.setRule('.main .wrapper .block', 'background-color', glass[og]);
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
							styleSheetWriter.setRule('.main .header, .main .footer', 'color', hfo[hf]);
							if(!load)
								$('#hfTextColor').trigger("colorpickersliders.updateColor", hfo[hf]);
							break;
					}
				}
				break;
		}
	}
	saveStyleOptions();
	load = true;
}

function saveStyleOptions(){
	var saveOpt = $.extend({}, defaultOptions, options),
		data = new Uint8Array(Buffer.from(JSON.stringify(saveOpt, null, '\t')));
	fs.writeFile(styleJson, data, function(err){});
}

function base64_encode(file) {
	var bitmap = fs.readFileSync(file),
		buffer = (new Buffer(bitmap)).toString('base64');
	return buffer;
}

function readBodySettings() {
	fs.access(styleJson, fs.constants.F_OK, function(err){
		if (err) {
			// Файл не существует
			var jsn = JSON.stringify(defaultOptions, null, '\t'),
				data = new Uint8Array(Buffer.from(jsn));
			fs.writeFile(styleJson, data, function(err){});
			setStyleOptions(jsn);
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

$(document).ready(function(){
	dlg.setContext(document);
	$('.header .settings').on('click', function(e){
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
	$('.panel__settings .tab__panel li').on('click', function(e){
		e.preventDefault();
		$('.panel__settings .tab-container').scrollTop(0);
		$('.panel__settings .tab__panel li, .panel__settings .tab-container').removeClass('active');
		$(this).addClass('active');
		$($(this).data('trigger')).addClass('active');
		return !1;
	});
	$('button#select-image').on('click', function(e){
		dlg.openFileDialog(['.png', '.jpg'], function(result) {
			var mtype = mime.getType(result);
			switch(mtype){
				case 'image/jpeg':
				case 'image/png':
					var base64 = String(base64_encode(result));
					options.type = mtype;
					options.backgroundImage = base64;
					setStyleOptions(JSON.stringify(options, null, '\t'));
					break;
				default:
					alert('Данный формат файла не поддерживается.');
					break;
			}
		});
		return !1;
	});
	$("#select-position").on('input change', function(e){
		e.preventDefault();
		options.backgroundPosition = $(this).val();
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	$("#select-repeat").on('input change', function(e){
		e.preventDefault();
		options.backgroundRepeat = $(this).val();
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	$("#select-attachment").on('input change', function(e){
		e.preventDefault();
		options.backgroundAttachment = $(this).val();
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	$("#select-size").on('input change', function(e){
		e.preventDefault();
		options.backgroundSize = $(this).val();
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	$('#bloorColor').ColorPickerSliders({
		color: defaultOptions.glass.backgroundColor,
		swatches: false,
		sliders: false,
		hsvpanel: true,
		onchange: function(container, color) {
			options.glass.backgroundColor = color.tiny.toRgbString();
			setStyleOptions(JSON.stringify(options, null, '\t'));
		}
	});
	$('#hfBgColor').ColorPickerSliders({
		color: defaultOptions.hf.backgroundColor,
		swatches: false,
		sliders: false,
		hsvpanel: true,
		onchange: function(container, color) {
			options.hf.backgroundColor = color.tiny.toRgbString();
			setStyleOptions(JSON.stringify(options, null, '\t'));
		}
	});
	$('#hfTextColor').ColorPickerSliders({
		color: defaultOptions.hf.color,
		swatches: false,
		sliders: false,
		hsvpanel: true,
		onchange: function(container, color) {
			options.hf.color = color.tiny.toRgbString();
			setStyleOptions(JSON.stringify(options, null, '\t'));
		}
	});
	$('input#bloorBloor').on('input change', function(e){
		e.preventDefault();
		options.glass.blur = this.value;
		$("#bloor-step").text(parseFloat(this.value).toFixed(2)); 
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	$('#resetBg').on('click', function(e){
		e.preventDefault();
		options.backgroundImage = defaultOptions.backgroundImage;
		options.type = false;
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	$('#resetDefault').on('click', function(e){
		e.preventDefault();
		options = $.extend({}, defaultOptions);
		load = false;
		setStyleOptions(JSON.stringify(options, null, '\t'));
		return !1;
	});
	setTimeout(readBodySettings, 0);
});