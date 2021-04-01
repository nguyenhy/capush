import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import * as DetectRTC from 'detectrtc';
/* package */
import { IDevice, InputConfigService } from 'src/app/service/input-config/input-config.service';
import { EStorage, LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { MatSelectComponent } from '../mat-select/mat-select.component';
import { VideoStreamComponent } from '../video-stream/video-stream.component';

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

  /* decorator */
  // belong to this view
  @ViewChild('mediaDeviceMic') mediaDeviceMic!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceCam') mediaDeviceCam!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceSpeaker') mediaDeviceSpeaker!: MatSelectComponent<IDevice>;
  @ViewChild('videoStream') videoStream!: VideoStreamComponent;

  // input
  // output


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
      this.videoStream.updateStream(mediaStream)
    })

    this.InputConfigService.outputAudioObservable.subscribe((device) => {
      this.videoStream.setSinkId(device)
    })

  }


  async loadSavedMediaDevice() {
    const inputVideo: IDevice | null = this.InputConfigService.getCurrentInputVideo()
    const inputAudio: IDevice | null = this.InputConfigService.getCurrentInputAudio()
    const outputAudio: IDevice | null = this.InputConfigService.getCurrentOutputAudio()

    this.InputConfigService.initService({
      inputVideo,
      inputAudio,
      outputAudio,
    })

    if (inputAudio && this.mediaDeviceMic) {
      const listMic = this.InputConfigService.getCurrentListMic()
      const index = this.InputConfigService.findDeviceIndex(listMic, inputAudio)
      if (index > -1) {
        this.mediaDeviceMic.setValue(index)
      }
    }

    if (inputVideo && this.mediaDeviceCam) {
      const listCamera = this.InputConfigService.getCurrentListCamera()
      const index = this.InputConfigService.findDeviceIndex(listCamera, inputVideo)
      if (index > -1) {
        this.mediaDeviceCam.setValue(index)
      }
    }

    if (outputAudio && this.mediaDeviceSpeaker) {
      const listSpeaker = this.InputConfigService.getCurrentListSpeaker()
      const index = this.InputConfigService.findDeviceIndex(listSpeaker, outputAudio)
      if (index > -1) {
        this.mediaDeviceSpeaker.setValue(index)
      }
    }

  }

}