/** TODO
 * SearchSongs -> A list of songs based on search criteria
 * toQueue -> Append specified song to queue
 * @type {e | (() => Express)}
 */



var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
//var cors = require('cors');
var querystring = require('querystring');
//var cookieParser = require('cookie-parser');


//For making a local server
var app = express()
app.use(express.static(__dirname));


//Refactor to hide these from users
function redirect(){
    return 'http://localhost:8888/';
}

function clientID(){
    return '43e81766dc6546f1a727947ec9ddf337';
}

function clientSecret(){
    return '41d5c3e36e104a1bacc32e403c2a1b86';
}
//Refactor to hide these from users
var client_id;
var client_secret;
var redirect_uri;

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";

//API Endpoints
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
    };

    return endpoint[string];
}


function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

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
            refreshDevices();
            refreshPlaylists();
            currentlyPlaying();
        }
    }
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect()); // remove param from url
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

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

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect());
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint('TOKEN'), true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientID() + ":" + clientSecret()));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
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

function refreshDevices(){
    callApi( "GET", endpoint('DEVICES'), null, handleDevicesResponse );
}

function handleDevicesResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "devices" );
        data.devices.forEach(item => addDevice(item));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addDevice(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name;
    document.getElementById("devices").appendChild(node);
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function refreshPlaylists(){
    callApi( "GET", endpoint('PLAYLISTS'), null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "playlists" );
        data.items.forEach(item => addPlaylist(item));
        document.getElementById('playlists').value=currentPlaylist;
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addPlaylist(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node);
}

function removeAllItems( elementId ){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

//MODIFY FOR SEARCHING SONGS
function play(){
    let playlist_id = document.getElementById("playlists").value;
    let trackindex = document.getElementById("tracks").value;
    let body = {};
    body.context_uri = "spotify:playlist:" + playlist_id;
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi( "PUT", endpoint('PLAY') + "?device_id=" + deviceId(), JSON.stringify(body), handleApiResponse );
}

//TODO
function queue(){
    let playlist_id = document.getElementById("playlists").value;
    let trackindex = document.getElementById("tracks").value;
    let body = {};
    body.context_uri = "spotify:playlist:" + playlist_id;
    body.offset = {};
    body.offset.position = trackindex.length > 0 ? Number(trackindex) : 0;
    body.offset.position_ms = 0;
    callApi( "POST", endpoint('QUEUE') + JSON.stringify(body) + "device_id=" + deviceId(), null, handleApiResponse );
}

function shuffle(){
    callApi( "PUT", endpoint('SHUFFLE') + "?state=true&device_id=" + deviceId(), null, handleApiResponse );
    play();
}

function pause(){
    callApi( "PUT", endpoint('PAUSE') + "?device_id=" + deviceId(), null, handleApiResponse );
}

function next(){
    callApi( "POST", endpoint('NEXT') + "?device_id=" + deviceId(), null, handleApiResponse );
}

function previous(){
    callApi( "POST", endpoint('PREVIOUS') + "?device_id=" + deviceId(), null, handleApiResponse );
}

function currentlyPlaying(){
    callApi( "GET", endpoint('PLAYER') + "?market=US", null, handleCurrentlyPlayingResponse );
}

function transfer(){
    let body = {};
    body.device_ids = [];
    body.device_ids.push(deviceId())
    callApi( "PUT", endpoint('PLAYER'), JSON.stringify(body), handleApiResponse );
}

//Check if good request, check if
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
        alert(this.responseText);
    }
}

function deviceId(){
    return document.getElementById("devices").value;
}

function fetchTracks(){
    let playlist_id = document.getElementById("playlists").value;
    if ( playlist_id.length > 0 ){
        url = endpoint('TRACKS').replace("{{PlaylistId}}", playlist_id);
        callApi( "GET", url, null, handleTracksResponse );
    }
}

function handleTracksResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "tracks" );
        data.items.forEach( (item, index) => addTrack(item, index));
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addTrack(item, index){
    let node = document.createElement("option");
    node.value = index;
    node.innerHTML = item.track.name + " (" + item.track.artists[0].name + ")";
    document.getElementById("tracks").appendChild(node);
}


function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.item != null ){
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }


        if ( data.device != null ){
            // select device
            currentDevice = data.device.id;
            document.getElementById('devices').value=currentDevice;
        }

        if ( data.context != null ){
            // select playlist
            currentPlaylist = data.context.uri;
            currentPlaylist = currentPlaylist.substring( currentPlaylist.lastIndexOf(":") + 1,  currentPlaylist.length );
            document.getElementById('playlists').value=currentPlaylist;
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


app.listen(8888);