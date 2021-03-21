import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as DetectRTC from 'detectrtc';
import { IDevice, InputConfigService } from 'src/app/service/input-config/input-config.service';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss']
})
export class VideoStreamComponent implements OnInit {
  hasStream: boolean = false
  constructor(
    private ElementRef: ElementRef,
    private InputConfigService: InputConfigService
  ) { }

  ngOnInit(): void {
    const self = this;

    this.updateStream(this.InputConfigService.getCurrentStream())

    this.InputConfigService.localStreamObservable.subscribe((mediaStream) => {
      this.updateStream(mediaStream)
    })
    this.InputConfigService.outputAudioObservable.subscribe((device) => {
      this.setSinkId(device)
    })
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

  setSinkId(device: IDevice | null) {
    if (!DetectRTC.isSetSinkIdSupported) {
      return
    }

    if (device) {
      const nativeElement = this.ElementRef.nativeElement as HTMLElement
      const $videoElement: HTMLVideoElement | null = nativeElement.querySelector('video')
      if ($videoElement) {
        const $video = $videoElement as HTMLVideoElementSink
        $video.setSinkId(device.deviceId)
      }
    } else {

    }
  }

}



interface HTMLVideoElementSink extends HTMLVideoElement {
  setSinkId: (sinkId: string) => Promise<any>
}