/* eslint-disable */

/**
 * TODO
 *  1) Actually implement a queue
 *  2) Allow for better hand off between spotify and apple
 *
 */


//const main = require("/src/main");
//import toQueue from "/src/main";

//TODO Refactor to hide these from users
function redirect(){
    return 'http://localhost:8080/callback';
}

function clientID(){
    return '43e81766dc6546f1a727947ec9ddf337';
}

function clientSecret(){
    return '41d5c3e36e104a1bacc32e403c2a1b86';
}
//TODO Refactor to hide these from users
var client_id;
var client_secret;

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";

//API Endpoints for Spotify
function endpoint( string ) {
    const endpoint = {
        AUTHORIZE: "https://accounts.spotify.com/authorize",
        TOKEN: "https://accounts.spotify.com/api/token",
        PLAYLISTS: "https://api.spotify.com/v1/me/playlists",
        DEVICES: "https://api.spotify.com/v1/me/player/devices",
        PLAY: "https://api.spotify.com/v1/me/player/play",
        PAUSE: "https://api.spotify.com/v1/me/player/pause",
        NEXT: "https://api.spotify.com/v1/me/player/next",
        PREVIOUS: "https://api.spotify.com/v1/me/player/previous",
        PLAYER: "https://api.spotify.com/v1/me/player",
        TRACKS: "https://api.spotify.com/v1/playlists/{{PlaylistId}}/tracks",
        CURRENTLYPLAYING: "https://api.spotify.com/v1/me/player/currently-playing",
        SHUFFLE: "https://api.spotify.com/v1/me/player/shuffle",
        QUEUE: 	"https://api.spotify.com/v1/me/player/queue",
        SEARCH: "https://api.spotify.com/v1/search",
        RECENT: "https://api.spotify.com/v1/me/player/recently-played",
    };

    return endpoint[string];
}

//Holds queue
let queue = [ ];

let isInit = false;


function onPageLoad(){
    localStorage.removeItem("device");
    isInit = false;
    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            document.getElementById("tokenSection").style.display = 'block';
        }
        else {
            // we have an access token so present device section
            document.getElementById("deviceSection").style.display = 'block';
            currentlyPlaying();
        }
    }
}

/**
 * Used for spotify Authorization
 */
function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect()); // remove param from url
}

/**
 * Used for spotify Authorization
 */
function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

/**
 * Pull up authorization window
 * Used for spotify Authorization
 */
function requestAuthorization(){
    localStorage.setItem("client_id", clientID());
    localStorage.setItem("client_secret", clientSecret());
    var client_id = localStorage.getItem("client_id");
    var client_secret = localStorage.getItem("client_secret");

    let url = endpoint('AUTHORIZE');
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect());
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

/**
 * Generates an access token
 * Used for spotify Authorization
 */
function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect());
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

/**
 * Calls API for a new access token
 * Used for spotify Authorization
 */
function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

/**
 * Makes a call to Spotify API
 * Used for spotify Authorization
 */
function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint('TOKEN'), true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientID() + ":" + clientSecret()));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

/**
 * Callback function for spotify API call, handles response
 * Used for spotify Authorization
 */
function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

/**
 * Gets all spotify devices
 * Used for refreshing and choosing AUX Music as active device
 */
function refreshDevices(){
    callApi( "GET", endpoint('DEVICES'), null, handleDevicesResponse );
}

/**
 * Callback function for spotify devices
 */
function handleDevicesResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        localStorage.removeItem("device");
        localStorage.setItem("device", data.devices[0].id);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}

/**
 * Returns the identifier of the active device
 */
function deviceId(){
    return localStorage.getItem("device");
}

/**
 * General function for calling Spotify API
 * @param method HTTP method (GET/POST/etc)
 * @param url API Reference to Api function
 * @param body JSON Body (if needed)
 * @param callback Function to handle API call responses
 */
function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

/**
 * Calls API for a user's most recently played song
 */
function getRecents(){                             //limit?=1 denotes only the most recent song
   callApi("GET", endpoint("RECENT") + "?limit=1", null, handleRecentsResponse);
}

/**
 * Handles response from API Call
 * Upon succesful call adds the URI of the most recent track to local storage
 */
function handleRecentsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        localStorage.setItem("uri", data.items[0].track.uri);

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}

/**
 * Calls search API reference for both Spotify and Apple using searchbar text
 * Displays results
 */

async function search() {
    let query = document.getElementById("searchbar").value;

    searchSpotify(query);
    let results = await searchApple(query).then(
        function (data) {

            //We only care about the arrays of tracks/songs
            let resultsSpotify = JSON.parse(localStorage.getItem("searchSpotify")).tracks.items;
            let resultsApple = JSON.parse(localStorage.getItem("searchApple")).data;

            console.log(resultsSpotify);
            console.log(resultsApple);

            /***************************************************************
             * TODO Display Spotify and Apple search results in the page   *
             * ResultsApple contains an array of Artists and Songs         *
             * ResultsSpotify contains an array of Artists and Tracks      *
             *                                                             *
             * If not in this await block, apple results won't be loaded   *
             **************************************************************/


            /**
             * Spotify name/artist/album artwork
             * item.name, item.artists[0].name, item.album.images[]
             *
             * Apple name/artist/album artowrk
             * item.attributes.name, item.attributes.artistName, item.attributes.artwork
             */





            /****************************************************************
             *                                                              *
             *                                                              *
             *                                                              *
             ****************************************************************/
        },
        function (error) {
            console.log(error);
        }
    );
}

/**
 * Call to Spotify Search API
 * @param query the value to search
 */
function searchSpotify(query){
    console.log('search for ' + query);                                      //spotify API handles " " char as "%20"
    callApi("GET", endpoint("SEARCH") + "?q=" + query.replaceAll(" ","%20") + "&type=track&limit=5", null,  handleSearchResponse );
}

/**
 * Handles search response, add data to local storage on success
 * TODO Bug if searching first, recent played gets played instead of search result
 */
function handleSearchResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);

        //TODO Modify Implementation
        localStorage.setItem("searchSpotify", JSON.stringify(data));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

/**
 * Determines if a specific URI is apple or spotify and returns the appropriate value
 * spotify uris always include "spotify".  Apple uris are numbers
 * @param uri
 * @returns {string}
 */
function playertype(uri){
    return uri.includes("spotify") ? "spotify" : "apple";
}


/**
 * Push an item to the queue
 */
function addToQueue(uri){
   //TODO Modify to push to Queue object
   queue.push(uri);

   //callApi( "POST", endpoint('QUEUE') + "?uri=" + uri, null, handleApiResponse );

}

/**
 * Play Functions
 * TODO allow Apple and Spotify to hand off control
 */
function play(){
    /*
    if(!isInit){
        startPlayback();
        configMusicKit
        isInit = true;
        pause();
    }
    else {
        currentlyPlaying();
        callPlay();
    } */
    if(!isInit) { configMusicKit(); isInit = true;}
    playApple();

}

/**
 * Pops the next uri and determines what player to use, then starts playback of that uri on that player
 * TODO Fix this mess
 */
function next(){
    let uri = queue.pop();
    playURI(uri.toString());
    if (playertype(uri.toString()) === "Spotify") {
        callPlay(uri.toString());
       pauseApple();
    }
    else {
        playApple();
        pause();
    }
}

/**
 * Initialize Spotify Player for use
 */
function startPlayback(){
    refreshDevices();
    getRecents();
    callPlay();

}

/**
 * Calls spotify Play API using the locally saved URI
 */
function callPlay(){
    uri = localStorage.getItem("uri")
    playURI(uri);
}

/**
 * Call spotify play api using the specified uri
 */
function playURI(uri){
    //let playlist_id = document.getElementById("playlists").value;
    //let trackindex = document.getElementById("tracks").value;
    let body = {};
    body.uris =  [uri];

    callApi( "PUT", endpoint('PLAY') + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}

function pause(){
    pauseSpotify();
    pauseApple();
}

/**
 * Spotify Pause
 * TODO Implement a pause that pauses both players
 */
function pauseSpotify(){
    callApi( "PUT", endpoint('PAUSE') + "?device_id=" + deviceId(), null, handleApiResponse );
}

/*
function next(){
    callApi( "POST", endpoint('NEXT') + "?device_id=" + deviceId(), null, handleApiResponse );
} */

/**
 * Get's spotify's previous track
 */
function previous(){
    callApi( "POST", endpoint('PREVIOUS') + "?device_id=" + deviceId(), null, handleApiResponse );
}

/**
 * Get's Spotify's current track
 */
function currentlyPlaying(){
    callApi( "GET", endpoint('PLAYER') + "?market=US", null, handleCurrentlyPlayingResponse );
}

/* TODO Implement Apple currently playing
function getCurrentlyPlaying(){
  uri = queue.first;
  if(playertype(uri) == "spotify"){
    currentlyPlayingSpotify();
   }
  else {
    // Handle Apple Music
   }
}
*/

/**
 * General function for handling API requests
 */
function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ){
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        //alert(this.responseText);
    }
}

/**
 * Handles current playing call
 * Sets current uri to local uri
 * Gets uri data and displays it
 */
function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        localStorage.setItem("uri", data.item.uri);

        if ( data.item != null ){
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }
    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

/**
 * Apple Functions
 */

// TODO Hide from users
// Valid 180 days from 5/9/2021
function devtoken() {
    return 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjQ5TEdWTjk4TjgifQ.eyJpYXQiOjE2MjA1ODAzMzgsImV4cCI6MTYzNjEzMjMzOCwiaXNzIjoiNlgyNjM3UjNZViJ9.zLkCSfjC1lwtM1jcR2xj6wUeFAErInYVkeqS0uO-n8IQiyTr4yoQNeoLwNS0dhK3scvGr28Jr7SMlK7UlEmWtA'}


let music;

const setupMusicKit = new Promise((resolve) => {
    document.addEventListener("musickitloaded", () => {
        const musicKitInstance = window.MusicKit.configure({
            developerToken: devtoken(),
            app: {
                name: "AUX Music",
                build: "1.0.0",
            },
        });
        music = musicKitInstance;
        //delete window.MusicKit; // clear global scope
        resolve(musicKitInstance);
    });
});


function configMusicKit() {
    setupMusicKit.then(async (musicKit) => {
        try {
            await musicKit.authorize();
            let data = await musicKit.api.recentPlayed().then(
                    function(value) {
                        console.log(value[0].type);
                        let type = value[0].type;
                        if (type == "albums") {
                            musicKit.setQueue({
                                album: value[0].id,
                            });
                        } else {
                            if (type == "songs") {
                                musicKit.setQueue({
                                    song: value[0].id,
                                });
                            }
                        }
                        musicKit.play();
                    },
                    function(error) { /* code if some error */ }
                );
        } catch (error) {
            console.log(error);
        }
    })
}

const playApple = () => {
    return music.play(); // promise
};
const pauseApple = () => {
    music.pause();
};
const nextApple = () => {
    return music.skipToNextItem(); // promise
};
const previousApple = () => {
    music.skipToPreviousItem(); // promise
};


async function searchApple(query) {
    console.log(query);
    let data = await music.api.search(query, { limit: 5, types: 'song' }).then(
        function(results) {
            localStorage.setItem("searchApple", JSON.stringify(results.songs));
        },
        function(error) {
            console.log(error);
        }
    );
}

