import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import * as DetectRTC from 'detectrtc';
import { IDevice, IOSettingService } from 'src/app/service/settings/io-setting/io-setting.service';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss']
})
export class VideoStreamComponent implements OnInit {
  hasStream: boolean = false
  mediaStream: MediaStream | null = null
  constructor(
    private ChangeDetectorRef: ChangeDetectorRef,
    private ElementRef: ElementRef,
    private IOSettingService: IOSettingService
  ) { }

  ngOnInit(): void {
    const self = this;

  }

  updateStream(mediaStream: MediaStream | null) {
    this.hasStream = !!mediaStream
    this.ChangeDetectorRef.detectChanges()
    if (mediaStream) {
      const nativeElement = this.ElementRef.nativeElement as HTMLElement
      const $videoElement: HTMLVideoElement | null = nativeElement.querySelector('video')
      if ($videoElement) {
        this.stopAllTrack()

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

  stopAllTrack() {
    if (!this.mediaStream) {
      return
    }

    const track = this.mediaStream.getTracks()
    if (track && track.length) {
      track.forEach(function (item) {
        item.stop()
      })
    }
  }

}



interface HTMLVideoElementSink extends HTMLVideoElement {
  setSinkId: (sinkId: string) => Promise<any>
}