// Load the fs package to read and write
var fs = require("fs");
// Grab the request package...
var request = require("request");

var Twitter = require("twitter");

var spotify = require('spotify');

var https = require('https');

var nodeArgs = process.argv;

var command = process.argv[2];

var songName = "";

var movieName = "";

switch (command) {
  case "my-tweets":
    tweets();
    break;

  case "spotify-this-song":
    songSearch();
    break;

  case "movie-this":
    movieSearch();
    break;

  case "do-what-it-says":
    random();
    break;
}


function tweets() {
	var keys = require("./keys.js");
	var client = new Twitter(keys.twitterKeys);
	var params = {screen_name: 'wrnecmrn1'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);
	  }
	});
}


function songSearch() {
	for (var i = 3; i < nodeArgs.length; i++) {
	  if (i > 3 && i < nodeArgs.length) {
	    songName = songName + "+" + nodeArgs[i];
	  }
	  else {
	   	songName += nodeArgs[i];
	  }
	}

	// spotify.search({ type: 'track', query: "'" + songName + "'" }, function(err, data) {
	//     if ( err ) {
	//         console.log('Error occurred: ' + err);
	//         return;
	//     } 
	//     for (var i = 0; i < data.length; i++) {
	// 		console.log("Artist Name: " + data.tracks.items[i].artist[i].name);
	// 	};
	// });

	var queryUrl = "https://api.spotify.com/v1/search?query=" + songName + "&offset=0&limit=5&type=track";

	https.get(queryUrl, function (response){
	  var str = '';
	  response.setEncoding('utf8');
	  response.on('data', function (data){
	    str += data;
	  });
	  response.on('end', function (){
	    var jObj = JSON.parse(str);
	    console.log(jObj);
	  });
	})

}


function movieSearch() {
	for (var i = 3; i < nodeArgs.length; i++) {
	  if (i > 3 && i < nodeArgs.length) {
	    movieName = movieName + "+" + nodeArgs[i];
	  }
	  else {
	    movieName += nodeArgs[i];
	  }
	}
	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json";
	// This line is just to help us debug against the actual URL.
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
	  // If the request is successful
	  if (!error && response.statusCode === 200) {
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year); 
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("Country: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors); 
	   	console.log("Rotten Tomatos Rating: " + JSON.parse(body).tomatoRating);
	   	console.log("Rotten Tomatos URL: " + JSON.parse(body).tomatoURL);
	  }
	});
}


function random() {
	
}

