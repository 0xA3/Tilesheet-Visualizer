package;

import js.Browser;
import js.html.DragEvent;
import js.html.Element;
import js.html.Event;
import js.html.File;
import js.html.FileList;
import js.html.FileReader;

using xa3.HtmlUtils;

var document:js.html.HTMLDocument = js.Browser.document;

var viewRegion:Element;
var imageDrop:Element;
var imageFile:Element;
var imageFilename:Element;
var imageClose:Element;
var imageView:Element;
var mapDrop:Element;
var mapFile:Element;
var mapFilename:Element;
var mapClose:Element;
var mapView:Element;

function main() {
	
	viewRegion = e( "view" );
	imageDrop = e( "image_drop" );
	imageFile = e( "image_file" );
	imageFilename = e( "image_filename" );
	imageClose = e( "image_close" );
	imageView = e( "image_view" );
	mapDrop = e( "map_drop" );
	mapFile = e( "map_file" );
	mapFilename = e( "map_filename" );
	mapClose = e( "map_close" );
	mapView = e( "map_view" );
	
	final fakeImageInput = document.createInputElement();
	fakeImageInput.type = "file";
	fakeImageInput.accept = "image/*";
	fakeImageInput.multiple = false;
	
	fakeImageInput.addEventListener( 'change', () -> {
		final files = fakeImageInput.files;
		handleImageFiles( files );
	});
	
	final fakeMapInput = document.createInputElement();
	fakeMapInput.type = "file";
	fakeMapInput.accept = "application/json";
	fakeMapInput.multiple = false;
	
	fakeMapInput.addEventListener( 'change', () -> {
		final files = fakeMapInput.files;
		handleJsonFiles( files );
	});
	
	imageDrop.addEventListener( 'click', () -> fakeImageInput.click());
	imageDrop.addEventListener( 'dragenter', preventDefault, false );
	imageDrop.addEventListener( 'dragleave', preventDefault, false );
	imageDrop.addEventListener( 'dragover', preventDefault, false );
	imageDrop.addEventListener('drop', handleImageDrop, false);

	mapDrop = e( "map_drop" );
	mapDrop.addEventListener( 'click', () -> fakeMapInput.click());
	mapDrop.addEventListener( 'dragenter', preventDefault, false );
	mapDrop.addEventListener( 'dragleave', preventDefault, false );
	mapDrop.addEventListener( 'dragover', preventDefault, false );
	mapDrop.addEventListener( 'drop', handleMapDrop, false);

	imageClose.addEventListener( 'click', closeImage );
	mapClose.addEventListener( 'click', closeMap );

}

function e( elementId:String ) return document.getElementById( elementId );

function handleImageDrop( e:DragEvent ) {
	final dt = e.dataTransfer;
	final files = dt.files;
	if( files.length > 0 ) handleImageFiles( files );
	preventDefault( e );
}

function preventDefault( e:Event ) {
	e.preventDefault();
	e.stopPropagation();
}

function handleImageFiles( fileList:FileList ) {
	if( fileList.length > 0 ) {
		if( validateImage( fileList[0] )) readImage( fileList[0] );
	}
}

function handleMapDrop( e:DragEvent ) {
	final dt = e.dataTransfer;
	final files = dt.files;
	if( files.length > 0 ) handleJsonFiles( files );
	preventDefault( e );
}

function handleJsonFiles( fileList:FileList ) {
	if( fileList.length > 0 ) {
		if( validateJson( fileList[0] )) readMap( fileList[0] );
	}
}

function validateImage( image:File ) {
	var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
	if( !validTypes.contains( image.type )) {
		Browser.window.alert( 'Invalid File Type: ${image.type}' );
		return false;
	}
	return true;
}

function validateJson( file:File ) {
	var validTypes = ['application/json'];
	if( !validTypes.contains( file.type )) {
		Browser.window.alert( 'Invalid File Type: ${file.type}' );
		return false;
	}
	return true;
}

function readImage( image:File ) {
	final img = document.createImageElement();
	img.name = image.name;
	imageView.appendChild( img );
	
	final reader = new FileReader();
	reader.onload = e -> {
		img.src = e.target.result;
		imageFilename.innerHTML = img.name;
		imageDrop.hide();
		imageFile.show();
	}
	reader.readAsDataURL( image );
}

function closeImage( e:Event ) {
	imageView.innerHTML = "";
	imageDrop.show();
	imageFile.hide();
	closeMap( e );
}

function readMap( file:File ) {
	final reader = new FileReader();
	reader.onload = e -> {
		mapFilename.innerHTML = file.name;
		mapDrop.hide();
		mapFile.show();
		createMapAreas( e.target.result );
	}
	reader.readAsText( file );
}

function closeMap( e:Event ) {
	mapView.innerHTML = "";
	mapDrop.show();
	mapFile.hide();
}

function createMapAreas( mapFile:String ) {
	final parsedMap = haxe.Json.parse( mapFile );
	if( parsedMap.frames == null ) {
		Browser.window.alert( 'Invalid Map' );
		return;
	}

	final map = parsedMap.frames;
	final fields = Reflect.fields( map );
	for( field in fields ) {
		final value:TilemapDataset = Reflect.field( map, field );
		final frame = value.frame;
		mapView.innerHTML += '<div class="map-area" style="left:${frame.x}px;top:${frame.y}px;width:${frame.w}px; height:${frame.h}px"><span class="area-name">$field</span></div>';
	}
}

typedef TilemapDataset = {
	frame:{
		x:Int,
		y:Int,
		w:Int,
		h:Int
	},
	rotated:Bool,
	trimmed:Bool,
	spriteSourceSize:{
		x:Int,
		y:Int,
		w:Int,
		h:Int
	},
	sourceSize:{
		w:Int,
		h:Int
	}
}