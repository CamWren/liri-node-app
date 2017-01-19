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
	var params = {screen_name: 'wrnecmrn1', limit: '20'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (var i = 0; i < tweets.length; i++) {
	  		console.log("                   ");
	  		console.log(tweets[i].created_at);
	  		console.log(tweets[i].text);
	  		console.log("                   ");
	  	}
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

	var queryUrl = "https://api.spotify.com/v1/search?query=" + songName + "&offset=0&limit=5&type=track";

	https.get(queryUrl, function (response){
	  var str = '';
	  response.setEncoding('utf8');
	  response.on('data', function (data){
	    str += data;
	  });
	  response.on('end', function (err, data){
	  if (songName === "" || songName === '""') {
			var queryUrl = "https://api.spotify.com/v1/search?query=ace+of+base+the+sign&offset=0&limit=5&type=track";
			https.get(queryUrl, function (response){
			    var str = '';
			    response.setEncoding('utf8');
			    response.on('data', function (data){
			    	str += data;
			    });
			    response.on('end', function (){
				  	var artistName = JSON.parse(str).tracks.items[0].artists[0].name;
				    var songTitle = JSON.parse(str).tracks.items[0].name;
				    var songPreview = JSON.parse(str).tracks.items[0].external_urls.spotify;
				    var albumTitle = JSON.parse(str).tracks.items[0].album.name;
					console.log("                                                                                     ");
					console.log("Since you didn't search for a song here is your punishment: 'The Sign' by Ace of Base");
					console.log("-------------------------------------------------------------------------------------");
				    console.log(artistName);
				    console.log(songTitle);
				    console.log(songPreview);
				    console.log(albumTitle);
				    console.log("-------------------------------------------------------------------------------------");
				});
			});
		  } else {
			    var artistName = JSON.parse(str).tracks.items[0].artists[0].name;
			    var songTitle = JSON.parse(str).tracks.items[0].name;
			    var songPreview = JSON.parse(str).tracks.items[0].external_urls.spotify;
			    var albumTitle = JSON.parse(str).tracks.items[0].album.name;
				console.log("                                                 ");
				console.log("Here is the information for the song you searched:");
				console.log("--------------------------------------------------");
			    console.log(artistName);
			    console.log(songTitle);
			    console.log(songPreview);
			    console.log(albumTitle);
			    console.log("--------------------------------------------------");
			};
	  });
  });	 
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

	var queryUrlNobody = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&tomatoes=true&r=json";
	// This line is just to help us debug against the actual URL.
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
	  if (movieName === "") {
	  	request(queryUrlNobody, function(error, response, body) {
	  		console.log("                                                                    ");
	  		console.log("Since you didn't search for a movie, here is the info for Mr. Nobody:");
			console.log("--------------------------------------------------------------------");
	  		console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year); 
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors); 
		   	console.log("Rotten Tomatos Rating: " + JSON.parse(body).tomatoRating);
		   	console.log("Rotten Tomatos URL: " + JSON.parse(body).tomatoURL);
		   	console.log("--------------------------------------------------------------------");
	  	});
	  };
	  // If the request is successful
	  if (!error && response.statusCode === 200 && movieName !== "") {
	  	console.log("                                                   ");
	  	console.log("Here is the information for the movie you searched:");
	  	console.log("---------------------------------------------------");
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year); 
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("Country: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Actors: " + JSON.parse(body).Actors); 
	   	console.log("Rotten Tomatos Rating: " + JSON.parse(body).tomatoRating);
	   	console.log("Rotten Tomatos URL: " + JSON.parse(body).tomatoURL);
	   	console.log("---------------------------------------------------");
	  } 
	});
}


function random() {
  fs.readFile('random.txt', 'utf8', (err, data) => {
	
	  if (err) throw err;

	  var output = data.split(',');

	  for (var i = 0; i < output.length; i++) {
	  	console.log(output[i]);
	  }

	  var dwisThing = output[1];

	  songName = dwisThing;

	  songSearch();

	});
}

