import { Injectable } from '@angular/core';
import { IDevice } from '../settings/io-setting/io-setting.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage = window.localStorage;
  constructor() { }

  public remove(key: string) {
    this.storage.removeItem(key);
  }
  public set<T extends EStorage>(key: T, item: TStorageMap[T]) {
    try {
      const data: IStorage<T> = { item };
      const value = JSON.stringify(data);
      this.storage.setItem(`${key}`, value);

    } catch (error) {
      console.error(error);
    }
  }
  public get<T extends EStorage>(key: T): TStorageMap[T] {
    try {
      const data: string = this.storage.getItem(`${key}`) || '';
      if (data) {
        const value = JSON.parse(data);
        return value?.item ? value.item : null;

      } else {
        return null;
      }

    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public clear() {
    this.storage.clear();
  }
}


export enum EStorage {
  settingSelectedAudioOutput,
  settingSelectedAudioInput,
  settingSelectedVideoInput,
}


export type TStorageMap = {
  [key in EStorage]: IDevice | null;
};

export type TStorageKey = keyof TStorageMap;


export interface IStorage<T extends TStorageKey> {
  item: TStorageMap[T];
}
