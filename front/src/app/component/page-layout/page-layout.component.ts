import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenuItem, PageInfoService } from 'src/app/service/page-info/page-info.service';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {
  @Input() pageInfo: IMenuItem | null = null
  @Input() pagePath: string = '';
  listMenu: Array<IMenuItem> = []
  constructor(
    private router: Router,
    private PageInfoService: PageInfoService
  ) {

  }
  ngOnInit(): void {
    // if input pageInfo empty
    if (!this.pageInfo) {
      // find base on "pagePath"
      this.pageInfo = this.PageInfoService.get_page_info(this.pagePath)
    }

    // still empty
    if (!this.pageInfo) {
      this.pageInfo = this.PageInfoService.get_page_info('/404')
    }

    this.listMenu = this.PageInfoService.get_list_menu();
  }

}