import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  public micFormControl = new FormControl(0, Validators.required,)
  public cameraFormControl = new FormControl(0, Validators.required,)
  public speakerFormControl = new FormControl(0, Validators.required,)
  constructor(
    private ElementRef: ElementRef,
    private ChangeDetectorRef: ChangeDetectorRef,
  ) {

  }

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
    const activeIndex = event.value;
    const selectedMic: Device = this.listMic[activeIndex]
    console.log('__onChooseMic', activeIndex, selectedMic)
    if (selectedMic) {
      if (selectedMic.isCustomLabel) {
        // user change mic but not allow permission to mic
      } else {
        this.updateMicStream()
      }
    } else {
      // selected mic not found
    }
  }

  __onChooseCamera(event) {
    const activeIndex = event.value;
    const selectedCamera: Device = this.listCamera[activeIndex]
    console.log('__onChooseCamera', activeIndex, selectedCamera)
    if (selectedCamera) {
      if (selectedCamera.isCustomLabel) {
        // user change camera but not allow permission to camera
      } else {
        this.updateCameraStream(selectedCamera)
      }
    } else {
      // selected camera not found
    }
  }

  __onChooseSpeaker(event) {
    const activeIndex = event.value;
    const selectedSpeaker: Device = this.listSpeaker[activeIndex]
    console.log('__onChooseSpeaker', activeIndex, selectedSpeaker)
    if (selectedSpeaker) {
      if (selectedSpeaker.isCustomLabel) {
        // user change speaker but not allow permission to speaker
      } else {
        this.updateSpeaker()
      }
    } else {
      // selected speaker not found
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
      self.listCamera = DetectRTC.videoInputDevices
      self.listSpeaker = DetectRTC.audioOutputDevices
    })
  }

  async askForUserMedia(constraints: MediaStreamConstraints) {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      this.localStream = stream
      this.ChangeDetectorRef.detectChanges()

      this.refreshListInput()
      return stream
    } catch (error) {
      console.error('getUserMedia', error.name, error.code)
      this.refreshListInput()
      // click close: DOMException: Permission dismissed
      // click block: DOMException: Permission denied
      return null
    }
  }


  async updateMicStream() {
    if (this.localStream) {
      const track = this.localStream.getTracks()
      if (track && track.length) {
        track.forEach(function (item) {
          item.stop()
        })
      }
    }

    const constraints: MediaStreamConstraints = {
      audio: true,
      video: true,
    };
    const stream = await this.askForUserMedia(constraints)
    const nativeElement = this.ElementRef.nativeElement as HTMLElement
    const $videoElement: HTMLVideoElement | null = nativeElement.querySelector('video')
    if ($videoElement) {
      $videoElement.srcObject = stream
    }
  }

  async updateCameraStream(device: Device) {
    if (this.localStream) {
      const track = this.localStream.getTracks()
      if (track && track.length) {
        track.forEach(function (item) {
          item.stop()
        })
      }
    }

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: {
          exact: device.deviceId
        }
      },
    };
    const stream = await this.askForUserMedia(constraints)

    const nativeElement = this.ElementRef.nativeElement as HTMLElement
    const $videoElement: HTMLVideoElement | null = nativeElement.querySelector('video')
    if ($videoElement) {
      $videoElement.srcObject = stream
    }
  }

  updateSpeaker() {
    if (!this.localStream) {
      return
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