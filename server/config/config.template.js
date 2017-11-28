// create a file in this directory called 'config.js' and use the template below
// make sure you .gitignore that file
var config = {};

config.twitter = {};
config.twitter.OAuthConsumerKey = '';
config.twitter.OAuthConsumerSecret = '';
config.twitter.OAuthAccessToken = '';
config.twitter.OAuthAccessTokenSecret = '';

/**
 * to generate a self signed cert for local use:
 * openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
 */
config.ssl = {};
config.ssl.useSSL = false;
config.ssl.keyPath = '';
config.ssl.certPath = '';

module.exports = config;
