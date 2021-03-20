import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _allNotifyBehaviorSubject = new BehaviorSubject<Array<INotifyItem>>([])

  onNotifyChange = this._allNotifyBehaviorSubject.asObservable()
  totalUnreadNoify: number = 0
  constructor() {

  }

  initService() {

  }
}


export interface INotifyItem {

}