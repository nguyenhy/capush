import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { IDevice } from 'src/app/service/input-config/input-config.service';

@Component({
  selector: 'app-input-device',
  templateUrl: './input-device.component.html',
  styleUrls: ['./input-device.component.scss']
})
export class InputMediaComponent implements OnInit {
  /* input */
  @Input() listDevice: Array<IDevice> = []
  @Input() fieldLabel: string = '';

  /* output */
  @Output() onChange: EventEmitter<IDevice> = new EventEmitter()

  formControl = new FormControl(0, Validators.required)
  constructor(

  ) {

  }

  ngOnInit(): void {
  }

  __onChooseDevice(event: MatSelectChange) {
    const activeIndex = event.value;
    const selectedCamera: IDevice = this.listDevice[activeIndex]
    if (selectedCamera) {
      if (selectedCamera.isCustomLabel) {
        // user change camera but not allow permission to camera
      } else {
        this.onChange.emit(selectedCamera)
      }
    } else {
      // selected camera not found
    }
  }
}
