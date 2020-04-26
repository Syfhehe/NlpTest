requirejs(['./require-common'], function (common) {
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	var libs = document.getElementById("libs");
	if (libs && libs.value) {
		var libsValue = libs.value;
		var libsArr = libsValue.split(",").map(function(item) {
		  return item.trim();
		});
		requirejs(libsArr);
	}
});
