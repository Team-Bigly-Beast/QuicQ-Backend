const express = require('express'); // module for express router
const session = require('express-session');
const http = require('http'); // module for http server
const { env } = require('process');

const request = require("request");

const cookieParser = require("cookie-parser");
const querystring = require("querystring");
const cors = require("cors");

const User = require('./user.js');
const Room = require('./room.js');

const userMap = new Map;
const roomMap = new Map;

const app = express(); // init express router and assign it to variable app

/* Create an HTTP server to handle responses */

const client_id = env.CLIENT_ID; // Your client id
const client_secret = env.CLIENT_SECRET; // Your secret
const redirect_uri = env.REDIRECT_URI
const scope = env.SCOPES;
const stateKey = 'spotify_auth_state';

console.log(redirect_uri)
// assigns wwwRoot to correct location
const wwwRoot = (env.NODE_ENV == "development") ? "src/www" : "build/www"
app.use(cookieParser()); 


app.get('/', function (req, res) {
    res.clearCookie("room_id");
    res.clearCookie("room_pass");
    res.sendFile('index.html', { root: wwwRoot });
});

app.use(express.static(wwwRoot)).use(cors()).use(cookieParser());// tell app to use index.html at build/www


const sessionParser = session({
    saveUninitialized: false,
    secret: generateRandomString(5),
    resave: false
});

app.use(express.urlencoded());
app.use(sessionParser);

// creates the server and sets it to use the express router we set up earlier 
const server = http.createServer(app);

function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.post("/room", function (req, res) {
    
    const access_token = req.cookies['access_token']
    if (userMap.has(access_token)) {
        const id = generateRandomString(6);
        const pass = (req.body.room_pass !== "") ? req.body.room_pass : generateRandomString(6)
        roomMap.set(id, new Room(id, pass, userMap.get(access_token)));
        res.end(`/room@${id}`);
    }
    else {
        res.status(400).end("User unable to start a room :(");
    }

});

app.post('/joinRoom', function (req, res) {
    const data = req.body;
    console.log(req.body)
    if (roomMap.has(data.room_id)) {
        const room = roomMap.get(data.room_id);
        if (data.room_pass === room.getRoomPassword()) {
            room.addUser(req.cookies['access_token']);
            res.end(`/room@${data.room_id}`)
        }
        else {
            res.status(401).end("Bad Password!")
        }
    }
    else {
        res.status(404).end("Room Not Found")
    }
});

app.get("/room@:id", function (req, res) {
    if (roomMap.has(req.params.id)) {
        const room = roomMap.get(req.params.id);
        res.cookie("room_id", room.getRoomID());
        res.cookie("room_password", room.getRoomPassword());
        res.sendFile("room.html", { root: wwwRoot });
    }
    else {
        res.redirect('/');
    }
});

app.post('/addSong', function (req, res) {
    const data = req.body;
    if (roomMap.has(data.roomID)) {
        const room = roomMap.get(data.roomID);
        if (room.getUser(data.access_token)) {
            const owner = room.getOwner();
            const auth = {
                url: `https://api.spotify.com/v1/me/player/queue?uri=${data.songURI}`,
                type: 'POST',
                data: { device_id: "", },
                headers: {
                    Accept: 'application/json',
                    'Content-Type': "application/json",
                    //If your header name has spaces or any other char not appropriate
                    Authorization: `Bearer ${owner.getAccessKey()}`
                    //for object property name, use quoted notation shown in second
                },
                dataType: 'json',
                success: function (data) {
                    console.log(`Song Added To Queue: ${data.song}`);
                }
            }
            console.log(auth);
            request.post(auth, (error, response, body) => {
                res.statusCode = response.statusCode;
                res.send();
            });
        }
    }
});


app.get('/user', function (req, res) {
    // console.log(req.cookies)
    var accessToken = req.cookies ? req.cookies['access_token'] : null;
    if (userMap.has(accessToken)) {
        res.cookie("profile_picture", userMap.get(accessToken).getImage());
        res.cookie("username", userMap.get(accessToken).getUserName());

        res.sendFile("join.html", { root: wwwRoot });
    }
    else {
        res.redirect('/');
        return;
    }
    
});

app.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })
    );
});

app.get('/callback', function (req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
    }
    else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                res.cookie("access_token", access_token);
                res.cookie("refresh_token", refresh_token);
                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(`Logged in user`);
                    console.log(body)
                    userMap.set(access_token, new User(body, access_token));
                    res.redirect('/user');
                });

                // we can also pass the token to the browser to make requests from there
            }
            else {
                res.redirect('/' +
                    querystring.stringify({
                        error: 'invalid_token'
                    })
                );
            }
        });
    }
});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});


// Start the server.
server.listen(env.PORT || 8080, () => {
    if (env.NODE_ENV == "development")
        console.log('Listening at http://localhost:8080');
});