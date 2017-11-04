
var action = process.argv[2];
var value = process.argv[3];

var keys = require("./key.js");

var Twitter = require('twitter');
var Spotify = require("spotify-web-api-node");

// Twitter keys
var consumerKey = keys.twitterKeys.consumer_key;
var consumerSecret = keys.twitterKeys.consumer_secret;
var accessTokenKey = keys.twitterKeys.access_token_key;
var accessTokenSecret = keys.twitterKeys.access_token_secret;

// Spotify Keys
var id = keys.spotifyKeys.id;
var secret = keys.spotifyKeys.secret;

var client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret,
});

var spotify = new Spotify({
    client_id: id,
    client_secret: secret,
});


var params = {
    screen_name: "P_Ross_7",
    count: 20
};

var request = require("request");
var fs = require("fs");

switch (action) {
    case "movie-this":
        movieThis(value);
        break;
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong(value);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

//omdb function 

function movieThis(value) {

    if (value == null) {
        value = "Mr. Nobody";
    }

    request("http://www.omdbapi.com/?t=" + value + "&tomatoes=true&r=json&apikey=40e9cece", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            jsonBody = JSON.parse(body);
            console.log("===============================");
            console.log("Title: " + jsonBody.Title);
            console.log("Year: " + jsonBody.Year);
            console.log("IMDB Rating: " + jsonBody.imdbRated);
            console.log("Rotten Tomatoes Rating: " + jsonBody.tomatoRating);
            console.log("Country: " + jsonBody.Country);
            console.log("Languae: " + jsonBody.Language);
            console.log("Plot: " + jsonBody.Plot);
            console.log("Actors: " + jsonBody.Actors);
            console.log("===============================");

        }

    });

}

// my-tweets function

function myTweets() {

    client.get("statuses/user_timeline", params, function (error, tweets, response) {

        console.log("===============================");
        console.log("Last 20 Tweets: ")

        for (var i = 0; i < tweets.length; i++) {

            var number = i + 1;
            console.log("===============================");
            console.log(number + ". " + tweets[i].text);
            console.log("===============================");

        }

    });

}

// spotify-this-song function 
spotify.clientCredentialsGrant()
    .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotify.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err.message);
    });

function spotifyThisSong(value) {

    if (value == null) {
        value = "The+Sign";
    }

    request("https://api.spotify.com/v1/search?q=" + value + "&type=track", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            jsonBody = JSON.parse(body);
            console.log("===============================");
            console.log("Artist: " + jsonBody.tracks.items[0].artists[0].name);
            console.log("Song: " + jsonBody.tracks.items[0].name);
            console.log("Preview Link: " + jsonBody.tracks.items[0].preview_url);
            console.log("Album: " + jsonBody.tracks.items[0].album.name);
            console.log("===============================");

        }

    });
}

// do-what-it-says function

function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {

            console.log(error);

        } else {

            var dataArr = data.split(",");

            if (dataArr[0] === "spotify-this-song") {

                spotifyThisSong(dataArr[1]);

            }

            request("https://api.spotify.com/v1/search?q=" + value + "&type=track", function (error, response, body) {

                jsonBody = JSON.parse(data);
                console.log("===============================");
                console.log("Artist: " + jsonBody.tracks.items[0].artists[0].name);
                console.log("Song: " + jsonBody.tracks.items[0].name);
                console.log("Preview Link: " + jsonBody.tracks.items[0].preview_url);
                console.log("Album: " + jsonBody.tracks.items[0].album.name);
                console.log("===============================");

            });

        }

    });

}