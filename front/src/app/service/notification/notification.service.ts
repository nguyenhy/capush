import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  onNotifyChange: Observable<any[]>;
  totalUnreadNoify = 0;

  private allNotifySubject = new Subject<Array<any>>();

  constructor() {
    this.onNotifyChange = this.allNotifySubject.asObservable();
  }

  public initService() {

  }
}
