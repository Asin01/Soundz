/******************************************************************************
Title: Soundz
Use: Javascript for Favorites Page Local Storage
Author: Amir Sinanovic
School/Term: SIU Carbondale, Spring 2020
Developed: April 15, 2020
Tested: April 27, 2020; Passed with no problems.
******************************************************************************/

$(function(){

	// define the application
	var Notekeeper = {};

	(function(app){

		// variable definitions go here
		var $artist = $('#artist'),
			$song = $('#song'),
			$ul = $('#songlist'),
			li = '<li><a href="#pgNotesDetail?artist=LINK">ID</a></li>',
			songsHdr = '<li data-role="list-divider">Your Song List</li>',
			noSongs = '<li id="noSongs">No songs added</li>';

		app.init = function(){
			app.bindings();
			app.checkForStorage();
		};

		app.bindings = function(){
			// set up binding for form
			$('#btnAddNote').on('touchend', function(e){
				e.preventDefault();
				// save the song
				app.addNote(
					$('#artist').val(),
					$('#song').val()
				);
			});
			$(document).on('touchend', '#favorites a', function(e){
				e.preventDefault();
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var artist = href.replace(/^\?artist=/,'');
				app.loadNote(artist);
			});
			$(document).on('touchend', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('href');
				app.deleteNote(key);
			});
		};

		app.loadNote = function(artist){
			// get songs
			var notes = app.getNotes(),
				// lookup specific song
				song = notes[artist],
				page = ['<div data-role="page">',
							'<div data-role="header" data-add-back-btn="true">',
								'<h1>Notekeeper</h1>',
								'<a id="btnDelete" href="" data-href="ID" data-role="button" class="ui-btn-right">Delete</a>',
							'</div>',
							'<div role="main" class="ui-content"><h3>ARTIST</h3><p>SONG</p></div>',
						'</div>'].join('');
			var newPage = $(page);
			//append it to the page container
			newPage.html(function(index,old){
				return old
						.replace(/ID/g,aratist)
						.replace(/ARTIST/g,artist
						.replace(/-/g,' '))
						.replace(/SONG/g,song);
			}).appendTo($.mobile.pageContainer);
			$.mobile.changePage(newPage);
		};

		app.addNote = function(artist, song){
			var notes = localStorage['Notekeeper'],
				notesObj;
			if (notes === undefined || notes === '') {
				notesObj = {};
			} else {
				notesObj = JSON.parse(notes);
			}
			notesObj[artist.replace(/ /g,'-')] = song;
			localStorage['Notekeeper'] = JSON.stringify(notesObj);
			// clear the two form fields
			$song.val('');
			$artist.val('');
			//update the listview
			app.displayNotes();
		};

		app.getNotes = function(){
			// get songs
			var notes = localStorage['Notekeeper'];
			// convert notes from string to object
			if(notes) return JSON.parse(notes);
			return [];
		};

		app.displayNotes = function(){
			// get songs
			var notesObj = app.getNotes(),
				// create an empty string to contain html
				html = '',
				n; // make sure your iterators are properly scoped
			// loop over songs
			for (n in notesObj) {
				html += li.replace(/ID/g,n.replace(/-/g,' ')).replace(/LINK/g,n);
			}
			$ul.html(songsHdr + html).listview('refresh');
		};

		app.deleteNote = function(key){
			// get the notes from localStorage
			var notesObj = app.getNotes();
			// delete selected song
			delete notesObj[key];
			// write it back to localStorage
			localStorage['Notekeeper'] = JSON.stringify(notesObj);
			// return to the list of songs
			$.mobile.changePage('favorites.htm');
			// restart the storage check
			app.checkForStorage();
		};

		app.checkForStorage = function(){
			var notes = app.getNotes();
			// are there existing notes?
			if (!$.isEmptyObject(notes)) {
				// yes there are. pass them off to be displayed
				app.displayNotes();
			} else {
				// nope, just show the placeholder
				$ul.html(songsHdr + noSongs).listview('refresh');
			}
		};

		app.init();

	})(Notekeeper);
});