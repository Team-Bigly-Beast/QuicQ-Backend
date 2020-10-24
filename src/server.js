const express = require('express'); // module for express router
const http = require('http'); // module for http server
const { env } = require('process');

const app = express(); // init express router and assign it to variable app

// assigns wwwRoot to correct location
const wwwRoot = (env.NODE_ENV == "development") ? "src/www" : "build/www"
app.use(express.static(wwwRoot)); // tell app to use index.html at build/www

// creates the server and sets it to use the express router we set up earlier 
const server = http.createServer(app);

// define the first route
app.get("/", function (req, res) {
    res.sendFile("index.html")
});

// Start the server.
server.listen(env.PORT || 8080, () => {
    if (env.NODE_ENV == "development")
        console.log('Listening at http://localhost:8080');
});