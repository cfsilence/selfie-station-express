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

  controlsStyle: any;
  imageSrc: any;
  _navigator = <any> navigator;
  localStream: any;
  isStreaming = false;
  status: string;
  successMessage: string;
  errorMessage: string;
  sending = false;

  constructor( private changeDetectorRef: ChangeDetectorRef, private titleService: Title ) {
    titleService.setTitle('Selfie Station!')
    Observable.fromEvent(window, 'resize')
      .debounceTime(500)
      .subscribe((event) => {
        this.onResize(event);
      });
  }

  ngOnInit() {
  }

  startFeed() {
    const video = this.cameraFeedEl.nativeElement;
    this._navigator = <any>navigator;

    this._navigator.getUserMedia = ( this._navigator.getUserMedia || this._navigator.webkitGetUserMedia
      || this._navigator.mozGetUserMedia || this._navigator.msGetUserMedia );

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

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      this.imageSrc = canvas.toDataURL('image/png');
    }
    this.shutterEl.nativeElement.play();
    return false;
  }

  discardSnapshot() {
    this.imageSrc = null;
    return false;
  }

  share() {
    $('#shareModal').modal('show');
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
    const formGroup = this.tweetForm.form;
    Util.validateAllFormFields(formGroup);
    if(formGroup.valid) {
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
          $('#shareModal').modal('hide');
          const self = this;
          self.successMessage = 'Sent!';
          self.sending = false;
          setTimeout(()=>{self.successMessage = '';}, 2500);
        });
    }
  }

}
