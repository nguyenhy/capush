import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss']
})
export class VideoStreamComponent implements OnInit {
  hasStream: boolean = false
  constructor(
    private ElementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    const self = this;

  }

  updateStream(mediaStream: MediaStream | null) {
    this.hasStream = !!mediaStream
    if (mediaStream) {
      const nativeElement = this.ElementRef.nativeElement as HTMLElement
      const $videoElement: HTMLVideoElement | null = nativeElement.querySelector('video')
      if ($videoElement) {
        $videoElement.srcObject = mediaStream
      }
    } else {

    }
  }

}
