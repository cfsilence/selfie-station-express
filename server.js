// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const config = require('./server/config/config.js');

// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);
app.use('/blueimp', express.static(__dirname + '/node_modules/blueimp-canvas-to-blob/'));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * SSL config
 */
const options = {
  key: fs.readFileSync(config.ssl.keyPath),
  cert: fs.readFileSync(config.ssl.certPath)
};

/**
 * Create HTTP server.
 */
let server;
if( config.ssl.useSSL ) {
  server = https.createServer(options, app);
}
else {
  server = http.createServer(app);
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
