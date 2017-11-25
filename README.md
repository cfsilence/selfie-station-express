# Selfie Station Express

## About
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

This is a super simple Angular 4 application that was inspired by [this](https://jsfiddle.net/dannymarkov/cuumwch5/) demo of taking a snapshot in the browser.

It's intended to POST the snapshot along with a status of up to 280 characters to a Node backend that uses Express which then posts to the Twitter account.

A simple use for this application might be for a conference or event to allow users to post a selfie from their event to the event's Twitter feed.

## Launching

From the project root, run `npm run build` to build the Angular app and launch the Express server.  The app will then be running at `http://localhost:3000`.

## Screenshots

Launching the camera:

![Launch Camera](https://s3.amazonaws.com/img.recursive.codes/Screenshot_20171124_225720.png)

Camera interface:

![Camera](https://s3.amazonaws.com/img.recursive.codes/Screenshot_20171124_230207.png)

Sharing Via Twitter:

![Tweeting](https://s3.amazonaws.com/img.recursive.codes/Screenshot_20171124_230228.png)


## Server Config

Create a copy of server/config/config.template.js in the same directory and populate it with your Twitter API info.  Add that file to .gitignore to keep it out of source control.

## Client Config

Update the environment.* files as necessary to point the service at the proper endpoint.

## Note

This is my first Node/Express app.  It's a simple one, but feedback is welcomed.  

## Contact

toddraymondsharp@gmail.com
[http://recursive.codes](http://recursive.codes)
