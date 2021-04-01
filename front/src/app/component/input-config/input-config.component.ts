import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import * as DetectRTC from 'detectrtc';
/* package */
import { IDevice, InputConfigService } from 'src/app/service/input-config/input-config.service';
import { EStorage, LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { MatSelectComponent } from '../mat-select/mat-select.component';

@Component({
  selector: 'app-input-config',
  templateUrl: './input-config.component.html',
  styleUrls: ['./input-config.component.scss']
})
export class InputConfigComponent implements OnInit, AfterViewInit {
  public listMic: Array<IDevice> = []
  public listCamera: Array<IDevice> = []
  public listSpeaker: Array<IDevice> = []
  public supportChangeSpeaker: boolean = false

  public videoMediaStream: MediaStream | null = null

  @ViewChild('mediaDeviceMic') mediaDeviceMic!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceCam') mediaDeviceCam!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceSpeaker') mediaDeviceSpeaker!: MatSelectComponent<IDevice>;
  constructor(
    private InputConfigService: InputConfigService,
    private LocalStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    const self = this;
    this.supportChangeSpeaker = DetectRTC.isSetSinkIdSupported


  }

  ngAfterViewInit() {


    DetectRTC.load(() => {
      this.subscribeListMediaChange()
      this.subscribeMediaDeviceChange()

      this.loadSavedMediaDevice()
    })

  }

  __onChooseMic(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.InputConfigService.requestUserMedia(device)
    }
  }

  __onChooseCamera(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.InputConfigService.requestUserMedia(device)
    }
  }

  __onChooseSpeaker(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.InputConfigService.requestUserMedia(device)
    }
  }


  async subscribeMediaDeviceChange() {
    this.InputConfigService.inputAudioObservable.subscribe((device) => {
      this.saveInputAudio(device)
    })

    this.InputConfigService.inputVideoObservable.subscribe((device) => {
      this.saveInputVideo(device)
    })

    this.InputConfigService.outputAudioObservable.subscribe((device) => {
      this.saveOutputVideo(device)
    })
  }

  async subscribeListMediaChange() {
    const self = this;

    this.InputConfigService.listMicObservable.subscribe((listMic) => {
      self.listMic = listMic;
    })

    this.InputConfigService.listCameraObservable.subscribe((listCamera) => {
      self.listCamera = listCamera;
    })

    this.InputConfigService.listSpeakerObservable.subscribe((listSpeaker) => {
      self.listSpeaker = listSpeaker;
    })

    this.InputConfigService.localStreamObservable.subscribe((mediaStream) => {
      this.videoMediaStream = mediaStream
    })

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


  async loadSavedMediaDevice() {
    const inputVideo: IDevice | null = this.LocalStorageService.get(EStorage.settingSelectedVideoInput)
    const inputAudio: IDevice | null = this.LocalStorageService.get(EStorage.settingSelectedAudioInput)
    const outputAudio: IDevice | null = this.LocalStorageService.get(EStorage.settingSelectedAudioOutput)

    this.InputConfigService.initService({
      inputVideo,
      inputAudio,
      outputAudio,
    })

    if (inputAudio && this.mediaDeviceMic) {
      const listMic = this.InputConfigService.getCurrentListMic()
      const value = this.InputConfigService.findDeviceIndex(listMic, inputAudio)
      if (value > -1) {
        this.mediaDeviceMic.formControl.setValue(value)
      }
    }

    if (inputVideo && this.mediaDeviceCam) {
      const listCamera = this.InputConfigService.getCurrentListCamera()
      const value = this.InputConfigService.findDeviceIndex(listCamera, inputVideo)
      if (value > -1) {
        this.mediaDeviceCam.formControl.setValue(value)
      }
    }

    if (outputAudio && this.mediaDeviceSpeaker) {
      const listSpeaker = this.InputConfigService.getCurrentListSpeaker()
      const value = this.InputConfigService.findDeviceIndex(listSpeaker, outputAudio)
      if (value > -1) {
        this.mediaDeviceSpeaker.formControl.setValue(value)
      }
    }
  }




}