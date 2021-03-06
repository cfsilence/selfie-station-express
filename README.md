# Selfie Station Express

## About
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

This is a super simple Angular 4 application that was inspired by [this](https://jsfiddle.net/dannymarkov/cuumwch5/) demo of taking a snapshot in the browser.

It's intended to POST the snapshot along with a status of up to 280 characters to a Node backend that uses Express which then posts to the Twitter account.

A simple use for this application might be for a conference or event to allow users to post a selfie from their event to the event's Twitter feed.

## Launching

From the project root, run `npm run build` to build the Angular app and launch the Express server.  The app will then be running at `http://localhost:3000`.

## Screenshots

Launching the camera (only shown if browser blocks auto launch):

![Launch Camera](https://s3.amazonaws.com/img.recursive.codes/Screenshot_20171124_225720.png)

Camera interface:

![Camera](https://s3.amazonaws.com/img.recursive.codes/Screenshot_20171128_230803.png)

Sharing Via Twitter:

![Tweeting](https://s3.amazonaws.com/img.recursive.codes/Screenshot_20171128_230824.png)


## Server Config

Create a copy of server/config/config.template.js in the same directory and populate it with your Twitter API info.  Add that file to .gitignore to keep it out of source control.

## Client Config

Update the environment.* files as necessary to point the service at the proper endpoint.

## SSL

If you'd like to use SSL (*Recommended - some browsers block getUserMedia() in insecure contexts*), edit the `config` as necessary:

```
config.ssl = {};
config.ssl.useSSL = false;
config.ssl.keyPath = '';
config.ssl.certPath = '';
```

*If you choose to use SSL make sure that the Angular service URL (in `environment.ts`) reflects https!*

## Note

This is my first Node/Express app.  It's a simple one, but feedback is welcomed.  

## Contact

toddraymondsharp@gmail.com

[http://recursive.codes](http://recursive.codes)
