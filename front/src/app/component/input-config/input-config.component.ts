import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
/* package */
import { IDevice, InputConfigService } from 'src/app/service/input-config/input-config.service';

@Component({
  selector: 'app-input-config',
  templateUrl: './input-config.component.html',
  styleUrls: ['./input-config.component.scss']
})
export class InputConfigComponent implements OnInit {
  public listMic: Array<IDevice> = []
  public listCamera: Array<IDevice> = []
  public listSpeaker: Array<IDevice> = []

  public micFormControl = new FormControl(0, Validators.required)
  public cameraFormControl = new FormControl(0, Validators.required)
  public speakerFormControl = new FormControl(0, Validators.required)


  constructor(
    private InputConfigService: InputConfigService
  ) {
  }

  ngOnInit(): void {
    const self = this;
    this.InputConfigService.initService()
    this.subscribeListMediaChange()

  }

  __onChooseMic(event: MatSelectChange) {
    const activeIndex = event.value;
    const selectedMic: IDevice = this.listMic[activeIndex]
    console.log('__onChooseMic', activeIndex, selectedMic)
    if (selectedMic) {
      if (selectedMic.isCustomLabel) {
        // user change mic but not allow permission to mic
      } else {
        this.InputConfigService.stopAllTrack()
        this.InputConfigService.requestUserMedia()
      }
    } else {
      // selected mic not found
    }
  }

  __onChooseCamera(event: MatSelectChange) {
    const activeIndex = event.value;
    const selectedCamera: IDevice = this.listCamera[activeIndex]
    console.log('__onChooseCamera', activeIndex, selectedCamera)
    if (selectedCamera) {
      if (selectedCamera.isCustomLabel) {
        // user change camera but not allow permission to camera
      } else {
        this.InputConfigService.stopAllTrack()
        this.InputConfigService.requestUserMedia()
      }
    } else {
      // selected camera not found
    }
  }

  __onChooseSpeaker(event: MatSelectChange) {
    const activeIndex = event.value;
    const selectedSpeaker: IDevice = this.listSpeaker[activeIndex]
    console.log('__onChooseSpeaker', activeIndex, selectedSpeaker)
    if (selectedSpeaker) {
      if (selectedSpeaker.isCustomLabel) {
        // user change speaker but not allow permission to speaker
      } else {

      }
    } else {
      // selected speaker not found
    }
  }


  async subscribeListMediaChange() {
    const self = this;

    this.InputConfigService.listMicObservable.subscribe(function (listMic) {
      self.listMic = listMic;
    })

    this.InputConfigService.listCameraObservable.subscribe(function (listCamera) {
      self.listCamera = listCamera;
    })

    this.InputConfigService.listSpeakerObservable.subscribe(function (listSpeaker) {
      self.listSpeaker = listSpeaker;
    })

    this.InputConfigService.listSpeakerObservable.subscribe(function () {

    })

  }


}