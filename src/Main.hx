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
var mapDrop:Element;
var mapFile:Element;
var mapFilename:Element;
var mapClose:Element;

function main() {
	
	viewRegion = e( "view" );
	imageDrop = e( "image_drop" );
	imageFile = e( "image_file" );
	imageFilename = e( "image_filename" );
	imageClose = e( "image_close" );
	mapDrop = e( "map_drop" );
	mapFile = e( "map_file" );
	mapFilename = e( "map_filename" );
	mapClose = e( "map_close" );
	
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
	fakeMapInput.accept = "text/json";
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
	mapDrop.addEventListener( 'drop', handleImageDrop, false);

	imageClose.addEventListener( 'click', closeImage );

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

function handleJsonFiles( fileList:FileList ) {
	if( fileList.length > 0 ) {
		if( validateJson( fileList[0] )) readJson( fileList[0] );
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
	var validTypes = ['text/json'];
	if( !validTypes.contains( file.type )) {
		Browser.window.alert( 'Invalid File Type: ${file.type}' );
		return false;
	}
	return true;
}

function readImage( image:File ) {
	final img = document.createImageElement();
	img.name = image.name;
	viewRegion.appendChild( img );
	
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
	for( child in viewRegion.children ) {
		viewRegion.removeChild( child );
	}
	imageDrop.show();
	imageFile.hide();
}

function readJson( file:File ) {

	final reader = new FileReader();
	reader.onload = e -> {
		trace( e.target.result );
		mapDrop.hide();
		mapFile.show();
	}
	reader.readAsText( file );
}

