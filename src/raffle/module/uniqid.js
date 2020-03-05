var uniqid = function (pr, en) {
	var a1 = pr || "",
		a2 = en || false,
		seed = function (s, w) {
			s = parseInt(s, 10).toString(16);
			return (w < s.length) ? s.slice(s.length - w) : ((w < s.length) ? new Array(1 + (w - s.length)).join('0') + s : s);
		},
		result;
	result = a1 + seed(parseInt(new Date().getTime() / 1000, 10), 8) + seed(Math.floor(Math.random() * 123456789) + 1, 5);
	if (a2)
		result += (Math.random() * 10).toFixed(8).toString();
	return result;
};

if (typeof exports == 'undefined') {
    window.uniqid = uniqid;
} else {
    module.exports = uniqid;
}