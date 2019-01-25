/* jshint esversion: 6 */
/* jslint expr: true */
var helper = require("./helper"),
	_ = require("underscore"),
	EventDispatcher = function () {},
	timeupdate,
	audio,
	_this,
	_isPlaying = false,
	_isProgress = false,
	_time = 0;
	_volume = 1,
	_status = "online",
	_nullstream = "data:audio/mpeg;base64,/+MQwAAAAANIAYAAAExBTUUzLjkzVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/jEMAnAAADSAHAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/4xDATgAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
	_stream = "data:audio/mpeg;base64,/+MQwAAAAANIAYAAAExBTUUzLjkzVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/jEMAnAAADSAHAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/4xDATgAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
	_playlist = [],
	_index = -1,
	audioEvents = [
		'emptied',
		'loadedmetadata',
		'loadeddata',
		'canplay',
		'canplaythrough',
		'playing',
		'ended',
		'waiting',
		'ended',
		'durationchange',
		'timeupdate',
		'play',
		'playing',
		'pause',
		'progress',
		'stalled',
		'suspend',
		'ratechange',
		'volumechange'
	],
	audioHandler = function(e){
		//var event = new Event('statechange');
		var _atime = parseInt(audio.currentTime),
			_aduration = parseInt(audio.duration);
		switch(e.type){
			case "volumechange":
				_this.dispatchEvent({type: e.type, volume: _volume});
				break;
			case 'play':
			case 'waiting':
				_isProgress = true;
				_isPlaying = true;
				_time = audio.duration ? ((100 * audio.currentTime) / audio.duration) : 0;
				/*event.audioev = 'play';
				event.bufering = _isProgress;
				event.playing = _isPlaying;
				event.progress = time;
				event.index = _index;*/
				_this.dispatchEvent({
					type: 'statechange',
					audioev:'play',
					bufering: _isProgress,
					playing: _isPlaying,
					progress: _time,
					index: _index,
					time: _atime,
					duration: _aduration
				});
				//this.dispatchEvent(event);
				break;
			case 'canplay':
				
				break;
			case 'playing':
				timeupdate && clearTimeout(timeupdate);
				_isProgress = false;
				_isPlaying = true;
				_time = audio.duration ? ((100 * audio.currentTime) / audio.duration) : 0;
				_this.dispatchEvent({
					type: 'statechange',
					audioev:'playing',
					bufering: _isProgress,
					playing: _isPlaying,
					progress: _time,
					index: _index,
					time: _atime,
					duration: _aduration
				});
				break;
			case 'ended':
			case 'abort':
			//case 'emptied':
			case 'error':
			case 'pause':
				timeupdate && clearTimeout(timeupdate);
				_isPlaying = _isProgress = false;
				_time = audio.duration ? ((100 * audio.currentTime) / audio.duration) : 0;
				_this.dispatchEvent({
					type: 'statechange',
					audioev:'stop',
					bufering: _isProgress,
					playing: _isPlaying,
					progress: _time,
					index: _index,
					time: _atime,
					duration: _aduration,
					e: e
				});
				break;
			case 'timeupdate':
				timeupdate && clearTimeout(timeupdate);
				_time = (100 * audio.currentTime) / audio.duration;
				_this.dispatchEvent({
					type: 'statechange',
					audioev:'progress',
					bufering: _isProgress,
					playing: _isPlaying,
					progress: _time,
					index: _index,
					time: _atime,
					duration: _aduration
				});
				if(_isProgress && audio.readyState==4){
					_isProgress = false;
					_this.dispatchEvent({
						type: 'statechange',
						audioev:'progress',
						bufering: _isProgress,
						playing: _isPlaying,
						progress: _time,
						index: _index,
						time: _atime,
						duration: _aduration
					});
					return;
				}
				_isProgress && (
					timeupdate = setTimeout(function(){
						_isProgress = true;
						_this.dispatchEvent({
							type: 'statechange',
							audioev:'progress',
							bufering: _isProgress,
							playing: _isPlaying,
							progress: _time,
							index: _index,
							time: _atime,
							duration: _aduration
						});
					}, 150)
				);
				break;
		}
	};
	
Object.assign( EventDispatcher.prototype, {
	addEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) this._listeners = {};
		var listeners = this._listeners;
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}
		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}
	},
	hasEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return false;
		var listeners = this._listeners;
		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
			return true;
		}
		return false;
	},
	removeEventListener: function ( type, listener ) {
		if ( this._listeners === undefined ) return;
		var listeners = this._listeners;
		var listenerArray = listeners[ type ];
		if ( listenerArray !== undefined ) {
			var index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) {
				listenerArray.splice( index, 1 );
			}
		}
	},
	dispatchEvent: function ( event ) {
		if ( this._listeners === undefined ) return;
		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];
		if ( listenerArray !== undefined ) {
			event.target = this;
			var array = [], i = 0;
			var length = listenerArray.length;
			for ( i = 0; i < length; i ++ ) {
				array[ i ] = listenerArray[ i ];
			}
			for ( i = 0; i < length; i ++ ) {
				array[ i ].call( this, event );
			}
		}
	}
});

var AudioPlaylist = function(){
	var dispatchHandlers = [],
		i=0;
	_this = this;
	audio = new Audio();
	audio.crossOrigin="anonymous";
	audio.preload = "none";
	audio.autoplay = false;
	audio.controls = null;
	document.body.appendChild(audio);
	audioEvents.forEach(function(a, b){
		audio.addEventListener(a, audioHandler);
	});
	
	return _this;
};

AudioPlaylist.prototype = {
	isPlaying: function(){
		return _isPlaying;
	},
	isProgress: function(){
		return _isProgress;
	},
	toggle: function(){
		_isPlaying ? this.stop() : this.play();
	},
	set stream(value) {
		_stream = value;
	},
	get stream() {
		return _stream;
	},
	set volume(value) {
		_volume = helper.inInterval(value, 0, 1);
		if(_volume==audio.volume){
			return;
		}
		audio.volume = _volume;
	},
	get volume(){
		return _volume;
	},
	
	set playlist(arr){
		if(_isPlaying){
			this.stop();
		}
		if(helper.isArray(arr)){
			_playlist = arr;
		}else{
			throw new Error('playlist is not Array');
		}
	},
	get playlist(){
		return _playlist;
	},
	
	set index(val){
		var tval = parseInt(val);
		if(!tval && tval != 0){
			tval = _playlist.length ? 0 : -1;
		}
		tval = helper.inInterval(tval, -1, _playlist.length - 1);
		if(_index != tval){
			if(_isPlaying){
				this.stop();
			}
		}
		_index = parseInt(tval);
	},
	get index(){
		return _index;
	},
	
	play: function(){
		//this.dispatchEvent({type:'statechange', msg: 'start'});
		_index = helper.inInterval(_index, -1, _playlist.length - 1);
		if(_index < 0 && _playlist.length){
			_index = 0;
		}
		this.dispatchEvent({type:'statechange', msg: _index.toString()});
		if(_index < 0){
			return;
		}
		_isPlaying = true;
		this.stream = _playlist[_index].src;
		audio.src = this.stream;
		audio.currentTime = 0;
		setTimeout(function(){
			audio.play();
		},10);
	},
	stop: function(){
		audio.pause();
		audio.src = _nullstream;
		audio.currentTime = 0;
		_isPlaying = false;
	},
	
};

Object.assign(AudioPlaylist.prototype, EventDispatcher.prototype);

if (typeof exports == 'undefined') {
    window.AudioPlaylist = AudioPlaylist;
} else {
    module.exports = AudioPlaylist;
}