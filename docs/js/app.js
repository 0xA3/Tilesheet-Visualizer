(function ($global) { "use strict";
var Main_viewRegion = null;
var Main_imageDrop = null;
var Main_imageFile = null;
var Main_imageFilename = null;
var Main_imageClose = null;
var Main_imageView = null;
var Main_mapDrop = null;
var Main_mapFile = null;
var Main_mapFilename = null;
var Main_mapClose = null;
var Main_mapView = null;
function Main_main() {
	Main_viewRegion = Main_e("view");
	Main_imageDrop = Main_e("image_drop");
	Main_imageFile = Main_e("image_file");
	Main_imageFilename = Main_e("image_filename");
	Main_imageClose = Main_e("image_close");
	Main_imageView = Main_e("image_view");
	Main_mapDrop = Main_e("map_drop");
	Main_mapFile = Main_e("map_file");
	Main_mapFilename = Main_e("map_filename");
	Main_mapClose = Main_e("map_close");
	Main_mapView = Main_e("map_view");
	let fakeImageInput = Main_document.createElement("input");
	fakeImageInput.type = "file";
	fakeImageInput.accept = "image/*";
	fakeImageInput.multiple = false;
	fakeImageInput.addEventListener("change",function() {
		let files = fakeImageInput.files;
		Main_handleImageFiles(files);
	});
	let fakeMapInput = Main_document.createElement("input");
	fakeMapInput.type = "file";
	fakeMapInput.accept = "application/json";
	fakeMapInput.multiple = false;
	fakeMapInput.addEventListener("change",function() {
		let files = fakeMapInput.files;
		Main_handleJsonFiles(files);
	});
	Main_imageDrop.addEventListener("click",function() {
		fakeImageInput.click();
	});
	Main_imageDrop.addEventListener("dragenter",Main_preventDefault,false);
	Main_imageDrop.addEventListener("dragleave",Main_preventDefault,false);
	Main_imageDrop.addEventListener("dragover",Main_preventDefault,false);
	Main_imageDrop.addEventListener("drop",Main_handleImageDrop,false);
	Main_mapDrop = Main_e("map_drop");
	Main_mapDrop.addEventListener("click",function() {
		fakeMapInput.click();
	});
	Main_mapDrop.addEventListener("dragenter",Main_preventDefault,false);
	Main_mapDrop.addEventListener("dragleave",Main_preventDefault,false);
	Main_mapDrop.addEventListener("dragover",Main_preventDefault,false);
	Main_mapDrop.addEventListener("drop",Main_handleMapDrop,false);
	Main_imageClose.addEventListener("click",Main_closeImage);
	Main_mapClose.addEventListener("click",Main_closeMap);
}
function Main_e(elementId) {
	return Main_document.getElementById(elementId);
}
function Main_handleImageDrop(e) {
	let dt = e.dataTransfer;
	let files = dt.files;
	if(files.length > 0) {
		Main_handleImageFiles(files);
	}
	Main_preventDefault(e);
}
function Main_preventDefault(e) {
	e.preventDefault();
	e.stopPropagation();
}
function Main_handleImageFiles(fileList) {
	if(fileList.length > 0) {
		if(Main_validateImage(fileList[0])) {
			Main_readImage(fileList[0]);
		}
	}
}
function Main_handleMapDrop(e) {
	let dt = e.dataTransfer;
	let files = dt.files;
	if(files.length > 0) {
		Main_handleJsonFiles(files);
	}
	Main_preventDefault(e);
}
function Main_handleJsonFiles(fileList) {
	if(fileList.length > 0) {
		if(Main_validateJson(fileList[0])) {
			Main_readMap(fileList[0]);
		}
	}
}
function Main_validateImage(image) {
	let validTypes = ["image/jpeg","image/png","image/gif"];
	if(!validTypes.includes(image.type)) {
		window.alert("Invalid File Type: " + image.type);
		return false;
	}
	return true;
}
function Main_validateJson(file) {
	let validTypes = ["application/json"];
	if(!validTypes.includes(file.type)) {
		window.alert("Invalid File Type: " + file.type);
		return false;
	}
	return true;
}
function Main_readImage(image) {
	let img = Main_document.createElement("img");
	img.name = image.name;
	Main_imageView.appendChild(img);
	let reader = new FileReader();
	reader.onload = function(e) {
		img.src = e.target.result;
		Main_imageFilename.innerHTML = img.name;
		xa3_HtmlUtils.hide(Main_imageDrop);
		xa3_HtmlUtils.show(Main_imageFile);
	};
	reader.readAsDataURL(image);
}
function Main_closeImage(e) {
	Main_imageView.innerHTML = "";
	xa3_HtmlUtils.show(Main_imageDrop);
	xa3_HtmlUtils.hide(Main_imageFile);
	Main_closeMap(e);
}
function Main_readMap(file) {
	let reader = new FileReader();
	reader.onload = function(e) {
		Main_mapFilename.innerHTML = file.name;
		xa3_HtmlUtils.hide(Main_mapDrop);
		xa3_HtmlUtils.show(Main_mapFile);
		Main_createMapAreas(e.target.result);
	};
	reader.readAsText(file);
}
function Main_closeMap(e) {
	Main_mapView.innerHTML = "";
	xa3_HtmlUtils.show(Main_mapDrop);
	xa3_HtmlUtils.hide(Main_mapFile);
}
function Main_createMapAreas(mapFile) {
	let parsedMap = JSON.parse(mapFile);
	if(parsedMap.frames == null) {
		window.alert("Invalid Map");
		return;
	}
	let map = parsedMap.frames;
	let fields = Reflect.fields(map);
	let _g = 0;
	while(_g < fields.length) {
		let field = fields[_g];
		++_g;
		let value = Reflect.field(map,field);
		let frame = value.frame;
		Main_mapView.innerHTML += "<div class=\"map-area\" style=\"left:" + frame.x + "px;top:" + frame.y + "px;width:" + frame.w + "px; height:" + frame.h + "px\"><span class=\"area-name\">" + field + "</span></div>";
	}
}
class Reflect {
	static field(o,field) {
		try {
			return o[field];
		} catch( _g ) {
			return null;
		}
	}
	static fields(o) {
		let a = [];
		if(o != null) {
			let hasOwnProperty = Object.prototype.hasOwnProperty;
			for( var f in o ) {
			if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
				a.push(f);
			}
			}
		}
		return a;
	}
}
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
class xa3_HtmlUtils {
	static show(element) {
		element.style.display = "block";
	}
	static hide(element) {
		element.style.display = "none";
	}
}
{
}
var Main_document = window.document;
Main_main();
})({});

//# sourceMappingURL=app.js.map