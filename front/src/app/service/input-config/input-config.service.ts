import { Injectable } from '@angular/core';
import * as DetectRTC from 'detectrtc';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputConfigService {
  public localStreamObservable: Observable<MediaStream | null>
  private localStreamBehaviorSubject: BehaviorSubject<MediaStream | null>

  public listMicObservable: Observable<Array<IDevice>>
  private listMicBehaviorSubject: BehaviorSubject<Array<IDevice>>

  public listCameraObservable: Observable<Array<IDevice>>
  private listCameraBehaviorSubject: BehaviorSubject<Array<IDevice>>

  public listSpeakerObservable: Observable<Array<IDevice>>
  private listSpeakerBehaviorSubject: BehaviorSubject<Array<IDevice>>
  constructor() {

    this.localStreamBehaviorSubject = new BehaviorSubject<MediaStream | null>(null)
    this.localStreamObservable = this.localStreamBehaviorSubject.asObservable()

    this.listMicBehaviorSubject = new BehaviorSubject<Array<IDevice>>([])
    this.listMicObservable = this.listMicBehaviorSubject.asObservable()

    this.listCameraBehaviorSubject = new BehaviorSubject<Array<IDevice>>([])
    this.listCameraObservable = this.listCameraBehaviorSubject.asObservable()

    this.listSpeakerBehaviorSubject = new BehaviorSubject<Array<IDevice>>([])
    this.listSpeakerObservable = this.listSpeakerBehaviorSubject.asObservable()
  }

  initService() {
    this.requestUserMedia()
  }

  async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream | null> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.refreshListMediaDevice()
      this.localStreamBehaviorSubject.next(stream)

      return stream
    } catch (error) {
      console.error('getUserMedia', error.name, error.code)
      this.refreshListMediaDevice()
      this.localStreamBehaviorSubject.next(null)
      return null
    }
  }

  stopAllTrack() {
    const stream = this.localStreamBehaviorSubject.value
    if (!stream) {
      return
    }

    const track = stream.getTracks()
    if (track && track.length) {
      track.forEach(function (item) {
        item.stop()
      })
    }
  }

  async requestUserMedia() {
    const self = this;
    const constraints: MediaStreamConstraints = {
      audio: false,
      video: false,
    };
    DetectRTC.load(function () {
      console.log(JSON.parse(JSON.stringify(DetectRTC)))
      // has all permission
      if (DetectRTC.isWebsiteHasMicrophonePermissions && DetectRTC.isWebsiteHasWebcamPermissions) {
        self.refreshListMediaDevice()
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
        self.getUserMedia(constraints)
      }
    })
  }


  refreshListMediaDevice() {
    this.listMicBehaviorSubject.next(DetectRTC.audioInputDevices)
    this.listCameraBehaviorSubject.next(DetectRTC.videoInputDevices)
    this.listSpeakerBehaviorSubject.next(DetectRTC.audioOutputDevices)
  }
}



/**
 * copy from node_modules/detectrtc/DetectRTC.d.ts
 */
export interface IDevice {
  deviceId: string;
  groupId: string;
  id: string;
  isCustomLabel?: boolean;
  kind: string;
  label: string;
}