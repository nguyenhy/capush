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
  @Input() pageInfo: IMenuItem | null = null;
  @Input() pagePath = '';

  totalUnreadNoify = 0;
  listMenu: Array<IMenuItem> = [];
  constructor(
    private router: Router,
    private pageInfoService: PageInfoService,
    private potificationService: NotificationService,
  ) {

  }

  public ngOnInit(): void {
    // if input pageInfo empty
    if (!this.pageInfo) {
      // find base on "pagePath"
      this.pageInfo = this.pageInfoService.getPageInfo(this.pagePath);
    }

    // still empty
    if (!this.pageInfo) {
      this.pageInfo = this.pageInfoService.getPageInfo('/404');
    }

    this.listMenu = this.pageInfoService.getListMenu();

    this.potificationService.initService();

    this.potificationService.onNotifyChange.subscribe(() => {
      this.totalUnreadNoify = this.potificationService.totalUnreadNoify;
    });
  }

}
