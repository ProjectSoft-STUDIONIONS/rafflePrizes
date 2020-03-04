/*jshint esversion: 6 */
/* jslint expr: true */
var gui = require('nw.gui');
var tray = new gui.Tray({
		title: 'Генератор розыгрыша лотерей',
		icon: 'favicon.png'
	});
var menu = new nw.Menu();
/*
menu.append(new nw.MenuItem({
	label: '        Исходный код страницы',
	icon: 'favicon.png',
	click: function(){
		gui.Window.get().showDevTools();
	}
}));
*/
$(function(){
	$('body').on('click', 'a.link', function(e){
		e.preventDefault();
		nw.Shell.openExternal(this.href);
		return !1;
	});
});

menu.append(new nw.MenuItem({
	label: '  GitHub Raffle Prizes',
	icon: "assets/images/github.png",
	click: function(){
		nw.Shell.openExternal("https://github.com/ProjectSoft-STUDIONIONS/rafflePrizes");
	}
}));

menu.append(new nw.MenuItem({
	label: '  ProjectSoft',
	icon: "assets/images/projectsoft.png",
	click: function(){
		nw.Shell.openExternal("https://demiart.ru/forum/index.php?showuser=1393929");
	}
}));

menu.append(new nw.MenuItem({
	type: 'separator',
}));
/*
menu.append(new nw.MenuItem({
	label: '  FullScreen',
	click: function(){
		win.enterFullscreen();
	}
}));
*/
menu.append(new nw.MenuItem({
	label: '  Close',
	icon: "assets/images/close.png",
	click: function(){
		nw.App.quit();
	}
}));
tray.menu = menu;
win.setBadgeLabel('Пробуем');
/*
menu.append(new nw.MenuItem({
	label: 'Stop',
	click: function(){
		//window.opener.require('nw.gui').Window.get().showDevTools();
	}
}));
*/
/*
document.body.addEventListener('contextmenu', function(ev) { 
  ev.preventDefault();
  menu.popup(ev.x, ev.y);
  return false;
});
*/