window._helper = {
	pack: function(data){
		return JSON.stringify(data);
	},
	unpack: function(data){
		try {
			return JSON.parse(data);
		} catch(ex) {
			return null;
		}
	},
	isNumber: function(value){
		return (!isNaN(parseFloat(value)) && isFinite(value) && !this.isString && !this.isBoolean && !this.isObject && !this.isArray);
	},
	isArray: function (value){
		return (!this.isNull(value) && (Object.prototype.toString.call(value) === '[object Array]'));
	},
	isObject: function(value){
		return (!this.isEmpty(value) && (typeof value == 'object'));
	},
	isBoolean: function(value){
		return (typeof value == 'boolean');
	},
	isString: function(value){
		return (typeof value == 'string');
	},
	isNull: function(value){
		return ((value === undefined) || (value === null));
	},
	isEmpty: function(value){
		return ( this.isNull(value) || ((typeof value.length != 'undefined') && (value.length == 0)) );
	},
	in_array: function(value, array) 
	{
		for(var i = 0; i < array.length; i++) 
		{
			if(array[i] == value) return true;
		}
		return false;
	}
};