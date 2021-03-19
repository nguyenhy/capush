import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-setting',
  templateUrl: './all-setting.component.html',
  styleUrls: ['./all-setting.component.scss']
})
export class AllSettingComponent implements OnInit {

  constructor(
    private MatDialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    
  }

}
