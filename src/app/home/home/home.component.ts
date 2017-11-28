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

  countdownMessage: string;
  successMessage: string;
  overlayMessage: string;
  overlayError: string;
  controlsStyle: any;
  imageSrc: any;
  _navigator = <any> navigator;
  localStream: any;
  isStreaming = false;
  status = '';
  errorMessage: string;

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
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          video.src = window.URL.createObjectURL(stream);
        }
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
    // maintain the aspect ratio
    const ratio = video.videoWidth / video.videoHeight;
    const width = this.videoContainerEl.nativeElement.offsetHeight * ratio;
    const height = this.videoContainerEl.nativeElement.offsetHeight;
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
      self.countdownMessage = c.toString();
      if( c === 0 ) {
        clearInterval(interval);
        snapIt();
        self.countdownMessage = null;
      }
    }

    self.countdownMessage = c.toString();
    interval = setInterval(counter, 1000);

    return false;
  }

  discardSnapshot() {
    this.countdownMessage = null;
    this.overlayMessage = null;
    this.successMessage = null;
    this.overlayError = null;
    this.imageSrc = null;
    return false;
  }

  onResize(event) {
    const video = this.cameraFeedEl.nativeElement;
    // maintain the aspect ratio
    const ratio = video.videoWidth / video.videoHeight;
    const width = this.videoContainerEl.nativeElement.offsetHeight * ratio;
    this.controlsStyle = {width: width + 'px'};
  }

  tweetSubmit() {
    const f = Util.dataURLtoFile(this.imageSrc, 'snapshot.png');
    const form = new FormData();
    form.append('tweet', this.status);
    form.append('uploadFile', f);
    this.overlayMessage = '<i class="fa fa-refresh fa-spin"></i> Posting...'

    fetch(environment.serviceUrl, {
      method: 'post',
      body: form
    })
      .then((response) =>{
        const self = this;
        self.overlayMessage = null;
        self.successMessage = 'Posted to Twitter!';
        setTimeout(()=>{
          self.discardSnapshot()
        }, 2500);
      })
      .catch((e) =>{
        const self = this;
        this.countdownMessage = null;
        this.overlayMessage = null;
        this.successMessage = null;
        self.overlayError = 'Failed to Post to Twitter.  Is the service running?'
        setTimeout(()=>{
          self.discardSnapshot()
        }, 2500);
      });
  }

}
