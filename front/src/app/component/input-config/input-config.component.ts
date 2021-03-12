import { Component, OnInit } from '@angular/core';
/* package */
import * as DetectRTC from "detectrtc"

@Component({
  selector: 'app-input-config',
  templateUrl: './input-config.component.html',
  styleUrls: ['./input-config.component.scss']
})
export class InputConfigComponent implements OnInit {
  public listMic: Array<IMediaDeviceInfo> = []
  public listCamera: Array<IMediaDeviceInfo> = []
  public listSpeaker: Array<IMediaDeviceInfo> = []
  private localStream: MediaStream | null = null
  constructor() { }

  ngOnInit(): void {
    const self = this;
    const constraints = {
      audio: false,
      video: false,
    };
    DetectRTC.load(function () {
      console.log(DetectRTC)
      // has all permission
      if (DetectRTC.isWebsiteHasMicrophonePermissions && DetectRTC.isWebsiteHasWebcamPermissions) {
        self.refreshListInput()
      } else {

        // just incase
        self.refreshListInput()
        if (DetectRTC.isWebsiteHasMicrophonePermissions) {
          // doesn't as microphone permission
          constraints.audio = true

        } else if (DetectRTC.isWebsiteHasWebcamPermissions) {
          // doesn't as webcam permission
          constraints.video = true

        } else {
          // doesn't as any permission
          constraints.audio = true
          constraints.video = true

        }
        self.askForUserMedia(constraints)
      }
    })

  }

  async refreshListInput() {
    const self = this;
    const mediaDeviceInfo: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices()
    console.log(mediaDeviceInfo)
    if (mediaDeviceInfo) {
      mediaDeviceInfo.forEach(function (item) {
        if (item.kind === 'audioinput') {
          // mic
          self.listMic.push({
            ...item,
            label: item.label || `microphone ${self.listMic.length + 1}`,
          })
        } else if (item.kind === 'videoinput') {
          // cam
          self.listCamera.push({
            ...item,
            label: item.label || `camera ${self.listMic.length + 1}`,
          })
        } else if (item.kind === 'audiooutput') {
          // speaker
          self.listSpeaker.push({
            ...item,
            label: item.label || `speaker ${self.listMic.length + 1}`,
          })
        }
      })
    } else {

    }
  }

  askForUserMedia(constraints: MediaStreamConstraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream: MediaStream) {
        console.log(stream)
      }).catch(function (error) {
        console.error('getUserMedia', error)
        // click close: DOMException: Permission dismissed
        // click block: DOMException: Permission denied
      })
  }

}


export interface IMediaDeviceInfo extends MediaDeviceInfo {
  label: string
}