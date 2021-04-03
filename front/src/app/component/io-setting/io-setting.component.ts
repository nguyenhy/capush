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
  /* decorator */
  // belong to this view
  @ViewChild('mediaDeviceMic') mediaDeviceMic!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceCam') mediaDeviceCam!: MatSelectComponent<IDevice>;
  @ViewChild('mediaDeviceSpeaker') mediaDeviceSpeaker!: MatSelectComponent<IDevice>;
  @ViewChild('videoStream') videoStream!: VideoStreamComponent;

  public listMic: Array<IDevice> = [];
  public listCamera: Array<IDevice> = [];
  public listSpeaker: Array<IDevice> = [];
  public supportChangeSpeaker = false;


  // input
  // output


  constructor(
    private ioSettingService: IOSettingService,
  ) {
  }

  public ngOnInit(): void {
    const self = this;
    this.supportChangeSpeaker = DetectRTC.isSetSinkIdSupported;

  }

  public ngAfterViewInit() {


    DetectRTC.load(() => {
      this.subscribeListMediaChange();

      this.loadSavedMediaDevice();
    });
  }

  public _onChooseMic(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.ioSettingService.requestUserMedia(device);
    }
  }

  public _onChooseCamera(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.ioSettingService.requestUserMedia(device);
    }
  }

  public _onChooseSpeaker(device: IDevice) {
    if (device.isCustomLabel) {
      // user change camera but not allow permission to camera
    } else {
      this.ioSettingService.requestUserMedia(device);
    }
  }


  private async subscribeListMediaChange() {
    const self = this;

    this.ioSettingService.listMicObservable.subscribe((listMic) => {
      self.listMic = listMic;
    });

    this.ioSettingService.listCameraObservable.subscribe((listCamera) => {
      self.listCamera = listCamera;
    });

    this.ioSettingService.listSpeakerObservable.subscribe((listSpeaker) => {
      self.listSpeaker = listSpeaker;
    });

    this.ioSettingService.localStreamObservable.subscribe((mediaStream) => {
      this.videoStream.updateStream(mediaStream);
    });

    this.ioSettingService.outputAudioObservable.subscribe((device) => {
      this.videoStream.setSinkId(device);
    });

  }


  private async loadSavedMediaDevice() {
    const inputVideo = this.ioSettingService.getCurrentInputVideo();
    const inputAudio = this.ioSettingService.getCurrentInputAudio();
    const outputAudio = this.ioSettingService.getCurrentOutputAudio();

    this.ioSettingService.initService({
      inputVideo,
      inputAudio,
      outputAudio,
    });

    if (inputAudio && this.mediaDeviceMic) {
      const listMic = this.ioSettingService.getCurrentListMic();
      const index = this.ioSettingService.findDeviceIndex(listMic, inputAudio);
      if (index > -1) {
        this.mediaDeviceMic.setValue(index);
      }
    }

    if (inputVideo && this.mediaDeviceCam) {
      const listCamera = this.ioSettingService.getCurrentListCamera();
      const index = this.ioSettingService.findDeviceIndex(listCamera, inputVideo);
      if (index > -1) {
        this.mediaDeviceCam.setValue(index);
      }
    }

    if (outputAudio && this.mediaDeviceSpeaker) {
      const listSpeaker = this.ioSettingService.getCurrentListSpeaker();
      const index = this.ioSettingService.findDeviceIndex(listSpeaker, outputAudio);
      if (index > -1) {
        this.mediaDeviceSpeaker.setValue(index);
      }
    }

  }

}
