var $global = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
var Main_viewRegion = null;
var Main_imageDrop = null;
var Main_imageFile = null;
var Main_imageFilename = null;
var Main_imageClose = null;
var Main_mapDrop = null;
var Main_mapFile = null;
var Main_mapFilename = null;
var Main_mapClose = null;
function Main_main() {
	Main_viewRegion = Main_e("view");
	Main_imageDrop = Main_e("image_drop");
	Main_imageFile = Main_e("image_file");
	Main_imageFilename = Main_e("image_filename");
	Main_imageClose = Main_e("image_close");
	Main_mapDrop = Main_e("map_drop");
	Main_mapFile = Main_e("map_file");
	Main_mapFilename = Main_e("map_filename");
	Main_mapClose = Main_e("map_close");
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
	fakeMapInput.accept = "text/json";
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
	Main_mapDrop.addEventListener("drop",Main_handleImageDrop,false);
	Main_imageClose.addEventListener("click",Main_closeImage);
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
function Main_handleJsonFiles(fileList) {
	if(fileList.length > 0) {
		if(Main_validateJson(fileList[0])) {
			Main_readJson(fileList[0]);
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
	let validTypes = ["text/json"];
	if(!validTypes.includes(file.type)) {
		window.alert("Invalid File Type: " + file.type);
		return false;
	}
	return true;
}
function Main_readImage(image) {
	let img = Main_document.createElement("img");
	img.name = image.name;
	Main_viewRegion.appendChild(img);
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
	let _g = 0;
	let _g1 = Main_viewRegion.children;
	while(_g < _g1.length) {
		let child = _g1[_g];
		++_g;
		Main_viewRegion.removeChild(child);
	}
	xa3_HtmlUtils.show(Main_imageDrop);
	xa3_HtmlUtils.hide(Main_imageFile);
}
function Main_readJson(file) {
	let reader = new FileReader();
	reader.onload = function(e) {
		console.log("src/Main.hx:145:",e.target.result);
		xa3_HtmlUtils.hide(Main_mapDrop);
		xa3_HtmlUtils.show(Main_mapFile);
	};
	reader.readAsText(file);
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

//# sourceMappingURL=app.js.map