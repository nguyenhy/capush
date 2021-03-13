import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
/* package */
import * as DetectRTC from "detectrtc"

@Component({
  selector: 'app-input-config',
  templateUrl: './input-config.component.html',
  styleUrls: ['./input-config.component.scss']
})
export class InputConfigComponent implements OnInit {
  public listMic: Array<Device> = []
  public listCamera: Array<Device> = []
  public listSpeaker: Array<Device> = []
  public localStream: MediaStream | null = null;
  public micFormControl = new FormControl('', Validators.required,)
  public cameraFormControl = new FormControl('', Validators.required,)
  public speakerFormControl = new FormControl('', Validators.required,)
  constructor() { }

  ngOnInit(): void {
    const self = this;
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: false,
    };
    DetectRTC.load(function () {
      console.log(JSON.parse(JSON.stringify(DetectRTC)))
      // has all permission
      if (DetectRTC.isWebsiteHasMicrophonePermissions && DetectRTC.isWebsiteHasWebcamPermissions) {
        self.refreshListInput()
      } else {

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

  __onChooseMic(event) {
    const activeIndex = this.micFormControl.value;
    const selectedMic: Device = this.listMic[activeIndex]
    console.log('__onChooseMic', activeIndex, selectedMic)
    if (selectedMic) {
      if (selectedMic.isCustomLabel) {
        // user change mic but not allow permission to mic
      } else {

      }
    } else {
      // selected mic not found
    }
  }

  __onChooseCamera(event) {
    const activeIndex = this.cameraFormControl.value;
    const selectedCamera: Device = this.listCamera[activeIndex]
    console.log('__onChooseCamera', activeIndex, selectedCamera)
    if (selectedCamera) {
      if (selectedCamera.isCustomLabel) {
        // user change mic but not allow permission to mic
      } else {

      }
    } else {
      // selected mic not found
    }
  }

  __onChooseSpeaker(event) {
    const activeIndex = this.speakerFormControl.value;
    const selectedSpeaker: Device = this.listSpeaker[activeIndex]
    console.log('__onChooseSpeaker', activeIndex, selectedSpeaker)
    if (selectedSpeaker) {
      if (selectedSpeaker.isCustomLabel) {
        // user change mic but not allow permission to mic
      } else {

      }
    } else {
      // selected mic not found
    }
  }


  async refreshListInput() {

    const self = this;
    // refresh all list
    this.listMic = []
    this.listCamera = []
    this.listSpeaker = []
    DetectRTC.load(function () {
      console.log(JSON.parse(JSON.stringify(DetectRTC)))

      self.listMic = DetectRTC.audioInputDevices
      self.listCamera = DetectRTC.audioOutputDevices
      self.listSpeaker = DetectRTC.videoInputDevices
    })
  }

  async askForUserMedia(constraints: MediaStreamConstraints) {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      this.localStream = stream

      this.refreshListInput()
    } catch (error) {
      console.error('getUserMedia', error.name, error.code)
      this.refreshListInput()
      // click close: DOMException: Permission dismissed
      // click block: DOMException: Permission denied
    }
  }

}

/**
 * copy from node_modules/detectrtc/DetectRTC.d.ts
 */
export interface Device {
  deviceId: string;
  groupId: string;
  id: string;
  isCustomLabel?: boolean;
  kind: string;
  label: string;
}