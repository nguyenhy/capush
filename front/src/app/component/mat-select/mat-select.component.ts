import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { IDevice } from 'src/app/service/input-config/input-config.service';

@Component({
  selector: 'app-mat-select',
  templateUrl: './mat-select.component.html',
  styleUrls: ['./mat-select.component.scss']
})
export class MatSelectComponent<T> implements OnInit {
  /* input */
  @Input() listOption: Array<T> = []
  @Input() fieldLabel: string = '';

  /* output */
  @Output() onChange: EventEmitter<T> = new EventEmitter()

  formControl = new FormControl(0, Validators.required)
  constructor(

  ) {

  }

  ngOnInit(): void {
  }

  __onChooseOption(event: MatSelectChange) {
    const activeIndex = event.value;
    const selectedCamera: T = this.listOption[activeIndex]
    if (selectedCamera) {
      this.onChange.emit(selectedCamera)
    } else {
      // selected camera not found
    }
  }
}