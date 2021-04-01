import { Injectable } from '@angular/core';
import * as DetectRTC from 'detectrtc';
import { Subject, Observable } from 'rxjs';
import { EStorage, LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InputConfigService {
  public outputAudioObservable: Observable<IDevice | null>
  private outputAudioSubject: Subject<IDevice | null>

  public inputAudioObservable: Observable<IDevice | null>
  private inputAudioSubject: Subject<IDevice | null>

  public inputVideoObservable: Observable<IDevice | null>
  private inputVideoSubject: Subject<IDevice | null>

  public localStreamObservable: Observable<MediaStream | null>
  private localStreamSubject: Subject<MediaStream | null>

  public listMicObservable: Observable<Array<IDevice>>
  private listMicSubject: Subject<Array<IDevice>>

  public listCameraObservable: Observable<Array<IDevice>>
  private listCameraSubject: Subject<Array<IDevice>>

  public listSpeakerObservable: Observable<Array<IDevice>>
  private listSpeakerSubject: Subject<Array<IDevice>>
  constructor(
    private LocalStorageService: LocalStorageService,
  ) {
    this.localStreamSubject = new Subject<MediaStream | null>()
    this.localStreamObservable = this.localStreamSubject.asObservable()

    this.outputAudioSubject = new Subject<IDevice | null>()
    this.outputAudioObservable = this.outputAudioSubject.asObservable()

    this.inputAudioSubject = new Subject<IDevice | null>()
    this.inputAudioObservable = this.inputAudioSubject.asObservable()

    this.inputVideoSubject = new Subject<IDevice | null>()
    this.inputVideoObservable = this.inputVideoSubject.asObservable()

    this.listMicSubject = new Subject<Array<IDevice>>()
    this.listMicObservable = this.listMicSubject.asObservable()

    this.listCameraSubject = new Subject<Array<IDevice>>()
    this.listCameraObservable = this.listCameraSubject.asObservable()

    this.listSpeakerSubject = new Subject<Array<IDevice>>()
    this.listSpeakerObservable = this.listSpeakerSubject.asObservable()
  }

  initService(option: IInitServiceOption) {
    this.subscribeMediaDeviceChange()
    this.refreshListMediaDevice()
    this.loadSavedUserMedia(option)
  }

  async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream | null> {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.refreshListMediaDevice()
      this.localStreamSubject.next(stream)

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
      this.localStreamSubject.next(null)
      return null
    }
  }


  async loadSavedUserMedia(option: IInitServiceOption) {
    const constraints: MediaStreamConstraints = {};
    constraints.audio = this.getAudioConstraint(option.inputAudio)
    constraints.video = this.getVideoConstraint(option.inputVideo)

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

      this.inputAudioSubject.next(device)

    } else if (device.kind === 'videoinput') {
      constraints.video = this.getVideoConstraint(device)
      constraints.audio = this.getAudioConstraint()


      this.inputVideoSubject.next(device)

    } else {

      this.outputAudioSubject.next(device)
      return
    }


    DetectRTC.load(function () {
      // has all permission
      self.getUserMedia(constraints)
    })
  }


  refreshListMediaDevice() {
    this.listMicSubject.next(DetectRTC.audioInputDevices)
    this.listCameraSubject.next(DetectRTC.videoInputDevices)
    this.listSpeakerSubject.next(DetectRTC.audioOutputDevices)
  }

  getCurrentOutputAudio() {
    return this.LocalStorageService.get(EStorage.settingSelectedAudioOutput)
  }

  getCurrentInputAudio() {
    return this.LocalStorageService.get(EStorage.settingSelectedAudioInput)
  }

  getCurrentInputVideo() {
    return this.LocalStorageService.get(EStorage.settingSelectedVideoInput)
  }

  getCurrentListMic() {
    return DetectRTC.audioInputDevices
  }

  getCurrentListCamera() {
    return DetectRTC.videoInputDevices
  }

  getCurrentListSpeaker() {
    return DetectRTC.audioOutputDevices
  }



  getAudioConstraint(device: IDevice | null = null): boolean | MediaTrackConstraints {
    if (device) {

      return {
        advanced: [
          {
            deviceId: device.deviceId,
            echoCancellation: {
              exact: true
            }
          }
        ]
      }

    } else {
      const selectedAudio = this.getCurrentInputAudio()
      if (selectedAudio) {
        return {
          advanced: [
            {
              deviceId: selectedAudio.deviceId,
              echoCancellation: {
                exact: true
              }
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
            width: 1280,
            height: 720,
            deviceId: device.deviceId,
            echoCancellation: {
              exact: true
            }
          }
        ]
      }

    } else {
      const selectedVideo = this.getCurrentInputVideo()
      if (selectedVideo) {
        return {
          advanced: [
            {
              width: 1280,
              height: 720,
              deviceId: selectedVideo.deviceId,
              echoCancellation: {
                exact: true
              }
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


  saveInputAudio(device: IDevice | null) {
    if (!device) {
      return
    }

    this.LocalStorageService.set(EStorage.settingSelectedAudioInput, device)
  }

  saveInputVideo(device: IDevice | null) {
    if (!device) {
      return
    }
    this.LocalStorageService.set(EStorage.settingSelectedVideoInput, device)
  }

  saveOutputVideo(device: IDevice | null) {
    if (!device) {
      return
    }
    this.LocalStorageService.set(EStorage.settingSelectedAudioOutput, device)
  }

  subscribeMediaDeviceChange() {
    this.inputAudioObservable.subscribe((device) => {
      this.saveInputAudio(device)
    })

    this.inputVideoObservable.subscribe((device) => {
      this.saveInputVideo(device)
    })

    this.outputAudioObservable.subscribe((device) => {
      this.saveOutputVideo(device)
    })
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