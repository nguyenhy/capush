import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {
  pageInfo: IMenuItem | null = null
  listMenu: Array<IMenuItem> = []
  constructor(
    private router: Router
  ) {

  }
  ngOnInit(): void {
    console.log(this.router.getCurrentNavigation())
    this.listMenu = [
      {
        icon: 'brightness_1',
        text: 'input-output',
        title: 'input-output demo',
        href: '/input-output'
      }
    ]

    this.pageInfo = this.listMenu[0]
  }

}



export interface IMenuItem {
  icon: string
  text: string
  title: string
  href: string
}