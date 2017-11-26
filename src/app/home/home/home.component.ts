import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {NgForm} from "@angular/forms";
import {Util} from "../../shared/util/util";
import {environment} from '../../../environments/environment';
import {Title} from "@angular/platform-browser";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('cameraFeed')
  cameraFeedEl: any;
  @ViewChild('canvas')
  canvasEl: any;
  @ViewChild('snapShot')
  snapShotEl: any;
  @ViewChild('shutter')
  shutterEl: any;
  @ViewChild('controls')
  controlsEl: any;
  @ViewChild('videoContainer')
  videoContainerEl: any;
  @ViewChild('tweet')
  tweetEl: any;
  @ViewChild(NgForm)
  tweetForm: any;

  countdown: number;
  controlsStyle: any;
  imageSrc: any;
  _navigator = <any> navigator;
  localStream: any;
  isStreaming = false;
  status = '';
  successMessage: string;
  tweetFailedMessage: string;
  errorMessage: string;
  sending = false;
  footerDisabled = false;


  constructor( private changeDetectorRef: ChangeDetectorRef, private titleService: Title ) {
    titleService.setTitle('Selfie Station!')
    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => {
        this.onResize(event);
      });
  }

  ngOnInit() {
    this._navigator = <any>navigator;
    this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
      || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );
    if( this._navigator.getUserMedia ) {
      try{
        this.startFeed();
      }
      catch(e){
        // fail silently, they'll have to click the button to start the feed
      }
    }
  }

  startFeed() {
    const video = this.cameraFeedEl.nativeElement;

    this._navigator.mediaDevices.getUserMedia({video: true})
      .then((stream) => {
        this.localStream = stream;
        video.src = window.URL.createObjectURL(stream);
        video.play();
      })
      .catch((error) =>{
        this.errorMessage = `Error accessing camera: "${error.name}"`
      });
    const self = this;
    video.onloadeddata = (event) => {
      self.isStreaming = true;
      this.changeDetectorRef.detectChanges();
      this.controlsStyle = {width: event.currentTarget.offsetWidth + 'px'};
    }
  }

  takeSnapshot(){
    const video = this.cameraFeedEl.nativeElement;
    const canvas = this.canvasEl.nativeElement;
    const context = canvas.getContext('2d');
    const width = video.videoWidth;
    const height = video.videoHeight;

    const self = this;
    let c = 3;
    let interval;

    const snapIt = function(){
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        self.imageSrc = canvas.toDataURL('image/png');
      }
      self.shutterEl.nativeElement.play();
    }

    const counter = function(){
      c = c-1;
      self.countdown = c;
      if( c === 0 ) {
        clearInterval(interval);
        snapIt();
        self.countdown = null;
        self.share();
      }
    }

    self.countdown = c;
    interval = setInterval(counter, 1000);

    return false;
  }

  discardSnapshot() {
    this.imageSrc = null;
    return false;
  }

  share() {
    $('#shareModal').modal('show');
    this.tweetFailedMessage = '';
    const self = this;
    $('#shareModal').one('shown.bs.modal', function(){
      //$('#tweet').focus();
    });
    $('#shareModal').one('hidden.bs.modal', function(){
      self.discardSnapshot();
    });

    return false;
  }

  onResize(event) {
    const videoContainer = this.videoContainerEl.nativeElement;
    this.controlsStyle = {width: videoContainer.offsetWidth + 'px'};
  }

  tweetSubmit() {
    const f = Util.dataURLtoFile(this.imageSrc, 'snapshot.png');
    const form = new FormData();
    form.append('tweet', this.status);
    form.append('uploadFile', f);

    this.sending = true;

    fetch(environment.serviceUrl, {
      method: 'post',
      body: form
    })
      .then((response) =>{
        const self = this;
        self.successMessage = 'Posted to Twitter!';
        self.sending = false;
        self.footerDisabled = true;
        setTimeout(()=>{
          $('#shareModal').modal('hide');
          self.successMessage = '';
          self.footerDisabled = false;
        }, 2500);
      })
      .catch((e) =>{
        this.tweetFailedMessage = 'Failed to Post to Twitter.  Is the service running?'
        this.sending = false;
        this.footerDisabled = false;
      });
  }

}
