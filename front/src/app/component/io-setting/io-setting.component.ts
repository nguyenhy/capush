import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import * as DetectRTC from 'detectrtc';
/* package */
import { IDevice, IOSettingService } from 'src/app/service/settings/io-setting/io-setting.service';
import { EStorage, LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { MatSelectComponent } from '../mat-select/mat-select.component';
import { VideoStreamComponent } from '../video-stream/video-stream.component';

@Component({
  selector: 'app-io-setting',
  templateUrl: './io-setting.component.html',
  styleUrls: ['./io-setting.component.scss']
})
export class IOSettingComponent implements OnInit, AfterViewInit {
  public listMic: Array<IDevice> = []
  public listCamera: Array<IDevice> = []
  public listSpeaker: Array<IDevice> = []
  public supportChangeSpeaker: boolean = false

  /* decorator */
  // belong to this view
  @ViewChild('mediaDeviceMic') mediaDeviceMic!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceCam') mediaDeviceCam!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceSpeaker') mediaDeviceSpeaker!: MatSelectComponent<IDevice>;
  @ViewChild('videoStream') videoStream!: VideoStreamComponent;

  // input
  // output


  constructor(
    private IOSettingService: IOSettingService,
  ) {
  }

  ngOnInit(): void {
    const self = this;
    this.supportChangeSpeaker = DetectRTC.isSetSinkIdSupported


  }

  ngAfterViewInit() {


    DetectRTC.load(() => {
      this.subscribeListMediaChange()

      this.loadSavedMediaDevice()
    })

  }

  __onChooseMic(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.IOSettingService.requestUserMedia(device)
    }
  }

  __onChooseCamera(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.IOSettingService.requestUserMedia(device)
    }
  }

  __onChooseSpeaker(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.IOSettingService.requestUserMedia(device)
    }
  }


  async subscribeListMediaChange() {
    const self = this;

    this.IOSettingService.listMicObservable.subscribe((listMic) => {
      self.listMic = listMic;
    })

    this.IOSettingService.listCameraObservable.subscribe((listCamera) => {
      self.listCamera = listCamera;
    })

    this.IOSettingService.listSpeakerObservable.subscribe((listSpeaker) => {
      self.listSpeaker = listSpeaker;
    })

    this.IOSettingService.localStreamObservable.subscribe((mediaStream) => {
      this.videoStream.updateStream(mediaStream)
    })

    this.IOSettingService.outputAudioObservable.subscribe((device) => {
      this.videoStream.setSinkId(device)
    })

  }


  async loadSavedMediaDevice() {
    const inputVideo = this.IOSettingService.getCurrentInputVideo()
    const inputAudio = this.IOSettingService.getCurrentInputAudio()
    const outputAudio = this.IOSettingService.getCurrentOutputAudio()

    this.IOSettingService.initService({
      inputVideo,
      inputAudio,
      outputAudio,
    })

    if (inputAudio && this.mediaDeviceMic) {
      const listMic = this.IOSettingService.getCurrentListMic()
      const index = this.IOSettingService.findDeviceIndex(listMic, inputAudio)
      if (index > -1) {
        this.mediaDeviceMic.setValue(index)
      }
    }

    if (inputVideo && this.mediaDeviceCam) {
      const listCamera = this.IOSettingService.getCurrentListCamera()
      const index = this.IOSettingService.findDeviceIndex(listCamera, inputVideo)
      if (index > -1) {
        this.mediaDeviceCam.setValue(index)
      }
    }

    if (outputAudio && this.mediaDeviceSpeaker) {
      const listSpeaker = this.IOSettingService.getCurrentListSpeaker()
      const index = this.IOSettingService.findDeviceIndex(listSpeaker, outputAudio)
      if (index > -1) {
        this.mediaDeviceSpeaker.setValue(index)
      }
    }

  }

}