import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification/notification.service';
import { IMenuItem, PageInfoService } from 'src/app/service/page-info/page-info.service';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {
  @Input() pageInfo: IMenuItem | null = null
  @Input() pagePath: string = '';
  
  totalUnreadNoify: number = 0
  listMenu: Array<IMenuItem> = []
  constructor(
    private router: Router,
    private PageInfoService: PageInfoService,
    private NotificationService: NotificationService,
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

    this.NotificationService.initService()
    
    this.NotificationService.onNotifyChange.subscribe(() => {
      this.totalUnreadNoify = this.NotificationService.totalUnreadNoify
    })
  }

}