// vars
// requires for other pages and npms
var fs = require("fs");
var keys = require("./keys.js");
//var env = require(".env");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var inquirer = require("inquirer");
//require('dotenv').config();
var userInput = '';

//list in command promt with selections/commands
inquirer
    .prompt([

        {
            type: "list",
            message: "Pick a command",
            choices: ["my_tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "commandList"
        },
    ])
    //promise for movie input
    .then(function(inquirerResponse){
    	userInput = inquirerResponse.commandList;
    	console.log(userInput);
    	if (userInput === "movie-this") {
    		inquirer
    			.prompt([{
    				type: "input",
    				message: "Type in your Movie...Or Not",
    				name: "nodeInput"
    			}, ])
    			.then(function(inquirerResponse) {
    				runMovie(inquirerResponse.nodeInput);
    			});
    	};
    	//for spotify
    	if (userInput === "spotify-this-song") {
    		inquirer
    			.prompt([{
    				type: "input",
    				message: "Type in your song",
    				name: "nodeInput"
    		}, ])
    		.then(function(inquirerResponse) {
    			runSpotify(inquirerResponse.nodeInput);
    		});
    	};
    	//for tweets
    	if (userInput === "my_tweets") {
    		runTwitter();
    	};
    	//other
    	if (userInput === "do-what-it-says") {
    		runDo();
    	};

    });

//function to run twitter
function runTwitter() {

//links to twitter keys on keys.js
//keys is varibale at top linking to js via require
//twitterKeys is title in js
//last . is for exact item selected
var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

//accesses twitter data to pull tweets
var params = {screen_name: 'awiens037'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  //log if error
  if (error) {
  	console.log(error);
  }
  else if (!error) {
  	for (i = 0; i < tweets.length && i < 19; i++) {
  		var twitterData = tweets[i].text
  		console.log(twitterData);
  		fs.appendFile("log.txt", tweets[i].text + "\n", function(err) {});
  	}
    fs.appendFile("log.txt", "---------" + "\n", function(err) {});
  }

});

} 

//Spotify Function
//calls keys.js, selects client id and secret
function runSpotify(song) {
	var spotify = new Spotify ({
		id: keys.spotifyKeys.clientID,
		secret: keys.spotifyKeys.consumer_secret
	});

//see npm docs for spotify on how to search
	spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var track = data.tracks.items[0];
        console.log(track.artists[0].name);
        console.log(track.name);
        console.log(track.preview_url);
        console.log(track.album.name);
        fs.appendFile("log.txt", track.artists[0].name + "\n", function(err) {});
        fs.appendFile("log.txt", track.name + "\n", function(err) {});
        fs.appendFile("log.txt", track.preview_url + "\n", function(err) {});
        fs.appendFile("log.txt", track.album.name + "\n", function(err) {});
        fs.appendFile("log.txt", "----------------------" + "\n", function(err) {});
    });

}

//omdb movie function
function runMovie(movieName) {
	//request to omdb api 
	var movieURL = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&type&apikey=f7e4897b'
	request(movieURL, function(error, response, body) {
		//if request successful, response code = 200
		if (!error && response.statusCode === 200) {
			if (movieName === "") {
				console.log('If you haven\'t watched Mr. Nobody you should:http://imdb.com/title/tt0485947/');
			} else {
				//Parse body of site and recover rating
				console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors/Actress's: " + JSON.parse(body).Actors);
                console.log("Tomato Url: " + JSON.parse(body).Website);
                fs.appendFile("log.txt", JSON.parse(body).Title + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).Year + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).imdbRating + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).Country + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).Language + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).Plot + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).Actors + "\n", function(err) {});
                fs.appendFile("log.txt", JSON.parse(body).Website + "\n", function(err) {});
                fs.appendFile("log.txt", "--------------" + "\n", function(err) {});
			}
		}
	});
}

//do-what-it-says function
function runDo() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		console.log(data);
		var dataArray = data.split(",");
		runSpotify(dataArray[1]);
	});
}