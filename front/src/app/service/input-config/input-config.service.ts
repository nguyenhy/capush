import { Injectable } from '@angular/core';
import * as DetectRTC from 'detectrtc';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputConfigService {
  public outputAudioObservable: Observable<IDevice | null>
  private outputAudioBehaviorSubject: BehaviorSubject<IDevice | null>

  public inputAudioObservable: Observable<IDevice | null>
  private inputAudioBehaviorSubject: BehaviorSubject<IDevice | null>

  public inputVideoObservable: Observable<IDevice | null>
  private inputVideoBehaviorSubject: BehaviorSubject<IDevice | null>

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

    this.outputAudioBehaviorSubject = new BehaviorSubject<IDevice | null>(null)
    this.outputAudioObservable = this.outputAudioBehaviorSubject.asObservable()

    this.inputAudioBehaviorSubject = new BehaviorSubject<IDevice | null>(null)
    this.inputAudioObservable = this.inputAudioBehaviorSubject.asObservable()

    this.inputVideoBehaviorSubject = new BehaviorSubject<IDevice | null>(null)
    this.inputVideoObservable = this.inputVideoBehaviorSubject.asObservable()

    this.listMicBehaviorSubject = new BehaviorSubject<Array<IDevice>>([])
    this.listMicObservable = this.listMicBehaviorSubject.asObservable()

    this.listCameraBehaviorSubject = new BehaviorSubject<Array<IDevice>>([])
    this.listCameraObservable = this.listCameraBehaviorSubject.asObservable()

    this.listSpeakerBehaviorSubject = new BehaviorSubject<Array<IDevice>>([])
    this.listSpeakerObservable = this.listSpeakerBehaviorSubject.asObservable()
  }

  initService(option: IInitServiceOption) {
    this.refreshListMediaDevice()
    this.loadSavedUserMedia(option)

  }

  async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream | null> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.refreshListMediaDevice()
      this.localStreamBehaviorSubject.next(stream)

      return stream
    } catch (error) {
      //log to console first 
      console.error('getUserMedia', error.name, error.code, error)

      /**
       * add error handle suggest from [here](https://blog.addpipe.com/common-getusermedia-errors/)
       */
      if (error.name == "NotFoundError" || error.name == "DevicesNotFoundError") {
        //required track is missing 
      } else if (error.name == "NotReadableError" || error.name == "TrackStartError") {
        //webcam or mic are already in use 
      } else if (error.name == "OverconstrainedError" || error.name == "ConstraintNotSatisfiedError") {
        //constraints can not be satisfied by avb. devices 
      } else if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError") {
        //permission denied in browser 
      } else if (error.name == "TypeError" || error.name == "TypeError") {
        //empty constraints object 
      } else {
        //other errors 
      }

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

  async loadSavedUserMedia(option: IInitServiceOption) {
    const constraints: MediaStreamConstraints = {};
    constraints.audio = this.getAudioConstraint(option.inputAudio)
    constraints.video = this.getVideoConstraint(option.inputVideo)

    this.stopAllTrack()

    DetectRTC.load(() => {
      // has all permission
      this.getUserMedia(constraints)
    })

  }

  async requestUserMedia(device: IDevice) {
    const self = this;
    const constraints: MediaStreamConstraints = {};

    // "audioinput" | "audiooutput" | "videoinput"
    if (device.kind === 'audioinput') {
      constraints.video = this.getVideoConstraint()
      constraints.audio = this.getAudioConstraint(device)

      this.stopAllTrack()
      this.inputAudioBehaviorSubject.next(device)

    } else if (device.kind === 'videoinput') {
      constraints.video = this.getVideoConstraint(device)
      constraints.audio = this.getAudioConstraint()


      this.stopAllTrack()
      this.inputVideoBehaviorSubject.next(device)

    } else {

      this.outputAudioBehaviorSubject.next(device)
      return
    }


    DetectRTC.load(function () {
      // has all permission
      self.getUserMedia(constraints)
    })
  }


  refreshListMediaDevice() {
    this.listMicBehaviorSubject.next(DetectRTC.audioInputDevices)
    this.listCameraBehaviorSubject.next(DetectRTC.videoInputDevices)
    this.listSpeakerBehaviorSubject.next(DetectRTC.audioOutputDevices)
  }

  getCurrentStream() {
    return this.localStreamBehaviorSubject.getValue()
  }

  getCurrentOutputAudio() {
    return this.outputAudioBehaviorSubject.getValue()
  }

  getCurrentInputAudio() {
    return this.inputAudioBehaviorSubject.getValue()
  }

  getCurrentInputVideo() {
    return this.inputVideoBehaviorSubject.getValue()
  }

  getCurrentListMic() {
    return this.listMicBehaviorSubject.getValue()
  }

  getCurrentListCamera() {
    return this.listCameraBehaviorSubject.getValue()
  }

  getCurrentListSpeaker() {
    return this.listSpeakerBehaviorSubject.getValue()
  }



  getAudioConstraint(device: IDevice | null = null): boolean | MediaTrackConstraints {
    if (device) {

      return {
        advanced: [
          {
            deviceId: device.deviceId,
            echoCancellation: true
          }
        ]
      }

    } else {
      const selectedAudio = this.inputAudioBehaviorSubject.getValue()
      if (selectedAudio) {
        return {
          advanced: [
            {
              deviceId: selectedAudio.deviceId,
              echoCancellation: true
            }
          ]
        }
      } else {
        return true
      }
    }
  }

  getVideoConstraint(device: IDevice | null = null): boolean | MediaTrackConstraints {
    if (device) {

      return {
        advanced: [
          {
            deviceId: device.deviceId,
            echoCancellation: true
          }
        ]
      }

    } else {
      const selectedVideo = this.inputVideoBehaviorSubject.getValue()
      if (selectedVideo) {
        return {
          advanced: [
            {
              deviceId: selectedVideo.deviceId,
              echoCancellation: true
            }
          ]
        }
      } else {
        return true
      }
    }
  }

  findDeviceIndex(listDevice: Array<IDevice | null>, device: IDevice | null) {
    let value = -1;

    if (!listDevice.length) {
      return value;
    }

    listDevice.forEach((item, index) => {
      if (item?.deviceId === device?.deviceId) {
        value = index
      }
    })
    return value;
  }
}



/**
 * copy from node_modules/detectrtc/DetectRTC.d.ts
 */
export interface IDevice {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;

  id: string;
  isCustomLabel?: boolean;
}



export interface IInitServiceOption {
  outputAudio: IDevice | null,
  inputAudio: IDevice | null,
  inputVideo: IDevice | null,
}