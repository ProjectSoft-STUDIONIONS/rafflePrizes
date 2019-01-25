Array.prototype.shuffle = function( b ){
	var newArr=[],
		arr = Object.assign([], this),
		count=arr.length,
		i=null,
		rnd=null;
	for (i=0; i<count; i++) {
		rnd=~~(Math.random() * arr.length);
		newArr.push(arr[rnd]);
		arr.splice(rnd,1);
	}
	Object.assign(this, newArr);
	return this;
};

;(function(window, document, $, undefined){
	
	var i18n = {
			'ru-ru': {
				'ALERT_ERROR': '<span class="error">ОШИБКА!!!</span>',
				'ERROR_MIN_NUMBER': 'Сначало удалите приз.',
				'ALERT_SUCCESS': '<span class="success">Призовой фонд разыгран!!!</span>',
				'SUCCESS_LOTERY': 'Поздравляем!<br>Все призы разыграны.',
				'NOT_PRIZES': 'Нет призов для розыгрыша!',
				'PRIZES_NUM_ERROR': 'Призов для розыгрыша больше, чем участвующих номеров!',
				'PAGE_TITLE': 'Генератор розыгрыша призов',
				'H1_TITLE': 'РОЗЫГРЫШ ПРИЗОВ',
				'PLAYED_TITLE': 'Разыгрываемые призы',
				'PLAYED_RESULT': 'Результат розыгрыша призов',
				'NUMBER_TITLE':	'Количество разыгрываемых номеров',
				'BTN_RAFFLE_TITLE': 'Разыграть призы',
				'BTN_ADD_TITLE': 'Добавить приз',
				'BTN_EDIT_TITLE': 'Редактировать приз',
				'BTN_DELETE_TITLE': 'Удалить приз',
				'BTN_CLEAR_TITLE': 'Удалить все призы',
				'BTN_PRIZERAFLE_TITLE': 'Перемешать призы',
				'NOT_SELECT_FILE': 'Файл не выбран',
				'BTN_SUBMIT': 'Применить',
				'BTN_CANCEL': 'Отмена',
				'NAME_LABEL': 'Название',
				'PHOTO_LABEL': 'Фотография',
				'PREVIEW_LABEL': 'Предпросмотр',
				'ADD_LABEL': 'Добавить',
				'MODAL_TITLE':'Добавить приз',
				'SELECT_FILE': 'Выбрать Файл',
				'NOT_ADD': 'Вы не можете добавить приз.\nПризов больше чем номеров',
				'NOT_NAME': 'Вы не ввели название приза',
				'WON_NUMBER': 'Выиграл номер',
				'ALERT_DEL_PRIZE': 'Сначало удалите приз',
				'END_RAFFLE': 'Все призы разыграны!',
				'NEW_RAFFLE': 'Новый розыгрыш призов',
				'PRINT': 'Распечатать',
				'month0': 'Января',
				'month1': 'Февраля',
				'month2': 'Марта',
				'month3': 'Апреля',
				'month4': 'Мая',
				'month5': 'Июня',
				'month6': 'Июля',
				'month7': 'Августа',
				'month8': 'Сентября',
				'month9': 'Октября',
				'month10': 'Ноября',
				'month11': 'Декабря'
			}
		},
		userLang = 'ru-ru',//($.cookie('lang') || navigator.language || navigator.userLanguage).toLowerCase(),
		_lang = i18n[userLang] ? userLang : 'ru-ru',
		_raffleing = false,
		_array = [],
		_loop;
	if(!$){
		return;
	}
	
	Raffle = function(element){
		
		var self = this;
		
		Object.defineProperties(self, {
			lang: {
				get: function() {
					return _lang;
				},
				set: function(value){
					_lang = value;
					//tray.title = i18n[_lang].PAGE_TITLE;
					//tray.tooltip = i18n[_lang].PAGE_TITLE + "\n" + "ProjectSoft © 2018";
					$('[data-i18n]', document).each(function(){
						if(typeof i18n[value] == 'object'){
							_lang = value;
							$.cookie('lang', _lang, { expires: 360, path: '/' });
							var $this = $(this),
								TEXT = i18n[_lang][$this.data('i18n')];
							if(TEXT){
								$this.html(TEXT);
							}
						}
					});
					$('[data-i18n-title]', document).each(function(){
						if(typeof i18n[value] == 'object'){
							_lang = value;
							$.cookie('lang', _lang, { expires: 360, path: '/' });
							var $this = $(this),
								TEXT = i18n[_lang][$this.data('i18n-title')],
								text = $("<div></div>").html(TEXT).text();
							
							if(text){
								$this.attr({
									'data-tooltips-title': text,
									'data-original-title': text
								}).removeAttr('title');
							}
						}
					});
					$('[data-i18n-file]', document).each(function(){
						if(typeof i18n[value] == 'object'){
							_lang = value;
							$.cookie('lang', _lang, { expires: 360, path: '/' });
							var $this = $(this),
								TEXT = i18n[_lang][$this.data('i18n-file')],
								BTNTEXT = i18n[_lang][$this.data('i18n-file-title')],
								text = $("<div></div>").html(TEXT).text(),
								btntext = $("<div></div>").html(BTNTEXT).text();
							if(TEXT){
								$this.attr({
									'data-file': text,
									'data-file-title': btntext
								});
							}
						}
					});
					$("#langs > li > a[data-lang]").removeClass('active');
					$("#langs > li > a[data-lang="+_lang+"]").addClass('active');
					/*$('[data-tooltips-title]').tooltip(
						{
							trigger: 'hover',
							title: function(){
								return $(this).attr('data-tooltips-title');
							},
							container: 'body'
						}
					).removeAttr('title');*/
					//clearTimeout(self.datetime);
					self.date();
				}
			},
			raffleing: {
				get: function(){
					return _raffleing;
				},
				set: function(value){
					if(typeof value == 'boolean'){
						_raffleing = value;
					}else if(Object.prototype.toString.call(value) ==='[object Number]'){
						_raffleing = (value > 0);
					}
				}
			},
			array: {
				get: function(){
					if(Object.prototype.toString.call(_array)==='[object Array]'){
						return _array;
					}else{
						_array = [];
					}
					return _array;
				},
				set: function(value){
					if(Object.prototype.toString.call(value)==='[object Array]'){
						_array = value;
					}
				}
			},
			block: {
				get: function(){
					return $('#loto', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			prizes: {
				get: function(){
					return $('#prizes', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			result: {
				get: function(){
					return $('#result', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			btnraffle: {
				get: function(){
					return $('#btnraffle', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			btnstitch: {
				get: function(){
					return $('#btnstitch', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			btnclear: {
				get: function(){
					return $('#btnclear', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			btnadd: {
				get: function(){
					return $('#btnadd', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			btnexport: {
				get: function(){
					return $('#btnexport', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			btnimport: {
				get: function(){
					return $('#btnimport', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			sizenum: {
				get: function(){
					return $('#sizenum', this.element);
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			},
			addprize: {
				get: function(){
					return $("#artic-template .addprize").clone();
				},
				set: function(value){
					throw new Error('Нельзя установить данное значение!');
				}
			}
		});
		self.element = element;
		self.datetime = null;
		self.artmodal = null;
		self.alertmodal = null;
		self.artedit = null;
		
		self.countloop = 70;
		self.raffle = 0;
		self.raffleing = false;
		self.rafflestart = false;
		self.rafdef = 0;
		
		self.lang = _lang;
		self
			.init()
			.build(self.sizenum.val())
			.date();
		return self;
	};
	$.extend(Raffle.prototype, {
		init: function(){
			var self = this;
			$(document).on('click', "#langs > li > a[data-lang]", function(e){
				e.preventDefault();
				$("#langs > li > a[data-lang]").removeClass('active');
				self.lang = $(this).data('lang');
				return !1;
			});
			$(document).on('click', '.ok-button', function(e){
				e.preventDefault();
				
				if(self.alertmodal){
					self.alertmodal.arcticmodal('close');
				}else{
					$.arcticmodal('close');
				}
				return !1;
			});
			$(document).on('click', 'button.cancel-button', function(e){
				e.preventDefault();
				$.arcticmodal('close');
				return !1;
			});
			$(self.sizenum).on("input change", function(e){
				//console.log(e.type);
				var $this = $(this),
					val = parseInt($this.val()),
					childs = self.prizes.children();
				val = val ? val : 1;
				$this.val(val);
				if(val < childs.length){
					$this.val(childs.length);
					self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, i18n[self.lang].ALERT_DEL_PRIZE]);
					return !1;
				}
				self.build(val);
			});
			$(self.btnadd).bind('click', function(e){
				e.preventDefault();
				self.add();
				return !1;
			});
			$(self.btnclear).on('click', function(e){
				e.preventDefault();
				self.clear();
				return !1;
			});
			$(self.btnstitch).on('click', function(e){
				e.preventDefault();
				$(self.btnstitch).addClass('active');
				var len = 50,
					loop = 0,
					stitch = function(){
						clearTimeout(interval);
						if(!self.raffleing){
							var childs = self.prizes.children(),
								arr = [].shuffle.call(childs);
							arr.each(function(){
								self.prizes.append(this);
							});
							if(loop < len){
								++loop;
								interval = setTimeout(stitch, 25);
							}else{
								$(self.btnstitch).removeClass('active');
							}
						} else {
							$(self.btnstitch).removeClass('active');
						}
					},
					interval = setTimeout(stitch, 25);
				return !1;
			});
			self.btnraffle.on('click', function(e){
				$('.tooltip').remove();
				e.preventDefault();
				self.prizes.sortable("option", "disabled", true);
				self.start();
				return !1;
			});
			self.btnexport.on('click', self.export.bind(self));
			self.btnimport.on('click', self.import.bind(self));
			self.prizes.sortable({
				axis: 'y',
				stop: function(e, u){
					self.prizes.children().each(function(){
						$(this).removeAttr('style');
					});
				},
				cursor: 'n-resize',
				handle: '.handle'
			});//.sortable( "refresh" );
			$('.git a').unbind('click');
			
			/*$('[data-tooltips-title]').tooltip(
				{
					trigger: 'hover',
					title: function(){
						return $(this).attr('data-tooltips-title');
					}
				}
			);*/
			/*
			$('.help > a').tooltip(
				{
					html: true,
					placement: 'bottom',
					container: '.help',
					trigger: 'click'
				}
			);
			*/
			if(typeof MutationObserver == 'function'){
				var $prz = self.prizes,
					$btc = self.btnclear,
					$titleresult = $(".resultraffle h2"),
					observer,
					result,
					config = {
						childList: true,
						characterData: true,
						subtree: true,
						characterDataOldValue: true
					},
					callbackPrize = function(mutationsList) {
						var $childs = self.prizes.children(),
							len = $childs.length;
						if(len){
							if(self.btnclear[0].disabled){
								self.btnclear.removeAttr("disabled");
								self.btnstitch.removeAttr("disabled");
							}
							
						}else{
							if(!self.btnclear[0].disabled){
								self.btnclear.attr("disabled", "disabled");
								self.btnstitch.attr("disabled", "disabled");
							}
						}
						
						if(!self.prizes.children().length){
							self.btnraffle.attr({disabled: 'disabled'}).removeClass('active');
						}else{
							if(!self.raffleing){
								self.btnraffle.removeAttr('disabled');
							}else{
								self.btnraffle.tooltip('destroy');
							}
						}
						
						if(self.raffleing){
							$($btc).attr("disabled", "disabled");
							self.btnstitch.attr("disabled", "disabled");
						}
						
						
						
						if(self.prizes.children().length < self.block.children().length && self.prizes.children().length >= 0){
							self.btnadd.removeAttr('disabled');
						}else{
							self.btnadd.attr('disabled', 'disabled');
						}
						
						var $childsres = self.result.children(),
							lens = $childsres.length;
						if(lens){
							if($titleresult.hasClass('hidden')) {
								$titleresult.removeClass('hidden');
							}
						}else{
							if(!$titleresult.hasClass('hidden')) {
								$titleresult.addClass('hidden');
							}
						}
					};
				observer = new MutationObserver(callbackPrize);
				observer.observe(self.element, config);
				$($prz).text("GO").empty();
				self.result.text("GO").empty();
				
			}
			$(window).data({
				selfrafle: self
			});
			$(window).on('keydown', self.keycommand);
			
			return self;
		},
		keycommand: function(e){
			var self = $(window).data('selfrafle');
			if(self){
				if(self.alertmodal){
					if(e.keyCode != 13){
						return;
					}else{
						self.alertmodal.arcticmodal("close");
						e.preventDefault();
						return !1;
					}
				}
				if(self.raffleing || self.rafflestart){
					return;
				}
			}else{
				return;
			}
			if(e.altKey && e.ctrlKey && e.keyCode != 18 && e.keyCode != 17){
				var val = self.sizenum.val();
				switch(e.keyCode){
					// Ctrl + Alt + A (65)
					case 65:
						self.btnadd.trigger('click');
						break;
					// Ctrl + Alt + Down
					case 40:
						//if(!self.sizenum.is(':focus')){
							--val;
							self.sizenum.val(val).trigger('change');
						//}
						break;
					// Ctrl + Alt + Up
					case 38:
						if(!self.sizenum.is(':focus')){
							++val;
							self.sizenum.val(val).trigger('change');
						}
						break;
					// Ctrl + Alt + E - Export
					case 69:
						//self.export();
						break;
					// Ctrl + Alt + I - Import
					case 73:
						//self.import();
						break;
					// Ctrl + Alt + P - Import
					case 80:
						
						break;
				}
			}
			var fscr = false;
			if(e.keyCode==122){
				fscr = win.isFullscreen;
				win.toggleFullscreen();
				
			}
			if(e.keyCode==27){
				fscr = win.isFullscreen;
				win.toggleFullscreen();
				
			}
		},
		alert: function(title, content){
			var c = $(
				'<div class="box-modal reload-modal text-center alert-modal">' + 
					'<div class="reload-modal-wrapper">' + 
						'<h2 class="text-center">' + title + '</h2>' + 
						'<p class="text-center">' + content + '</p>' + 
					'</div>' + 
					'<button class="ok-button">OK</button>' + 
				'</div>'
				),
				self = this;
				//c.prepend('<div class="box-modal_close arcticmodal-close rf-remove"></div>');
			$.arcticmodal({
				content: c,
				closeOnOverlayClick: false,
				closeOnEsc: false,
				beforeOpen: function(d, f){
					self.sizenum.blur();
					if(self.alertmodal){
						self.alertmodal.arcticmodal("close");
					}
					self.alertmodal = f;
					if(self.artmodal){
						$('input, button', self.artmodal).attr({
							disabled: 'disabled'
						});
					}
				},
				afterClose: function(d, f){
					self.alertmodal = null;
					if(self.artmodal){
						$('input, button', self.artmodal).removeAttr('disabled');
						self.setFocus();
					}
				}
			});
			return self;
		},
		loopraffle: function() {
			//_loop;
			var self = this,
				r, t, n,
				childs = self.prizes.children(),
				len = childs.length;
			clearTimeout(_loop);
			$("span[data-number]", self.block).removeClass('pre-active');
			if(!self.btnraffle.hasClass('active'))
				self.btnraffle.addClass('active');
			++self.raffle;
			if(len){
				if(self.raffle < self.countloop){
					self.array.shuffle();
					r = self.array.length-1;
					t = Math.round((Math.random() * r + r)- r);
					n = self.array[t];
					$("span[data-number='"+n+"']", self.block).addClass('pre-active');
					_loop = setTimeout(self.loopraffle.bind(self), 60);
				}else{
					self.raffle = 0;
					r = self.array.length-1;
					t = Math.round((Math.random() * r + r)- r);
					n = self.array[t];
					$("span[data-number="+n+"]", self.block).addClass('active');
					// Перемещение приза к номеру
					self.array.splice(t, 1);
					self.prize(n);
					if(self.array.length){
						if(self.array.length == 1)
							self.raffle = self.countloop;
						_loop = setTimeout(self.loopraffle.bind(self), 4500);
					}
				}
			}else{
				self.stop();
			}
		},
		start: function(){
			var self = this,
				childs = self.prizes.children(),
				len = childs.length;
			self.btnraffle.tooltip('destroy');
			if(!self.raffleing){
				if(len==0){
					self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, i18n[self.lang].NOT_PRIZES]);
					return !1;
				}
				if(len > self.array.length){
					self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, i18n[self.lang].PRIZES_NUM_ERROR]);
					return !1;
				}
			}
			
			if(!self.raffleing && self.array.length){
				$('body').addClass('raffleing');
				self.rafdef = self.array.length;
				self.raffleing = self.rafflestart = true;
				self.raffle = 0;
				$(".inputnumber").addClass('disabled');
				$("input[type=number], #btnadd").attr('disabled',"disabled");
				self.btnraffle.addClass("active");
				//$('.columns-settings-label').slideUp(500);
				$('.columns-settings-label-buttons').slideUp(500);
				$(".columns-settings").slideUp(500);
				self.loopraffle();
				var list = options.sounds.dest[options.sounds.source],
				index = 0;
				isPlay = false;
				if(list.length < 1){
					options.sounds.source = 0;
					aus.playlist = options.sounds.dest[options.sounds.source];
				}
				saveStyleOptions();
				aus.stop();
				aus.playlist = _.values(list);
				aus.index = 0;
				if(options.sounds.playing) {
					isLoop = true;
					aus.play();
				}
			}
			return self;
		},
		stop: function(){
			var self = this;
			clearTimeout(_loop);
			self.btnraffle.removeClass('active').slideUp(300);
			[].forEach.call($("button, input"), function(el){
				var id = $(el).attr('id');
				if(id != 'btnclear' || id != 'btnstitch')
					el.removeAttribute('disabled');
			});
			$(".inputnumber").removeClass('disabled');
			self.btnadd.removeAttr("disabled");
			self.raffleing = false;
			self.rafflestart = true;
			self.raffle = 0;
			var $childs = self.prizes.children(),
				len = $childs.length;
			if(len){
				self.btnclear.removeAttr("disabled");
				self.btnstitch.removeAttr("disabled");
			}else{
				self.btnclear.attr("disabled", "disabled");
				self.btnstitch.attr("disabled", "disabled");
			}
			$('.reload').remove();
			var reload = $('<div></div>', {
				class: 'reload text-center print-hidden'
			}).append(
				$('<a></a>', {
					class: 'reload-link btn webicon-reload',
					href: '',
				}).on('click', function(e){
					e.preventDefault();
					$('a', reload).unbind('click');
					reload.remove();
					self.reload();
					return !1;
				}).attr({
					'title' : i18n[self.lang].NEW_RAFFLE
				})
			).append(
				$('<a></a>', {
					class: 'print-link btn webicon-print',
					href: '',
				}).on('click', function(e){
					e.preventDefault();
					var footer = $.trim(options.print.footer),
						header = $.trim(options.print.header),
						pr = {
							autoprint: false
						};/*
					if(options.print.showDate)
						pr.headerFooterEnabled = true;*/
					pr.headerString = header.length < 3 ? defaultOptions.print.header : header;
					pr.footerString = footer.length < 3 ? defaultOptions.print.footer : footer;
					
					win.print(pr);
					
					return !1;
				}).attr({
					'title': i18n[self.lang].PRINT
				})
			);
			$('.columns-result.full').prepend(reload);
			$('body').addClass('end');
			self.prizes.sortable("option", "disabled", false);
			setTimeout(function(){
				self.alert.apply(self, [i18n[self.lang].ALERT_SUCCESS, i18n[self.lang].SUCCESS_LOTERY]);
				setTimeout(function(){
					if(self.alertmodal){
						self.alertmodal.arcticmodal('close');
					}
					aus.stop();
					aus.index = 0;
					clearTimeout(self.datetime);
					self.date();
				}, 3000);
			}, 500);
			return self;
		},
		prize: function(val){
			var self = this;
			var childs = self.prizes.children(),
				el, pzpt,
				pos = {},
				win = {},
				ch = false;
			if(childs.length){
				el = childs.first();
				el.addClass('active').attr({
					'data-number': val
				});
				pos = {
					top: el.offset().top,
					left: el.offset().left,
					width: el.width(),
					height: el.height()
				};
				win = {
					left: self.result.offset().left,
					width: self.result.width(),
				};
				setTimeout(function(){
					el.css({
						position: 'absolute',
						'z-index': 1000,
						top: el.offset().top,
						left: el.offset().left,
						width: el.width(),
						height: el.height()
					}).parent().css({
						paddingTop: el.height()
					});
					$('.handle', el).removeClass('ui-sortable-handle');
					$('body').prepend(el);
					el.animate(win, 1000, function(){
						el.animate({
							top: self.result.offset().top + self.result.height()
						}, 1500, function(){
							// self.result.append(el.removeAttr("style"));
							if(!self.result.children().length){
								ch = true;
								self.result.append("<div style=\"height: 0px !important; overflow: hidden;\">&nbsp;</div>");
							}
							self.result.animate({
								paddingBottom: el.height()
							}, 500, function(){
								self.result.css({
									paddingBottom: 0
								});
								if(ch){
									self.result.empty();
								}
								self.result.append(el.removeAttr("style"));
							});
							self.prizes.animate({
								"padding" : 0
							}, 500, function(){
								self.prizes.removeAttr("style");
								var childs = self.prizes.children(),
									len = childs.length;
								if(!len){
									clearTimeout(_loop);
									self.stop();
									$('.columns-settings-label > h2').slideUp(500);
								}
							});
						});
					});
				}, 1000);
			}
			return self;
		},
		build: function(val){
			var self = this,
				ret = 0;
			self.block.empty();
			self.array = [];
			ret = parseInt(val);
			self.rafdef = ret;
			for(var i = 0; i<ret; ++i){
				var k = i+1,
					$span = $(document.createElement("span")).attr('data-number', k);
				self.array.push(k);
				self.block.append($span.append(document.createElement("span")));
			}
			return self;
		},
		reload: function(){
			var self = this;
			$('.columns-settings-label > h2').slideDown(500);
			$('.columns-settings-label-buttons').slideDown(500);
			$(".columns-settings").slideDown(500);
			$('body').removeClass('raffleing end');
			self.btnraffle.slideDown(500);
			self.prizes.empty();
			self.result.empty();
			$(self.sizenum).val(1);
			self.build(self.sizenum.val());
			self.lang = _lang;
			self.rafflestart = false;
			self.raffleing = false;
			return self;
		},
		setFocus: function(){
			var self = this;
			setTimeout(function(){
				if(self.artmodal.length) {
					var $ntext = $(".addprize-name", self.artmodal),
						len = $ntext.val().length * 2;
					if($ntext[0]){
						$ntext.focus();
						$ntext[0].setSelectionRange(len, len);
					}
				}
			}, 50);
			return self;
		},
		edit: function(el){
			$('.tooltip').remove();
			var self = this,
				element = el;
			if(el.length != 1)
				return self;
			var $temp = $("#artic-template .addprize").clone(),
				$crp = $(".preview-image", $temp),
				$submit = $(".addprize-button", $temp),
				$name = $(".addprize-name", $temp),
				$file,
				$fileparent = $('.input-file', $temp),
				h2 = $('.addprize > h2', $temp),
				c = $('<div class="box-modal" />'),
				originalUri = el.data('bg'),
				cd = el.data('cropData'),
				cropUri = el.data('crop'),
				name = el.data('name'),
				file = el.data('file'),
				addHandle = function(){
					if(self.alertmodal){
						return !1;
					}
					var val = $.trim($name.val()),
						data = $temp.data(),
						$bg = $('.bg', el),
						$text = $('.text', el);
					if(val==""){
						self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, i18n[self.lang].NOT_NAME]);
						return !1;
					}
					$file.unbind('input change');
					el.data({
						bg: data.original,
						cropData: cd,
						crop: data.crop,
						name: val,
						file: data.file,
						files: $file[0]
					});
					$bg.css({
						backgroundImage: "url(" + data.crop + ")"
					}).data({
						'parent': el
					});
					if(data.original){
						$bg.addClass('pointer');
					}else{
						$bg.removeClass('pointer');
					}
					$text.text(val);
					self.artmodal.arcticmodal('close');
				};
			$file = $(el.data('files')).on('input change', function(){
				var $this = $(this),
					$parent = $this.parent(),
					clear = function(){
						$parent.attr({
							'data-file': i18n[self.lang].NOT_SELECT_FILE
						});
						$temp.data({
							'original': false,
							'file': false 
						});
						$crp.croppie('bind', 'assets/images/nophoto.jpg');
						self.setFocus();
					};
				$crp.croppie('destroy');
				$crp.croppie({
					viewport: {
						width: 300,
						height: 300
					},
					boundary: {
						width: 300,
						height: 300
					},
					showZoomer: false,
					enableOrientation: true,
					mouseWheelZoom: 'ctrl',
					enableExif: true
				});
				
				if(this.files && this.files[0]){
					var reader = new FileReader();
					reader.onload = function (e) {
						$('.upload-demo').addClass('ready');
						$crp.croppie('bind', {
							url: e.target.result
						}).then(function(){
							
						});
						$temp.data({
							'original': this.result
						});
					};
					reader.readAsDataURL(this.files[0]);
					$crp.croppie('result', {
						type: 'canvas',
						size: 'viewport'
					}).then(function (resp, cropData) {
						$temp.data({
							'crop': resp
						});
						self.setFocus();
					});
					$parent.attr({
						'data-file': this.files[0].name
					});
					$temp.data({
						file: this.files[0].name
					});
				}else{
					clear();
				}
				self.setFocus();
			});
			$fileparent.empty().append($file);
			c.append($temp);
			$temp.data({
				original: originalUri,
				crop: cropUri,
				cropData: cd,
				name: name,
				file: file
			});
			$crp.croppie({
				viewport: {
					width: 300,
					height: 300
				},
				boundary: {
					width: 300,
					height: 300
				},
				showZoomer: false,
				enableOrientation: true,
				mouseWheelZoom: 'ctrl',
				enableExif: true
			});
			$crp.on('update.croppie', function(ev, cropData) {
				cd = cropData;
				$temp.data({
					'cropData': cropData
				});
				$crp.croppie('result', {
					type: 'canvas',
					size: 'viewport'
				}).then(function (resp) {
					$temp.data({
						'cropData': cd,
						'crop': resp
					});
				});
				setTimeout(self.setFocus.bind(self), 50);
			});
			$crp.croppie('bind', {
				url: originalUri ? originalUri : 'assets/images/nophoto.jpg',
				points: cd.points,
				orientation: cd.orientation,
				zoom: cd.zoom
			}).then(function(){
				
			});
			//c.prepend('<div class="box-modal_close arcticmodal-close rf-remove"></div>');
			$submit.on("click", function(e){
				if(!self.alertmodal){
					e.preventDefault();
					addHandle();
					return !1;
				}
			}).text(i18n[self.lang].BTN_SUBMIT);
			$name.on('keydown', function(e){
				if(e.keyCode == 13 && !e.ctrlKey && !e.altKey){
					if(!self.alertmodal){
						e.preventDefault();
						addHandle();
						return !1;
					}
				}
			}).focus();
			$.arcticmodal({
				content: c,
				closeOnOverlayClick: false,
				beforeOpen: function(d, f){
					self.artmodal = f;
					
					$('[data-i18n=MODAL_TITLE]').text(i18n[self.lang].BTN_EDIT_TITLE);
					$name.val(name);
					$fileparent.attr({
						'data-file': file ? file : i18n[self.lang].NOT_SELECT_FILE
					});
				},
				afterClose: function(){
					
					self.artmodal = null;
					self.artedit = null;
				}
			});
			return self;
		},
		add: function(){
			$('.tooltip').remove();
			var self = this,
				childs = self.prizes.children(),
				len = childs.length;
			if(self.array.length <= len){
				self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, i18n[self.lang].NOT_ADD]);
				return self;
			}
			if(self.artmodal){
				return self;
			}
			var $temp = $("#artic-template .addprize").clone(),
				$crp = $(".preview-image", $temp),
				$submit = $(".addprize-button", $temp),
				$name = $(".addprize-name", $temp),
				$file = $("[type=file]", $temp),
				c = $('<div class="box-modal" />'),
				addHandle = function(){
					var val = $.trim($name.val());
					if(val==""){
						if(!self.alertmodal){
							self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, i18n[self.lang].NOT_NAME]);
						}
						return;
					}
					$temp.data({
						'name': val,
						'file': $file.parent().data('file')
					});
					$file.unbind('input change');
					var data = $temp.data(),
						$li = $('<li></li>', {
							'class': 'prize'
						}).attr({
							'data-number': "?"
						}).data({
							bg: data.original,
							crop: data.crop,
							cropData: data.cropData,
							name: data.name,
							file: data.file,
							files: $file[0]
						}),
						$bg = $('<span></span>', {
							'class': 'bg'
						}).css({
							backgroundImage: "url(" + data.crop + ")"
						}).data({
							'parent': $li
						}),
						$text = $('<span></span>', {
							'class': 'text'
						}).text(data.name),
						$close = $('<span></span>', {
							'class': 'webicon-clear btn btn-remove'
						}).data({
							'parent': $li
						}).attr({
							'title': i18n[self.lang].BTN_DELETE_TITLE,
							'data-i18n-title': 'BTN_DELETE_TITLE'
						}),
						$edit = $('<span></span>', {
							'class': 'webicon-edit btn btn-edit'
						}).data({
							'parent': $li,
							'original': data.original
						}).attr({
							'title': i18n[self.lang].BTN_EDIT_TITLE,
							'data-i18n-title': 'BTN_EDIT_TITLE'
						});
					$close.on("click", function(e){
						e.preventDefault();
						var parent = $(this).data('parent');
						$([$close, $edit]).tooltip('destroy');
						
						parent.remove();
						return !1;
					});
					$edit.on('click', function(e){
						e.preventDefault();
						self.edit($(this).data('parent'));
						return !1;
					});
					if(data.original){
						$bg.addClass('pointer');
					}
					$bg.on("click", function(e){
						var $this = $(this),
							$parent = $this.data('parent'),
							uri = $parent.data('bg'),
							num = $parent.attr('data-number'),
							txt = "";
						if(uri){
							if(num && num != "?"){
								txt = " --- " + i18n[self.lang].WON_NUMBER + " " + num + " ";
							}
							$.fancybox.open([
								{
									src  : uri,
									opts : {
										caption : $text.text() + txt
									},
									animationEffect: 'zoom-in-out',
									transitionEffect: 'circular',
									transitionDuration: 700
								}
							]);
						}
					});
					$li.append([$('<span class="handle"></span>'), $bg, $text, $close, $edit]);
					self.prizes.append($li);
					self.prizes.sortable( 'refresh' );
					$submit.unbind('click');
					self.artmodal.arcticmodal('close');
				};
			c.append($temp);
			$crp.croppie({
				viewport: {
					width: 300,
					height: 300
				},
				boundary: {
					width: 300,
					height: 300
				},
				showZoomer: false,
				enableOrientation: true,
				mouseWheelZoom: 'ctrl',
				enableExif: true
			});
			$crp.on('update.croppie', function(ev, cropData) {
				$crp.croppie('result', {
					type: 'canvas',
					size: 'viewport'
				}).then(function (resp) {
					$temp.data({
						'cropData':cropData,
						'crop': resp
					});
				});
				setTimeout(self.setFocus.bind(self), 50);
			});
			$crp.croppie('bind', 'assets/images/nophoto.jpg');
			//c.prepend('<div class="box-modal_close arcticmodal-close rf-remove"></div>');
			$submit.on("click", function(e){
				if(!self.alertmodal){
					e.preventDefault();
					addHandle();
					return !1;
				}
			});
			$name.on('keydown', function(e){
				if(e.keyCode == 13 && !e.ctrlKey && !e.altKey){
					if(!self.alertmodal){
						e.preventDefault();
						addHandle();
						return !1;
					}
					return;
				}
			}).focus();
			$file.on('change', function(e){
				var $this = $(this),
					$parent = $this.parent(),
					clear = function(){
						$parent.attr({
							'data-file': i18n[self.lang].NOT_SELECT_FILE
						});
						$temp.data({
							'original': false
						});
						$crp.croppie('bind', 'assets/images/nophoto.jpg');
						self.setFocus();
					};
				if(this.files && this.files[0]){
					switch(this.files[0].type){
						case "image/jpeg":
						case "image/png":
							
							break;
						default:
							self.alert.apply(self, [i18n[self.lang].ALERT_ERROR, 'Данный формат файла не поддерживается!']);
							return;
					}
					$crp.croppie('destroy');
					$crp.croppie({
						viewport: {
							width: 300,
							height: 300
						},
						boundary: {
							width: 300,
							height: 300
						},
						showZoomer: false,
						enableOrientation: true,
						mouseWheelZoom: 'ctrl',
						enableExif: true
					});
					
					var reader = new FileReader();
					reader.onload = function (e) {
						$('.upload-demo').addClass('ready');
						$crp.croppie('bind', {
							url: e.target.result
						}).then(function(){
							
						});
						$temp.data({
							'original': this.result
						});
					};
					reader.readAsDataURL(this.files[0]);
					$crp.croppie('result', {
						type: 'canvas',
						size: 'viewport'
					}).then(function (resp) {
						$temp.data({
							'crop': resp
						});
						self.setFocus();
					});
					$parent.attr({
						'data-file': this.files[0].name
					});
					$temp.data({
						file: this.files[0].name
					});
				}else{
					clear();
				}
				self.setFocus();
			}).parent().attr({
				'data-file': i18n[self.lang].NOT_SELECT_FILE
			});
			$.arcticmodal({
				content: c,
				closeOnOverlayClick: false,
				beforeOpen: function(d, f){
					self.artmodal = f;
					
				},
				afterClose: function(){
					self.artmodal = null;
					self.artedit = null;
					/*$('[title]').tooltip(
						{
							trigger: 'hover',
							title: function(){
								return $(this).attr('data-tooltips-title');
							},
							container: 'body'
						}
					);*/
				}
			});
			return self;
		},
		clear: function(){
			$('.tooltip').remove();
			var self = this;
			$('[data-original-title]', self.prizes).tooltip('destroy');
			self.prizes.empty();
			return self;
		},
		date: function(){
			var self = this,
				jDate = new Date(),
				month = i18n[self.lang]['month'+jDate.getMonth()];
			clearTimeout(self.datetime);
			$('span.dateyear').text(jDate.getFullYear());
			var optionFormat = {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false,
				weekday: "long",
				day: "2-digit",
				month: "long",
				year: "numeric",
			},
			fdate = (new Date()).toLocaleDateString("ru-RU",optionFormat).split(","),
			strDate = (fdate[0] || "") + " " + (fdate[1] || "") + "\n" + (fdate[2] || "");
			if(options.print.showDate) {
				$(".date").attr({
					'data-date': strDate
				});
			} else {
				$(".date").attr({
					'data-date': ""
				});
			}
			self.datetime = setTimeout(self.date.bind(self), 1000);
			return self;
		},
		windowresize: function(){
			setTimeout(function(){
				$(window).trigger('resize');
			}, 5);
		},
		log: function(){
			if(window.debuger){
				console.dir.apply(console, arguments);
			}
		},
		import: function(){
			var self = this,
				json,
				time,
				input = $('<input />', {
					type: 'file',
					accept: "application/json"
				}).css({
					position: 'fixed',
					left: -3000
				}).on('input.raffle change.raffle', function(e){
					clearTimeout(time);
					$(window).unbind('focus.raffle');
					var file = this;
					if(file.files && file.files[0]){
						var reader = new FileReader();
						reader.onload = function (e) {
							setTimeout(function(){$(file).remove();}, 10);
							try {
								json = JSON.parse(e.target.result);
							} catch (ex) {
								return;
							}
							if(json){
								self.log('YES JSON');
							}
						};
						reader.readAsText(file.files[0]);
					}
					$(file).unbind('input.raffle change.raffle');
				}).on('click.raffle', function(){
					$(window).on('focus.raffle', function(){
						$(window).unbind('focus.raffle');
						time = setTimeout(function(){
							input.unbind('input.raffle change.raffle').remove();
						}, 3000);
					});
				});
			
			$("body").append(input);
			input.trigger('click');
			return self;
		},
		export: function(){
			var self = this,
				childs = self.prizes.children(),
				array = [],
				text = "",
				blob, url, link, name, date, arr;
			if(childs.length){
				childs.each(function(){
					var ed = $(this).data(),
						aq = {
							bg			: ed.bg,
							crop		: ed.crop,
							cropData	: ed.cropData,
							file		: ed.file,
							name		: ed.name,
							number		: ed.number
						};
					array.push(aq);
				});
				date = new Date();
				name = date.toLocaleString();
				arr = name.split(',');
				arr[1] = $.trim(arr[1].replace(/:/g,"-"));
				name = arr.join("_") + ".json";
				
				text = JSON.stringify(array, null, '\t');
				blob = new Blob([text], {type: "application/json"});
				url = window.URL.createObjectURL(blob);
				link = document.createElement("a");
				link.href = url;
				link.download = "export_" + name;
				document.body.appendChild(link);
				link.click();
				setTimeout(function(){
					window.URL.revokeObjectURL(url);
					link.remove();
				}, 0);
				
			}
			return self;
		}
	});
	function Plugin() {
		return this.each(function () {
			var $this   = $(this),
				data    = $this.data('ps.raffle');
			if (!data){
				data = new Raffle(this);
				$this.data('ps.raffle', data);
			}
		});
	}
	
	var old = $.fn.raffle;
	
	$.fn.raffle             = Plugin;
	
	$.fn.raffle.Constructor = Raffle;
	
	$.fn.raffle.noConflict = function () {
		$.fn.raffle = old;
		return this;
	};
	
	
	

	$.cookie('lang', _lang, { expires: 360, path: '/' });
	window.ds = $($('#lotereya > .row')[0]).raffle().data('ps.raffle');
	$(window).on('load', function(e){
		
		setTimeout(function(){
			$('body').addClass('load ');
			setTimeout(function(){
				$(window).trigger('resize');
			},2000);
		}, 3000);
	});
	
	$('a.goto').on('click', function(e){
		e.preventDefault();
		//console.log(this);
		gui.Shell.openExternal(e.target.href);
		return !1;
	});
	/*$("#chs").on('click', function(){
		
		chrome.desktopCapture.chooseDesktopMedia(
			['window', 'audio'],
			function(){
				console.log(arguments);
			}
		);
	});*/
	/*
	document.body.addEventListener('contextmenu', function(ev) { 
		 ev.preventDefault();
		 menu.popup(ev.x, ev.y);
		 return false;
	});
	*/
}( window, document, window.jQuery || jQuery ));