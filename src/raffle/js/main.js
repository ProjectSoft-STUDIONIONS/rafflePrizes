/*jshint esversion: 6 */
/* jslint expr: true */
var gui = require('nw.gui');
var tray = new gui.Tray({
		title: 'Генератор розыгрыша лотерей',
		icon: 'favicon.png'
	});
var menu = new nw.Menu();
menu.append(new nw.MenuItem({
	label: 'Исходный код страницы',
	click: function(){
		gui.Window.get().showDevTools();
	}
}));

$(function(){
	$('body').on('click', 'a.link', function(e){
		e.preventDefault();
		nw.Shell.openExternal(this.href);
		return !1;
	});
});
/*
menu.append(new nw.MenuItem({
	label: 'Фоновая страница',
	click: function(){
		window.opener.require('nw.gui').Window.get().showDevTools();
	}
}));

document.body.addEventListener('contextmenu', function(ev) { 
  ev.preventDefault();
  menu.popup(ev.x, ev.y);
  return false;
});
*/