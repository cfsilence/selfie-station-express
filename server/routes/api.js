const express = require('express');
const fs = require('fs');
const router = express.Router();
const Twitter = require('twitter');
const multer  = require('multer');
var storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: {fieldSize: 5*1024*1024} });

const config = require('../config/config.js');

const client = new Twitter({
  consumer_key: config.twitter.OAuthConsumerKey,
  consumer_secret: config.twitter.OAuthConsumerSecret,
  access_token_key: config.twitter.OAuthAccessToken,
  access_token_secret: config.twitter.OAuthAccessTokenSecret
});

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.post('/tweet', upload.single('uploadFile'), (req, res) => {
  client.post('media/upload', {media: req.file.buffer})
    .then(function(response){
      client.post('statuses/update', {status: req.body.tweet, media_ids: response.media_id_string})
        .then(function(tweet){
          res.send(tweet);
        })
        .catch(function(error){
          throw error;
        })
    })
    .catch(function(error){
      throw error;
    });
});

module.exports = router;
